import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const VAPID_PUBLIC_KEY = 'BLLo_5JbZd_ag8cYUy6L5CT6ZzbkqIxMnHqkOWlvGcS0XnIIK4Iip6vS1kWaY_PcwJXnNPwjGMiyi8sj_wRtdbs'

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

export default function EnablePushButton() {
    const [isSupported, setIsSupported] = useState(false)
    const [isEnabled, setIsEnabled] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        const checkPushStatus = async () => {
            try {
                if (
                    typeof window === 'undefined' ||
                    !('Notification' in window) ||
                    !('serviceWorker' in navigator) ||
                    !('PushManager' in window)
                ) {
                    setIsSupported(false)
                    setIsEnabled(false)
                    setIsLoading(false)
                    return
                }

                setIsSupported(true)

                const permissionGranted = Notification.permission === 'granted'
                const registration = await navigator.serviceWorker.ready
                const existingSubscription = await registration.pushManager.getSubscription()

                setIsEnabled(permissionGranted && !!existingSubscription)
            } catch {
                setIsEnabled(false)
            } finally {
                setIsLoading(false)
            }
        }

        void checkPushStatus()
    }, [])

    useEffect(() => {
        if (!errorMessage) return

        const timeout = window.setTimeout(() => {
            setErrorMessage(null)
        }, 5000)

        return () => window.clearTimeout(timeout)
    }, [errorMessage])

    const showError = (text: string) => {
        setErrorMessage(text)
    }

    const enablePush = async () => {
        try {
            setErrorMessage(null)

            const { data: userData } = await supabase.auth.getUser()
            const user = userData.user
            if (!user) {
            showError('Vous devez être connecté pour activer les notifications.')
            return
            }

            if (
                !('Notification' in window) ||
                !('serviceWorker' in navigator) ||
                !('PushManager' in window)
            ) {
                showError('Les notifications ne sont pas supportées sur cet appareil.')
                return
            }

            let permission = Notification.permission

            if (permission !== 'granted') {
                permission = await Notification.requestPermission()
            }

            if (permission !== 'granted') {
                showError('Vous devez autoriser les notifications dans votre navigateur.')
                return
            }

            const registration = await navigator.serviceWorker.ready
            let subscription = await registration.pushManager.getSubscription()

            if (!subscription) {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
                })
            }

            const json = subscription.toJSON()

            const { error } = await supabase.from('push_subscriptions').upsert(
                {
                    user_id: user.id,
                    endpoint: subscription.endpoint,
                    p256dh: json.keys?.p256dh,
                    auth: json.keys?.auth,
                },
                { onConflict: 'endpoint' }
            )

            if (error) {
                showError("Impossible d'enregistrer les notifications pour le moment.")
                return
            }

            setIsEnabled(true)
        } catch {
            showError("Impossible d'activer les notifications pour le moment.")
        }
    }

    if (isLoading || !isSupported || isEnabled) {
        return null
    }

    return (
        <>
            <button
                type="button"
                onClick={enablePush}
                aria-label="Activer les notifications"
                title="Activer les notifications"
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M12 2a6 6 0 00-6 6v3.586L4.293 13.293A1 1 0 005 15h14a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6zm0 20a3 3 0 002.995-2.824L15 19h-6a3 3 0 002.824 2.995L12 22z" />
                </svg>
            </button>

            {errorMessage && (
                <div
                className="fixed bottom-24 right-6 z-50 max-w-xs rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg"
                role="status"
                aria-live="polite"
                >
                {errorMessage}
                </div>
            )}
        </>
    )
}