class UsabilityMonitor {
  constructor() {
    this.metrics = {
      timeOnTask: new Map(),
      errorRate: new Map(),
      successRate: new Map()
    };
  }

  startTaskTimer(taskId) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.metrics.timeOnTask.set(taskId, duration);
    };
  }

  trackSuccess(taskId, isSuccess) {
    const current = this.metrics.successRate.get(taskId) || { total: 0, success: 0 };
    current.total++;
    if (isSuccess) current.success++;
    this.metrics.successRate.set(taskId, current);
  }

  generateReport() {
    return {
      averageTimeOnTask: this.calculateAverageTime(),
      successRates: Object.fromEntries(this.metrics.successRate),
      recommendations: this.generateRecommendations()
    };
  }
}
