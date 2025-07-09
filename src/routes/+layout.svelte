<script>
	import Footer from '$lib/components/block/footer.svelte';
	import '../app.css';
6
	let { children } = $props();
</script>

{@render children()}
<Footer/>
