<script>
import abtesting from '$lib/asset/ab-testing.mp4'
import CheckBox from '$lib/components/block/checkBox.svelte';
import Footer from '$lib/components/block/footer.svelte';
import Result from "$lib/components/block/result.svelte";
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from 'svelte-codemirror-editor'
import { processUploadedFiles, formatFileSize, calculateTotalSize } from '$lib/utils/fileProcessor.js'

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
        alert('code block cannot be empty!')
        return
    }
    if(inputMode === 'file' && uploadedFiles.length === 0) {
        alert('Please upload files to scan!')
        return
    }
    if(selectedTests.length === 0) {
        alert('Please select at least one test!')
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
    } else {
        alert('Input cannot be empty')
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
    } catch (error) {
        fileError = error.message;
        uploadedFiles = [];
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
        <div class={`fixed z-30 top-0 left-0 bg-white w-full h-screen backdrop-blur-sm ${showTestModal ? 'block':'hidden'}`}>
            <div class="relative w-full h-full flex items-center justify-center">
                <div class="w-sm h-96 flex flex-col items-center justify-center gap-4 ">
                    <div class="text-base text-neutral-800"> Hang on tight ! </div>
                    <div class="w-32 aspect-square bg-transparent grid place-items-center-safe">
                        <video width="320" height="240" autoplay muted loop class="w-28 aspect-square">
                          <source src={abtesting} type="video/mp4"/>
                        </video>
                    </div>
                    <div class="text-lg font-semibold">
                        Running <span>{selectedTests.length}</span> tests
                        {#if inputMode === 'file'}
                            on <span>{uploadedFiles.length}</span> files
                        {/if}
                    </div>
                </div>
            </div>
        </div>


        <div class="w-full max-w-xl h-fit flex flex-col gap-5 py-10">
            <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 py-1" contenteditable="true">
                Project 1
            </h2>
            
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
                    <CodeMirror bind:value={codeBlock} lang={javascript()} placeholder='//write your code here'  class="w-full h-36 overflow-auto codeEditor" styles={{"&": {width: "100%",maxWidth: "100%",height: "100%",},}}/>              
                </div>
                <div class="w-full h-1 flex">
                    {#if codeBlock.length != 0}
                        <button onclick={()=>codeBlock = ''}>clear</button>
                        <span class="ml-auto">lines : {codeBlock.split('\n').length}</span>
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
                                            class="ml-2 text-red-500 hover:text-red-700 text-sm"
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
  .checkbox-wrapper-4 * {
    box-sizing: border-box;
  }
  .checkbox-wrapper-4 .cbx {
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.2s ease;
    display: inline-block;
  }
  .checkbox-wrapper-4 .cbx:not(:last-child) {
    margin-right: 6px;
  }
  .checkbox-wrapper-4 .cbx:hover {
    background: rgba(0,119,255,0.06);
  }
  .checkbox-wrapper-4 .cbx span {
    float: left;
    vertical-align: middle;
    transform: translate3d(0, 0, 0);
  }
  .checkbox-wrapper-4 .cbx span:first-child {
    position: relative;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    transform: scale(1);
    border: 1px solid #cccfdb;
    transition: all 0.2s ease;
    box-shadow: 0 1px 1px rgba(0,16,75,0.05);
  }
  .checkbox-wrapper-4 .cbx span:first-child svg {
    position: absolute;
    top: 3px;
    left: 2px;
    fill: none;
    stroke: #fff;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 16px;
    stroke-dashoffset: 16px;
    transition: all 0.3s ease;
    transition-delay: 0.1s;
    transform: translate3d(0, 0, 0);
  }
  .checkbox-wrapper-4 .cbx span:last-child {
    padding-left: 8px;
    line-height: 18px;
  }
  .checkbox-wrapper-4 .cbx:hover span:first-child {
    border-color: #07f;
  }
  .checkbox-wrapper-4 .inp-cbx {
    position: absolute;
    visibility: hidden;
  }
  .checkbox-wrapper-4 .inp-cbx:checked + .cbx span:first-child {
    background: #07f;
    border-color: #07f;
    animation: wave-4 0.4s ease;
  }
  .checkbox-wrapper-4 .inp-cbx:checked + .cbx span:first-child svg {
    stroke-dashoffset: 0;
  }
  .checkbox-wrapper-4 .inline-svg {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
    user-select: none;
  }
  @media screen and (max-width: 640px) {
    .checkbox-wrapper-4 .cbx {
      width: 100%;
      display: inline-block;
    }
  }
  @-moz-keyframes wave-4 {
    50% {
      transform: scale(0.9);
    }
  }
  @-webkit-keyframes wave-4 {
    50% {
      transform: scale(0.9);
    }
  }
  @-o-keyframes wave-4 {
    50% {
      transform: scale(0.9);
    }
  }
  @keyframes wave-4 {
    50% {
      transform: scale(0.9);
    }
  }
  .codeEditor::-webkit-scrollbar{
    width: 2px;
  }

</style>












