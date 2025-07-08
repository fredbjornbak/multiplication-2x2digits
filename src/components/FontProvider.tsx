import React, { useEffect } from 'react';
import { usePreferencesStore } from '@/store/preferencesStore';

interface FontProviderProps {
  children: React.ReactNode;
}

const FontProvider: React.FC<FontProviderProps> = ({ children }) => {
  const { preferences } = usePreferencesStore();
  
  useEffect(() => {
    // Apply font family to the root element to ensure it cascades properly
    if (preferences.fontFamily === 'openDyslexic') {
      // Apply to html element to ensure it cascades properly
      document.documentElement.style.setProperty('--font-family', 'OpenDyslexic, sans-serif');
      document.body.style.fontFamily = 'OpenDyslexic, sans-serif';
      
      // Add a class to the body for additional styling if needed
      document.body.classList.add('dyslexia-font');
    } else {
      document.documentElement.style.setProperty('--font-family', 'Roboto, system-ui, sans-serif');
      document.body.style.fontFamily = 'Roboto, system-ui, sans-serif';
      document.body.classList.remove('dyslexia-font');
    }
    
    // Clean up
    return () => {
      document.documentElement.style.removeProperty('--font-family');
      document.body.style.fontFamily = '';
      document.body.classList.remove('dyslexia-font');
    };
  }, [preferences.fontFamily]);
  
  return <>{children}</>;
};

export default FontProvider; 