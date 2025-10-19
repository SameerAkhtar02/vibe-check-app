<script>
import { createEventDispatcher, onMount } from 'svelte';
import { fly, fade } from 'svelte/transition';

const dispatch = createEventDispatcher();

export let type = 'info'; // 'success', 'error', 'warning', 'info'
export let message = '';
export let duration = 5000;
export let show = false;

let timeoutId;

const typeConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: '✓'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: '✕'
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: '⚠'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'ℹ'
  }
};

function closeToast() {
  show = false;
  dispatch('close');
}

onMount(() => {
  if (duration > 0) {
    timeoutId = setTimeout(() => {
      closeToast();
    }, duration);
  }

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
});
</script>

{#if show}
  <div
    class="fixed top-4 right-4 z-50 max-w-sm w-full"
    role="alert"
    aria-live="polite"
    transition:fly={{ x: 300, duration: 300 }}
  >
    <div class="flex items-start p-4 rounded-lg border shadow-lg {typeConfig[type].bg} {typeConfig[type].border}">
      <div class="flex-shrink-0">
        <span class="text-lg {typeConfig[type].text}">{typeConfig[type].icon}</span>
      </div>
      <div class="ml-3 flex-1">
        <p class="text-sm font-medium {typeConfig[type].text}">
          {message}
        </p>
      </div>
      <div class="ml-4 flex-shrink-0">
        <button
          type="button"
          class="inline-flex rounded-md p-1.5 {typeConfig[type].text} hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
          onclick={closeToast}
          aria-label="Close notification"
        >
          <span class="sr-only">Close</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
{/if}
