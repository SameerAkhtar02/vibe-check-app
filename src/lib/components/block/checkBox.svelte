<script>
  let {data, handleSelectTest} = $props()

  let selected = $state(false);
  function toggle() {
    selected = !selected;
    handleSelectTest(data.id)
  }
</script>

<button
  class={`flex items-start gap-3 p-4 rounded-sm cursor-pointer border transition-all duration-200 ${selected ? ' bg-[#f4a261]/80 border-[#f4a261]':'border-slate-300'}`}
  onclick={toggle}
>
  <!-- Checkbox icon -->
  <div
    class={`flex items-center justify-center w-6 h-6 rounded border-2 transition-all duration-200 ${selected ? 'bg-slate-700' : 'bg-slate-50'}`}
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
  <div>
    <h4 class="text-sm text-start text-neutral-800 font-semibold">{data.title}</h4>
    <p class="text-xs text-neutral-700 mt-1 leading-snug">{data.desc}</p>
  </div>
</button>