// ÉVSZAKOK – szintetizált hangok (licencmentes, felvétel nélkül). © Andras Banky
(function () {
  // választható motívumok (félhang a alaphanghoz, hossz mp)
  const MOTIFS = {
    A: [[0, 0.55], [5, 0.55], [7, 0.4], [9, 0.9], [7, 0.55], [5, 0.9], [4, 0.55], [2, 0.55], [0, 1.6]],          // ív: fel, majd ereszkedve haza
    B: [[12, 0.7], [9, 0.5], [7, 0.5], [9, 1.0], [4, 0.6], [5, 0.6], [2, 0.9], [0, 1.7]],                          // ereszkedő, nyugodt
    C: [[0, 0.5], [2, 0.5], [4, 0.5], [7, 1.1], [9, 0.5], [7, 0.5], [4, 0.8], [2, 0.5], [0, 1.6]],                 // kérdés–felelet
  };
  const BASE = { 'ősz': 293.66, 'tél': 587.33, 'tavasz': 587.33, 'nyár': 220 };     // D4 / D5 / D5 / A3
  const R = Math.random;

  class EvszakHang {
    constructor() { this.loops = {}; this.motifId = 'A'; }
    init() {
      if (this.ac) { if (!this.hold) this.ac.resume(); return; }   // megállítva / némítva semmi nem indíthatja újra
      const AC = window.AudioContext || window.webkitAudioContext, ac = this.ac = new AC();
      this.out = ac.createGain(); this.out.gain.value = 0.3;   // környezeti hangok együttes szintje (szerző: „sokkal halkabbra”, nov. 1.)
      this.out.connect(ac.destination);
      const len = ac.sampleRate * 3, ir = ac.createBuffer(2, len, ac.sampleRate);
      for (let c = 0; c < 2; c++) { const a = ir.getChannelData(c); for (let i = 0; i < len; i++) a[i] = (R() * 2 - 1) * Math.pow(1 - i / len, 3.5); }
      const cv = ac.createConvolver(); cv.buffer = ir; this.rev = ac.createGain(); this.rev.gain.value = 0.35; this.rev.connect(cv); cv.connect(this.out);
      const n = ac.sampleRate * 2;
      this.white = ac.createBuffer(1, n, ac.sampleRate); const w = this.white.getChannelData(0); for (let i = 0; i < n; i++) w[i] = R() * 2 - 1;
      this.brown = ac.createBuffer(1, n, ac.sampleRate); const b = this.brown.getChannelData(0); let l = 0; for (let i = 0; i < n; i++) { l = (l + 0.02 * (R() * 2 - 1)) / 1.02; b[i] = l * 3.5; }
    }
    // kimenet: száraz + zengő ág
    bus(g, wet = 0.3) { g.connect(this.out); if (wet) { const s = this.ac.createGain(); s.gain.value = wet; g.connect(s); s.connect(this.rev); } return g; }
    noise(buf) { const s = this.ac.createBufferSource(); s.buffer = buf || this.white; s.loop = true; s.loopStart = R(); s.start(); return s; }
    env(g, t, a, peak, d) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.setTargetAtTime(0, t + a, d / 4); }

    // ---- motívum, évszakonként más hangszínnel ----
    motif(season, vol = 1) {
      this.init(); const ac = this.ac, f0 = BASE[season]; let t = ac.currentTime + 0.05;
      vol *= 0.6;
      for (const [st, dur] of MOTIFS[this.motifId] || MOTIFS.A) { this.note(season, f0 * Math.pow(2, st / 12), t, dur, vol); t += dur * (season === 'nyár' ? 1.15 : 1); }
      return t - ac.currentTime;
    }
    note(season, f, t, dur, vol) {
      const ac = this.ac, g = ac.createGain(); this.bus(g, season === 'tél' ? 0.5 : 0.35);
      const osc = (type, fr, amp, det = 0) => { const o = ac.createOscillator(), og = ac.createGain(); o.type = type; o.frequency.value = fr; o.detune.value = det; og.gain.value = amp; o.connect(og); og.connect(g); o.start(t); o.stop(t + dur + 4); return o; };
      if (season === 'ősz') {   // pengetett, hárfaszerű
        osc('triangle', f, 0.5); osc('sine', f * 2, 0.18); osc('sine', f * 3, 0.06);
        this.env(g, t, 0.006, 0.22 * vol, 2.2);
      } else if (season === 'tél') {   // zenedoboz
        osc('sine', f, 0.5); osc('sine', f * 4.02, 0.12); osc('sine', f * 6.9, 0.05);
        this.env(g, t, 0.003, 0.16 * vol, 1.6);
      } else if (season === 'tavasz') {   // fuvolaszerű, levegős
        const o = osc('sine', f, 0.6); osc('sine', f * 2, 0.08);
        const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 5; lg.gain.value = f * 0.006; lfo.connect(lg); lg.connect(o.frequency); lfo.start(t + 0.15); lfo.stop(t + dur + 1);
        const n = this.ac.createBufferSource(); n.buffer = this.white; const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * 2; bp.Q.value = 3; const ng = ac.createGain(); ng.gain.value = 0.05;
        n.connect(bp); bp.connect(ng); ng.connect(g); n.start(t); n.stop(t + dur + 0.5);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.16 * vol, t + 0.09); g.gain.setValueAtTime(0.14 * vol, t + dur * 0.8); g.gain.setTargetAtTime(0, t + dur * 0.8, 0.12);
      } else {   // nyár: meleg, telt
        const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100; lp.Q.value = 0.5;
        const g2 = ac.createGain(); g2.connect(lp); lp.connect(g);
        for (const [d, a] of [[-7, 0.3], [7, 0.3], [0, 0.25]]) { const o = ac.createOscillator(), og = ac.createGain(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = d; og.gain.value = a; o.connect(og); og.connect(g2); o.start(t); o.stop(t + dur + 3); }
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.11 * vol, t + 0.18); g.gain.setValueAtTime(0.1 * vol, t + dur); g.gain.setTargetAtTime(0, t + dur, 0.35);
      }
    }

    // ---- háttérzene: folyamatos, nagyon lágy, lassan váltó akkordok; az évszak csak a hangszínt színezi ----
    // nincs folyamatosan szóló oszcillátor (az „géphang”): egymásba úszó, lassan felerősödő és elhaló puha hangok
    pad(on, season) {
      this.init(); const ac = this.ac;
      if (!on) { if (this.pd) { clearTimeout(this.pd.to); this.pd.g.gain.setTargetAtTime(0, ac.currentTime, 1.5); this.pd = null; } return; }
      if (!this.pd) {
        const g = ac.createGain(); g.gain.value = 0; const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 0.2; lp.connect(g); this.bus(g, 0.8);
        g.gain.setTargetAtTime(1, ac.currentTime, 2);
        const CH = [[146.83, 220, 293.66, 369.99], [123.47, 246.94, 293.66, 369.99], [98, 196, 246.94, 293.66], [110, 220, 277.18, 329.63]];   // D – Hm – G – A
        const P = this.pd = { g, lp, ci: 0, h: 0.3 };
        const swell = (f, t, len, amp) => {   // egy puha hang: lassú be- és kiúszás, enyhe felhang
          const o = ac.createOscillator(), o2 = ac.createOscillator(), vg = ac.createGain(), g2 = ac.createGain();
          o.frequency.value = f; o2.frequency.value = f * 2; o2.detune.value = 3; g2.gain.value = P.h * 0.35;
          o.connect(vg); o2.connect(g2); g2.connect(vg); vg.connect(lp);
          vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(amp, t + len * 0.4); vg.gain.linearRampToValueAtTime(0, t + len);
          o.start(t); o2.start(t); o.stop(t + len + 0.1); o2.stop(t + len + 0.1);
        };
        const step = () => {
          if (this.pd !== P) return; const now = ac.currentTime + 0.05, c = CH[P.ci++ % CH.length];
          c.forEach((f, i) => { if (Math.random() < 0.8 || i === 0) swell(f, now + i * (0.6 + Math.random() * 1.2), 9 + Math.random() * 4, (i === 0 ? 0.022 : 0.016) * (0.7 + Math.random() * 0.3)); });
          P.to = setTimeout(step, (8 + Math.random() * 3) * 1000);
        };
        step();
      }
      const C = { 'ősz': [700, 0.35], 'tél': [1200, 0.12], 'tavasz': [1000, 0.22], 'nyár': [820, 0.4] }[season] || [900, 0.3];
      this.pd.lp.frequency.setTargetAtTime(C[0], ac.currentTime, 4); this.pd.h = C[1];
    }
    // ---- háttérzene felvételből: részletek, lágy be- és kiúsztatással, nagyon halkan ----
    loadMusic(url) {
      this.init(); if (this.mload) return this.mload;
      this.mload = fetch(url).then(r => r.arrayBuffer()).then(b => this.ac.decodeAudioData(b)).then(buf => {
        this.mbuf = buf; this.mg = this.ac.createGain(); this.mg.gain.value = 0.05; this.mg.connect(this.ac.destination);
      }).catch(e => console.warn('zene', e));
      return this.mload;
    }
    // a zene végig szól: az évszak részlete áttűnéssel ismétlődik, évszakváltáskor átúszik a következőbe
    playSeg(name, off, len, fi) {
      const ac = this.ac, t = ac.currentTime + 0.05, s = ac.createBufferSource(), g = ac.createGain();
      s.buffer = this.mbuf; s.connect(g); g.connect(this.mg);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + fi); g.gain.setValueAtTime(1, t + len - 4); g.gain.linearRampToValueAtTime(0, t + len);
      s.start(t, off, len + 0.1); return { name, t0: t, len, s, g };
    }
    fadeOut(M, d = 4) { const now = this.ac.currentTime; M.g.gain.cancelScheduledValues(now); M.g.gain.setValueAtTime(M.g.gain.value, now); M.g.gain.linearRampToValueAtTime(0, now + d); try { M.s.stop(now + d + 0.2); } catch (e) {} }
    musicSeason(name, off, len) {
      if (!this.mbuf) return; const M = this.mcur, now = this.ac.currentTime;
      if (!M || M.name !== name) { if (M) this.fadeOut(M, 4); this.mcur = this.playSeg(name, off, len, M ? 4 : 3); return; }
      if (now > M.t0 + len - 4.2) this.mcur = this.playSeg(name, off, len, 4);   // a régi a saját burkolójával halkul el
    }
    musicDuck(busy) { if (this.mg) this.mg.gain.setTargetAtTime(busy ? 0.02 : 0.05, this.ac.currentTime, 1.2); }   // környezeti hang alatt halkabb, csendben kicsit erősebb
    musicStop() { if (this.mcur) { this.fadeOut(this.mcur, 1.5); this.mcur = null; } }
    // ---- folyamatos hangok (be/ki) ----
    start(name) {
      this.init(); if (this.loops[name]) return; const ac = this.ac, nodes = [], timers = [];
      const g = ac.createGain(); g.gain.value = 0; nodes.push(g);
      const L0 = { g, nodes, timers, stopped: false, base: 0 };
      const every = (fn, a, b) => { const tick = () => { if (L0.stopped) return; fn(); timers.push(setTimeout(tick, (a + R() * (b - a)) * 1000)); }; timers.push(setTimeout(tick, 200)); };
      const fade = (v, tc = 1) => { L0.base = v; g.gain.setTargetAtTime(v, ac.currentTime, tc); };
      if (name === 'szél') {   // levegős susogás: nincs mély, zümmögő sáv
        const n = this.noise(), hp = ac.createBiquadFilter(), bp = ac.createBiquadFilter(), lv = ac.createGain();
        hp.type = 'highpass'; hp.frequency.value = 450; bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 0.35; lv.gain.value = 0.07;
        n.connect(hp); hp.connect(bp); bp.connect(lv); lv.connect(g); this.bus(g, 0.25); nodes.push(n); fade(1, 2.5);
        every(() => { const now = ac.currentTime, k = R(); bp.frequency.setTargetAtTime(900 + k * 1600, now, 1.8); lv.gain.setTargetAtTime(0.02 + k * k * 0.09, now, 1.6); }, 2, 4.5);
      } else if (name === 'tél csendje') {
        const n = this.noise(this.brown), lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260;
        n.connect(lp); lp.connect(g); this.bus(g, 0.1); nodes.push(n); fade(0.05, 2);
        every(() => g.gain.setTargetAtTime(0.025 + R() * 0.04, ac.currentTime, 2), 3, 6);
      } else if (name === 'eső' || name === 'zápor') {
        const z = name === 'zápor', n = this.noise(), hp = ac.createBiquadFilter(), lp = ac.createBiquadFilter();
        hp.type = 'highpass'; hp.frequency.value = z ? 500 : 900; lp.type = 'lowpass'; lp.frequency.value = z ? 4500 : 7000;
        const ng = ac.createGain(); ng.gain.value = 1; n.connect(hp); hp.connect(lp); lp.connect(ng); ng.connect(g); this.bus(g, 0.2); nodes.push(n);
        ng.gain.value = z ? 0.32 : 0.12; fade(1, 1.2);
        const tick = () => { const now = ac.currentTime; for (let k = 0; k < (z ? 7 : 3); k++) this.tick(now + R() * 0.05, z, g); };
        every(tick, 0.04, 0.06);
      } else if (name === 'csöpögés') {
        every(() => this.drip(), 0.5, 1.7);
      } else if (name === 'tücskök') {
        this.bus(g, 0.3); g.gain.value = 1;
        const cricket = (f, lvl, a, b, delay) => {
          const o = ac.createOscillator(), o2 = ac.createOscillator(), am = ac.createGain(), og2 = ac.createGain(), lv = ac.createGain();
          o.frequency.value = f; o2.frequency.value = f * 2; og2.gain.value = 0.25; am.gain.value = 0; lv.gain.value = lvl;
          o.connect(am); o2.connect(og2); og2.connect(am); am.connect(lv); lv.connect(g); o.start(); o2.start(); nodes.push(o, o2);
          every(() => { if (R() < 0.45) return; const now = ac.currentTime + delay; for (let k = 0, n = 2 + (R() * 3 | 0); k < n; k++) { const t = now + k * 0.055; am.gain.setValueAtTime(0, t); am.gain.linearRampToValueAtTime(1, t + 0.01); am.gain.setValueAtTime(1, t + 0.03); am.gain.linearRampToValueAtTime(0, t + 0.042); } }, a, b);
        };
        cricket(3900, 0.07, 3.2, 7.5, 0);
      } else if (name === 'méhek') {
        const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = 1.2; bp.connect(g); this.bus(g, 0.2);
        const os = [205, 211, 418].map((f, i) => { const o = ac.createOscillator(), og = ac.createGain(); o.type = 'sawtooth'; o.frequency.value = f; og.gain.value = i === 2 ? 0.3 : 0.5; o.connect(og); og.connect(bp); o.start(); nodes.push(o); return o; });
        fade(0.06, 0.8);
        every(() => { const now = ac.currentTime, k = 0.9 + R() * 0.25; os.forEach((o, i) => o.frequency.setTargetAtTime([205, 211, 418][i] * k, now, 0.4)); g.gain.setTargetAtTime(0.02 + R() * 0.08, now, 0.6); }, 0.6, 1.6);
      } else if (name === 'verebek') every(() => this.sparrow(), 0.8, 2.6);
      else if (name === 'rigó') every(() => this.blackbird(), 4, 7);
      else if (name === 'fecskék') every(() => this.swallow(), 1.2, 3);
      else if (name === 'madárdal') every(() => (R() < 0.5 ? this.blackbird(0.5) : this.sparrow(0.6)), 1.5, 4);
      this.loops[name] = L0;
    }
    level(name, v) { const L = this.loops[name]; if (L) L.g.gain.setTargetAtTime(L.base * Math.max(0, Math.min(1, v)), this.ac.currentTime, 0.35); }
    stop(name) {
      const L = this.loops[name]; if (!L) return; delete this.loops[name];
      L.stopped = true; L.timers.forEach(clearTimeout); L.timers.length = 0;
      const now = this.ac.currentTime; L.g.gain.cancelScheduledValues(now); L.g.gain.setTargetAtTime(0, now, 0.4);
      L.nodes.forEach(n => { try { n.stop && n.stop(now + 2); } catch (e) {} });
    }
    stopAll() { Object.keys(this.loops).forEach(n => this.stop(n)); this.pad(false); if (this.ac) this.musicStop(); }

    // ---- egyedi hangok ----
    tick(t, z, dest) {   // esőcsepp koppanása
      const ac = this.ac, s = ac.createBufferSource(); s.buffer = this.white; const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = (z ? 1500 : 2500) + R() * 3000; bp.Q.value = 4;
      const g = ac.createGain(); this.env(g, t, 0.001, (z ? 0.12 : 0.08) * R(), 0.03); s.connect(bp); bp.connect(g); if (dest) g.connect(dest); else this.bus(g, 0.1); s.start(t, R()); s.stop(t + 0.06);
    }
    drip(vol = 1) {   // olvadó csepp: „plip”
      this.init(); const ac = this.ac, t = ac.currentTime + 0.02, o = ac.createOscillator(), g = ac.createGain();
      const f = 620 + R() * 280; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.35, t + 0.06);
      this.env(g, t, 0.004, 0.05 * vol, 0.08); o.connect(g); this.bus(g, 0.5); o.start(t); o.stop(t + 0.3);
    }
    chirp(t, f1, f2, dur, amp, wet = 0.3) {
      const ac = this.ac, o = ac.createOscillator(), g = ac.createGain();
      o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(amp, t + dur * 0.2); g.gain.linearRampToValueAtTime(0, t + dur);
      o.connect(g); this.bus(g, wet); o.start(t); o.stop(t + dur + 0.05);
    }
    sparrow(vol = 1) {   // „csip-csip”
      this.init(); let t = this.ac.currentTime + 0.02; const n = 2 + (R() * 3 | 0), f = 3600 + R() * 900;
      for (let k = 0; k < n; k++) { this.chirp(t, f * 1.15, f * 0.82, 0.07, 0.09 * vol); this.chirp(t + 0.01, f * 2.2, f * 1.7, 0.05, 0.02 * vol); t += 0.13 + R() * 0.06; }
    }
    blackbird(vol = 1) {   // dallamos, fuvolás frázis, csicsergő végződéssel
      this.init(); const ac = this.ac; let t = ac.currentTime + 0.02; const P = [1760, 1975, 2217, 2489, 2637, 2960];
      for (let k = 0, n = 4 + (R() * 3 | 0); k < n; k++) {
        const f = P[R() * P.length | 0], d = 0.14 + R() * 0.16, o = ac.createOscillator(), g = ac.createGain();
        o.frequency.setValueAtTime(f * (R() < 0.5 ? 0.92 : 1.06), t); o.frequency.exponentialRampToValueAtTime(f, t + d * 0.4);
        const lf = ac.createOscillator(), lg = ac.createGain(); lf.frequency.value = 22; lg.gain.value = f * 0.012; lf.connect(lg); lg.connect(o.frequency); lf.start(t); lf.stop(t + d + 0.1);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.085 * vol, t + 0.03); g.gain.setTargetAtTime(0, t + d * 0.7, 0.04);
        o.connect(g); this.bus(g, 0.45); o.start(t); o.stop(t + d + 0.3); t += d + 0.05;
      }
      for (let k = 0; k < 4; k++) { this.chirp(t, 5200 + R() * 800, 3800, 0.035, 0.035 * vol, 0.4); t += 0.05; }
    }
    thunder(vol = 1) {   // távoli dörgés: mély, hosszan elnyúló morajlás
      this.init(); const ac = this.ac, t = ac.currentTime + 0.05, n = ac.createBufferSource(); n.buffer = this.brown;
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 160; lp.Q.value = 0.4; const g = ac.createGain();
      n.loop = true; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1.0 * vol, t + 0.6); g.gain.linearRampToValueAtTime(0.5 * vol, t + 1.6); g.gain.linearRampToValueAtTime(0.9 * vol, t + 2.5); g.gain.linearRampToValueAtTime(0.55 * vol, t + 4); g.gain.linearRampToValueAtTime(0.75 * vol, t + 5.2); g.gain.linearRampToValueAtTime(0.4 * vol, t + 7.5); g.gain.linearRampToValueAtTime(0.5 * vol, t + 8.6); g.gain.setTargetAtTime(0, t + 9, 2.4);   // erősebb, hosszan görgő   // hosszabb, hullámzó morajlás
      lp.frequency.setValueAtTime(260, t); lp.frequency.linearRampToValueAtTime(90, t + 12);
      n.connect(lp); lp.connect(g); this.bus(g, 0.6); n.start(t, Math.random()); n.stop(t + 18);
    }
    cranes(vol = 1) {   // daru: távoli, kürtszerű „krú-krú”
      this.init(); const ac = this.ac; let t = ac.currentTime + 0.03;
      for (let k = 0, n = 2 + (R() * 3 | 0); k < n; k++) {
        const f = 520 + R() * 160, d = 0.22 + R() * 0.12, o = ac.createOscillator(), o2 = ac.createOscillator(), bp = ac.createBiquadFilter(), g = ac.createGain();
        o.type = 'sawtooth'; o2.type = 'square'; o.frequency.setValueAtTime(f * 0.92, t); o.frequency.linearRampToValueAtTime(f, t + d * 0.3); o.frequency.linearRampToValueAtTime(f * 0.97, t + d);
        o2.frequency.value = f * 1.5; const g2 = ac.createGain(); g2.gain.value = 0.25;
        bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 1.4;
        o.connect(bp); o2.connect(g2); g2.connect(bp); bp.connect(g);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.06 * vol, t + 0.04); g.gain.setTargetAtTime(0, t + d * 0.75, 0.05);
        this.bus(g, 0.7); o.start(t); o2.start(t); o.stop(t + d + 0.3); o2.stop(t + d + 0.3);
        t += d + 0.08 + (k % 2 ? 0.25 : 0);
      }
    }
    swallow(vol = 1) {   // gyors csivitelés
      this.init(); let t = this.ac.currentTime + 0.02;
      for (let k = 0, n = 6 + (R() * 8 | 0); k < n; k++) { const f = 4800 + R() * 2200; this.chirp(t, f, f * (R() < 0.5 ? 1.3 : 0.75), 0.03 + R() * 0.02, 0.045 * vol, 0.25); t += 0.045 + R() * 0.03; }
    }
  }
  window.EvszakHang = EvszakHang;
})();
