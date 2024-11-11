<script>
  import { onMount } from 'svelte';
  let time = 300; // 5 minutes in seconds
  let active = false;

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function toggleTimer() {
    active = !active;
  }
</script>

<div class="text-center">
  <h3 class="text-xl font-semibold mb-4">Timer</h3>
  <div class="text-4xl font-bold mb-4">
    {formatTime(time)}
  </div>
  <button
    on:click={toggleTimer}
    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
  >
    {active ? 'Pause' : 'Start'}
  </button>
</div>
