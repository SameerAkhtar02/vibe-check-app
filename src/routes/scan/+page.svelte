<script>
import abtesting from '$lib/asset/ab-testing.mp4'
import CheckBox from '$lib/components/block/checkBox.svelte';
import Footer from '$lib/components/block/footer.svelte';
import Result from "$lib/components/block/result.svelte";
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from 'svelte-codemirror-editor'
import { processUploadedFiles, formatFileSize, calculateTotalSize } from '$lib/utils/fileProcessor.js'
import { toastService } from '$lib/utils/toastService.js'

let codeBlock = $state('')
let selectedTests = $state([])
let showTestModal = $state(false)
let result = $state([])
let showResult = $state(false)
let inputMode = $state('code') // 'code' or 'file'
let uploadedFiles = $state([])
let isProcessingFiles = $state(false)
let fileError = $state('')
let tests = [
    {id : 1, title : 'API Endpoints', desc : 'search insecure or exposed private routes'}, {id : 2, title : 'API Keys', desc:"check for API keys that should not be public"}, {id : 3, title : 'CORS', desc : 'check for Cross Origin Requests'}, {id : 4, title : 'Fetch Request', desc:'check for insecure fetch requests'}
]

function handleResult(val){
  showResult = val
}
function handleSelectTest(val){
  if(selectedTests.includes(val)){
    const test = selectedTests.filter( n => val != n)
    selectedTests = test.sort()
  } else{
    selectedTests.push(val)
    selectedTests = selectedTests.sort()
  }
  console.log($state.snapshot(selectedTests))
}

function handleRunTest(){
    if(inputMode === 'code' && !codeBlock.length) {
        toastService.error('Code block cannot be empty!')
        return
    }
    if(inputMode === 'file' && uploadedFiles.length === 0) {
        toastService.error('Please upload files to scan!')
        return
    }
    if(selectedTests.length === 0) {
        toastService.error('Please select at least one test!')
        return
    }
    showTestModal = true
    runTest()
}

async function runTest(){
    if((inputMode === 'code' && codeBlock != '') || (inputMode === 'file' && uploadedFiles.length > 0)) {
        const minDuration = new Promise(r => setTimeout(r, 1000));
        
        let requestBody;
        if(inputMode === 'code') {
            requestBody = { code: codeBlock, tests: selectedTests };
        } else {
            requestBody = { files: uploadedFiles, tests: selectedTests };
        }
        
        const req = await fetch(`/api/scan-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        const resp = await req.json()
        const [apiResult] = await Promise.all([req, minDuration]);
        showResult = apiResult
        result = resp
        showTestModal = false
        toastService.success('Scan completed successfully!')
    } else {
        toastService.error('Input cannot be empty')
    }
}

async function handleFileUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    isProcessingFiles = true;
    fileError = '';
    
    try {
        uploadedFiles = await processUploadedFiles(files);
        // Reset file input
        event.target.value = '';
        toastService.success(`Successfully uploaded ${uploadedFiles.length} file(s)`)
    } catch (error) {
        fileError = error.message;
        uploadedFiles = [];
        toastService.error(error.message);
    } finally {
        isProcessingFiles = false;
    }
}

function removeFile(index) {
    uploadedFiles = uploadedFiles.filter((_, i) => i !== index);
}

function clearFiles() {
    uploadedFiles = [];
    fileError = '';
}       
</script>

<div class="relative w-full h-fit px-4 pb-7">
    <div class="relative w-full h-fit flex flex-col items-center">
      {#if showResult}
        <Result {result} {handleResult} {codeBlock} {uploadedFiles}/>
      {/if}
        <div 
            class={`fixed z-30 top-0 left-0 bg-white/95 backdrop-blur-sm w-full h-screen ${showTestModal ? 'block':'hidden'}`}
            role="dialog"
            aria-labelledby="loading-title"
            aria-modal="true"
        >
            <div class="relative w-full h-full flex items-center justify-center">
                <div class="w-sm h-96 flex flex-col items-center justify-center gap-4 bg-white rounded-lg shadow-lg p-8">
                    <div class="text-base text-neutral-800" id="loading-title">Hang on tight!</div>
                    <div class="w-32 aspect-square bg-transparent grid place-items-center-safe">
                        <video width="320" height="240" autoplay muted loop class="w-28 aspect-square" aria-hidden="true">
                          <source src={abtesting} type="video/mp4"/>
                        </video>
                    </div>
                    <div class="text-lg font-semibold text-center">
                        Running <span class="text-orange-500">{selectedTests.length}</span> tests
                        {#if inputMode === 'file'}
                            on <span class="text-orange-500">{uploadedFiles.length}</span> files
                        {/if}
                    </div>
                    <div class="text-sm text-neutral-600 text-center">
                        This may take a few moments...
                    </div>
                </div>
            </div>
        </div>


        <div class="w-full max-w-xl h-fit flex flex-col gap-5 py-10">
            <div class="flex items-center gap-2">
                <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 py-1" id="project-title">
                    Project 1
                </h2>
                <button 
                    onclick={() => {
                        const newName = prompt('Enter project name:', 'Project 1');
                        if (newName) document.getElementById('project-title').textContent = newName;
                    }}
                    class="text-neutral-500 hover:text-orange-500 transition-colors"
                    aria-label="Edit project name"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Input Mode Toggle -->
            <div class="w-full flex border border-neutral-300 rounded-md overflow-hidden">
                <button 
                    class={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                        inputMode === 'code' 
                            ? 'bg-orange-400 text-white' 
                            : 'bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                    onclick={() => inputMode = 'code'}
                >
                    Paste Code
                </button>
                <button 
                    class={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                        inputMode === 'file' 
                            ? 'bg-orange-400 text-white' 
                            : 'bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                    onclick={() => inputMode = 'file'}
                >
                    Upload Files
                </button>
            </div>

            <!-- Code Input Mode -->
            {#if inputMode === 'code'}
                <div class="w-full h-max border-2 border-neutral-400 rounded-md p-2">
                    <CodeMirror bind:value={codeBlock} lang={javascript()} placeholder='//write your code here'  class="w-full min-h-48 md:h-36 overflow-auto codeEditor" styles={{"&": {width: "100%",maxWidth: "100%",height: "100%",},}}/>              
                </div>
                <div class="w-full h-1 flex items-center">
                    {#if codeBlock.length != 0}
                        <button 
                            onclick={()=>codeBlock = ''}
                            class="text-sm text-neutral-600 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded px-2 py-1"
                            aria-label="Clear code editor"
                        >
                            Clear
                        </button>
                        <span class="ml-auto text-sm text-neutral-500">Lines: {codeBlock.split('\n').length}</span>
                    {/if}
                </div>
            {/if}

            <!-- File Upload Mode -->
            {#if inputMode === 'file'}
                <div class="w-full border-2 border-dashed border-neutral-400 rounded-md p-6">
                    <input 
                        type="file" 
                        id="file-upload"
                        multiple
                        webkitdirectory
                        class="hidden"
                        onchange={handleFileUpload}
                        accept=".js,.jsx,.ts,.tsx,.svelte,.vue,.json,.html,.css,.scss,.sass,.less,.py,.java,.php,.rb,.go,.rs,.cpp,.c,.h,.hpp,.cs,.swift,.kt,.scala,.clj,.hs,.ml,.fs,.r,.m,.pl,.sh,.bash,.zsh,.yaml,.yml,.toml,.ini,.cfg,.conf,.xml,.sql,.md,.txt"
                        aria-label="Upload code files or folders for scanning"
                    />
                    
                    {#if isProcessingFiles}
                        <div class="text-center">
                            <div class="text-sm text-neutral-600">Processing files...</div>
                        </div>
                    {:else if uploadedFiles.length === 0}
                        <div class="text-center">
                            <label for="file-upload" class="cursor-pointer">
                                <div class="text-lg font-medium text-neutral-700 mb-2">Upload Files or Folder</div>
                                <div class="text-sm text-neutral-500 mb-4">Click to select files or drag and drop</div>
                                <div class="inline-flex items-center px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors">
                                    Choose Files
                                </div>
                            </label>
                            <div class="text-xs text-neutral-400 mt-2">
                                Supports: .js, .jsx, .ts, .tsx, .svelte, .json, .html, .css, .py, .java, .php, .rb, .go, .rs, .cpp, .c, .h and more
                            </div>
                        </div>
                    {:else}
                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <div class="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</div>
                                <div class="flex gap-2">
                                    <button onclick={clearFiles} class="text-xs text-red-600 hover:text-red-800">Clear All</button>
                                    <label for="file-upload" class="text-xs text-orange-600 hover:text-orange-800 cursor-pointer">Add More</label>
                                </div>
                            </div>
                            <div class="max-h-48 overflow-y-auto border border-neutral-200 rounded-md">
                                {#each uploadedFiles as file, index}
                                    <div class="flex items-center justify-between p-2 border-b border-neutral-100 last:border-b-0">
                                        <div class="flex-1 min-w-0">
                                            <div class="text-sm font-medium text-neutral-700 truncate">{file.name}</div>
                                            <div class="text-xs text-neutral-500">{formatFileSize(file.size)}</div>
                                        </div>
                                        <button 
                                            onclick={() => removeFile(index)}
                                            class="ml-2 text-red-500 hover:text-red-700 text-sm p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                            aria-label={`Remove file ${file.name}`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                {/each}
                            </div>
                            <div class="text-xs text-neutral-500">
                                Total: {formatFileSize(calculateTotalSize(uploadedFiles))}
                            </div>
                        </div>
                    {/if}
                    
                    {#if fileError}
                        <div class="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                            <div class="text-sm text-red-600">{fileError}</div>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
        <div class="w-full max-w-xl h-fit flex flex-col gap-4">
          <h2 class="text-lg font-medium border-b">Select Tests:</h2>
            {#each tests as test}
              <CheckBox data = {test} bind:value={selectedTests} {handleSelectTest}/>
            {/each}
            <button class={`w-full h-fit py-2 rounded-md border font-semibold mt-4 ${selectedTests.length?'bg-orange-400':'border border-orange-400'}`} disabled={!selectedTests.length} onclick={handleRunTest}>Run Test</button>
        </div>
   </div>

</div>


<style>
  .codeEditor::-webkit-scrollbar{
    width: 2px;
  }
</style>












