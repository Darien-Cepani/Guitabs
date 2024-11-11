import { writable } from 'svelte/store';

export const appState = writable({
  sidebarOpen: false,
  currentFeature: 'home'
});
