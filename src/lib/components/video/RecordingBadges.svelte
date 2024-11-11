<script>
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faVideo, faMicrophone, faCircle } from '@fortawesome/free-solid-svg-icons';
  import { recordingQuality } from '$lib/stores/recording-store';

  let videoQuality = { status: 'checking', value: 0 };
  let audioQuality = { status: 'checking', value: 0 };
  let isCountingDown = false;
  let countdownValue = 3;

  $: canRecord = videoQuality.status === 'good' && audioQuality.status === 'good';

  onMount(() => {
    checkQuality();
  });

  function checkQuality() {
    const stream = $recordingQuality.stream;
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];

    // Video quality check
    const videoSettings = videoTrack.getSettings();
    videoQuality = calculateVideoQuality(videoSettings);

    // Audio quality check
    const audioSettings = audioTrack.getSettings();
    audioQuality = calculateAudioQuality(audioSettings);
  }

  function startCountdown() {
    if (!canRecord) return;

    isCountingDown = true;
    countdownValue = 3;
    
    const countdown = setInterval(() => {
      countdownValue--;
      if (countdownValue === 0) {
        clearInterval(countdown);
        isCountingDown = false;
        startRecording();
      }
    }, 1000);
  }
</script>

<div class="flex flex-wrap gap-4 justify-center mt-4">
  <!-- Video Quality Badge -->
  <div 
    class="flex items-center gap-2 px-4 py-2 rounded-full {videoQuality.status === 'good' ? 'bg-green-500' : 'bg-red-500'}"
    transition:fade
  >
    <FontAwesomeIcon icon={faVideo} />
    <span class="font-medium">Video Quality</span>
    <span class="text-sm">{videoQuality.value}%</span>
  </div>

  <!-- Audio Quality Badge -->
  <div 
    class="flex items-center gap-2 px-4 py-2 rounded-full {audioQuality.status === 'good' ? 'bg-green-500' : 'bg-red-500'}"
    transition:fade
  >
    <FontAwesomeIcon icon={faMicrophone} />
    <span class="font-medium">Audio Quality</span>
    <span class="text-sm">{audioQuality.value}%</span>
  </div>

  <!-- Recording Button -->
  <button
    on:click={startCountdown}
    class="flex items-center gap-2 px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    disabled={!canRecord}
  >
    <FontAwesomeIcon icon={faCircle} class="text-red-300" />
    Record
  </button>
</div>

{#if isCountingDown}
  <div 
    class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
    transition:fade
  >
    <div 
      class="text-8xl font-bold"
      in:scale={{duration: 300}}
      out:scale={{duration: 300}}
    >
      {countdownValue}
    </div>
  </div>
{/if}
