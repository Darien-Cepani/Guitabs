<script>
  import { fade, slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { sessionStore } from '$lib/stores/session-store';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faHistory, faClock, faTag } from '@fortawesome/free-solid-svg-icons';

  let sessions = [];
  let currentSession = null;
  let loading = false;

  $: filteredSessions = sessions.sort((a, b) => b.timestamp - a.timestamp);

  onMount(async () => {
    sessions = await loadSessions();
  });

  async function loadSession(sessionId) {
    loading = true;
    
    // Store current session state
    sessionStore.saveCurrentState();
    
    try {
      const session = await fetchSessionData(sessionId);
      await transitionToSession(session);
    } finally {
      loading = false;
    }
  }

  async function transitionToSession(session) {
    // Smooth transition between sessions
    await sessionStore.transition(session);
    currentSession = session;
  }
</script>

<div class="space-y-4">
  <!-- History Header -->
  <div class="flex items-center gap-2 text-gray-400">
    <FontAwesomeIcon icon={faHistory} />
    <span class="font-medium">Session History</span>
  </div>

  <!-- Sessions List -->
  <div class="space-y-2">
    {#each filteredSessions as session (session.id)}
      <button
        class="w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors {currentSession?.id === session.id ? 'ring-2 ring-blue-500' : ''}"
        on:click={() => loadSession(session.id)}
        disabled={loading}
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-medium text-left">{session.title}</h3>
            <div class="flex items-center gap-2 text-sm text-gray-400 mt-1">
              <span class="flex items-center gap-1">
                <FontAwesomeIcon icon={faClock} class="text-xs" />
                {new Date(session.timestamp).toLocaleDateString()}
              </span>
              {#if session.tags?.length}
                <span class="flex items-center gap-1">
                  <FontAwesomeIcon icon={faTag} class="text-xs" />
                  {session.tags[0]}
                </span>
              {/if}
            </div>
          </div>
          
          {#if session.progress}
            <div 
              class="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center"
              transition:fade
            >
              <span class="text-sm font-medium text-blue-400">
                {session.progress}%
              </span>
            </div>
          {/if}
        </div>
      </button>
    {/each}
  </div>

  <!-- Loading Overlay -->
  {#if loading}
    <div 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      transition:fade={{ duration: 200 }}
    >
      <div 
        class="bg-gray-800 p-6 rounded-lg shadow-xl"
        transition:slide={{ duration: 300, easing: quintOut }}
      >
        <div class="flex items-center gap-4">
          <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span class="text-lg">Loading Session...</span>
        </div>
      </div>
    </div>
  {/if}
</div>
