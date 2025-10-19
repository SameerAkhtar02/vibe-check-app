<script>
import Toast from './Toast.svelte';
import { fly } from 'svelte/transition';

export let toasts = [];

function removeToast(index) {
  toasts = toasts.filter((_, i) => i !== index);
}

function addToast(type, message, duration = 5000) {
  const id = Date.now();
  const newToast = { id, type, message, duration, show: true };
  toasts = [...toasts, newToast];
  
  // Auto remove after duration
  setTimeout(() => {
    removeToast(toasts.findIndex(t => t.id === id));
  }, duration);
  
  return id;
}

// Export the addToast function for external use
export { addToast };
</script>

<div class="fixed top-4 right-4 z-50 space-y-2">
  {#each toasts as toast, index (toast.id)}
    <Toast
      type={toast.type}
      message={toast.message}
      duration={toast.duration}
      show={toast.show}
      on:close={() => removeToast(index)}
    />
  {/each}
</div>
