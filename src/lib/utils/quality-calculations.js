export function calculateVideoScore(settings) {
  const frameRate = settings.frameRate || 30;
  const width = settings.width || 1280;
  const height = settings.height || 720;
  
  const frameRateScore = Math.min(100, (frameRate / 30) * 100);
  const resolutionScore = Math.min(100, ((width * height) / (1280 * 720)) * 100);
  
  return Math.floor((frameRateScore + resolutionScore) / 2);
}

export function calculateAudioScore(dataArray) {
  const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
  const normalizedScore = Math.min(100, (average / 128) * 100);
  return Math.floor(normalizedScore);
}
