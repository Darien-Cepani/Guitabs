<script>
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
// Analysis-specific icons
import { 
    faChartLine,
    faCheck,
    faHistory,
	faSpinner,
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

  const stages = [
    { id: 'preprocessing', label: 'Preprocessing Video' },
    { id: 'detection', label: 'Detecting Hand Movements' },
    { id: 'transcription', label: 'Transcribing Notes' },
    { id: 'analysis', label: 'Analyzing Techniques' },
    { id: 'finalization', label: 'Finalizing Results' }
  ];

  const progress = tweened(0, {
    duration: 1000,
    easing: cubicOut
  });

  let currentStage = 0;
  let isComplete = false;

  onMount(() => {
    advanceStages();
  });

  async function advanceStages() {
    for (let i = 0; i <= stages.length; i++) {
      await progress.set((i / stages.length) * 100);
      currentStage = i;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    isComplete = true;
  }
</script>

<div class="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
  <!-- Main Progress Bar -->
  <div class="relative h-3 bg-gray-700 rounded-full overflow-hidden">
    <div
      class="absolute h-full bg-blue-500 transition-all duration-300"
      style="width: {$progress}%"
    />
  </div>

  <!-- Stages List -->
  <div class="mt-6 space-y-4">
    {#each stages as stage, index}
      <div class="flex items-center gap-4">
        <div class="w-6 h-6 flex items-center justify-center">
          {#if index < currentStage}
            <FontAwesomeIcon
              icon={faCheck}
              class="text-green-500"
            />
          {:else if index === currentStage}
            <FontAwesomeIcon
              icon={faSpinner}
              class="text-blue-500 animate-spin"
            />
          {/if}
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-center">
            <span class="font-medium {index <= currentStage ? 'text-white' : 'text-gray-400'}">
              {stage.label}
            </span>
            {#if index < currentStage}
              <span class="text-sm text-green-500">Complete</span>
            {:else if index === currentStage}
              <span class="text-sm text-blue-500">In Progress</span>
            {/if}
          </div>
          {#if index < stages.length - 1}
            <div class="h-8 w-px bg-gray-700 ml-3" />
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <!-- Completion Message -->
  {#if isComplete}
    <div class="mt-6 text-center bg-green-500/10 p-4 rounded-lg border border-green-500">
      <span class="text-green-500 font-medium">Analysis Complete!</span>
    </div>
  {/if}
</div>

<style>
  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
