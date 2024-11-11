<script>
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { sessionStore } from '$lib/stores/session-store';
  import { createEventDispatcher } from 'svelte';
  import TabView from '../transcription/TabView.svelte';
  import NotationView from '../transcription/NotationView.svelte';
  import NoteEditor from '../transcription/NoteEditor.svelte';

// Specific icons for transcription features
import { 
    faEdit,
    faSave,
    faUndo 
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

import { createPulseAnimation, springConfig } from '$lib/utils';

const dispatch = createEventDispatcher();

  export let currentTime = 0;
  export let transcription = [];
  
  let viewMode = 'tab'; // 'tab' or 'notation'
  let editingNote = null;
  let activeNoteIndex = -1;

  $: {
    activeNoteIndex = transcription.findIndex(note => 
      note.timestamp <= currentTime && 
      note.timestamp + note.duration >= currentTime
    );
  }

  function updateNote(index, updatedNote) {
    transcription[index] = { ...transcription[index], ...updatedNote };
    transcription = [...transcription];
    dispatch('update', { transcription });
    editingNote = null;
  }
</script>

<div class="bg-gray-800 rounded-lg p-4">
  <!-- View Toggle -->
  <div class="flex justify-between items-center mb-4">
    <div class="space-x-2">
      <button
        class="px-4 py-2 rounded-lg transition-colors {viewMode === 'tab' ? 'bg-blue-600' : 'hover:bg-gray-700'}"
        on:click={() => viewMode = 'tab'}
      >
        Tab View
      </button>
      <button
        class="px-4 py-2 rounded-lg transition-colors {viewMode === 'notation' ? 'bg-blue-600' : 'hover:bg-gray-700'}"
        on:click={() => viewMode = 'notation'}
      >
        Notation View
      </button>
    </div>

    <button
      class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
      on:click={() => dispatch('save')}
    >
      Save Changes
    </button>
  </div>

  <!-- Transcription Display -->
  <div class="relative">
    {#if viewMode === 'tab'}
      <TabView
        {transcription}
        activeIndex={activeNoteIndex}
        on:edit={(e) => editingNote = e.detail.note}
      />
    {:else}
      <NotationView
        {transcription}
        activeIndex={activeNoteIndex}
        on:edit={(e) => editingNote = e.detail.note}
      />
    {/if}

    <!-- Note Editor Modal -->
    {#if editingNote}
      <div 
        class="fixed inset-0 bg-black/50 flex items-center justify-center"
        transition:fade
      >
        <div 
          class="bg-gray-800 p-6 rounded-lg w-96"
          transition:slide
        >
          <NoteEditor
            note={editingNote}
            on:save={(e) => updateNote(editingNote.index, e.detail)}
            on:cancel={() => editingNote = null}
          />
        </div>
      </div>
    {/if}
  </div>
</div>