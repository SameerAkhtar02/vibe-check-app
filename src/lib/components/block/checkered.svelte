<script>
let blocks = $state(0)
let colNo = $state(0)
 function createBlock(node){
    const width = Math.floor(node.getBoundingClientRect().width)
    const rows = 12
    blocks = (width/100) * rows

 }
</script>

<div class="absolute z-20 left-0 w-full h-full bg-transparent overflow-hidden mainbg"  >
    <div class={`w-full h-full  grid`} style="grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));" use:createBlock>
      {#if blocks!=0}
          {#each {length : blocks},i }
            <div class="aspect-square border border-white/50 bg-transparent"></div>
        {/each}
      {/if}
    </div>
</div>

<style>

  .mainbg{
    background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%);
  }
</style>