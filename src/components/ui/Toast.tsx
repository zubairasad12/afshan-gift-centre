'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, Check, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', title?: string, duration: number = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastMessage = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title: string = 'Success') => addToast(message, 'success', title),
    [addToast]
  );

  const error = useCallback(
    (message: string, title: string = 'Error') => addToast(message, 'error', title),
    [addToast]
  );

  const info = useCallback(
    (message: string, title?: string) => addToast(message, 'info', title),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info }}>
      {children}
      {/* Toast rendering portal / container */}
      <div
        aria-live="assertive"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 shadow-lg border transition-all animate-in slide-in-from-bottom-2 duration-200',
              toast.type === 'success' && 'bg-[#FAFDFB] border-[#5A7A60]/30 text-[#2C2C2C]',
              toast.type === 'error' && 'bg-[#FDF8F8] border-[#C75050]/30 text-[#2C2C2C]',
              toast.type === 'info' && 'bg-white border-stone-200 text-[#2C2C2C]'
            )}
          >
            <span className="shrink-0 mt-0.5">
              {toast.type === 'success' && <Check className="w-5 h-5 text-[#5A7A60]" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#C75050]" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[#B8956A]" />}
            </span>

            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-sm font-semibold mb-0.5 text-[#2C2C2C]">{toast.title}</h4>
              )}
              <p className="text-xs text-stone-600 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 text-stone-400 hover:text-stone-700 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
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

export default ToastProvider;
