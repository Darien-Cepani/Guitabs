<script>
  // Main application imports
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  // Component and store imports
  import {
    VideoFeed,
    PlaybackControls,
    TranscriptionEditor,
    ProgressTracker,
    themeStore,
    sessionStore
  } from '$lib';

  // FontAwesome imports
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import {
    faPlay,
    faPause,
    faForward,
    faBackward
  } from '@fortawesome/free-solid-svg-icons';
	import UploadZone from '$lib/components/ui/UploadZone.svelte';
	import RecordingControls from '$lib/components/video/RecordingControls.svelte';
	import Metronome from '$lib/components/tuning/Metronome.svelte';
	import CountdownTimer from '$lib/components/ui/CountdownTimer.svelte';
	import TuningModal from '$lib/components/tuning/TuningModal.svelte';

  let isModalOpen = false;
</script>

<main class="min-h-screen bg-gray-900 text-white p-4">
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Upload Zone -->
    <section 
      class="bg-gray-800 rounded-lg p-6"
      transition:slide
    >
      <UploadZone />
    </section>

    <!-- Video Feed and Controls -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Video Feed -->
      <div class="lg:col-span-2">
        <section 
          class="bg-gray-800 rounded-lg p-6"
          transition:fade
        >
          <VideoFeed />
          <RecordingControls />
        </section>
      </div>

      <!-- Side Controls -->
      <div class="space-y-6">
        <!-- Metronome -->
        <section 
          class="bg-gray-800 rounded-lg p-6"
          transition:fade
        >
          <Metronome />
        </section>

        <!-- Timer -->
        <section 
          class="bg-gray-800 rounded-lg p-6"
          transition:fade
        >
          <CountdownTimer />
        </section>

        <!-- Tuning Button -->
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-lg p-4 font-semibold"
          on:click={() => isModalOpen = true}
        >
          Open Tuner
        </button>
      </div>
    </div>
  </div>

  <TuningModal bind:isOpen={isModalOpen} />
</main>
