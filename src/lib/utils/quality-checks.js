export function calculateVideoQuality(settings) {
  const frameRate = settings.frameRate || 30;
  const width = settings.width || 1280;
  const height = settings.height || 720;
  
  const frameRateScore = Math.min(100, (frameRate / 30) * 100);
  const resolutionScore = Math.min(100, ((width * height) / (1280 * 720)) * 100);
  
  const qualityScore = Math.floor((frameRateScore + resolutionScore) / 2);
  
  return {
    status: qualityScore >= 70 ? 'good' : 'poor',
    value: qualityScore
  };
}

export function calculateAudioQuality(settings) {
  const sampleRate = settings.sampleRate || 44100;
  const channelCount = settings.channelCount || 1;
  
  const sampleRateScore = Math.min(100, (sampleRate / 44100) * 100);
  const channelScore = Math.min(100, (channelCount / 2) * 100);
  
  const qualityScore = Math.floor((sampleRateScore + channelScore) / 2);
  
  return {
    status: qualityScore >= 70 ? 'good' : 'poor',
    value: qualityScore
  };
}
