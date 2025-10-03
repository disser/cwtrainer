import { morseCode } from './MorseData.js';

export class MorseGenerator {
  constructor(wpm = 20, frequency = 700) {
    this.wpm = wpm;
    this.frequency = frequency;
    this.audioContext = null;
    this.currentTone = null;
  }

  // Initialize audio context (must be called after user interaction)
  initAudio() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Calculate timing based on WPM using PARIS standard
  // PARIS = 50 units, so at 1 WPM, 1 unit = 1200ms
  getUnitDuration() {
    return 1200 / this.wpm;
  }

  // Play a tone for specified duration
  playTone(duration) {
    return new Promise((resolve) => {
      if (!this.audioContext) {
        this.initAudio();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = this.frequency;
      oscillator.type = 'sine';

      const now = this.audioContext.currentTime;
      
      // Envelope to avoid clicks
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.005);
      gainNode.gain.setValueAtTime(0.3, now + duration - 0.005);
      gainNode.gain.linearRampToValueAtTime(0, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);

      this.currentTone = oscillator;

      setTimeout(() => {
        resolve();
      }, duration * 1000);
    });
  }

  // Wait for specified duration
  wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration * 1000));
  }

  // Play a single morse character
  async playCharacter(character) {
    const morse = morseCode[character.toUpperCase()];
    if (!morse) {
      console.warn(`No morse code for character: ${character}`);
      return;
    }

    const unitDuration = this.getUnitDuration() / 1000; // Convert to seconds
    const dotDuration = unitDuration;
    const dashDuration = unitDuration * 3;
    const symbolGap = unitDuration; // Gap between dots/dashes
    const letterGap = unitDuration * 3; // Gap after character

    for (let i = 0; i < morse.length; i++) {
      const symbol = morse[i];
      
      if (symbol === '.') {
        await this.playTone(dotDuration);
      } else if (symbol === '-') {
        await this.playTone(dashDuration);
      }

      // Gap between symbols (except after last symbol)
      if (i < morse.length - 1) {
        await this.wait(symbolGap);
      }
    }

    // Gap after character
    await this.wait(letterGap);
  }

  // Set WPM
  setWPM(wpm) {
    this.wpm = wpm;
  }

  // Set frequency
  setFrequency(freq) {
    this.frequency = freq;
  }

  // Stop current playback
  stop() {
    if (this.currentTone) {
      try {
        this.currentTone.stop();
      } catch (e) {
        // Already stopped
      }
      this.currentTone = null;
    }
  }

  // Close audio context
  close() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
