/**
 * BunkerOS Audio Engine (Web Audio API)
 * Procedural retro sound synthesis:
 * - Mechanical mouse clicks & clacks
 * - Heavy rubber/brass approval stamps & dry wooden reject stamps
 * - Window minimize / restore glides & close clicks
 * - Dot-matrix teletype & printer chatter
 * - Background ambient PC hum (50Hz transformer, 15kHz CRT coil, HDD chatter)
 * - Cash register chime, radio static for TOR tuner, Windows 95 logon
 */
class BunkerAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.7;

    // Ambient PC noise nodes
    this.ambientRunning = false;
    this.ambientGain = null;
    this.humOsc = null;
    this.crtOsc = null;
    this.hddInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(0.08 * this.volume, this.ctx.currentTime);
    }
  }

  toggleSound(enable) {
    this.enabled = enable;
    if (!enable && this.ambientRunning) {
      this.stopAmbient();
    } else if (enable && !this.ambientRunning) {
      this.startAmbient();
    }
  }

  // =========================================================================
  // BACKGROUND AMBIENT: 50Hz Transformer Hum + 15kHz CRT Coil + HDD seeks
  // =========================================================================
  startAmbient() {
    if (!this.enabled || this.ambientRunning) return;
    this.init();
    try {
      this.ambientRunning = true;
      const t = this.ctx.currentTime;

      // Master ambient gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.08 * this.volume, t);
      this.ambientGain.connect(this.ctx.destination);

      // 1. 50Hz Transformer / Fan hum
      this.humOsc = this.ctx.createOscillator();
      const humFilter = this.ctx.createBiquadFilter();
      humFilter.type = 'lowpass';
      humFilter.frequency.value = 110;

      this.humOsc.type = 'triangle';
      this.humOsc.frequency.value = 50;
      this.humOsc.connect(humFilter);
      humFilter.connect(this.ambientGain);
      this.humOsc.start();

      // 2. 15.6 kHz CRT Flyback Whistle
      this.crtOsc = this.ctx.createOscillator();
      const crtGain = this.ctx.createGain();
      crtGain.gain.value = 0.015; // very subtle high frequency whistle
      this.crtOsc.type = 'sine';
      this.crtOsc.frequency.value = 15625;
      this.crtOsc.connect(crtGain);
      crtGain.connect(this.ambientGain);
      this.crtOsc.start();

      // 3. Periodic HDD Seek / Head Chatter (*хр-хр-тррк*)
      this.hddInterval = setInterval(() => {
        if (!this.ambientRunning || Math.random() > 0.45) return;
        this.playHddSeek();
      }, 4000);
    } catch (e) {}
  }

  stopAmbient() {
    this.ambientRunning = false;
    if (this.hddInterval) clearInterval(this.hddInterval);
    if (this.humOsc) {
      try { this.humOsc.stop(); this.humOsc.disconnect(); } catch (e) {}
    }
    if (this.crtOsc) {
      try { this.crtOsc.stop(); this.crtOsc.disconnect(); } catch (e) {}
    }
  }

  playHddSeek() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const clicks = 2 + Math.floor(Math.random() * 4);

    for (let i = 0; i < clicks; i++) {
      const clickTime = t + i * (0.03 + Math.random() * 0.02);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(450 + Math.random() * 300, clickTime);

      gain.gain.setValueAtTime(0.025 * this.volume, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.015);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(clickTime);
      osc.stop(clickTime + 0.02);
    }
  }

  // =========================================================================
  // UNIVERSAL MECHANICAL CLICK
  // =========================================================================
  playGlobalClick() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.025);
    
    gain.gain.setValueAtTime(0.12 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.03);
  }

  playClick() {
    this.playGlobalClick();
  }

  // =========================================================================
  // STAMPS & ACTIONS
  // =========================================================================
  playApproveStamp() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;

    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(180, t);
    thud.frequency.exponentialRampToValueAtTime(30, t + 0.22);

    thudGain.gain.setValueAtTime(0.7 * this.volume, t);
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    thud.connect(thudGain);
    thudGain.connect(this.ctx.destination);
    thud.start(t);
    thud.stop(t + 0.26);

    const noiseLen = this.ctx.sampleRate * 0.08;
    const noiseBuf = this.ctx.createBuffer(1, noiseLen, this.ctx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) noiseData[i] = Math.random() * 2 - 1;

    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35 * this.volume, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    noiseSrc.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noiseSrc.start(t);

    setTimeout(() => this.playHydraulics(), 120);
  }

  playStampApprove() {
    this.playApproveStamp();
  }

  playRejectStamp() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;

    const wood = this.ctx.createOscillator();
    const woodGain = this.ctx.createGain();
    wood.type = 'triangle';
    wood.frequency.setValueAtTime(540, t);
    wood.frequency.exponentialRampToValueAtTime(80, t + 0.12);

    woodGain.gain.setValueAtTime(0.6 * this.volume, t);
    woodGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    wood.connect(woodGain);
    woodGain.connect(this.ctx.destination);
    wood.start(t);
    wood.stop(t + 0.15);

    const buzzer = this.ctx.createOscillator();
    const buzzGain = this.ctx.createGain();
    buzzer.type = 'sawtooth';
    buzzer.frequency.setValueAtTime(140, t + 0.03);
    buzzer.frequency.exponentialRampToValueAtTime(90, t + 0.2);

    buzzGain.gain.setValueAtTime(0.25 * this.volume, t + 0.03);
    buzzGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    buzzer.connect(buzzGain);
    buzzGain.connect(this.ctx.destination);
    buzzer.start(t + 0.03);
    buzzer.stop(t + 0.25);
  }

  playStampReject() {
    this.playRejectStamp();
  }

  // =========================================================================
  // CASH REGISTER / BRIBE / SALARY SOUND
  // =========================================================================
  playCash() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;

    // Dual bell chime
    [1046.5, 1318.5].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0, t + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.25 * this.volume, t + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.5);
    });
  }

  // =========================================================================
  // RADIO STATIC (FOR TOR RADIO TUNING)
  // =========================================================================
  playRadioStatic() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2200;
    filter.Q.value = 1.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  // =========================================================================
  // WINDOW MOVEMENT & CONTROLS
  // =========================================================================
  playWindowMinimize() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, t);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.14);
    gain.gain.setValueAtTime(0.18 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  playWindowRestore() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(680, t + 0.14);
    gain.gain.setValueAtTime(0.18 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  playWindowGlide() {
    this.playWindowRestore();
  }

  playWindowClose() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.06);
    gain.gain.setValueAtTime(0.2 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  playWindowsLogon() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const chord = [
      { f: 261.63, time: 0.00, dur: 0.8 },
      { f: 329.63, time: 0.08, dur: 0.8 },
      { f: 392.00, time: 0.16, dur: 0.9 },
      { f: 523.25, time: 0.24, dur: 1.2 }
    ];

    chord.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t + n.time);
      gain.gain.setValueAtTime(0, t + n.time);
      gain.gain.linearRampToValueAtTime(0.18 * this.volume, t + n.time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.time + n.dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + n.time);
      osc.stop(t + n.time + n.dur + 0.05);
    });
  }

  playTeletype() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1800 + Math.random() * 400, t);
    osc.frequency.setValueAtTime(900 + Math.random() * 200, t + 0.015);
    gain.gain.setValueAtTime(0.08 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.035);
  }

  playHydraulics() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2200, t);
    filter.frequency.linearRampToValueAtTime(600, t + 0.3);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25 * this.volume, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);
  }

  playPneumaticLaunch() {
    this.playHydraulics();
  }

  playIncomingMail() {
    this.playAchievementChime();
  }

  playCrtOff() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(15734, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.35);
    gain.gain.setValueAtTime(0.2 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  playDegauss() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.5);
    gain.gain.setValueAtTime(0.4 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.6);
  }

  playAchievementChime() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const notes = [
      { f: 523.25, time: 0.00, dur: 0.12 },
      { f: 659.25, time: 0.08, dur: 0.12 },
      { f: 783.99, time: 0.16, dur: 0.15 },
      { f: 1046.50, time: 0.26, dur: 0.45 }
    ];

    notes.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, t + note.time);
      gain.gain.setValueAtTime(0, t + note.time);
      gain.gain.linearRampToValueAtTime(0.22 * this.volume, t + note.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.time + note.dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + note.time);
      osc.stop(t + note.time + note.dur + 0.05);
    });
  }

  playWarning() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.setValueAtTime(240, t + 0.1);
    gain.gain.setValueAtTime(0.3 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.32);
  }

  playErrorChord() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    [150, 190, 225].forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2 * this.volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.36);
    });
  }

  playBootUp() {
    this.playWindowsLogon();
  }

  // =========================================================================
  // PROCEDURAL RADIO NARRATOR (Deep, Gruff Soviet Military Radio Broadcast)
  // =========================================================================
  playRadioNarration(onCharTick) {
    if (!this.enabled) return null;
    this.init();
    this.stopRadioNarration();

    const t = this.ctx.currentTime;
    // Low-mid speech bandpass filter for heavy chest voice & horn acoustics
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(580, t);
    bandpass.Q.setValueAtTime(1.8, t);

    // Heavy distortion wave shaper for gravelly vocal fry and radio clipping
    const shaper = this.ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = (Math.PI + 12) * x / (Math.PI + 12 * Math.abs(x));
    }
    shaper.curve = curve;

    const speechGain = this.ctx.createGain();
    speechGain.gain.setValueAtTime(0.25 * this.volume, t);

    bandpass.connect(shaper);
    shaper.connect(speechGain);
    speechGain.connect(this.ctx.destination);

    // Deep baritone/bass primary carrier oscillator
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(62, t); // Deep bass pitch (around C2)
    osc.connect(bandpass);
    osc.start(t);

    // Sub-harmonic throat oscillator for deep rasp
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'square';
    subOsc.frequency.setValueAtTime(31, t); // Sub-bass octave
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.12 * this.volume, t);
    subOsc.connect(subGain);
    subGain.connect(bandpass);
    subOsc.start(t);

    // Rhythmic modulation of pitch and formants to simulate deep masculine speech
    let step = 0;
    const syllablePitches = [58, 64, 72, 60, 66, 54, 70, 62, 68, 56];
    const formants = [350, 580, 440, 720, 380, 620, 690, 410];

    this.narratorInterval = setInterval(() => {
      if (!this.narratorActive) return;
      try {
        const now = this.ctx.currentTime;
        const pitch = syllablePitches[step % syllablePitches.length] + (Math.random() * 6 - 3);
        const f = formants[step % formants.length];
        osc.frequency.setValueAtTime(pitch, now);
        subOsc.frequency.setValueAtTime(pitch / 2, now);
        bandpass.frequency.setValueAtTime(f, now);

        // Syllable volume envelope
        speechGain.gain.cancelScheduledValues(now);
        speechGain.gain.setValueAtTime(0.24 * this.volume, now);
        speechGain.gain.linearRampToValueAtTime(0.06 * this.volume, now + 0.08);

        if (onCharTick) onCharTick(step);
        step++;
      } catch (e) {}
    }, 105);

    this.narratorActive = true;
    this.narratorOsc = osc;
    this.narratorSubOsc = subOsc;
    this.narratorGain = speechGain;

    return () => this.stopRadioNarration();
  }

  stopRadioNarration() {
    this.narratorActive = false;
    if (this.narratorInterval) {
      clearInterval(this.narratorInterval);
      this.narratorInterval = null;
    }
    if (this.narratorOsc) {
      try {
        this.narratorOsc.stop();
        this.narratorOsc.disconnect();
      } catch (e) {}
      this.narratorOsc = null;
    }
    if (this.narratorSubOsc) {
      try {
        this.narratorSubOsc.stop();
        this.narratorSubOsc.disconnect();
      } catch (e) {}
      this.narratorSubOsc = null;
    }
    if (this.narratorGain) {
      try { this.narratorGain.disconnect(); } catch (e) {}
      this.narratorGain = null;
    }
  }

  // =========================================================================
  // EMERGENCY ALARM SIREN (Two-tone pulsing bunker alert)
  // =========================================================================
  playAlarmSiren(durationSec = 4) {
    if (!this.enabled) return;
    this.init();
    this.stopAlarmSiren();

    const t = this.ctx.currentTime;
    const sirenOsc = this.ctx.createOscillator();
    const sirenGain = this.ctx.createGain();
    sirenOsc.type = 'sawtooth';

    // 2-tone frequency modulation (440Hz -> 880Hz wail)
    sirenOsc.frequency.setValueAtTime(440, t);
    for (let i = 0; i < durationSec * 2; i++) {
      const cycleT = t + i * 0.5;
      sirenOsc.frequency.linearRampToValueAtTime(750, cycleT + 0.25);
      sirenOsc.frequency.linearRampToValueAtTime(440, cycleT + 0.5);
    }

    sirenGain.gain.setValueAtTime(0.25 * this.volume, t);
    sirenGain.gain.exponentialRampToValueAtTime(0.001, t + durationSec);

    sirenOsc.connect(sirenGain);
    sirenGain.connect(this.ctx.destination);
    sirenOsc.start(t);
    sirenOsc.stop(t + durationSec);

    this.activeSiren = sirenOsc;
  }

  stopAlarmSiren() {
    if (this.activeSiren) {
      try { this.activeSiren.stop(); this.activeSiren.disconnect(); } catch (e) {}
      this.activeSiren = null;
    }
  }

  // =========================================================================
  // DEMONIC 666 / INFERNO EASTER EGG (Deep Abyssal Drone & Tritone Horror)
  // =========================================================================
  playDemonicEasterEgg() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;

    // 1. Tritone Dissonance Sawtooth Oscillators (Diabolus in Musica: 37Hz & 52Hz)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc3.type = 'triangle';

    osc1.frequency.setValueAtTime(54, t); // C#1
    osc1.frequency.exponentialRampToValueAtTime(28, t + 2.5); // Down-pitch demonic roar

    osc2.frequency.setValueAtTime(38, t); // F0 tritone dissonance
    osc2.frequency.exponentialRampToValueAtTime(20, t + 2.8);

    osc3.frequency.setValueAtTime(666, t); // High demonic squeal descending to 66.6Hz
    osc3.frequency.exponentialRampToValueAtTime(66.6, t + 1.2);

    // Distortion drive
    const shaper = this.ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = (Math.PI + 16) * x / (Math.PI + 16 * Math.abs(x));
    }
    shaper.curve = curve;

    // Filter
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(350, t);
    lowpass.frequency.linearRampToValueAtTime(120, t + 2.5);

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.40 * this.volume, t);
    masterGain.gain.exponentialRampToValueAtTime(0.001, t + 3.0);

    const highGain = this.ctx.createGain();
    highGain.gain.setValueAtTime(0.08 * this.volume, t);
    highGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

    osc1.connect(shaper);
    osc2.connect(shaper);
    shaper.connect(lowpass);
    lowpass.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    osc3.connect(highGain);
    highGain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc3.start(t);

    osc1.stop(t + 3.1);
    osc2.stop(t + 3.1);
    osc3.stop(t + 1.3);
  }

  // =========================================================================
  // VIRUS DRAIN / GLITCH SOUND
  // =========================================================================
  playVirusGlitch() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.linearRampToValueAtTime(180, t + 0.05);
    osc.frequency.linearRampToValueAtTime(40, t + 0.12);
    gain.gain.setValueAtTime(0.12 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }
  // =========================================================================
  // CONTINUOUS DEMONIC SUB-BASS DRONE & RASP (EASTER EGG 666 / 66.6 FM)
  // =========================================================================
  startDemonicDrone() {
    if (!this.enabled || this.demonicDroneActive) return;
    this.init();
    this.demonicDroneActive = true;
    try {
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const osc3 = this.ctx.createOscillator();
      const masterGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(46.25, t); // F#1 sub-bass

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(47.4, t); // beating detune

      osc3.type = 'square';
      osc3.frequency.setValueAtTime(92.5, t); // harsh octave harmonic

      // Distortion wave shaper
      const shaper = this.ctx.createWaveShaper();
      const n = 256;
      const curve = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const x = (i * 2) / n - 1;
        curve[i] = (3 + 12) * x * 20 * (Math.PI / 180) / (Math.PI + 12 * Math.abs(x));
      }
      shaper.curve = curve;
      shaper.oversample = '4x';

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, t);
      filter.Q.setValueAtTime(5.0, t);

      masterGain.gain.setValueAtTime(0.01, t);
      masterGain.gain.linearRampToValueAtTime(0.38 * (this.volume || 0.7), t + 0.6);

      osc1.connect(shaper);
      osc2.connect(shaper);
      osc3.connect(shaper);
      shaper.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc3.start(t);

      this.demonicDroneNodes = { osc1, osc2, osc3, masterGain, filter };
    } catch (e) {
      console.warn("Could not start demonic drone audio:", e);
    }
  }

  stopDemonicDrone() {
    if (!this.demonicDroneActive) return;
    this.demonicDroneActive = false;
    try {
      if (this.demonicDroneNodes && this.ctx) {
        const { osc1, osc2, osc3, masterGain } = this.demonicDroneNodes;
        const t = this.ctx.currentTime;
        masterGain.gain.linearRampToValueAtTime(0.001, t + 0.4);
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
            osc3.stop();
            osc1.disconnect();
            osc2.disconnect();
            osc3.disconnect();
          } catch (_) {}
        }, 450);
        this.demonicDroneNodes = null;
      }
    } catch (e) {
      console.warn("Could not stop demonic drone audio:", e);
    }
  }

  // =========================================================================
  // CINEMATIC BUNKER MENU AUDIO (HUM, RELAYS, ELECTRIC SPARK)
  // =========================================================================
  startMenuHum() {
    if (!this.enabled) return;
    try {
      if (!this.menuHumAudio) {
        this.menuHumAudio = new Audio('audio/menu_hum.mp3');
        this.menuHumAudio.loop = true;
      }
      this.menuHumAudio.volume = 0.35 * this.volume;
      const playPromise = this.menuHumAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy prevented immediate playback until user interaction
        });
      }
    } catch (e) {
      console.warn("Could not start menu hum:", e);
    }
  }

  stopMenuHum() {
    if (this.menuHumAudio) {
      try {
        let v = this.menuHumAudio.volume;
        const fade = setInterval(() => {
          v = Math.max(0, v - 0.05);
          if (this.menuHumAudio) this.menuHumAudio.volume = v;
          if (v <= 0) {
            clearInterval(fade);
            this.menuHumAudio.pause();
            this.menuHumAudio.currentTime = 0;
          }
        }, 30);
      } catch (_) {
        this.menuHumAudio.pause();
      }
    }
  }

  playMenuNavigate() {
    if (!this.enabled) return;
    this.init();
    try {
      const t = this.ctx.currentTime;
      // High-frequency subtle relay blip
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1250, t);
      osc.frequency.exponentialRampToValueAtTime(750, t + 0.035);

      gain.gain.setValueAtTime(0.08 * this.volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.045);
    } catch (_) {}
  }

  playMenuSelect() {
    if (!this.enabled) return;
    this.init();
    try {
      const t = this.ctx.currentTime;
      // Heavy mechanical latch switch
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(800, t);
      osc1.frequency.exponentialRampToValueAtTime(140, t + 0.05);

      gain1.gain.setValueAtTime(0.18 * this.volume, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.08);

      // Low mechanical thud
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(130, t + 0.02);
      osc2.frequency.exponentialRampToValueAtTime(45, t + 0.12);

      gain2.gain.setValueAtTime(0.22 * this.volume, t + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t + 0.02);
      osc2.stop(t + 0.15);
    } catch (_) {}
  }

  playLampCrackle() {
    if (!this.enabled) return;
    this.init();
    try {
      const t = this.ctx.currentTime;
      // Generate tiny burst of filtered crackle noise (electrical filament arc)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // sporadic spikes
        const r = Math.random();
        data[i] = r > 0.82 ? (Math.random() * 2 - 1) : 0;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2800, t);
      filter.Q.setValueAtTime(2.5, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12 * this.volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);
    } catch (_) {}
  }
}

window.soundEngine = new BunkerAudio();
