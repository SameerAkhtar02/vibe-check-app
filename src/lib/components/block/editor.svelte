<script>

</script>

<div class="relative h-72 w-sm md:w-md lg:w-lg rounded-lg bg-slate-800 shadow-xl"><div class="flex w-full gap-1.5 rounded-t-xl bg-slate-900 p-3"><div class="h-3 w-3 rounded-full bg-red-500"></div><div class="h-3 w-3 rounded-full bg-yellow-500"></div><div class="h-3 w-3 rounded-full bg-green-500"></div></div><div class="space-y-2 p-2">
    <p class="font-mono text-sm text-slate-200">
        'use client' <br/>      
    </p>
    
    <div class="w-full h-fit flex flex-col text-slate-200 text-sm">
        <span>{"OnMount( async ( )=>{"}</span>
        <span>{"try { const response = await fetch(`https://api/example.com/admin/recipes`, {headers: {'Authorization': 'Bearer ${apiKey}'}});"}</span>
        <span>{"if (!response.ok) {"}</span>
        <span>{"throw new Error('Failed to fetch recipes');}"}</span>
        <span>{"recipes = await response.json();}"}</span>
        <span>{"catch (err) {error = err.message;});})"}</span>
    </div>
    </div></div>