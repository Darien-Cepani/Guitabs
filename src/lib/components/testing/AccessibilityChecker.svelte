<script>
  import { onMount } from 'svelte';
  import { A11yTester } from '$lib/testing/a11y';
  
  let results = [];
  let fixing = false;
  
  onMount(async () => {
    const tester = new A11yTester();
    results = await tester.audit();
  });

  async function autoFix(issue) {
    fixing = true;
    await issue.applyFix();
    results = results.filter(r => r.id !== issue.id);
    fixing = false;
  }
</script>

<div class="space-y-4">
  {#each results as issue}
    <div class="p-4 bg-gray-800 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-medium">{issue.title}</h3>
          <p class="text-gray-400">{issue.description}</p>
        </div>
        <button
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          on:click={() => autoFix(issue)}
          disabled={fixing}
        >
          Auto Fix
        </button>
      </div>
    </div>
  {/each}
</div>
