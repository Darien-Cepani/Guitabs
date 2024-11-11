<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { processedMedia } from '$lib/stores/media-store';
  import VideoProcessor from './VideoProcessor.svelte';
  import AudioProcessor from './AudioProcessor.svelte';

  export let sourceMedia;
  let processing = false;
  let progress = 0;

  $: if (sourceMedia) {
    startProcessing();
  }

  async function startProcessing() {
    processing = true;
    progress = 0;

    const enhancedVideo = await processVideo(sourceMedia);
    const enhancedAudio = await processAudio(sourceMedia);

    processedMedia.set({
      video: enhancedVideo,
      audio: enhancedAudio
    });

    processing = false;
  }
</script>

{#if processing}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center" transition:fade>
    <div class="bg-gray-800 p-6 rounded-lg w-96">
      <h3 class="text-xl font-bold mb-4">Enhancing Media</h3>
      <div class="space-y-4">
        <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            class="h-full bg-blue-500 transition-all duration-300"
            style="width: {progress}%"
          />
        </div>
        <p class="text-center">{progress}% Complete</p>
      </div>
    </div>
  </div>
{/if}
