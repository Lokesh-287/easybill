import { ref } from 'vue';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const toasts = ref<ToastItem[]>([]);

export function useToast() {
  function show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3500) {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const item: ToastItem = { id, message, type, duration };
    toasts.value.push(item);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }
  }

  function remove(id: string) {
    const idx = toasts.value.findIndex(t => t.id === id);
    if (idx !== -1) {
      toasts.value.splice(idx, 1);
    }
  }

  return {
    toasts,
    show,
    remove,
    success: (msg: string, d?: number) => show(msg, 'success', d),
    error: (msg: string, d?: number) => show(msg, 'error', d),
    warning: (msg: string, d?: number) => show(msg, 'warning', d),
    info: (msg: string, d?: number) => show(msg, 'info', d)
  };
}

export const toast = useToast();
