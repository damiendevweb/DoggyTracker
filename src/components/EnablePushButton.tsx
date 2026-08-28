import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64String: string) {
    if (!base64String) throw new Error('VAPID_PUBLIC_KEY is missing')
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

export default function EnablePushButton() {
    const [isSupported, setIsSupported] = useState(false)
    const [isEnabled, setIsEnabled] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isUnsubscribing, setIsUnsubscribing] = useState(false)
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
        const timeout = window.setTimeout(() => setErrorMessage(null), 5000)
        return () => window.clearTimeout(timeout)
    }, [errorMessage])

    const showError = (text: string) => setErrorMessage(text)

    const enablePush = async () => {
        try {
            setErrorMessage(null)

            const { data: userData } = await supabase.auth.getUser()
            const user = userData.user
            if (!user) {
                showError('Connecte-toi pour activer les notifications.')
                return
            }

            if (
                !('Notification' in window) ||
                !('serviceWorker' in navigator) ||
                !('PushManager' in window)
            ) {
                showError('Notifications non supportées sur cet appareil.')
                return
            }

            let permission = Notification.permission
            if (permission !== 'granted') {
                permission = await Notification.requestPermission()
            }
            if (permission !== 'granted') {
                showError('Autorise les notifications dans ton navigateur.')
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
                showError('Erreur DB: ' + error.message)
                return
            }

            setIsEnabled(true)
        } catch (err) {
            console.error('EnablePush error:', err)
            showError('Impossible d\'activer les notifications.')
        }
    }

    const disablePush = async () => {
        setIsUnsubscribing(true)
        setErrorMessage(null)
        try {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()

            if (subscription) {
                await subscription.unsubscribe()
            }

            const { data: userData } = await supabase.auth.getUser()
            if (userData.user) {
                await supabase
                    .from('push_subscriptions')
                    .delete()
                    .eq('user_id', userData.user.id)
            }

            setIsEnabled(false)
        } catch {
            showError('Impossible de désactiver les notifications.')
        } finally {
            setIsUnsubscribing(false)
        }
    }

    if (isLoading || !isSupported) return null

    return (
        <>
            {isEnabled ? (
                <button
                    type="button"
                    onClick={disablePush}
                    disabled={isUnsubscribing}
                    aria-label="Désactiver les notifications"
                    title="Notifications activées — cliquer pour désactiver"
                    className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded bg-success text-bg transition-all duration-200 hover:bg-success/80 active:scale-95 disabled:opacity-50"
                >
                    <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a6 6 0 00-6 6v3.586L4.293 13.293A1 1 0 005 15h14a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6zm0 20a3 3 0 002.995-2.824L15 19h-6a3 3 0 002.824 2.995L12 22z" />
                        <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            ) : (
                <button
                    type="button"
                    onClick={enablePush}
                    aria-label="Activer les notifications"
                    title="Activer les notifications"
                    className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded bg-accent text-bg transition-all duration-200 hover:bg-accent-hover active:scale-95"
                >
                    <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a6 6 0 00-6 6v3.586L4.293 13.293A1 1 0 005 15h14a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6zm0 20a3 3 0 002.995-2.824L15 19h-6a3 3 0 002.824 2.995L12 22z" />
                    </svg>
                </button>
            )}

            {errorMessage && (
                <div
                    className="fixed bottom-20 right-6 z-50 max-w-xs rounded border border-error/20 bg-error/10 px-4 py-3 text-sm text-error"
                    role="status"
                    aria-live="polite"
                >
                    {errorMessage}
                </div>
            )}
        </>
    )
}
