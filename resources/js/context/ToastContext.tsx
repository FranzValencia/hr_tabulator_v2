import { X } from 'lucide-react';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const showToast = useCallback((message: string, type: ToastType, duration: number = 4000) => {
        const id = Date.now();
        const newToast: Toast = { id, message, type, duration };

        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => removeToast(id), duration);
    }, []);

    const toastTypeClass: Record<ToastType, string> = {
        success: 'alert-success',
        error: 'alert-error',
        info: 'alert-info',
        warning: 'alert-warning',
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="toast-end toast fixed right-4 bottom-4 z-50 space-y-2 pr-4">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`alert ${toastTypeClass[toast.type]} animate-fadeIn flex items-center justify-between transition-all`}
                    >
                        <span>{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)} className="ml-4 text-lg leading-none font-bold hover:text-gray-700">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
