'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, X, Undo2, AlertCircle } from 'lucide-react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    undoAction?: () => void;
}

interface ToastContextType {
    showToast: (message: string, type?: Toast['type'], undoAction?: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((
        message: string,
        type: Toast['type'] = 'success',
        undoAction?: () => void
    ) => {
        const id = Date.now().toString();
        const toast: Toast = { id, message, type, undoAction };

        setToasts(prev => [...prev, toast]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const handleUndo = useCallback((toast: Toast) => {
        if (toast.undoAction) {
            toast.undoAction();
        }
        removeToast(toast.id);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="flex items-center gap-3 px-4 py-3 bg-[#0d1117] border border-[#1c2128] rounded-lg shadow-lg animate-slide-up min-w-[280px] max-w-[400px]"
                    >
                        {toast.type === 'error' ? (
                            <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#e53935]" />
                        ) : (
                            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${toast.type === 'success' ? 'text-[#22c55e]' : 'text-gray-400'
                                }`} />
                        )}

                        <span className="flex-1 text-sm text-white">{toast.message}</span>

                        {toast.undoAction && (
                            <button
                                onClick={() => handleUndo(toast)}
                                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#e53935] hover:bg-[#e53935]/10 rounded transition-colors"
                            >
                                <Undo2 className="w-3 h-3" />
                                Undo
                            </button>
                        )}

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
