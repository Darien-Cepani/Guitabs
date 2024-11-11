<script>
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  export let transcription;
  export let activeIndex;
  
  function formatFret(fret) {
    return fret.toString().padStart(2, '-');
  }
</script>

<div class="font-mono text-lg whitespace-pre overflow-x-auto">
  {#each stringNames as string, stringIndex}
    <div class="flex">
      <span class="w-8 text-gray-400">{string}</span>
      <div class="flex-1 border-b border-gray-600">
        {#each transcription as note, noteIndex}
          {#if note.string === stringIndex}
            <span
              class="inline-block min-w-[2ch] text-center cursor-pointer transition-colors {activeIndex === noteIndex ? 'text-blue-500' : ''}"
              on:click={() => dispatch('edit', { note: { ...note, index: noteIndex } })}
            >
              {formatFret(note.fret)}
            </span>
          {:else}
            <span class="inline-block min-w-[2ch] text-center">-</span>
          {/if}
        {/each}
      </div>
    </div>
  {/each}
</div>
