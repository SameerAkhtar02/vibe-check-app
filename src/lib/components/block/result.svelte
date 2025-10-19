<script>
import { onMount } from "svelte";
import Verified from '$lib/asset/verified.mp4'
import Warning from '$lib/asset/warning.mp4'
import ErrorOneBlock from "./errorOneBlock.svelte";
import ErrorThreeBlock from "./errorThreeBlock.svelte";
import ErrorTwoBlock from "./errorTwoBlock.svelte";
import ErrorFourBlock from "./errorFourBlock.svelte";
import Output from "./Editor/output.svelte";

let {result, handleResult, codeBlock, uploadedFiles} = $props()
let errors = $state([])
let isMultiFileResult = $state(false)
let fileResults = $state([])
let selectedFileIndex = $state(0)

// Detect if result is from multiple files or single code
onMount(() => {
    // Check if result is array of file results (has fileName property)
    if (result && result.length > 0 && result[0].fileName) {
        isMultiFileResult = true;
        fileResults = result;
        
        // Calculate total errors across all files
        errors = [];
        result.forEach(fileResult => {
            fileResult.results.forEach(testResult => {
                if (testResult.message === 'notOk') {
                    errors = errors.concat(testResult.issues);
                }
            });
        });
        errors = errors.sort((a, b) => a.line - b.line);
    } else {
        // Single code result (existing behavior)
        isMultiFileResult = false;
        errors = result.filter(n => {
            if (n.message == 'notOk') return n
        }).map((t, i) => {
            return t.issues
        })
        errors = errors.flatMap(innerArr => innerArr.sort((a, b) => a.line - b.line)).sort((a, b) => a.line - b.line);
    }
    
    console.log('Result type:', isMultiFileResult ? 'multi-file' : 'single-code');
    console.log('Errors:', $state.snapshot(errors));
})

function selectFile(index) {
    selectedFileIndex = index;
}

function getCurrentFileErrors() {
    if (!isMultiFileResult) return errors;
    
    const currentFile = fileResults[selectedFileIndex];
    if (!currentFile) return [];
    
    let fileErrors = [];
    currentFile.results.forEach(testResult => {
        if (testResult.message === 'notOk') {
            fileErrors = fileErrors.concat(testResult.issues);
        }
    });
    return fileErrors.sort((a, b) => a.line - b.line);
}

function getCurrentFileContent() {
    if (!isMultiFileResult) return codeBlock;
    
    const currentFile = fileResults[selectedFileIndex];
    if (!currentFile) return '';
    
    // Find the corresponding uploaded file to get content
    if (uploadedFiles) {
        const uploadedFile = uploadedFiles.find(f => f.name === currentFile.fileName);
        return uploadedFile ? uploadedFile.content : '';
    }
    
    return '';
}

function getCurrentFileResults() {
    if (!isMultiFileResult) return result;
    
    const currentFile = fileResults[selectedFileIndex];
    return currentFile ? currentFile.results : [];
}
</script>

<div class="sticky z-50 top-0 left-0 w-full h-screen bg-white overflow-auto">
    <div class="relative w-full h-full flex flex-col items-center justify-start py-4 gap-4">
        
        <div class="w-full h-12 flex items-center justify-start p-4">
            <button class=" bg-white text-neutral-800 py-1.5 px-3.5 rounded-md border hover:border-neutral-600" onclick={()=>handleResult(false)}>close</button>
        </div>

        <div class="w-full max-w-3xl h-fit flex flex-col items-center gap-4 ">
            {#if errors.length != 0}
                <span>
                    Problems found 
                    {#if isMultiFileResult}
                        in {fileResults.length} files!!!
                    {:else}
                        in the code!!!
                    {/if}
                </span>
            {:else}
                <span>You are all set!!</span>
            {/if}

            <!-- File Navigation for Multi-file Results -->
            {#if isMultiFileResult && fileResults.length > 1}
                <div class="w-full max-w-3xl flex gap-2 overflow-x-auto pb-2">
                    {#each fileResults as fileResult, index}
                        <button 
                            class={`px-3 py-1 text-sm rounded-md whitespace-nowrap transition-colors ${
                                selectedFileIndex === index 
                                    ? 'bg-orange-400 text-white' 
                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                            }`}
                            onclick={() => selectFile(index)}
                        >
                            {fileResult.fileName.split('/').pop()}
                            {#if fileResult.results.some(r => r.message === 'notOk')}
                                <span class="ml-1 text-red-500">⚠</span>
                            {/if}
                        </button>
                    {/each}
                </div>
            {/if}

           <div class="w-full max-w-3xl h-48 flex items-center justify-center border-2 border-neutral-300 rounded-md overflow-hidden p-0.5">
                <Output value={getCurrentFileContent()} errors={getCurrentFileErrors()}/>
            </div>
        </div>

        <div class="w-full max-w-sm h-fit flex flex-col  lg:flex-row lg:max-w-max lg:justify-center lg:px-4 gap-4 divide-y mt-10 overflow-y-scroll lg:overflow-y-hidden overflow-x-clip lg:divide-x">
            {#each getCurrentFileResults() as item, index}
                <div class="w-sm h-fit lg:h-96 lg:overflow-y-scroll lg:w-md flex flex-col gap-1 ">                   
                    <span class="font-semibold text-base">{item.name}</span>
                    {#if isMultiFileResult}
                        <span class="text-xs text-neutral-500">File: {fileResults[selectedFileIndex].fileName.split('/').pop()}</span>
                    {/if}
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