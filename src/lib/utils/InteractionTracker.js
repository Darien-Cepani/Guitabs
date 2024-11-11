class InteractionTracker {
  constructor() {
    this.interactions = [];
    this.startTracking();
  }

  startTracking() {
    document.addEventListener('click', this.handleClick.bind(this));
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
    this.trackScrolling();
  }

  handleClick(event) {
    const target = event.target;
    const timestamp = Date.now();
    
    this.interactions.push({
      type: 'click',
      element: target.tagName,
      id: target.id,
      position: {
        x: event.clientX,
        y: event.clientY
      },
      timestamp
    });
  }

  generateHeatmap() {
    const heatmapData = this.interactions
      .filter(i => i.type === 'click')
      .map(i => ({
        x: i.position.x,
        y: i.position.y,
        value: 1
      }));

    return heatmapData;
  }
}
