export class ErrorBoundary {
  static handle(error: Error, component: string) {
    console.error(`Error in ${component}:`, error);
    ErrorTracker.capture(error);
    return {
      fallback: this.getFallbackUI(component),
      recovery: this.getRecoveryAction(error)
    };
  }
}
