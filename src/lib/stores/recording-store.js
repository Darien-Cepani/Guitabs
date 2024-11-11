import { writable } from 'svelte/store';

export const recordingQuality = writable({
  stream: null,
  isRecording: false,
  countdown: false
});
s