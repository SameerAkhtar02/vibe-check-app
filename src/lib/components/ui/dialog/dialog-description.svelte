<script>
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/lib/utils .js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	} = $props();
</script>

<DialogPrimitive.Description
	bind:ref
	data-slot="dialog-description"
	class={cn("text-muted-foreground text-sm", className)}
	{...restProps}
/>