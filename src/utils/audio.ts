import { state } from '../store';

export class AudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.init();
  }

  init() {
    if (this.context) return;

    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      state.audio.context = this.context;
      
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.15;
      this.masterGain.connect(this.context.destination);
      
      state.audio.enabled = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
      state.audio.enabled = false;
    }
  }

  playHoverSound() {
    if (!state.audio.enabled || !this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.context.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(this.context.currentTime);
    osc.stop(this.context.currentTime + 0.15);
  }

  playClickSound() {
    if (!state.audio.enabled || !this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.context.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.4, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(this.context.currentTime);
    osc.stop(this.context.currentTime + 0.08);
  }

  toggle() {
    if (!this.context) {
      this.init();
      return;
    }
    
    state.audio.enabled = !state.audio.enabled;
    
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(
        state.audio.enabled ? 0.15 : 0,
        this.context.currentTime
      );
    }
  }

  destroy() {
    if (this.context) {
      this.context.close();
      this.context = null;
      this.masterGain = null;
      state.audio.context = null;
      state.audio.enabled = false;
    }
  }
}

export const audioManager = new AudioManager();