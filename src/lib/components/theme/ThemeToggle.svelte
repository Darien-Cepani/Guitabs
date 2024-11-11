<script>
  import { onMount } from 'svelte';
  import { themeStore } from '$lib/stores/theme-store';
  import { 
    faSun, 
    faMoon 
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      themeStore.set(savedTheme);
    }
  });

  function toggleTheme() {
    themeStore.toggle();
  }
</script>

<button
  class="relative p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
  on:click={toggleTheme}
>
  <div class="relative w-8 h-8">
    {#if $themeStore.isDark}
      <div in:fade={{ duration: 200 }}>
        <FontAwesomeIcon icon={faSun} class="text-yellow-400" />
      </div>
    {:else}
      <div in:fade={{ duration: 200 }}>
        <FontAwesomeIcon icon={faMoon} class="text-blue-400" />
      </div>
    {/if}
  </div>
</button>
