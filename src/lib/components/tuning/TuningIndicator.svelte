<script>
  export let note;
  export let targetFreq;
  export let currentFreq;
  export let isTuned;

  $: difference = currentFreq - targetFreq;
  $: isClose = Math.abs(difference) < 1;
  $: direction = difference > 0 ? 'Too High' : 'Too Low';
</script>

<div class="p-4 rounded-lg {isTuned ? 'bg-green-600' : 'bg-gray-700'} transition-colors">
  <div class="text-center">
    <span class="text-2xl font-bold">{note}</span>
    <div class="mt-2 text-sm">
      {#if isClose}
        <span class="text-green-400">In Tune!</span>
      {:else}
        <span class="text-yellow-400">{direction}</span>
      {/if}
    </div>
  </div>
</div>
