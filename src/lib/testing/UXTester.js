class UXTester {
  constructor() {
    this.results = [];
    this.observers = new Map();
    this.setupIntersectionObserver();
    this.bindEventListeners();
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleVisibilityChanges(entries),
      { threshold: [0, 0.5, 1] }
    );
  }

  trackUserInteraction(element) {
    const metrics = {
      timeToFirstInteraction: performance.now(),
      interactionCount: 0,
      errorCount: 0
    };

    element.addEventListener('click', () => {
      metrics.interactionCount++;
      this.logInteraction(element, metrics);
    });

    return metrics;
  }

  validateAccessibility() {
    const elements = document.querySelectorAll('button, a, input, [role]');
    const issues = [];

    elements.forEach(element => {
      if (!element.getAttribute('aria-label') && !element.innerText) {
        issues.push({
          element,
          issue: 'Missing accessible name',
          severity: 'high'
        });
      }
    });

    return issues;
  }
}
