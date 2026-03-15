import { useEffect } from 'react';
import { audioManager } from '../utils/audio';

export const AudioManager = () => {
  useEffect(() => {
    audioManager.init();
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
};