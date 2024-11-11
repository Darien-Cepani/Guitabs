import { writable } from 'svelte/store';

export const videoAnnotations = writable({
  timestamps: [],
  techniques: new Map(),
  handPositions: new Map()
});

export function addAnnotation(timestamp, technique, bounds) {
  videoAnnotations.update(state => {
    state.timestamps.push(timestamp);
    state.techniques.set(timestamp, technique);
    state.handPositions.set(timestamp, bounds);
    return state;
  });
}
