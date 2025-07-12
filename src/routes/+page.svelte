<script>
	import Checkered from "$lib/components/block/checkered.svelte";
	import Editor from "$lib/components/block/editor.svelte";
	import Errordummy from "$lib/components/block/errordummy.svelte";
	import Footer from "$lib/components/block/footer.svelte";
	import Button from "$lib/components/ui/button/button.svelte";

	import { fade, scale } from "svelte/transition";

</script>

<svelte:head>
  <!-- Cloudflare Web Analytics -->
  <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon={{"token": "24cae5eff359443db67a31a7f27b5f2b"}}></script>
  <!-- End Cloudflare Web Analytics -->

  <title>VibeCheck – Scan Your Code for Vulnerabilities</title>
  <meta name="description" content="VibeCheck scans your JavaScript, Node.js, and Python code for common security issues like exposed API keys, CORS problems, and more.">
  <meta name="robots" content="index, follow">

  <!-- Open Graph -->
  <meta property="og:title" content="VibeCheck – Scan Your Code for Vulnerabilities">
  <meta property="og:description" content="Free and open-source code security scanner for developers.">
  <meta property="og:image" content="https://vibe-check-ee6y6zshd-sameerakhtar02s-projects.vercel.app.jpg">
  <meta property="og:url" content="https://vibe-check-ee6y6zshd-sameerakhtar02s-projects.vercel.app">
  <meta property="og:type" content="website">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="VibeCheck – Scan Your Code for Vulnerabilities">
  <meta name="twitter:description" content="Free and open-source code security scanner for developers.">
  <meta name="twitter:image" content="https://vibe-check-ee6y6zshd-sameerakhtar02s-projects.vercel.app/og-image.jpg">

  <!-- Canonical URL -->
  <link rel="canonical" href="https://vibe-check-ee6y6zshd-sameerakhtar02s-projects.vercel.app">

  <!-- Schema.org Structured Data -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "VibeCheck",
      "operatingSystem": "All",
      "applicationCategory": "DeveloperTool",
      "description": "Scan your JavaScript and Node.js code for security vulnerabilities.",
      "url": "https://vibe-check-ee6y6zshd-sameerakhtar02s-projects.vercel.app"
    }
  </script>
</svelte:head>

<div class="relative w-full h-max lg:h-screen flex flex-col lg:flex-row bg-[#f5ebe0]/40">

  <div class="w-full lg:w-[50%] h-96 lg:h-full flex flex-col items-center justify-center lg:items-start px-4 lg:px-10 gap-3 lg:gap-7">

    <h1 class="text-3xl md:text-4xl lg:text-5xl text-neutral-800 font-extrabold font-[Poppins] mt-10">Build Your Dream Apps With Ease</h1>
    <p class="max-w-lg font-medium text-neutral-700">Now it's easier than ever to build and launch your dream app/website while we handle the security.</p>
    <div class="w-fit h-fit flex flex-col lg:flex-row gap-3">
      <button class="w-fit h-fit text-base font-medium bg-[#22223b] text-white border border-slate-100 shadow-md rounded-md px-5 py-1.5 duration-200 transition-colors">Try it</button>
      <button class="w-fit h-fit text-base font-medium border border-slate-300 rounded-md px-4 py-1.5">Learn More</button>
    </div>

  </div>
  <div class="w-full h-96 lg:w-[49%] lg:h-full p-2">
    <!-- a11y_img_redundant_alt -->
    <img src={'https://images.pexels.com/photos/17485819/pexels-photo-17485819.png'} alt="hero-image" class="w-full h-full object-cover object-center rounded-md"/>
  </div>

</div>  

