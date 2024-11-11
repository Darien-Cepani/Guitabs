<script>
  export let note;
  
  let editedNote = { ...note };
  
  const techniques = [
    'hammer-on',
    'pull-off',
    'slide',
    'bend',
    'vibrato'
  ];
</script>

<div class="space-y-4">
  <h3 class="text-xl font-bold">Edit Note</h3>
  
  <div class="space-y-2">
    <label class="block">
      String
      <input
        type="number"
        bind:value={editedNote.string}
        min="0"
        max="5"
        class="w-full bg-gray-700 rounded px-3 py-2"
      />
    </label>
    
    <label class="block">
      Fret
      <input
        type="number"
        bind:value={editedNote.fret}
        min="0"
        max="24"
        class="w-full bg-gray-700 rounded px-3 py-2"
      />
    </label>
    
    <label class="block">
      Technique
      <select
        bind:value={editedNote.technique}
        class="w-full bg-gray-700 rounded px-3 py-2"
      >
        <option value="">None</option>
        {#each techniques as technique}
          <option value={technique}>{technique}</option>
        {/each}
      </select>
    </label>
  </div>
  
  <div class="flex justify-end gap-2">
    <button
      class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
      on:click={() => dispatch('cancel')}
    >
      Cancel
    </button>
    <button
      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
      on:click={() => dispatch('save', editedNote)}
    >
      Save
    </button>
  </div>
</div>
