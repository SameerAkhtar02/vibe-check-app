<script>
let { issues } = $props()

</script>

<div class="w-full h-fit flex flex-col px-2 divide-y">
    {#each issues as issue}
    <div class="w-full flex flex-col gap-0.5 py-3">
        <div class="w-full h-fit flex flex-col gap-0">
            <div class="w-full h-fit flex items-center">
            <span class=""><img width="16" height="16" src="https://img.icons8.com/small/16/down-right.png" alt="down-right"/></span>
               <span class="">at line </span> <span>{issue.line}</span>, route: <span>{issue.keyword}</span> <br/>
            </div>
            <span class="ml-4 text-muted-foreground">{issue.route}</span>
        </div>
        <div class="w-full h-fit">
            <span class="">Recommended Fix: </span> <br>
            <ul>
                {#each issue.fix.recommendation as fix}
                    <li class="text-sm text-neutral-700">{fix}</li>
                {/each}
            </ul>
            <!-- <span class="text-muted-foreground text-sm">{issue.fix.recommendation}</span> -->
        </div>
    </div>
    {/each}
</div>

