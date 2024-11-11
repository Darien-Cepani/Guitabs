import { writable } from 'svelte/store';

function createThemeStore() {
  const { subscribe, set, update } = writable({
    isDark: true,
    colors: {
      primary: 'blue',
      secondary: 'purple'
    }
  });

  return {
    subscribe,
    set: (theme) => {
      set({ isDark: theme === 'dark', colors: theme.colors });
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    },
    toggle: () => {
      update(state => {
        const newTheme = !state.isDark;
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', newTheme);
        return { ...state, isDark: newTheme };
      });
    }
  };
}

export const themeStore = createThemeStore();
