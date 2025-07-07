<script>

  // Replace with your actual email and LinkedIn URL
  const email = 'sameerakhtar1801.com';
  const linkedinUrl = 'https://www.linkedin.com/in/sameerakhtar1801';
</script>

<footer class="w-full bg-gray-800 text-gray-300 px-4 py-5 flex flex-col md:flex-row items-center gap-4">
  <!-- Logo placeholder -->
  <div class="flex items-center space-x-2">
   <a href="/" class="w-fit flex items-center">
            <svg width="44" height="44" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Shield shape -->
        <path d="M60 10L20 30V60C20 85 60 110 60 110C60 110 100 85 100 60V30L60 10Z" fill="#1D4ED8" stroke="#1E40AF" stroke-width="2"/>
        
        <!-- Scan beam -->
        <circle cx="60" cy="60" r="20" fill="#3B82F6" opacity="0.3"/>
        <circle cx="60" cy="60" r="10" fill="#3B82F6"/>

        <!-- Check mark in the center -->
        <path d="M52 60L58 66L70 52" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <span class="font-mono text-2xl text-blue-500">
            Vibe<span class="text-blue-300">Scanner</span>
        </span>
   </a>

  </div>

  <div class="w-fit h-fit flex flex-col md:flex-row md:items-center items-start gap-2 md:gap-4 md:ml-4">
    <!-- Email link -->
  <a href={`mailto:${email}`} class="flex items-center space-x-1 hover:text-white transition">
    <sapn class="text-2xl text-white font-light">@</sapn>
    <span>write me an email</span>
  </a>

  <!-- LinkedIn button -->
  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" class="flex items-center space-x-1  text-white py-1 rounded transition">
    <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
<path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path><path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"></path>
</svg>
    <span>LinkedIn</span>
  </a>
  </div>

  <!-- Disclaimer -->
  <p class="text-xs text-gray-400 text-center md:text-right md:ml-auto">
    This product is in development and may not give accurate result. <br/>
    <span>Icon resources from: Flaticon</span>
  </p>
</footer>
