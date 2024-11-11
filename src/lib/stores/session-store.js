import { writable } from 'svelte/store';

function createSessionStore() {
  const { subscribe, set, update } = writable({
    currentSession: null,
    history: [],
    states: new Map()
  });

  return {
    subscribe,
    
    async saveCurrentState() {
      update(store => {
        if (store.currentSession) {
          store.states.set(store.currentSession.id, {
            video: store.currentSession.video,
            transcription: store.currentSession.transcription,
            timestamp: Date.now()
          });
        }
        return store;
      });
    },
    
    async transition(newSession) {
      // Smooth transition between sessions
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set({
        currentSession: newSession,
        history: [],
        states: new Map()
      });
    },
    
    async fetchSessionData(sessionId) {
      const response = await fetch(`/api/sessions/${sessionId}`);
      return response.json();
    }
  };
}

export const sessionStore = createSessionStore();
