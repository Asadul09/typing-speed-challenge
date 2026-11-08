import { SoundProfile } from '../types';

class SoundSynthesizerService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.6;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public playKeySound(profile: SoundProfile, key: string, isError: boolean = false) {
    if (profile === 'off' || this.isMuted || this.volume <= 0) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (isError) {
      this.playErrorBuzz(ctx, now);
      return;
    }

    switch (profile) {
      case 'cherry-blue':
        this.playCherryBlue(ctx, now, key);
        break;
      case 'cherry-brown':
        this.playCherryBrown(ctx, now, key);
        break;
      case 'typewriter':
        this.playTypewriter(ctx, now, key);
        break;
      case 'pop':
        this.playBubblePop(ctx, now);
        break;
      default:
        break;
    }
  }

  private playCherryBlue(ctx: AudioContext, time: number, key: string) {
    const isSpace = key === ' ';
    const osc = ctx.createOscillator();
    const noiseGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // High frequency click
    osc.type = 'sine';
    const baseFreq = isSpace ? 1400 : 2100 + (Math.random() * 300 - 150);
    osc.frequency.setValueAtTime(baseFreq, time);
    osc.frequency.exponentialRampToValueAtTime(300, time + 0.035);

    // Filter to give that metallic switch housing resonance
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isSpace ? 1200 : 2400, time);
    filter.Q.setValueAtTime(4, time);

    noiseGain.gain.setValueAtTime(this.volume * 0.45, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    osc.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.045);

    // Mechanical downstroke click
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(isSpace ? 180 : 320, time);
    clickOsc.frequency.exponentialRampToValueAtTime(80, time + 0.02);

    clickGain.gain.setValueAtTime(this.volume * 0.35, time);
    clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);

    clickOsc.start(time);
    clickOsc.stop(time + 0.03);
  }

  private playCherryBrown(ctx: AudioContext, time: number, key: string) {
    const isSpace = key === ' ';
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Deep tactile "thock"
    osc.type = 'triangle';
    const baseFreq = isSpace ? 280 : 380 + (Math.random() * 40 - 20);
    osc.frequency.setValueAtTime(baseFreq, time);
    osc.frequency.exponentialRampToValueAtTime(60, time + 0.05);

    gain.gain.setValueAtTime(this.volume * 0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.055);
  }

  private playTypewriter(ctx: AudioContext, time: number, key: string) {
    const isSpace = key === ' ';
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Metallic punch
    osc.type = 'sawtooth';
    const baseFreq = isSpace ? 440 : 800 + (Math.random() * 120 - 60);
    osc.frequency.setValueAtTime(baseFreq, time);
    osc.frequency.exponentialRampToValueAtTime(100, time + 0.04);

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(400, time);

    gain.gain.setValueAtTime(this.volume * 0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.05);

    // Carriage bell if Enter or space occasionally
    if (key === 'Enter') {
      this.playBell(ctx, time + 0.03);
    }
  }

  private playBell(ctx: AudioContext, time: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2093, time); // High C bell
    gain.gain.setValueAtTime(this.volume * 0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.52);
  }

  private playBubblePop(ctx: AudioContext, time: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const startFreq = 750 + Math.random() * 100;
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(200, time + 0.06);

    gain.gain.setValueAtTime(this.volume * 0.38, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.065);
  }

  private playErrorBuzz(ctx: AudioContext, time: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, time);
    osc.frequency.setValueAtTime(130, time + 0.03);

    gain.gain.setValueAtTime(this.volume * 0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.08);
  }
}

export const soundSynthesizer = new SoundSynthesizerService();
