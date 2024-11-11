<script>
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
import { 
    faPlay, 
    faPause, 
    faForward, 
    faBackward, 
	faStepBackward
} from '@fortawesome/free-solid-svg-icons';

export let video;
  export let notes = [];
  
  const speeds = [0.2, 0.5, 1, 1.5, 2];
  let currentSpeed = 1;
  let isPlaying = false;
  let currentTime = 0;
  let duration = 0;
  let currentNote = null;

  $: {
    if (video) {
      video.playbackRate = currentSpeed;
    }
  }

  $: {
    currentNote = notes.find(note => 
      note.timestamp >= currentTime && 
      note.timestamp <= currentTime + 0.5
    );
  }

  function togglePlay() {
    isPlaying ? video.pause() : video.play();
    isPlaying = !isPlaying;
  }

  function skip(seconds) {
    video.currentTime += seconds;
  }

  function findNearestNote(direction) {
    const currentTime = video.currentTime;
    if (direction === 'next') {
      const nextNote = notes.find(note => note.timestamp > currentTime);
      if (nextNote) video.currentTime = nextNote.timestamp;
    } else {
      const prevNotes = notes.filter(note => note.timestamp < currentTime);
      if (prevNotes.length) video.currentTime = prevNotes[prevNotes.length - 1].timestamp;
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
</script>

<div class="bg-gray-800 p-4 rounded-lg shadow-lg">
  <!-- Progress Bar -->
  <div class="relative h-2 bg-gray-700 rounded-full cursor-pointer mb-4"
       on:click={(e) => {
         const rect = e.currentTarget.getBoundingClientRect();
         const percent = (e.clientX - rect.left) / rect.width;
         video.currentTime = percent * video.duration;
       }}>
    <div 
      class="absolute h-full bg-blue-500 rounded-full"
      style="width: {(currentTime / duration) * 100}%"
    />
    
    <!-- Note Markers -->
    {#each notes as note}
      <div
        class="absolute h-3 w-1 bg-green-500 -top-0.5 transform -translate-x-1/2"
        style="left: {(note.timestamp / duration) * 100}%"
        class:bg-yellow-500={currentNote?.id === note.id}
      />
    {/each}
  </div>

  <!-- Main Controls -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <!-- Previous/Next Note -->
      <button 
        class="p-2 hover:bg-gray-700 rounded-full transition-colors"
        on:click={() => findNearestNote('prev')}
      >
        <FontAwesomeIcon icon={faStepBackward} />
      </button>

      <!-- Skip Backward -->
      <button 
        class="p-2 hover:bg-gray-700 rounded-full transition-colors"
        on:click={() => skip(-10)}
      >
        <FontAwesomeIcon icon={faBackward} />
      </button>

      <!-- Play/Pause -->
      <button 
        class="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
        on:click={togglePlay}
      >
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
      </button>

      <!-- Skip Forward -->
      <button 
        class="p-2 hover:bg-gray-700 rounded-full transition-colors"
        on:click={() => skip(10)}
      >
        <FontAwesomeIcon icon={faForward} />
      </button>

      <!-- Next Note -->
      <button 
        class="p-2 hover:bg-gray-700 rounded-full transition-colors"
        on:click={() => findNearestNote('next')}
      >
        <FontAwesomeIcon icon={faStepForward} />
      </button>
    </div>

    <!-- Time Display -->
    <div class="flex items-center gap-4">
      <span class="font-mono">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      <!-- Speed Control -->
      <div class="relative group">
        <button class="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <FontAwesomeIcon icon={faClock} />
          {currentSpeed}x
        </button>
        
        <div class="absolute right-0 mt-2 py-2 w-24 bg-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
          {#each speeds as speed}
            <button
              class="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors {speed === currentSpeed ? 'text-blue-500' : ''}"
              on:click={() => currentSpeed = speed}
            >
              {speed}x
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Current Note Display -->
  {#if currentNote}
    <div 
      class="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
      transition:slide
    >
      <span class="font-medium">{currentNote.note}</span>
      {#if currentNote.technique}
        <span class="ml-2 px-2 py-1 bg-blue-500/20 rounded-full text-sm">
          {currentNote.technique}
        </span>
      {/if}
    </div>
  {/if}
</div>
