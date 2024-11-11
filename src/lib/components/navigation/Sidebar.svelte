<script>
  import { onMount } from 'svelte';
  import { slide, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { themeStore } from '$lib/stores/theme-store';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { 
    faBars, faUser, faCrown, faCog, 
    faHistory, faSun, faMoon, faChevronLeft 
  } from '@fortawesome/free-solid-svg-icons';

  let isExpanded = true;
  let isMobile = false;
  let userTier = 'pro';
  let history = [];

  onMount(() => {
    checkMobile();
    loadHistory();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });

  function checkMobile() {
    isMobile = window.innerWidth < 768;
    isExpanded = !isMobile;
  }

  function loadHistory() {
    history = [
      { id: 1, title: 'Sweet Child O Mine', date: '2024-01-20' },
      { id: 2, title: 'Stairway to Heaven', date: '2024-01-19' },
      { id: 3, title: 'Nothing Else Matters', date: '2024-01-18' }
    ];
  }

  function toggleTheme() {
    themeStore.toggle();
  }
</script>

<aside
  class="fixed left-0 top-0 h-full bg-gray-800 shadow-xl transition-all duration-300 z-50"
  class:w-64={isExpanded}
  class:w-16={!isExpanded}
>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="p-4 flex items-center justify-between border-b border-gray-700">
      {#if isExpanded}
        <img 
          src="/logo.svg" 
          alt="Logo" 
          class="h-8"
          transition:fade
        />
      {/if}
      <button
        class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        on:click={() => isExpanded = !isExpanded}
      >
        <FontAwesomeIcon icon={isExpanded ? faChevronLeft : faBars} />
      </button>
    </div>

    <!-- User Profile -->
    <div class="p-4 border-b border-gray-700">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
          <FontAwesomeIcon icon={faUser} />
        </div>
        {#if isExpanded}
          <div transition:fade>
            <div class="font-medium">John Doe</div>
            <div class="text-sm text-blue-400 flex items-center gap-1">
              <FontAwesomeIcon icon={faCrown} class="text-yellow-500" />
              Pro User
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto">
      <!-- Subscription -->
      <div class="p-4 border-b border-gray-700">
        {#if isExpanded}
          <button
            class="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition-opacity"
            transition:fade
          >
            Manage Subscription
          </button>
        {:else}
          <button class="w-8 h-8 mx-auto flex items-center justify-center hover:bg-gray-700 rounded-lg transition-colors">
            <FontAwesomeIcon icon={faCrown} />
          </button>
        {/if}
      </div>

      <!-- History -->
      <div class="p-4">
        <div class="flex items-center gap-2 mb-4 text-gray-400">
          <FontAwesomeIcon icon={faHistory} />
          {#if isExpanded}
            <span transition:fade>Recent Sessions</span>
          {/if}
        </div>
        {#if isExpanded}
          <div class="space-y-2" transition:fade>
            {#each history as session}
              <a
                href="/session/{session.id}"
                class="block p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div class="font-medium">{session.title}</div>
                <div class="text-sm text-gray-400">{session.date}</div>
              </a>
            {/each}
          </div>
        {/if}
      </div>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-700">
      <div class="flex items-center justify-between">
        <button
          class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          on:click={() => window.location.href = '/settings'}
        >
          <FontAwesomeIcon icon={faCog} />
        </button>
        <button
          class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          on:click={toggleTheme}
        >
          <FontAwesomeIcon icon={$themeStore.isDark ? faSun : faMoon} />
        </button>
      </div>
    </div>
  </div>
</aside>

<style>
  /* Custom scrollbar for history */
  nav::-webkit-scrollbar {
    width: 4px;
  }

  nav::-webkit-scrollbar-track {
    @apply bg-gray-700;
  }

  nav::-webkit-scrollbar-thumb {
    @apply bg-gray-600 rounded-full;
  }
</style>
