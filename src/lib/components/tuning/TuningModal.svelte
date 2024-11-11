<script>
  import { createDialog } from '@melt-ui/svelte';
  import { fade, fly } from 'svelte/transition';
  import TuningIndicator from './TuningIndicator.svelte';
  import { startAudioAnalysis, stopAudioAnalysis } from '$lib/utils/audio-analyzer';

  const strings = {
    E2: 82.41,
    A2: 110.00,
    D3: 146.83,
    G3: 196.00,
    B3: 246.94,
    E4: 329.63
  };

  let currentFrequency = 0;
  let currentString = null;
  let tunedStrings = new Set();
  let analyzer;

  const { dialog, trigger, overlay } = createDialog({
    onOpenChange: (isOpen) => {
      if (isOpen) {
        initializeTuner();
      } else {
        stopTuner();
      }
    }
  });

  async function initializeTuner() {
    const { analyzerNode, start } = await startAudioAnalysis();
    analyzer = analyzerNode;
    start();
    detectPitch();
  }

  function detectPitch() {
    if (!analyzer) return;
    
    const frequency = getCurrentFrequency(analyzer);
    currentFrequency = frequency;
    
    const matchedString = findClosestString(frequency);
    if (matchedString && isInTune(frequency, strings[matchedString])) {
      tunedStrings.add(matchedString);
      tunedStrings = tunedStrings; // Trigger reactivity
    }

    requestAnimationFrame(detectPitch);
  }

  function stopTuner() {
    if (analyzer) {
      stopAudioAnalysis();
      analyzer = null;
    }
  }
</script>

<button
  use:trigger
  class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
>
  Open Tuner
</button>

{#if $dialog.open}
  <div
    use:overlay
    class="fixed inset-0 bg-black/50 backdrop-blur-sm"
    transition:fade
  >
    <div
      use:dialog
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-gray-800 rounded-xl p-6 shadow-xl"
      transition:fly={{ y: 20 }}
    >
      <div class="space-y-6">
        <header class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">Guitar Tuner</h2>
          <button
            on:click={() => $dialog.open = false}
            class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            ✕
          </button>
        </header>

        <!-- Current Frequency Display -->
        <div class="text-center">
          <span class="text-4xl font-mono">
            {currentFrequency.toFixed(2)} Hz
          </span>
        </div>

        <!-- Tuning Indicators -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          {#each Object.entries(strings) as [note, freq]}
            <TuningIndicator
              {note}
              targetFreq={freq}
              currentFreq={currentFrequency}
              isTuned={tunedStrings.has(note)}
            />
          {/each}
        </div>

        <!-- Instructions -->
        <div class="text-center text-gray-400">
          <p>Play one string at a time and adjust until indicator shows green</p>
        </div>
      </div>
    </div>
  </div>
{/if}
