<script>
	import Checkered from "$lib/components/block/checkered.svelte";
	import Editor from "$lib/components/block/editor.svelte";
	import Errordummy from "$lib/components/block/errordummy.svelte";
	import Footer from "$lib/components/block/footer.svelte";
import { Button } from "$lib/components/ui /button";
	import { fade, scale } from "svelte/transition";

</script>

<div class="relative w-full h-screen">

  <Checkered/>
    <div class="absolute z-30 top-0 left-0 w-full h-full flex flex-col items-center gap-6 py-14 md:py-20 bg-transparent">
      <div class="w-full h-full grid place-items-center gap-4 px-4">
        <h1 class="text-3xl md:text-5xl font-bold leading-9 md:leading-12 text-center">Discover The <br> Freedom Of VibeCoding</h1>
        <p class="w-full max-w-md text-base md:text-lg text-center">Stay ahead in your creative game by catching errors and security vulnerablitites in your code</p>
        <Button href="/test" class="w-fit h-fit py-1.5 px-3 rounded-md bg-neutral-900 text-white text-base hover:bg-neutral-800 hover:cursor-pointer">Try Now</Button>
        <div class="relative w-fit py-16" in:scale={{ start: 0.8, duration: 500, delay:200 }}>
           <Editor/>
           <Errordummy />
        </div>
      </div>
    </div>

</div>  

