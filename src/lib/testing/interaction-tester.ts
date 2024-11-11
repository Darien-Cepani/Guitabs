export class InteractionTester {
  private events: UserEvent[] = [];
  
  async testUserFlow(scenario: string) {
    const flow = new UserFlow(scenario);
    
    await flow
      .start()
      .click('.video-player')
      .wait(1000)
      .pressKey('space')
      .verifyState({ isPlaying: true })
      .dragSlider('.progress-bar', 50)
      .verifyState({ progress: 0.5 })
      .end();
      
    return flow.results;
  }
  
  analyzeHeatmap() {
    return new HeatmapAnalyzer(this.events).generate();
  }
}
