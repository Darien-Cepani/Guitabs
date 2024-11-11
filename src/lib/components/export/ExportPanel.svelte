<script>
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { 
    faSave, 
    faFileExport, 
    faFilePdf, 
    faFileText, 
    faVideo 
  } from '@fortawesome/free-solid-svg-icons';
  import { exportStore } from '$lib/stores/export-store';
  
  let exporting = false;
  let progress = 0;
  
  export let rawVideo;
  export let processedVideo;
  export let transcription;
  
  async function exportVideo() {
    exporting = true;
    progress = 0;
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const stream = canvas.captureStream();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 8000000 // 8Mbps for high quality
      });
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => finalizeVideo(chunks);
      
      // Set up video layout
      canvas.width = 1920; // Full HD
      canvas.height = 1080;
      
      mediaRecorder.start();
      
      // Render frame by frame
      while (progress < 100) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw raw video
        ctx.drawImage(rawVideo, 0, 0, canvas.width/2, canvas.height * 0.7);
        
        // Draw processed video
        ctx.drawImage(processedVideo, canvas.width/2, 0, canvas.width/2, canvas.height * 0.7);
        
        // Draw transcription
        renderTranscription(ctx, canvas.width, canvas.height);
        
        progress += 1;
        await new Promise(r => setTimeout(r, 16)); // ~60fps
      }
      
      mediaRecorder.stop();
    } finally {
      exporting = false;
    }
  }
  
  async function exportPDF() {
    const doc = await createPDF();
    doc.save('guitar-transcription.pdf');
  }
  
  async function exportText() {
    const text = formatTranscriptionText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcription.txt';
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  async function saveSong() {
    const songData = {
      rawVideo: await videoToBlob(rawVideo),
      processedVideo: await videoToBlob(processedVideo),
      transcription,
      metadata: {
        savedAt: new Date().toISOString(),
        version: '1.0'
      }
    };
    
    exportStore.saveProject(songData);
  }
</script>

<div class="bg-gray-800 p-6 rounded-lg">
  <div class="flex flex-wrap gap-4">
    <!-- Save Button -->
    <button
      class="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      on:click={saveSong}
    >
      <FontAwesomeIcon icon={faSave} />
      Save Project
    </button>
    
    <!-- Export Video -->
    <button
      class="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
      on:click={exportVideo}
      disabled={exporting}
    >
      <FontAwesomeIcon icon={faVideo} />
      Export Video
    </button>
    
    <!-- Export PDF -->
    <button
      class="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
      on:click={exportPDF}
    >
      <FontAwesomeIcon icon={faFilePdf} />
      Export PDF
    </button>
    
    <!-- Export Text -->
    <button
      class="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
      on:click={exportText}
    >
      <FontAwesomeIcon icon={faFileText} />
      Export Text
    </button>
  </div>
  
  {#if exporting}
    <div class="mt-6" transition:slide>
      <div class="flex items-center gap-4">
        <div class="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-green-500 transition-all duration-300"
            style="width: {progress}%"
          />
        </div>
        <span class="text-sm">{progress}%</span>
      </div>
      <p class="mt-2 text-sm text-gray-400">Exporting video... Please wait</p>
    </div>
  {/if}
</div>
