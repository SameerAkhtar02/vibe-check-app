<script>
import { onMount } from "svelte";
import Verified from '$lib/asset/verified.mp4'
import Warning from '$lib/asset/warning.mp4'
import ErrorOneBlock from "./errorOneBlock.svelte";
import ErrorThreeBlock from "./errorThreeBlock.svelte";
import ErrorTwoBlock from "./errorTwoBlock.svelte";
import ErrorFourBlock from "./errorFourBlock.svelte";

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

function getSortedFiles() {
    if (!isMultiFileResult) {
        // For single code, return a single "file" entry
        return [{
            fileName: 'Code Block',
            hasErrors: errors.length > 0,
            errorCount: errors.length
        }];
    }
    
    // Sort files: those with errors first, then alphabetically
    return fileResults
        .map((file, index) => ({
            ...file,
            index,
            hasErrors: file.results.some(r => r.message === 'notOk'),
            errorCount: file.results
                .filter(r => r.message === 'notOk')
                .reduce((count, r) => count + r.issues.length, 0)
        }))
        .sort((a, b) => {
            // Files with errors first
            if (a.hasErrors && !b.hasErrors) return -1;
            if (!a.hasErrors && b.hasErrors) return 1;
            // Then sort by error count (descending)
            if (a.errorCount !== b.errorCount) return b.errorCount - a.errorCount;
            // Finally alphabetically
            return a.fileName.localeCompare(b.fileName);
        });
}

function getErrorCountForFile(fileIndex) {
    if (!isMultiFileResult) return errors.length;
    
    const file = fileResults[fileIndex];
    if (!file) return 0;
    
    return file.results
        .filter(r => r.message === 'notOk')
        .reduce((count, r) => count + r.issues.length, 0);
}

function getGroupedErrorsForFile() {
    const currentResults = getCurrentFileResults();
    if (!currentResults) return [];
    
    // Group errors by ID (severity/priority)
    const grouped = {};
    const priorityOrder = [1, 2, 3, 4]; // API endpoints, CORS, Insecure fetch, Code injection
    
    currentResults.forEach(result => {
        if (result.message === 'notOk' && result.issues.length > 0) {
            if (!grouped[result.id]) {
                grouped[result.id] = {
                    id: result.id,
                    name: result.name,
                    issues: []
                };
            }
            grouped[result.id].issues = grouped[result.id].issues.concat(result.issues);
        }
    });
    
    // Return in priority order
    return priorityOrder
        .filter(id => grouped[id])
        .map(id => grouped[id]);
}
</script>

<div class="sticky z-50 top-0 left-0 w-full h-screen bg-white overflow-auto">
    <div class="relative w-full h-full flex flex-col items-start justify-start py-4 gap-4">
        
        <div class="w-full h-12 flex items-center justify-start p-4">
            <button 
                class="bg-white text-neutral-800 py-2 px-4 rounded-md border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2" 
                onclick={()=>handleResult(false)}
                aria-label="Close results"
            >
                Close
            </button>
        </div>

        <!-- Two Column Layout -->
        <div class="w-full max-w-7xl h-full flex flex-col lg:flex-row gap-6 px-4 flex-1">
            
            <!-- Left Column - File List -->
            <div class="w-full lg:w-1/3 flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    {#if errors.length != 0}
                        <h2 class="text-lg font-semibold text-neutral-800">
                            Problems found 
                            {#if isMultiFileResult}
                                in {fileResults.length} files
                            {:else}
                                in the code
                            {/if}
                        </h2>
                    {:else}
                        <h2 class="text-lg font-semibold text-green-600">You are all set!</h2>
                    {/if}
                </div>

                <!-- File List -->
                <div class="flex flex-col gap-2 flex-1 overflow-y-auto">
                    {#each getSortedFiles() as file, index}
                        {@const isSelected = isMultiFileResult ? selectedFileIndex === file.index : true}
                        {@const displayName = isMultiFileResult ? file.fileName.split('/').pop() : file.fileName}
                        
                        <button 
                            class={`w-full p-3 rounded-lg border text-left transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                                isSelected 
                                    ? 'bg-orange-50 border-orange-300 text-orange-900' 
                                    : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300'
                            }`}
                            onclick={() => isMultiFileResult ? selectFile(file.index) : null}
                        >
                            <div class="flex items-center justify-between">
                                <span class="font-medium text-sm truncate">{displayName}</span>
                                {#if file.errorCount > 0}
                                    <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                        {file.errorCount}
                                    </span>
                                {:else}
                                    <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                        ✓
                                    </span>
                                {/if}
                            </div>
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Right Column - Error Display -->
            <div class="w-full lg:w-2/3 flex flex-col gap-4">
                <h3 class="text-lg font-semibold text-neutral-800">
                    {#if isMultiFileResult}
                        Errors in {fileResults[selectedFileIndex]?.fileName?.split('/').pop() || 'Selected File'}
                    {:else}
                        Code Analysis Results
                    {/if}
                </h3>
                
                <div class="flex flex-col gap-4 flex-1 overflow-y-auto">
                    {#each getGroupedErrorsForFile() as errorGroup}
                        <div class="bg-white border border-neutral-200 rounded-lg p-4">
                            <div class="flex items-center justify-between mb-3">
                                <h4 class="font-semibold text-neutral-800">{errorGroup.name}</h4>
                                <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                    {errorGroup.issues.length} issue{errorGroup.issues.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            
                            {#if errorGroup.id == 1}
                                <ErrorOneBlock issues={errorGroup.issues}/>
                            {:else if errorGroup.id == 2}
                                <ErrorTwoBlock issues={errorGroup.issues}/>
                            {:else if errorGroup.id == 3}
                                <ErrorThreeBlock issues={errorGroup.issues}/>
                            {:else if errorGroup.id == 4}
                                <ErrorFourBlock issues={errorGroup.issues}/>
                            {/if}
                        </div>
                    {/each}
                    
                    {#if getGroupedErrorsForFile().length === 0}
                        <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                            <div class="text-green-600 text-lg font-medium mb-2">No Issues Found</div>
                            <div class="text-green-700 text-sm">This file passed all security checks!</div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

    </div>
</div>

<style>

</style>