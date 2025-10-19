<script>
import { page } from '$app/stores';
</script>

<header>
    <nav class="fixed z-40 w-full h-16 bg-white/80 backdrop-blur-sm border-b border-neutral-200 flex items-center gap-4 px-4 md:px-8" aria-label="Main navigation">
        <div class="w-fit h-fit flex gap-1 items-center">
            <img width="32" height="32" src="https://img.icons8.com/pulsar-gradient/32/web-shield.png" alt="VibeCheck security shield logo"/>
            <a href="/" class="text-lg font-extrabold tracking-wide font-[Poppins] text-neutral-800 hover:text-orange-500 transition-colors">
                VibeCheck
            </a>
        </div>
        <div class="w-fit h-full flex items-center gap-4 ml-4 font-[Poppins]">
            <a 
                href="/" 
                class="font-semibold px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 {($page.url.pathname === '/') ? 'text-orange-500 bg-orange-50' : 'text-neutral-700 hover:text-orange-500 hover:bg-orange-50'}"
                aria-current={$page.url.pathname === '/' ? 'page' : undefined}
            >
                Home
            </a>
            <a 
                href="/scan" 
                class="font-semibold px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 {($page.url.pathname === '/scan') ? 'text-orange-500 bg-orange-50' : 'text-neutral-700 hover:text-orange-500 hover:bg-orange-50'}"
                aria-current={$page.url.pathname === '/scan' ? 'page' : undefined}
            >
                Scan
            </a>
        </div>
    </nav>
    <!-- Add padding to body to account for fixed navbar -->
    <div class="h-16"></div>
</header>