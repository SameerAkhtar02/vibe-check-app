<script>
	import Footer from '$lib/components/block/footer.svelte';
	import Navbar from '$lib/components/block/navbar.svelte';
	import ToastContainer from '$lib/components/ui/toast/ToastContainer.svelte';
	import { toastService } from '$lib/utils/toastService.js';
	import '../app.css';

	let { children } = $props();
	let toasts = $state([]);

	// Subscribe to toast service
	toastService.subscribe((newToasts) => {
		toasts = newToasts;
	});
</script>

<Navbar/>
<main role="main">
	{@render children()}
</main>
<Footer/>
<ToastContainer {toasts} />
