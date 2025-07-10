<script>
	import Footer from '$lib/components/block/footer.svelte';
	import Navbar from '$lib/components/block/navbar.svelte';
	import '../app.css';
6
	let { children } = $props();
</script>
<Navbar/>
{@render children()}
<Footer/>
