<script>
	import Footer from '$lib/components/block/footer.svelte';
	import '../app.css';

	let { children } = $props();
</script>

{@render children()}
<Footer/>
