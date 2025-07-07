<script>
import { onMount } from "svelte";
import Verified from '$lib/asset/verified.mp4'
import Warning from '$lib/asset/warning.mp4'
import ErrorOneBlock from "./errorOneBlock.svelte";
import ErrorThreeBlock from "./errorThreeBlock.svelte";
import ErrorTwoBlock from "./errorTwoBlock.svelte";
import ErrorFourBlock from "./errorFourBlock.svelte";

let {result, handleResult} = $props()

let errorFound = $state(false)

onMount(()=>{
    result.forEach(ele=>{
        if(ele.message == 'notOk'){
            errorFound = true
        }
    })
})
</script>

<div class="sticky z-50 top-0 left-0 w-full h-screen bg-white">
    <div class="relative w-full h-full flex flex-col items-center justify-start py-10 gap-4">
        <button class="absolute top-4 left-4 bg-white text-neutral-800 py-1.5 px-3.5 rounded-md border hover:border-neutral-600" onclick={()=>handleResult(false)}>close</button>
        <div class="w-fit h-fit grid place-items-center gap-2 mt-10 p-10 bg-white border-b">
            {#if errorFound}
                <span class="font-semibold text-lg">Error Found</span>
            <!-- svelte-ignore a11y_media_has_caption -->
            <video width="320" height="240" autoplay muted class="w-28 aspect-square">
                <source src={Warning} type="video/mp4"/>
            </video>
            {:else}
            <span class="font-semibold text-lg">Clean Code</span>
            <video width="320" height="240" autoplay muted class="w-28 aspect-square">
            <source src={Verified} type="video/mp4"/>
            </video>
            {/if}
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