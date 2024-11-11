<script>
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  import { fade } from 'svelte/transition';

  export let currentTime = 0;
  export let transcription = [];
  export let viewMode;

  const indicatorPosition = spring({ x: 0, y: 0 }, {
    stiffness: 0.1,
    damping: 0.7
  });

  let container;
  let activeNote = null;
  let followingPlayback = true;

  $: {
    if (currentTime && followingPlayback) {
      updateIndicatorPosition();
    }
  }

  function updateIndicatorPosition() {
    const currentNote = transcription.find(note => 
      note.timestamp <= currentTime && 
      note.timestamp + note.duration >= currentTime
    );

    if (currentNote && container) {
      const noteElement = container.querySelector(`[data-note-id="${currentNote.id}"]`);
      if (noteElement) {
        const rect = noteElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        indicatorPosition.set({
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top
        });
        
        activeNote = currentNote;
        scrollIntoView(noteElement);
      }
    }
  }

  function scrollIntoView(element) {
    const containerWidth = container.offsetWidth;
    const scrollPosition = element.offsetLeft - (containerWidth / 2);
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }
</script>

<div 
  bind:this={container}
  class="relative overflow-x-auto"
  on:click={() => followingPlayback = true}
>
  <div class="flex min-h-[200px]">
    <!-- Transcription Content -->
    <slot />
    
    <!-- Moving Indicator -->
    <div
      class="absolute w-1 bg-blue-500 transition-all duration-75"
      style="transform: translateX({$indicatorPosition.x}px); height: 100%;"
      in:fade
    >
      <div class="absolute top-0 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full" />
      <div class="absolute bottom-0 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full" />
    </div>
  </div>

  <!-- Playback Controls -->
  <div class="absolute bottom-4 right-4 flex gap-2">
    <button
      class="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
      class:bg-blue-600={followingPlayback}
      on:click={() => followingPlayback = !followingPlayback}
    >
      Auto-Follow
    </button>
  </div>
</div>

<style>
  .indicator-highlight {
    @apply absolute inset-0 bg-blue-500/20 pointer-events-none;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { opacity: 0.2; }
    50% { opacity: 0.4; }
    100% { opacity: 0.2; }
  }
</style>
