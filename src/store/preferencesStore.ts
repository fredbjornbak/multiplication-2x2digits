import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Preferences {
  fontFamily: 'default' | 'openDyslexic';
}

interface PreferencesStore {
  preferences: Preferences;
  setFontFamily: (font: 'default' | 'openDyslexic') => void;
}

const initialPreferences: Preferences = {
  fontFamily: 'default',
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      preferences: initialPreferences,
      
      setFontFamily: (font) => set((state) => ({
        preferences: {
          ...state.preferences,
          fontFamily: font,
        },
      })),
    }),
    {
      name: 'gradeaid-preferences',
    }
  )
); 