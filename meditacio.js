// MEDITÁCIÓ élmény – ködös tó, lélegző fény, halvány mandala, szintetizált tibeti tálak. © Andras Banky
(function () {
  const IW = 1920, IH = 1080;
  const SUN = [770 / IW, 578 / IH];      // a nap fényfoltja a képen
  const HORIZON = 565 / IH;               // vízvonal a képen
  const FOCUS = [0.5, 0.6];               // álló kivágás középpontja (fa + csónak)
  const BOWLS = [147, 175, 196, 220, 262]; // D F G A C (pentaton)
  const RATIOS = [1, 2.76, 5.40, 8.93];
  const AMPS = [1, 0.45, 0.22, 0.1];
  const DECAY = [20, 12, 7, 4];           // mp, amíg elhal (-60 dB)
  const SEQ = { Alap: [[0, 1], [0, 1], [3, 0]], D: [[0, 0]], F: [[1, 0]], G: [[2, 0]], A: [[3, 0]], C: [[4, 0]], 'Összes': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] };
  const sm = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);

  class Meditacio {
    constructor(cv, getP) {
      this.cv = cv; this.ctx = cv.getContext('2d'); this.getP = getP || (() => ({}));
      this.img = new Image(); this.img.onload = () => { this.ready = true; };
      this.img.src = (this.getP() || {})._kep || 'meditacio/to-01.jpg';
      this.t0 = performance.now(); this.glow = 0; this.next = 0; this.si = 0; this.want = true;
      this.onR = () => this.resize(); window.addEventListener('resize', this.onR);
      this.resize();
    }
    P() {
      const p = this.getP() || {};
      return {
        tal: p['tálak'] ?? true, sor: p['hangsor'] ?? 'Alap', kodMp: p['ködCiklusMp'] ?? 120, zugas: p['alapzúgás'] ?? true,
        mandala: p.mandala ?? true, mandalaMp: p['mandalaMp'] ?? 70, legzes: p['légzésMp'] ?? 10,
        kod: (p['ködErősség'] ?? 60) / 100, hang: (p['hangerő'] ?? 70) / 100,
      };
    }
    resize() {
      const d = Math.min(2, window.devicePixelRatio || 1), r = this.cv.getBoundingClientRect();
      this.d = d; this.w = Math.max(1, Math.round(r.width * d)); this.h = Math.max(1, Math.round(r.height * d));
      this.cv.width = this.w; this.cv.height = this.h;
      const s = Math.max(this.w / IW, this.h / IH), dw = IW * s, dh = IH * s;
      const cl = (v, a, b) => Math.min(b, Math.max(a, v));
      this.R = { s, dw, dh, dx: cl(this.w / 2 - FOCUS[0] * dw, this.w - dw, 0), dy: cl(this.h / 2 - FOCUS[1] * dh, this.h - dh, 0) };
      this.makeMist();
    }
    makeMist() {
      this.mist = [0, 1, 2].map(i => {
        const tw = Math.round(this.w * 1.6), th = Math.round(this.h * (0.32 + i * 0.08));
        const c = document.createElement('canvas'); c.width = tw; c.height = th; const g = c.getContext('2d');
        for (let k = 0; k < 34; k++) {
          const x = Math.random() * tw, y = th * (0.25 + Math.random() * 0.5), r = th * (0.15 + Math.random() * 0.3), a = 0.10 + Math.random() * 0.16;
          for (const ox of [-tw, 0, tw]) {
            g.save(); g.translate(x + ox, y); g.scale(3.2, 1);
            const gr = g.createRadialGradient(0, 0, 0, 0, 0, r);
            gr.addColorStop(0, `rgba(255,238,208,${a})`); gr.addColorStop(1, 'rgba(255,238,208,0)');
            g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.fill(); g.restore();
          }
        }
        return { c, tw, th, v: [5, -8, 13][i] * this.d, y: [-0.16, 0.02, 0.2][i] };
      });
    }
    // start/stop: többször hívható (a Bemutató minden képkockán hívja); stop csak szünetel
    start() {
      if (this.run) return; this.run = true; this.t0 = performance.now(); this.si = 0; this.next = 1; this.resize();
      if (this.want) this.audio();
      const f = () => { if (!this.run) return; this.frame(); this.raf = requestAnimationFrame(f); }; f();
    }
    stop() { if (!this.run) return; this.run = false; cancelAnimationFrame(this.raf); if (this.ac) this.ac.suspend(); }
    setWant(on) { if (on === this.want) return; this.want = on; if (!this.run) return; if (on) this.audio(); else if (this.ac) this.ac.suspend(); }
    locked() { return !!(this.run && this.want && this.ac && this.ac.state !== 'running'); }
    destroy() { this.stop(); window.removeEventListener('resize', this.onR); if (this.ac) this.ac.close(); }
    sync() { this.syncDrone(); if (this.master) this.master.gain.setTargetAtTime(this.P().hang, this.ac.currentTime, 0.3); }

    frame() {
      const { ctx, w, h, d } = this, p = this.P(), t = (performance.now() - this.t0) / 1000;
      if (p.sor !== this.sorNev) { this.sorNev = p.sor; this.si = 0; }
      if (this.ac && this.ac.state === 'running' && p.tal && t >= this.next) {
        const seq = SEQ[p.sor] || SEQ.Alap, st = seq[this.si % seq.length];
        this.strike(st[0], 0.8, st[1]); this.si++;
        this.next = t + 20;
      }
      this.glow *= 0.994;
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      ctx.fillStyle = '#b89c72'; ctx.fillRect(0, 0, w, h);
      if (!this.ready) return;
      const R = this.R, z = 1.035 + 0.035 * Math.sin(t / 40 * 6.2832);
      const fx = R.dx + FOCUS[0] * R.dw, fy = R.dy + FOCUS[1] * R.dh;
      const dw = R.dw * z, dh = R.dh * z, dx = fx - (fx - R.dx) * z, dy = fy - (fy - R.dy) * z;
      ctx.drawImage(this.img, dx, dy, dw, dh);
      // víz: alig fodrozódó csíkok
      const hy = dy + HORIZON * dh + 6 * d, sh = 2 * d;
      for (let y = Math.max(0, Math.floor(hy)); y < h; y += sh) {
        const k = (y - hy) / (h - hy + 1), amp = d * (0.6 + 3.2 * k);
        const off = amp * Math.sin(y * 0.045 / d + t * 0.8) + amp * 0.5 * Math.sin(y * 0.011 / d - t * 0.5);
        const sy = (y - dy) / dh * IH, sH = sh / dh * IH;
        ctx.drawImage(this.img, 0, sy, IW, sH, dx + off, y, dw, sh);
      }
      // lélegző napfény
      const sx = dx + SUN[0] * dw, syy = dy + SUN[1] * dh;
      const b = 0.5 - 0.5 * Math.cos(t / p.legzes * 6.2832), gl = Math.min(1, this.glow);
      ctx.globalCompositeOperation = 'screen';
      let gr = ctx.createRadialGradient(sx, syy, 0, sx, syy, Math.hypot(w, h) * 0.32);
      gr.addColorStop(0, `rgba(255,232,185,${0.10 + 0.20 * b + 0.12 * gl})`); gr.addColorStop(1, 'rgba(255,232,185,0)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h);
      gr = ctx.createRadialGradient(sx, syy, 0, sx, syy, Math.min(w, h) * 0.09);
      gr.addColorStop(0, `rgba(255,248,226,${0.18 + 0.22 * b})`); gr.addColorStop(1, 'rgba(255,248,226,0)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h);
      if (p.mandala) { const mr = Math.min(w, h) * 0.24; this.drawMandala(Math.max(mr * 1.15, w * 0.24), Math.max(mr * 1.1, h * 0.2), t, p, b, mr); }
      // köd
      ctx.globalCompositeOperation = 'source-over';
      const l = 0.5 - 0.5 * Math.cos(t / p.kodMp * 6.2832);   // 0 = lent ül a köd, 1 = felszállt, a kép alja tiszta
      gr = ctx.createLinearGradient(0, hy, 0, h);
      gr.addColorStop(0, `rgba(255,236,204,${p.kod * 0.18 * (1 - l)})`); gr.addColorStop(1, `rgba(255,236,204,${p.kod * 0.5 * (1 - l)})`);
      ctx.fillStyle = gr; ctx.fillRect(0, hy, w, h - hy);
      this.mist.forEach((m, i) => {
        const x = ((t * m.v) % m.tw + m.tw) % m.tw, y = hy + m.y * h - m.th / 2 - l * h * (0.12 + 0.1 * i);
        ctx.globalAlpha = Math.min(1, p.kod * (1 - l * (0.25 + 0.2 * i)) * (0.75 + 0.25 * Math.sin(t / (17 + i * 6) + i * 2)));
        ctx.drawImage(m.c, x - m.tw, y); ctx.drawImage(m.c, x, y);
      });
      ctx.globalAlpha = 1;
      gr = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.hypot(w, h) * 0.62);
      gr.addColorStop(0, 'rgba(60,40,20,0)'); gr.addColorStop(1, 'rgba(60,40,20,0.28)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h);
    }

    // egyetlen forma: kibomlik, lélegzik, átalakul, elhalványul
    drawMandala(cx, cy, t, p, b, R0) {
      const ph = (t % p.mandalaMp) / p.mandalaMp;
      const env = ph < 0.35 ? ph / 0.35 : ph < 0.5 ? 1 : ph < 0.85 ? 1 - (ph - 0.5) / 0.35 : 0;
      if (env <= 0) return;
      const { ctx, d } = this, Rm = R0 * (0.97 + 0.03 * b), N = 6;
      ctx.save(); ctx.translate(cx, cy); ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < N; i++) {
        const a = sm(env * (N + 1) - i) * 0.2;
        if (a <= 0.003) continue;
        const Ri = Rm * (0.16 + 0.15 * i), n = i % 2 ? 24 : 12, dir = i % 2 ? -1 : 1;
        const am = 0.05 + 0.05 * Math.sin(t * 0.045 + i * 1.3), rot = dir * t * 0.008 + i * 0.26;
        ctx.strokeStyle = `rgba(255,240,205,${a})`;
        for (const lw of [3.2, 1]) {
          ctx.lineWidth = lw * d; ctx.globalAlpha = lw > 1 ? 0.35 : 1;
          ctx.beginPath();
          for (let k = 0; k <= 360; k++) {
            const th = k / 360 * 6.2832, r = Ri * (1 + am * Math.cos(n * th + rot * n));
            const x = r * Math.cos(th), y = r * Math.sin(th);
            k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        if (i % 2) {   // szirmok
          const pr = Ri * (0.07 + 0.04 * Math.sin(t * 0.03 + i)), c = 12;
          ctx.lineWidth = d;
          for (let k = 0; k < c; k++) {
            const th = k / c * 6.2832 + rot;
            ctx.beginPath(); ctx.arc(Ri * Math.cos(th), Ri * Math.sin(th), pr, 0, 6.2832); ctx.stroke();
          }
        }
      }
      ctx.restore();
    }

    // ---------- hang ----------
    audio() {
      if (this.ac) { this.ac.resume(); return; }
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      const ac = this.ac = new AC();
      this.master = ac.createGain(); this.master.gain.value = this.P().hang; this.master.connect(ac.destination);
      this.bus = ac.createGain(); this.bus.connect(this.master);
      const len = ac.sampleRate * 4, ir = ac.createBuffer(2, len, ac.sampleRate);
      for (let c = 0; c < 2; c++) { const a = ir.getChannelData(c); for (let i = 0; i < len; i++) a[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
      const conv = ac.createConvolver(); conv.buffer = ir; const wet = ac.createGain(); wet.gain.value = 0.3;
      this.bus.connect(conv); conv.connect(wet); wet.connect(this.master);
      this.next = (performance.now() - this.t0) / 1000 + 1;
      this.syncDrone();
    }
    strike(i, vel = 0.8, mely = 0) {
      if (!this.ac) return; const ac = this.ac, now = ac.currentTime + 0.02;
      const f0 = BOWLS[i] * (1 + (Math.random() - 0.5) * 0.008);
      RATIOS.forEach((r, j) => {
        if (mely && j) return;
        const fp = f0 * r, beat = (0.6 + Math.random() * 1.4) * (j ? 1.6 : 1), T = DECAY[j];
        const g = ac.createGain(); g.connect(this.bus);
        g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(AMPS[j] * vel * (mely ? 0.12 : 0.09), now + 0.01);
        g.gain.setTargetAtTime(0, now + 0.01, T / 6.9);
        for (const df of [-beat / 2, beat / 2]) {
          const o = ac.createOscillator(); o.frequency.value = fp + df; o.connect(g); o.start(now); o.stop(now + T + 1);
        }
      });
      // ütés: rövid, tompa koppanás
      const nb = ac.createBuffer(1, ac.sampleRate * 0.06, ac.sampleRate), nd = nb.getChannelData(0);
      for (let k = 0; k < nd.length; k++) nd[k] = (Math.random() * 2 - 1) * (1 - k / nd.length);
      const src = ac.createBufferSource(); src.buffer = nb;
      const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f0 * 4; bp.Q.value = 2;
      const ng = ac.createGain(); ng.gain.value = 0.05 * vel; src.connect(bp); bp.connect(ng); ng.connect(this.bus); src.start(now);
      this.glow = Math.max(this.glow, vel);
    }
    syncDrone() {
      if (!this.ac) return; const ac = this.ac, on = this.P().zugas, now = ac.currentTime;
      if (on && !this.dr) {
        const g = ac.createGain(); g.gain.value = 0; g.connect(this.bus);
        const oscs = [[73.42, 0.5], [73.72, 0.4], [110.1, 0.22], [146.8, 0.08]].map(([f, a]) => {
          const o = ac.createOscillator(), og = ac.createGain(); o.frequency.value = f; og.gain.value = a; o.connect(og); og.connect(g); o.start(); return o;
        });
        const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 0.012; lfo.connect(lg); lg.connect(g.gain); lfo.start();
        g.gain.setTargetAtTime(0.04, now, 1.5);
        this.dr = { g, oscs: [...oscs, lfo] };
      } else if (!on && this.dr) {
        const dr = this.dr; this.dr = null; dr.g.gain.setTargetAtTime(0, now, 0.8);
        dr.oscs.forEach(o => o.stop(now + 5));
      }
    }
  }
  window.Meditacio = Meditacio;
})();
