<script>
  import { onMount, onDestroy } from 'svelte';
  import { createSlider } from '@melt-ui/svelte';
  import { recordingState } from '$lib/stores/video-store';
  import { fade } from 'svelte/transition';

  const { slider, value } = createSlider({
    min: 40,
    max: 208,
    step: 1,
    defaultValue: 120
  });

  let audioContext;
  let isPlaying = false;
  let isMuted = false;
  let tapTimes = [];
  let animationFrame;
  let progress = 0;
  let lastBeatTime = 0;

  $: bpm = $value;
  $: interval = 60000 / bpm;

  onMount(() => {
    audioContext = new AudioContext();
    initAudio();
  });

  function initAudio() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    return { oscillator, gainNode };
  }

  function playBeat() {
    if (isMuted || $recordingState.isRecording) return;
    
    const { oscillator, gainNode } = initAudio();
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  function startMetronome() {
    isPlaying = true;
    lastBeatTime = performance.now();
    tick();
  }

  function tick() {
    const now = performance.now();
    const elapsed = now - lastBeatTime;

    if (elapsed >= interval) {
      playBeat();
      lastBeatTime = now - (elapsed % interval);
    }

    progress = (elapsed % interval) / interval * 100;
    animationFrame = requestAnimationFrame(tick);
  }

  function stopMetronome() {
    isPlaying = false;
    cancelAnimationFrame(animationFrame);
  }

  function handleTapTempo() {
    const now = performance.now();
    tapTimes = [...tapTimes, now].filter(time => now - time < 2000);
    
    if (tapTimes.length > 1) {
      const intervals = tapTimes.slice(1).map((time, i) => time - tapTimes[i]);
      const averageInterval = intervals.reduce((a, b) => a + b) / intervals.length;
      value.set(Math.round(60000 / averageInterval));
    }
  }

  onDestroy(() => {
    stopMetronome();
    if (audioContext) {
      audioContext.close();
    }
  });
</script>

<div class="bg-gray-800 p-6 rounded-lg">
  <!-- Visual Metronome Circle -->
  <div class="relative w-48 h-48 mx-auto mb-6">
    <svg class="w-full h-full transform -rotate-90">
      <circle
        class="text-gray-700"
        stroke-width="4"
        stroke="currentColor"
        fill="transparent"
        r="70"
        cx="96"
        cy="96"
      />
      <circle
        class="text-blue-500 transition-all duration-100"
        stroke-width="4"
        stroke="currentColor"
        fill="transparent"
        r="70"
        cx="96"
        cy="96"
        stroke-dasharray={`${progress * 4.4}, 440`}
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="text-3xl font-bold">{bpm}</span>
    </div>
  </div>

  <!-- Controls -->
  <div class="space-y-6">
    <!-- BPM Slider -->
    <div class="space-y-2">
      <div use:slider class="relative h-2 bg-gray-700 rounded-full">
        <div class="absolute h-4 w-4 bg-blue-500 rounded-full -mt-1 cursor-pointer"
             style="left: {($value - 40) / (208 - 40) * 100}%">
        </div>
      </div>
      <div class="flex justify-between text-sm">
        <span>40</span>
        <span>208</span>
      </div>
    </div>

    <!-- Button Controls -->
    <div class="flex justify-center space-x-4">
      <button
        on:click={() => isPlaying ? stopMetronome() : startMetronome()}
        class="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        {isPlaying ? 'Stop' : 'Start'}
      </button>

      <button
        on:click={() => isMuted = !isMuted}
        class="px-6 py-2 rounded-lg {isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} transition-colors"
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </button>

      <button
        on:click={handleTapTempo}
        class="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
      >
        Tap
      </button>
    </div>

    <!-- Manual BPM Input -->
    <div class="flex justify-center">
      <input
        type="number"
        bind:value={$value}
        min="40"
        max="208"
        class="w-20 px-3 py-2 bg-gray-700 rounded-lg text-center"
      />
    </div>
  </div>
</div>
