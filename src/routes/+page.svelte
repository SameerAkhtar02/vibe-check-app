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

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">

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

<div class="relative w-full min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#f5ebe0]/40 to-white">

  <div class="w-full lg:w-[50%] min-h-96 lg:h-full flex flex-col items-center justify-center lg:items-start px-4 lg:px-10 gap-4 lg:gap-8 py-10 lg:py-0">

    <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-neutral-800 font-extrabold font-[Poppins] leading-tight text-center lg:text-left">
      Build Your Dream Apps With Ease
    </h1>
    <p class="max-w-lg font-medium text-neutral-700 text-center lg:text-left leading-relaxed">
      Now it's easier than ever to build and launch your dream app/website while we handle the security.
    </p>
    <div class="w-fit h-fit flex flex-col sm:flex-row gap-3">
      <a 
        href="/scan" 
        class="w-fit h-fit text-base font-medium bg-orange-500 text-white border border-orange-500 shadow-md rounded-lg px-6 py-3 duration-200 transition-all hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Try it now
      </a>
      <a 
        href="#features" 
        class="w-fit h-fit text-base font-medium border border-neutral-300 rounded-lg px-6 py-3 duration-200 transition-all hover:border-neutral-400 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Learn More
      </a>
    </div>

  </div>
  <div class="w-full lg:w-[50%] h-96 lg:h-full p-4 lg:p-6">
    <img 
      src={'https://images.pexels.com/photos/17485819/pexels-photo-17485819.png'} 
      alt="Developer working on secure code with VibeCheck security scanner" 
      class="w-full h-full object-cover object-center rounded-lg shadow-lg"
    />
  </div>

</div>  

