<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let transcription = [];
  export let activeIndex = -1;

  let canvas;
  let ctx;

  onMount(() => {
    ctx = canvas.getContext('2d');
    drawNotation();
  });

  function drawNotation() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw staff lines
    const staffLines = 5;
    const lineSpacing = 10;
    
    for (let i = 0; i < staffLines; i++) {
      const y = 20 + (i * lineSpacing);
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(canvas.width - 20, y);
      ctx.strokeStyle = '#666';
      ctx.stroke();
    }
    
    // Draw notes
    transcription.forEach((note, index) => {
      const x = 40 + (index * 30);
      const y = 20 + (note.string * lineSpacing);
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = index === activeIndex ? '#3B82F6' : '#fff';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.stroke();
      
      // Add click detection
      canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        transcription.forEach((note, index) => {
          const noteX = 40 + (index * 30);
          const noteY = 20 + (note.string * lineSpacing);
          
          if (Math.abs(clickX - noteX) < 10 && Math.abs(clickY - noteY) < 10) {
            dispatch('edit', { note: { ...note, index } });
          }
        });
      };
    });
  }

  $: if (ctx && transcription) drawNotation();
</script>

<canvas
  bind:this={canvas}
  width="800"
  height="200"
  class="w-full bg-gray-900 rounded-lg"
/>
