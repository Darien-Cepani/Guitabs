class LayoutAnalyzer {
  constructor() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.watchViewport();
  }

  watchViewport() {
    window.addEventListener('resize', () => {
      this.viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      this.analyzeLayout();
    });
  }

  analyzeLayout() {
    const elements = document.querySelectorAll('.interactive-element');
    const issues = [];

    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      
      if (rect.right > this.viewport.width || rect.bottom > this.viewport.height) {
        issues.push({
          element,
          issue: 'Element overflow',
          position: rect
        });
      }
    });

    return issues;
  }
}
