<script>
let { issues } = $props()

</script>

<div class="w-full h-fit flex flex-col gap-4 px-2 divide-y">
    {#each issues as issue}
    <div class="w-full h-fit flex flex-col py-3">
        <div class="w-full h-fit flex items-center gap-0.5 text-neutral-800">
            <span class=""><img width="16" height="16" src="https://img.icons8.com/small/16/down-right.png" alt="down-right"/></span>
            <span class="">at line </span> <span>{issue.line}</span>, <span>found </span> 
            <span class="">{issue.match}</span> 
        </div>
        <div class="w-full h-fit">
            <span class="">Recommended Fix: </span> <br>
            <ul>
                <li class="text-sm text-neutral-700">{issue.recommendation}</li>
            </ul>
            <!-- <span class="text-muted-foreground text-sm">{issue.fix.recommendation}</span> -->
        </div>
    </div>
    {/each}
</div>
