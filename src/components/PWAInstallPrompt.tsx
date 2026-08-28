import { useEffect, useState } from 'react'

export const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        if (dismissed) return

        const handler = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
        }

        window.addEventListener('beforeinstallprompt', handler)

        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [dismissed])

    if (!deferredPrompt || dismissed) return null

    const handleInstall = async () => {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
            setDismissed(true)
            setDeferredPrompt(null)
        }
    }

    const handleDismiss = () => setDismissed(true)

    return (
        <div className="fixed bottom-5 left-5 right-5 md:bottom-6 md:left-6 md:right-auto md:w-96 z-50 animate-fade-in-up">
            <div className="bg-bg-elevated border border-border rounded p-4 shadow-xl flex items-start gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">
                        Installer l'application
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                        Recevez les notifications instantanées lors du scan de la médaille de votre animal.
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={handleInstall}
                        className="px-3 py-1.5 bg-accent text-bg text-xs font-semibold rounded hover:bg-accent-hover transition-colors whitespace-nowrap"
                    >
                        Installer
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="p-1 text-text-muted hover:text-text-secondary rounded transition-colors"
                        aria-label="Fermer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}