// Toast notification utility for better user feedback
import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const addToast = useCallback((type: ToastType, message: string, duration = 5000) => {
    // Check if a toast with the same type and message already exists (within last 1 second)
    const now = Date.now();
    const existingToast = toasts.find(toast => 
      toast.type === type && 
      toast.message === message &&
      (now - parseInt(toast.id)) < 1000 // Only prevent duplicates within 1 second
    );
    
    if (existingToast) {
      console.log('Duplicate toast prevented:', { type, message });
      return existingToast.id;
    }
    
    const id = now.toString();
    const toast: Toast = { id, type, message, duration };
    
    setToasts(prev => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    
    return id;
  }, [toasts]);
  
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  const success = useCallback((message: string, duration?: number) => 
    addToast('success', message, duration), [addToast]);
  
  const error = useCallback((message: string, duration?: number) => 
    addToast('error', message, duration), [addToast]);
  
  const warning = useCallback((message: string, duration?: number) => 
    addToast('warning', message, duration), [addToast]);
  
  const info = useCallback((message: string, duration?: number) => 
    addToast('info', message, duration), [addToast]);
  
  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
};
