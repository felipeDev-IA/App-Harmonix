
import { NOTE_FREQUENCIES } from '../constants';
import { NoteName } from '../types';

class AudioService {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNote(note: NoteName, duration = 0.8) {
    this.init();
    if (!this.ctx) return;

    const freq = NOTE_FREQUENCIES[note];
    const now = this.ctx.currentTime;

    // Principal Oscillator (Tine sound)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);
    
    // Character Oscillator (Body)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq, now);

    // Envelope
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.4, now + 0.01);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + duration);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.6);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(this.ctx.destination);
    gain2.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  playSequence(notes: NoteName[], interval = 0.4) {
    notes.forEach((note, i) => {
      setTimeout(() => this.playNote(note), i * interval * 1000);
    });
  }
}

export const audioService = new AudioService();
