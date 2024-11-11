<script>
	import "../app.css";
	import { onMount } from 'svelte';
    import { PerformanceMonitor } from '$lib/utils/performance-monitor';
    import { initializeWorkers } from '$lib/utils/workers';
	import { core } from '$lib/core';
    import { player } from '$lib/player';
    
    const monitor = new PerformanceMonitor();
    
    onMount(() => {
		core.initialize();
        player.initialize();
        monitor.mark('app-start');
        
        // Modified to handle missing chunks gracefully
        Promise.all([
            prefetchCriticalAssets().catch(err => console.warn('Asset prefetch incomplete:', err)),
            initializeWorkers().catch(err => console.warn('Worker initialization incomplete:', err))
        ]).then(() => {
            monitor.mark('app-ready');
            monitor.measure('startup-time', 'app-start', 'app-ready');
        });
    });
    
    async function prefetchCriticalAssets() {
        const chunks = [
            '/src/lib/core.js',
            '/src/lib/player.js'
        ];
        
        return Promise.all(
            chunks.map(chunk => 
                fetch(chunk).catch(err => 
                    console.warn(`Chunk ${chunk} not available:`, err)
                )
            )
        );
    }
</script>

<div class="min-h-screen bg-gray-100">
	<slot />
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>