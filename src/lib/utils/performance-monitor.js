export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.marks = new Map();
  }

  mark(name) {
    performance.mark(name);
    this.marks.set(name, performance.now());
  }

  measure(name, startMark, endMark) {
    performance.measure(name, startMark, endMark);
    const duration = this.marks.get(endMark) - this.marks.get(startMark);
    this.metrics.set(name, duration);
    return duration;
  }
}
