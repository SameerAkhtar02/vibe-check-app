<script>
  let {data, handleSelectTest} = $props()

  let selected = $state(false);
  
  function toggle() {
    selected = !selected;
    handleSelectTest(data.id)
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  }
</script>

<button
  class={`flex items-start gap-3 p-4 rounded-lg cursor-pointer border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${selected ? 'bg-orange-50 border-orange-200 shadow-sm':'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'}`}
  onclick={toggle}
  onkeydown={handleKeydown}
  role="checkbox"
  aria-checked={selected}
  aria-labelledby={`test-${data.id}-title`}
  aria-describedby={`test-${data.id}-desc`}
  tabindex="0"
>
  <!-- Checkbox icon -->
  <div
    class={`flex items-center justify-center w-6 h-6 rounded border-2 transition-all duration-200 ${selected ? 'bg-orange-500 border-orange-500' : 'bg-white border-neutral-300'}`}
    aria-hidden="true"
  >
    {#if selected}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-white transition-transform duration-200 scale-100"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-7.778 7.778a1 1 0 01-1.414 0L3.293 10.95a1 1 0 111.414-1.414L8 12.828l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    {/if}
  </div>

  <!-- Text Content -->
  <div class="flex-1 text-left">
    <h4 id={`test-${data.id}-title`} class="text-sm text-neutral-800 font-semibold">{data.title}</h4>
    <p id={`test-${data.id}-desc`} class="text-xs text-neutral-600 mt-1 leading-snug">{data.desc}</p>
  </div>
</button>