<script>
  import { fade, fly, scale } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import { spring } from 'svelte/motion';

  const buttonScale = spring({ scale: 1 }, {
    stiffness: 0.2,
    damping: 0.4
  });

  const progress = tweened(0, {
    duration: 1000,
    easing: elasticOut
  });

  function animateButton() {
    buttonScale.set({ scale: 1.1 });
    setTimeout(() => buttonScale.set({ scale: 1 }), 200);
  }
</script>

<!-- Interactive Button -->
<button
  class="transform-gpu px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg 
         shadow-lg hover:shadow-xl transition-all duration-300 
         hover:-translate-y-0.5 active:translate-y-0"
  style="transform: scale({$buttonScale.scale})"
  on:click={animateButton}
>
  Click Me
</button>

<!-- Progress Bar -->
<div class="relative h-2 bg-gray-200 rounded-full overflow-hidden">
  <div
    class="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 
           transition-all duration-300 ease-out"
    style="width: {$progress}%"
  >
    <div class="absolute inset-0 bg-white/20 animate-shimmer" />
  </div>
</div>

<!-- Badge with Pulse -->
<div class="relative inline-flex">
  <span class="px-3 py-1 bg-green-500 text-white rounded-full">
    Active
  </span>
  <span class="absolute -right-1 -top-1 h-3 w-3">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
    <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
  </span>
</div>

<!-- Modal Transition -->
{#if showModal}
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm"
    transition:fade={{ duration: 200 }}
  >
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      in:fly={{ y: 20, duration: 300, easing: elasticOut }}
      out:scale={{ duration: 200 }}
    >
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl">
        Modal Content
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes shimmer {
    from { transform: translateX(-100%); }
    to { transform: translateX(100%); }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
</style>
