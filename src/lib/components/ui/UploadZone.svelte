<script>
  import { createDropzone } from '@melt-ui/svelte';
  import { fade, scale } from 'svelte/transition';
  import { videoStore } from '$lib/stores/video-store';

  const { dropzone, isDragging } = createDropzone();
  let fileInput;
  let videoPreview = null;
  let fileDetails = null;

  function handleFiles(event) {
    const files = event.dataTransfer?.files || event.target.files;
    const videoFile = Array.from(files).find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      processVideo(videoFile);
    }
  }

  function processVideo(file) {
    fileDetails = {
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      lastModified: new Date(file.lastModified).toLocaleDateString()
    };

    videoPreview = URL.createObjectURL(file);
    videoStore.set({ url: videoPreview, details: fileDetails });
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function clearUpload() {
    URL.revokeObjectURL(videoPreview);
    videoPreview = null;
    fileDetails = null;
    fileInput.value = '';
    videoStore.set(null);
  }
</script>

<div class="w-full p-4">
  {#if !videoPreview}
    <div
      use:dropzone
      on:drop={handleFiles}
      class="relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 {$isDragging ? 'border-blue-500 bg-blue-50/10' : 'border-gray-600'}"
      in:fade
    >
      <input
        type="file"
        accept="video/*"
        class="hidden"
        bind:this={fileInput}
        on:change={handleFiles}
      />

      <div class="flex flex-col items-center justify-center space-y-4">
        <div class="text-6xl {$isDragging ? 'text-blue-500' : 'text-gray-400'}">
          📁
        </div>
        <div class="text-center">
          <p class="text-lg font-medium">
            Drop your video here or 
            <button 
              class="text-blue-500 hover:text-blue-400 transition-colors"
              on:click={() => fileInput.click()}
            >
              browse
            </button>
          </p>
          <p class="text-sm text-gray-400 mt-2">
            Supports MP4, WebM, and MOV formats
          </p>
        </div>
      </div>
    </div>
  {:else}
    <div class="rounded-lg overflow-hidden bg-gray-800" in:scale>
      <div class="aspect-video">
        <video 
          src={videoPreview} 
          controls 
          class="w-full h-full object-contain bg-black"
        />
      </div>
      
      <div class="p-4 space-y-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-medium">{fileDetails.name}</h3>
            <p class="text-sm text-gray-400">
              {fileDetails.size} • {fileDetails.type}
            </p>
          </div>
          <button
            class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            on:click={clearUpload}
          >
            ✕
          </button>
        </div>
        
        <div class="flex gap-4">
          <button
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            on:click={() => fileInput.click()}
          >
            Replace Video
          </button>
          <button
            class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Use This Video
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
