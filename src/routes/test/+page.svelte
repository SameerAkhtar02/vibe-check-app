<script>
import abtesting from '$lib/asset/ab-testing.mp4'
import Footer from '$lib/components/block/footer.svelte';
import Result from "$lib/components/block/result.svelte";
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from 'svelte-codemirror-editor'


let codeBlock = $state('')
let selectedTests = $state([])
let showTestModal = $state(false)
let result = $state([])
let showResult = $state(false)
let tests = [
    {id : 1, title : 'API Endpoints', desc : 'search insecure or exposed private routes'}, {id : 2, title : 'API Keys', desc:"check for API keys that should not be public"}, {id : 3, title : 'CORS', desc : 'check for Cross Origin Requests'}, {id : 4, title : 'Fetch Request', desc:'check for insecure fetch requests'}
]

function handleResult(val){
  showResult = val
}

function handleRunTest(){
    if(!codeBlock.length) alert('code block cannot be empty!')
    else{
    showTestModal = true
    runTest()
    }
}

async function runTest(){
 if(codeBlock != '' && selectedTests.length != 0){
  const minDuration = new Promise(r => setTimeout(r, 1000));
   const req = await fetch(`/api/scan-code`,{
    method : 'POST',
    body : JSON.stringify({code : codeBlock, tests : selectedTests}),
    
  })
  const resp = await req.json()
  const [apiResult] = await Promise.all([req, minDuration]);
  showResult = apiResult
  result = resp
  showTestModal = false
 } else{
  alert('Code input cannot be empty')
 }
}       
</script>

<div class="relative w-full h-fit px-4 pb-7">
    <div class="relative w-full h-fit flex flex-col items-center">
      {#if showResult}
        <Result {result} {handleResult} {codeBlock}/>
      {/if}
        <div class={`sticky z-30 top-0 left-0 bg-slate-100 w-full h-screen backdrop-blur-xs ${showTestModal ? 'block':'hidden'}`}>
            <div class="relative w-full h-full flex items-center justify-center">
                <div class="w-sm h-96 flex flex-col items-center justify-center gap-4 border rounded-md shadow-md bg-white">
                    <div class="w-32 aspect-square bg-slate-300">
                        <video width="320" height="240" autoplay muted class="w-28 aspect-square">
                <source src={abtesting} type="video/mp4"/>
            </video>
                    </div>
                    <div class="text-base font-semibold">Running <span>{selectedTests.length}</span> tests</div>
                    <div class="text-lg text-muted-foreground"> Hang on tight ! </div>
                </div>
            </div>
        </div>


        <div class="w-full max-w-xl h-fit flex flex-col gap-5 py-10">
            <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 py-1" contenteditable="true">
                Project 1
            </h2>
            <div class="w-full  h-max border-2 border-neutral-400 rounded-md p-2">
              <CodeMirror bind:value={codeBlock} lang={javascript()} placeholder='//write your code here'  class="w-full h-36 overflow-auto codeEditor" styles={{"&": {width: "100%",maxWidth: "100%",height: "100%",},}}/>              
            </div>
            <div class="w-full h-1 flex">
                {#if codeBlock.length != 0}
                    <button onclick={()=>codeBlock = ''}>clear</button>
                    <span class="ml-auto">lines : {codeBlock.split('\n').length}</span>
                {/if}
            </div>
        </div>
        <div class="w-full max-w-xl h-fit flex flex-col gap-4">
            {#each tests as test}
                <div class="w-full max-w-sm checkbox-wrapper-4 flex flex-col">
                <input class="inp-cbx" value={test.id} id={test.title} type="checkbox" bind:group={selectedTests} onchange={()=>console.log(selectedTests)}/>
                <label class="cbx" for={test.title}><span>
                <svg width="12px" height="10px">
                    <use xlink:href="#check-4"></use>
                </svg></span><span class="font-semibold">{test.title}</span></label>
                <svg class="inline-svg">
                    <symbol id="check-4" viewbox="0 0 12 10">
                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                    </symbol>
                </svg>
                    <span class="text-sm text-muted-foreground ml-9">{test.desc}</span>
                </div>
            {/each}
            <button class={`w-full h-fit py-2 rounded-md border font-semibold mt-4 ${selectedTests.length?'bg-orange-300':'border border-orange-400'}`} disabled={!selectedTests.length} onclick={handleRunTest}>Run Test</button>
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












