export async function startAudioAnalysis() {
  const audioContext = new AudioContext();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioContext.createMediaStreamSource(stream);
  const analyzerNode = audioContext.createAnalyser();
  
  analyzerNode.fftSize = 2048;
  source.connect(analyzerNode);
  
  return {
    analyzerNode,
    start: () => audioContext.resume(),
    stop: () => {
      stream.getTracks().forEach(track => track.stop());
      audioContext.close();
    }
  };
}

export function getCurrentFrequency(analyzer) {
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Float32Array(bufferLength);
  analyzer.getFloatTimeDomainData(dataArray);
  
  return detectPitchYIN(dataArray, analyzer.sampleRate);
}

function detectPitchYIN(buffer, sampleRate) {
  const threshold = 0.1;
  const minFreq = 70;  // E2 string minimum
  const maxFreq = 350; // E4 string maximum
  
  // YIN algorithm implementation
  const bufferSize = buffer.length;
  const yinBuffer = new Float32Array(bufferSize / 2);
  
  // Step 1: Autocorrelation
  for (let t = 0; t < yinBuffer.length; t++) {
    yinBuffer[t] = 0;
    for (let i = 0; i < yinBuffer.length; i++) {
      const diff = buffer[i] - buffer[i + t];
      yinBuffer[t] += diff * diff;
    }
  }
  
  // Step 2 and 3: Cumulative mean normalized difference
  let runningSum = 0;
  yinBuffer[0] = 1;
  for (let t = 1; t < yinBuffer.length; t++) {
    runningSum += yinBuffer[t];
    yinBuffer[t] = yinBuffer[t] * t / runningSum;
  }
  
  // Step 4: Absolute threshold
  let tau = 0;
  let foundTau = false;
  for (let t = 2; t < yinBuffer.length; t++) {
    if (yinBuffer[t] < threshold) {
      if (yinBuffer[t] < yinBuffer[t - 1]) {
        tau = t;
        foundTau = true;
        break;
      }
    }
  }
  
  if (!foundTau) return 0;
  
  const freq = sampleRate / tau;
  if (freq >= minFreq && freq <= maxFreq) {
    return freq;
  }
  
  return 0;
}
