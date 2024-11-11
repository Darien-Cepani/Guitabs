<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { sessionStore } from '$lib';
  import { writable } from 'svelte/store';
  const dispatch = createEventDispatcher();
  let mediaRecorder;
  let stream;
  let videoElement;
  let audioContext;
  let audioAnalyser;

  let videoQualityScore = 100;
  let audioQualityScore = 100;
  let isRecording = false;
  let isPaused = false;
  let countdownActive = false;

  import { analyzeAudio, BREAKPOINTS } from '$lib/utils';
  import { calculateAudioScore, calculateVideoScore } from '$lib/utils/quality-calculations';
	import { fade, scale } from 'svelte/transition';

  const videoQuality = writable(true);

  onMount(async () => {
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { width: 1280, height: 720 }, 
      audio: true 
    });
    videoElement.srcObject = stream;
    initializeAudioAnalysis();
    startQualityMonitoring();
  });

  function initializeAudioAnalysis() {
    audioContext = new AudioContext();
    audioAnalyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(audioAnalyser);
  }

  function startQualityMonitoring() {
    setInterval(() => {
      checkVideoQuality();
      checkAudioQuality();
    }, 1000);
  }

  function checkVideoQuality() {
    const settings = stream.getVideoTracks()[0].getSettings();
    videoQualityScore = calculateVideoScore(settings);
    videoQuality.set(videoQualityScore > 70);
  }

  function checkAudioQuality() {
    const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
    audioAnalyser.getByteFrequencyData(dataArray);
    audioQualityScore = calculateAudioScore(dataArray);
  }

  function startRecording() {
    if (videoQualityScore < 70 || audioQualityScore < 70) return;
    
    countdownActive = true;
    startCountdown();
  }

  function startCountdown() {
    let count = 3;
    const countdown = setInterval(() => {
      if (count === 0) {
        clearInterval(countdown);
        countdownActive = false;
        initializeRecording();
      }
      count--;
    }, 1000);
  }

  function initializeRecording() {
    dispatch('recordingStart');
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    isRecording = true;
  }

  onDestroy(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (audioContext) {
      audioContext.close();
    }
  });
</script>

<div class="relative">
  <video
    bind:this={videoElement}
    autoplay
    class="w-full aspect-video bg-black rounded-lg"
  ></video>

  <div class="absolute top-4 right-4 flex gap-2">
    <div class="flex items-center gap-2 px-3 py-1 rounded-full {videoQualityScore > 70 ? 'bg-green-500' : 'bg-red-500'}">
      <span class="text-sm font-medium">Video</span>
      <span class="text-xs">{videoQualityScore}%</span>
    </div>
    <div class="flex items-center gap-2 px-3 py-1 rounded-full {audioQualityScore > 70 ? 'bg-green-500' : 'bg-red-500'}">
      <span class="text-sm font-medium">Audio</span>
      <span class="text-xs">{audioQualityScore}%</span>
    </div>
  </div>

  {#if countdownActive}
    <div 
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
      transition:fade
    >
      <div class="text-6xl font-bold" transition:scale>
        {count}
      </div>
    </div>
  {/if}
</div>

<div class="flex justify-center gap-4 mt-4">
  {#if !isRecording}
    <button
      on:click={startRecording}
      class="px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      disabled={videoQualityScore < 70 || audioQualityScore < 70}
    >
      Record
    </button>
  {:else}
    <button
      on:click={() => mediaRecorder.stop()}
      class="px-6 py-2 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors"
    >
      Stop
    </button>
    <button
      on:click={() => {
        isPaused ? mediaRecorder.resume() : mediaRecorder.pause();
        isPaused = !isPaused;
      }}
      class="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
    >
      {isPaused ? 'Resume' : 'Pause'}
    </button>
  {/if}
</div>
