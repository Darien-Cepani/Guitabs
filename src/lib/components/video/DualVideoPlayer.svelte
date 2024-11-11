<script>
  import { slide, fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faExpand, faCompress, faSync } from '@fortawesome/free-solid-svg-icons';
  
  const dispatch = createEventDispatcher();
  
  export let rawVideo;
  export let processedVideo;
  
  let isFullscreen = false;
  let activeView = 'split'; // 'split', 'raw', 'processed'
  let syncedPlayback = true;
  
  $: videoWidth = activeView === 'split' ? 'w-1/2' : 'w-full';
  
  function toggleView() {
    switch(activeView) {
      case 'split':
        activeView = 'raw';
        break;
      case 'raw':
        activeView = 'processed';
        break;
      default:
        activeView = 'split';
    }
  }
  
  function syncPlayback(event) {
    if (!syncedPlayback) return;
    const time = event.target.currentTime;
    const videos = document.querySelectorAll('.video-player');
    videos.forEach(video => {
      if (video !== event.target) {
        video.currentTime = time;
      }
    });
  }
</script>

<div 
  class="relative bg-gray-900 rounded-lg overflow-hidden"
  class:fullscreen={isFullscreen}
>
  <!-- Video Container -->
  <div class="flex relative" transition:slide>
    {#if activeView !== 'processed'}
      <div 
        class="relative {videoWidth} transition-all duration-300"
        in:fade
      >
        <video
          src={rawVideo}
          class="video-player w-full aspect-video"
          controls
          on:timeupdate={syncPlayback}
        >
          <track kind="captions" />
        </video>
        <div class="absolute top-2 left-2 bg-black/50 px-3 py-1 rounded-full">
          Raw
        </div>
      </div>
    {/if}

    {#if activeView !== 'raw'}
      <div 
        class="relative {videoWidth} transition-all duration-300"
        in:fade
      >
        <video
          src={processedVideo}
          class="video-player w-full aspect-video"
          controls
          on:timeupdate={syncPlayback}
        >
          <track kind="captions" />
        </video>
        <div class="absolute top-2 left-2 bg-black/50 px-3 py-1 rounded-full">
          Enhanced
        </div>
        
        <!-- Technique Overlays -->
        <div class="absolute inset-0 pointer-events-none">
          {#each processedVideo.annotations || [] as annotation}
            <div
              class="absolute bg-blue-500/20 rounded-lg border border-blue-500"
              style="left: {annotation.x}%; top: {annotation.y}%; width: {annotation.width}%; height: {annotation.height}%"
              transition:fade
            >
              <span class="absolute top-0 left-0 transform -translate-y-full px-2 py-1 bg-blue-500 rounded-t-lg text-sm">
                {annotation.technique}
              </span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <!-- Controls -->
  <div class="absolute bottom-4 right-4 flex gap-2">
    <button
      class="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
      on:click={() => syncedPlayback = !syncedPlayback}
    >
      <FontAwesomeIcon icon={faSync} class:text-blue-500={syncedPlayback} />
    </button>
    
    <button
      class="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
      on:click={toggleView}
    >
      Switch View
    </button>
    
    <button
      class="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
      on:click={() => isFullscreen = !isFullscreen}
    >
      <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
    </button>
  </div>
</div>

<style>
  .fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
  }
  
  :global(.video-player::-webkit-media-controls-timeline) {
    display: none !important;
  }
</style>
