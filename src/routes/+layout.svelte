<script>
	import Footer from '$lib/components/block/footer.svelte';
	import '../app.css';
	import { injectAnalytics } from '@vercel/analytics/sveltekit'
	let { children } = $props();
</script>

{@render children()}
<Footer/>
