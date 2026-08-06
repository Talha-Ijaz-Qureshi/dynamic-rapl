import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const preferencesOpen = writable(false);
export const slugifyEnabled = writable(false);
export const camelCaseEnabled = writable(false);

function themeStore() {
  const defaultTheme = 'amoled';
  const storedTheme = browser ? localStorage.getItem('carbon-theme') || defaultTheme : defaultTheme;
  
  const { subscribe, set, update } = writable(storedTheme);

  return {
    subscribe,
    set: (value: string) => {
      if (browser) {
        localStorage.setItem('carbon-theme', value);
      }
      set(value);
    },
    update: (updater: (value: string) => string) => {
      update((currentValue) => {
        const newValue = updater(currentValue);
        if (browser) {
          localStorage.setItem('carbon-theme', newValue);
        }
        return newValue;
      });
    }
  };
}

export const selectedTheme = themeStore(); 
