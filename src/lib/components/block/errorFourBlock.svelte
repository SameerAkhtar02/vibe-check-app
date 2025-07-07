<script>
let { issues } = $props()

</script>

<div class="w-full h-fit flex flex-col gap-2 px-2 divide-y">
    {#each issues as issue}
    <div class="w-full flex flex-col gap-0.5 py-3">
        <div class="w-full h-fit flex items-center gap-0.5 text-neutral-800">
            <span class=""><img width="16" height="16" src="https://img.icons8.com/small/16/down-right.png" alt="down-right"/></span><span class="font-medium">at line </span> <span>{issue.line}</span>, <span>found </span> <span>{issue.type}</span> <br>
        </div>
        <div class="w-full h-fit ml-5">
            <span class="text-base">Recommended Fix: </span> <br>
            <ul>
                    <li class="text-sm text-neutral-700">{issue.recommendation}</li>
            </ul>
        </div>
    </div>
    {/each}
</div>

