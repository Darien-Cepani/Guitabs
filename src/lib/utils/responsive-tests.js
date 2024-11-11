export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export function runResponsiveTests() {
  const tests = [
    testVideoPlayerLayout,
    testTranscriptionLayout,
    testControlsLayout,
    testModalLayout
  ];
  
  Object.entries(breakpoints).forEach(([size, width]) => {
    tests.forEach(test => test(width));
  });
}

function testVideoPlayerLayout(width) {
  const player = document.querySelector('.video-player');
  const aspectRatio = player.offsetWidth / player.offsetHeight;
  
  return {
    name: 'Video Player Layout',
    width,
    passed: aspectRatio > 1.7 && aspectRatio < 1.8,
    metrics: { aspectRatio }
  };
}
