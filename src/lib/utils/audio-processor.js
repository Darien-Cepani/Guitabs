export async function processAudio(audioBlob) {
  const audioContext = new AudioContext();
  const audioData = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(audioData);
  
  const processor = new AudioProcessor(audioContext);
  return processor.enhance(audioBuffer);
}

class AudioProcessor {
  constructor(context) {
    this.context = context;
  }

  async enhance(buffer) {
    const enhancedBuffer = this.context.createBuffer(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );

    // Process each channel
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const data = buffer.getChannelData(channel);
      const enhanced = await this.processChannel(data);
      enhancedBuffer.copyToChannel(enhanced, channel);
    }

    return enhancedBuffer;
  }

  async processChannel(data) {
    // Apply noise gate
    const gated = this.applyNoiseGate(data);
    
    // Frequency isolation for guitar
    const filtered = this.isolateGuitarFrequencies(gated);
    
    // Dynamic compression
    return this.applyCompression(filtered);
  }

  applyNoiseGate(data, threshold = 0.01) {
    return data.map(sample => 
      Math.abs(sample) < threshold ? 0 : sample
    );
  }

  isolateGuitarFrequencies(data) {
    // Guitar frequency range: ~80Hz to ~1.2kHz
    const lowPass = this.filterFrequencies(data, 1200);
    return this.filterFrequencies(lowPass, 80, 'highpass');
  }

  applyCompression(data, threshold = -24, ratio = 4) {
    const gain = 0.5;
    return data.map(sample => {
      const db = 20 * Math.log10(Math.abs(sample));
      if (db < threshold) return sample * gain;
      
      const compression = (db - threshold) * (1 - 1/ratio);
      return sample * gain * Math.pow(10, -compression/20);
    });
  }
}
