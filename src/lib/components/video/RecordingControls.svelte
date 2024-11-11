<script>
  import { createToggle } from '@melt-ui/svelte';
  const { toggle, pressed } = createToggle();
</script>

<div class="flex justify-center space-x-4 mt-4">
  <button
    use:toggle
    class="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors duration-200"
    class:bg-red-700={$pressed}
  >
    {$pressed ? 'Stop Recording' : 'Start Recording'}
  </button>
</div>
