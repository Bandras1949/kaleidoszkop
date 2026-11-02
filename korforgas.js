// KÖRFORGÁS élmény – egy fa, egy pad, egy év (evszakok.js kép + evszakok-hang.js hang), a MEDITÁCIÓ-val azonos felülettel. © Andras Banky
(function () {
  const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const SEG = { 'ősz': [78, 30], 'tél': [0, 27], 'tavasz': [27, 27], 'nyár': [54, 24] };   // a zene részletei: [helye a felvételben, hossza]
  const RAIN = S => Math.max(sm(14, 16, S) * (1 - sm(24.5, 31, S)), 0.8 * sm(160.5, 162, S) * (1 - sm(170.5, 176.5, S)));
  const SHOW = S => sm(216, 217.5, S) * (1 - sm(223.5, 229, S));
  const LOOPS = S => {
    const L = [];
    if (S >= 30 && S < 60) L.push('szél');
    if (S >= 60 && S < 122) L.push('tél csendje');
    if (S >= 121 && S < 146) L.push('csöpögés');
    if (S >= 138 && S < 178) L.push('madárdal'); if (S >= 147 && S < 159) L.push('méhek');
    if (S >= 181 && S < 215) L.push('tücskök');
    if (RAIN(S) > 0.002) L.push('eső'); if (SHOW(S) > 0.002) L.push('zápor');
    return L;
  };
  const NAMES = ['ősz', 'tél', 'tavasz', 'nyár'];

  class Korforgas {
    constructor(cv, getP) {
      this.getP = getP || (() => ({})); this.want = true;
      this.ev = new window.Evszakok(cv, () => ({}), null);
    }
    // start/stop többször hívható; stop szünetel, újraindításkor onnan folytatja
    start() {
      if (this.run) return; this.run = true;
      if (this.pAt) { this.ev.t0 += performance.now() - this.pAt; this.pAt = 0; }
      this.ev.tl = performance.now(); this.ev.start();
      if (this.want) this.audio();
      this.iv = setInterval(() => this.tick(), 250);
    }
    stop() { if (!this.run) return; this.run = false; this.ev.stop(); this.pAt = performance.now(); clearInterval(this.iv); this.mute(); }
    mute() { const H = this.H; if (!H || !H.ac) return; H.hold = true; H.stopAll(); H.ac.suspend(); this.busy = null; }
    setWant(on) { if (on === this.want) return; this.want = on; if (!this.run) return; if (on) this.audio(); else this.mute(); }
    locked() { return !!(this.run && this.want && this.H && this.H.ac && this.H.ac.state !== 'running'); }
    sync() {}
    destroy() { this.stop(); this.ev.destroy(); if (this.H && this.H.ac) this.H.ac.close(); }
    audio() {
      if (!window.EvszakHang) return;
      if (!this.H) {
        const H = this.H = new window.EvszakHang(); H.init(); H.loadMusic('evszakok/reflective-piano.mp3');
        this.ev.onEvent = n => {
          if (!this.on()) return; this.lastEv = performance.now();
          if (n === 'csepp') { if (Math.random() < 0.45) H.drip(0.6 + Math.random() * 0.4); }
          else if (n === 'veréb') H.sparrow(0.7); else if (n === 'rigó') H.blackbird(0.75); else if (n === 'dörgés') H.thunder(0.8);
        };
      }
      if (!this.run || !this.want) return;
      this.H.hold = false; this.H.ac.resume();
    }
    on() { return this.run && this.want && this.H && this.H.ac && this.H.ac.state === 'running' && !this.H.hold; }
    tick() {
      const H = this.H, S = this.ev.S; if (S == null || !this.on()) return;
      const want = new Set(LOOPS(S));
      for (const n of Object.keys(H.loops)) if (!want.has(n)) H.stop(n);
      for (const n of want) if (!H.loops[n]) H.start(n);
      H.level('eső', RAIN(S)); H.level('zápor', SHOW(S));
      const ms = NAMES[((S + 2) % 240) / 60 | 0];
      H.musicSeason(ms, SEG[ms][0], SEG[ms][1]);
      const busy = ['eső', 'zápor', 'madárdal', 'méhek', 'csöpögés'].some(n => want.has(n)) || performance.now() - (this.lastEv || 0) < 3000;
      if (busy !== this.busy) { this.busy = busy; H.musicDuck(busy); }
    }
  }
  window.Korforgas = Korforgas;
})();
