/**
 * Toast notification service
 */

class ToastService {
  constructor() {
    this.toasts = [];
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notify(toasts) {
    this.toasts = toasts;
    this.listeners.forEach(callback => callback(this.toasts));
  }

  addToast(type, message, duration = 5000) {
    const id = Date.now() + Math.random();
    const newToast = { id, type, message, duration, show: true };
    const updatedToasts = [...this.toasts, newToast];
    
    this.notify(updatedToasts);
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }
    
    return id;
  }

  removeToast(id) {
    const updatedToasts = this.toasts.filter(toast => toast.id !== id);
    this.notify(updatedToasts);
  }

  // Convenience methods
  success(message, duration = 5000) {
    return this.addToast('success', message, duration);
  }

  error(message, duration = 7000) {
    return this.addToast('error', message, duration);
  }

  warning(message, duration = 6000) {
    return this.addToast('warning', message, duration);
  }

  info(message, duration = 5000) {
    return this.addToast('info', message, duration);
  }

  clear() {
    this.notify([]);
  }
}

// Create singleton instance
export const toastService = new ToastService();
