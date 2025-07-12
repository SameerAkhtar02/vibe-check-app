<script>
import { onMount } from "svelte";
import Verified from '$lib/asset/verified.mp4'
import Warning from '$lib/asset/warning.mp4'
import ErrorOneBlock from "./errorOneBlock.svelte";
import ErrorThreeBlock from "./errorThreeBlock.svelte";
import ErrorTwoBlock from "./errorTwoBlock.svelte";
import ErrorFourBlock from "./errorFourBlock.svelte";
import Output from "./Editor/output.svelte";



let {result, handleResult, codeBlock} = $props()
let errors = $state([])

onMount(()=>{
    errors = result.filter(n => {
        if(n.message == 'notOk') return n
    }).map((t,i)=>{
        return t.issues
    })
    errors = errors.flatMap(innerArr => innerArr.sort((a,b)=>a.line-b.line)).sort((a,b)=>a.line-b.line)
    console.log($state.snapshot(errors))
})
</script>

<div class="sticky z-50 top-0 left-0 w-full h-screen bg-white overflow-auto">
    <div class="relative w-full h-full flex flex-col items-center justify-start py-4 gap-4">
        
        <div class="w-full h-12 flex items-center justify-start p-4">
            <button class=" bg-white text-neutral-800 py-1.5 px-3.5 rounded-md border hover:border-neutral-600" onclick={()=>handleResult(false)}>close</button>
        </div>

        <div class="w-full max-w-3xl h-fit flex flex-col items-center gap-4 ">
            {#if errors.length != 0}
                <span>Problems found in the code!!!</span>
            {:else}
                <span>You are all set!!</span>
            {/if}
           <div class="w-full max-w-3xl h-48 flex items-center justify-center border-2 border-neutral-300 rounded-md overflow-hidden p-0.5">
                <Output value={codeBlock} {errors}/>
            </div>
        </div>

        <div class="w-full max-w-sm h-fit flex flex-col  lg:flex-row lg:max-w-max lg:justify-center lg:px-4 gap-4 divide-y mt-10 overflow-y-scroll lg:overflow-y-hidden overflow-x-clip lg:divide-x">
            {#each result as item, index}
                <div class="w-sm h-fit lg:h-96 lg:overflow-y-scroll lg:w-md flex flex-col gap-1 ">                   
                    <span class="font-semibold text-base">{item.name}</span>
                    {#if item.message == 'ok'}
                        <span>No error found</span>
                    {:else}
                        {#if item.id == 1}
                            <ErrorOneBlock issues={item.issues}/>
                        {:else if item.id == 2}
                            <ErrorTwoBlock issues={item.issues}/>
                        {:else if item.id == 3}
                            <ErrorThreeBlock issues = {item.issues}/>
                        {:else}
                            <ErrorFourBlock issues={item.issues}/>
                        {/if}
                    {/if}
                </div>
                
            {/each}
        </div>
    </div>
</div>

<style>

</style>