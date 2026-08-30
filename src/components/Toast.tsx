import { createContext, useContext, useState, type ReactNode } from 'react'

type Toast = {
    id: number
    message: string
    type?: 'info' | 'success' | 'error' | 'warning'
    action?: {
        label: string
        onClick: () => void
    }
    secondaryAction?: {
        label: string
        onClick: () => void
    }
    duration?: number
}

type ToastContextType = {
    toasts: Toast[]
    showToast: (toast: Omit<Toast, 'id'>) => void
    dismissToast: (id: number) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([])
    let idCounter = 0

    const showToast = (toast: Omit<Toast, 'id'>) => {
        const id = ++idCounter
        setToasts(prev => [...prev, { ...toast, id }])
        if (toast.duration !== 0) {
            setTimeout(() => dismissToast(id), toast.duration ?? 5000)
        }
    }

    const dismissToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    return (
        <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}

const ToastContainer = ({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) => (
    <div className="fixed bottom-0 lg:bottom-5 lg:right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
            <div
                key={toast.id}
                className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded border shadow-xl animate-fade-in-up w-fit m-2 lg:m-0 lg:min-w-70 lg:max-w-100 ${
                    toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                    toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                    toast.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                    'bg-blue-50 border-blue-200 text-blue-800'
                }`}
            >
                <p className="text-sm flex-1">{toast.message}</p>
                <div className="flex items-center gap-2 shrink-0">
                    {toast.action && (
                        <button
                            onClick={() => { toast.action?.onClick(); onDismiss(toast.id); }}
                            className="px-3 py-1 text-xs font-semibold rounded border transition-colors"
                            style={{
                                background: toast.type === 'error' ? '#ef4444' :
                                           toast.type === 'success' ? '#22c55e' :
                                           toast.type === 'warning' ? '#f59e0b' : '#3b82f6',
                                color: 'white',
                                borderColor: toast.type === 'error' ? '#ef4444' :
                                           toast.type === 'success' ? '#22c55e' :
                                           toast.type === 'warning' ? '#f59e0b' : '#3b82f6'
                            }}
                        >
                            {toast.action.label}
                        </button>
                    )}
                    {toast.secondaryAction && (
                        <button
                            onClick={() => { toast.secondaryAction?.onClick(); onDismiss(toast.id); }}
                            className="px-3 py-1 text-xs font-medium rounded border border-current/30 transition-colors hover:bg-current/10"
                        >
                            {toast.secondaryAction.label}
                        </button>
                    )}
                    {!toast.action && !toast.secondaryAction && (
                        <button
                            onClick={() => onDismiss(toast.id)}
                            className="p-1 opacity-50 hover:opacity-100"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        ))}
    </div>
)