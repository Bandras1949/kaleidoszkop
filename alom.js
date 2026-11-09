// ÁLOM élmény – elalvás előtti foszlányok, lélegző fény, szívverés-dob, mély zúgás; 5:30 után fekete csend. © Andras Banky
(function () {
  const TX = [
    'Holnap reggel nyolckor. Második emelet,\nbalra a folyosó végén.',
    'A boríték…\nVékony? Vastag?',
    'Majd a doktor úr megmondja.',
    'Mondja a TAJ-számát. Nulla-hét-három… négy-egy-öt…',
    'Mi lesz, ha…',
    'Idegesítő ez az ember. Túl hangosan lapoz az újsággal.\nNem is olvas, csak lapoz.',
    'Nagymama mindig azt mondta: „De jó is annak, akinek jó!”',
    '…hét… három… négy…',
    'Egyszer nyáron a padláson feküdtünk, és hallgattuk az esőt a cserepeken.',
    'Koszos az ablak. Alig látszik a hársfa. Pedig szép lenne.',
    'Holnap. Az még messze van.',
    '…négy…',
    'Valaki betakart.',
    'csend'
  ];
  const cl = x => Math.min(1, Math.max(0, x)), sm = x => { x = cl(x); return x * x * (3 - 2 * x); };
  const glue = t => t.replace(/(^|[ \n])(a|az|s|e|és|egy) /g, '$1$2\u00A0');

  class Alom {
    constructor(cv, tx) {
      this.TX = tx || TX; this.cv = cv; this.want = true; this.T = 0; this.DUR = 330; this.BEAT = 4.2; this.lay = {}; this.sched();
      if (document.fonts) { const clear = () => { this.lay = {}; }; document.fonts.load('italic 40px "Cormorant Garamond"', 'ÁÉÍÓÖŐÚÜŰáéíóöőúüű…„”“ Holnap Tomorrow').then(clear, clear); document.fonts.addEventListener('loadingdone', clear); this.offFonts = () => document.fonts.removeEventListener('loadingdone', clear); }
    }
    sched() {
      const N = this.TX.length; let s = 4; this.FR = [];
      this.TX.forEach((t0, i) => {
        const txt = glue(t0), nW = txt.split(/[ \n]/).length, k = i / (N - 1), slow = 1 + 0.9 * k, gap = 0.55 * slow, hold = 3 + nW * 0.5 * slow, out = s + nW * gap + hold;
        const smoke = i === N - 1 ? 0 : sm((i - N / 2 + 1) / 3), dis = 2 + 2.5 * smoke;
        const dg = ({ 3: [0, 7, 3, 4, 1, 5], 7: [7, 3, 4], 11: [4] })[i];
        let o2 = out, dS = 0; if (dg) { dS = s + nW * gap + 1.5; o2 = Math.max(out, dS + dg.length * 1.2 + 0.8); }
        this.FR.push({ txt, s, nW, gap, out: o2, smoke, dis, dg, dS, last: i === N - 1 });
        s = o2 + 2.6 + dis + 5.6 + 6 * k;
      });
      const L = this.FR[N - 1], f = (330 - 26) / L.out; this.FR.forEach(F => { F.s *= f; F.out *= f; F.gap *= f; if (F.dg) { F.dS *= f; F.step = 1.2 * f; } });
    this.FR.forEach((F, i) => { if (i === 10) { F.pz = 4; F.out += 4; } else if (i > 10) { F.s += 4; F.out += 4; if (F.dg) F.dS += 4; } });   // „Holnap.” után 4 mp szünet
    }
    // start/stop többször hívható; stop szünetel, újraindításkor onnan folytatja (a végén elölről)
    start() {
      if (this.run) return; this.run = true;
      if (this.T >= this.DUR) { this.T = 0; this.doneBeat = -1; }
      this.pre = this.T === 0 ? 2 : 0; this.anchor = null; this.last = performance.now();
      if (this.want) this.audio();
      const loop = now => { this.raf = requestAnimationFrame(loop); const dt = Math.min(1, (now - this.last) / 1000); this.last = now;
        if (this.pre > 0) { if (!this.want || this.on()) this.pre -= dt; if (this.pre <= 0) this.anchor = null; } else this.T = Math.min(this.DUR, this.T + dt);
        this.draw(); this.audioTick(); };
      this.raf = requestAnimationFrame(loop);
    }
    stop() { if (!this.run) return; this.run = false; cancelAnimationFrame(this.raf); this.mute(); }
    mute() { if (this.ac) { (this.pend || []).forEach(o => { try { o.stop(); } catch (x) {} }); this.pend = []; this.anchor = null; this.ac.suspend(); } }
    setWant(on) { if (on === this.want) return; this.want = on; if (!this.run) return; if (on) this.audio(); else this.mute(); }
    locked() { return !!(this.run && this.want && this.ac && this.ac.state !== 'running'); }
    on() { return this.ac && this.ac.state === 'running'; }
    sync() {}
    destroy() { this.stop(); if (this.offFonts) this.offFonts(); if (this.ac) this.ac.close(); }
    audio() {
      if (!this.ac) {
        const ac = this.ac = new (window.AudioContext || window.webkitAudioContext)();
        const m = this.master = ac.createGain(); m.gain.value = 0; const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520; lp.Q.value = 0.3;
        this.sw = ac.createGain(); this.sw.gain.value = 0.7; this.sw.connect(lp); lp.connect(m); m.connect(ac.destination);
        for (const [f, a] of [[73.42, 0.32], [73.47, 0.22], [110, 0.2], [146.83, 0.12], [184.99, 0.05], [220, 0.05]]) { const o = ac.createOscillator(), og = ac.createGain(); o.frequency.value = f; og.gain.value = a; o.connect(og); og.connect(this.sw); o.start(); }
      }
      if (this.run && this.want) { this.anchor = null; this.ac.resume(); }
    }
    audioTick() {
      if (!this.ac || !this.want || !this.on()) return;
      const T = this.T, now = this.ac.currentTime;
      if (this.pre > 0) { this.master.gain.setTargetAtTime(0.22 * cl(1 - this.pre / 2), now, 0.3); return; }   // előzene: a zúgás a kép előtt indul
      this.master.gain.setTargetAtTime(0.22 * (1 - 0.5 * T / this.DUR) * (1 - cl((T - (this.DUR - 45)) / 42)), now, 0.4);
      const P = this.BEAT, ac = this.ac;
      if (!this.anchor) { (this.pend || []).forEach(o => { try { o.stop(); } catch (x) {} }); this.pend = []; this.anchor = { a: now, t: T }; this.nextBeat = Math.max(Math.ceil((T - 0.05) / P), (this.doneBeat ?? -1) + 1); }
      while (this.nextBeat * P <= Math.min(T + 0.8, this.DUR)) {
        const tb = this.nextBeat * P, t0 = Math.max(now + 0.005, this.anchor.a + (tb - this.anchor.t)), kv = 0.42 * (1 - 0.6 * cl((tb - (this.DUR - 45)) / 42));
        const o = ac.createOscillator(), kg = ac.createGain(), lp = ac.createBiquadFilter();   // basszus nagydob
        o.type = 'sine'; o.frequency.setValueAtTime(58, t0); o.frequency.exponentialRampToValueAtTime(46, t0 + 0.5);
        lp.type = 'lowpass'; lp.frequency.value = 220; lp.Q.value = 0.2;
        kg.gain.setValueAtTime(0.0001, t0); kg.gain.exponentialRampToValueAtTime(kv * 1.2, t0 + 0.02); kg.gain.exponentialRampToValueAtTime(0.0003, t0 + 1.3);
        const o2 = ac.createOscillator(), g2 = ac.createGain(); o2.type = 'sine'; o2.frequency.setValueAtTime(116, t0); o2.frequency.exponentialRampToValueAtTime(92, t0 + 0.5);
        g2.gain.setValueAtTime(0.0001, t0); g2.gain.exponentialRampToValueAtTime(0.35, t0 + 0.02); g2.gain.exponentialRampToValueAtTime(0.0002, t0 + 0.6);
        o.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(kg); kg.connect(ac.destination); o.start(t0); o.stop(t0 + 1.4); o2.start(t0); o2.stop(t0 + 0.7);
        this.pend.push(o, o2); if (this.pend.length > 8) this.pend.splice(0, 2); this.doneBeat = this.nextBeat; this.nextBeat++;
      }
      this.sw.gain.setTargetAtTime(0.55 + 0.45 * this.breath(T), now, 0.3);
    }
    heart(T) { const p = (T / this.BEAT) % 1; return p < 0.04 ? p / 0.04 : Math.exp(-(p - 0.04) / 0.16); }
    breath(T) { const P0 = 8, P1 = 12, k = (P1 - P0) / this.DUR, ph = Math.log((P0 + k * T) / P0) / k; return 0.5 - 0.5 * Math.cos(ph * Math.PI * 2); }
    seg7(g, n, x, y, H, a) {
      const W = H * 0.56, t = H * 0.12, g0 = t * 0.18, L = -W / 2, Rr = W / 2, Tp = -H / 2, B = H / 2;
      const hs = (x1, x2, yy) => [[x1, yy], [x1 + t / 2, yy - t / 2], [x2 - t / 2, yy - t / 2], [x2, yy], [x2 - t / 2, yy + t / 2], [x1 + t / 2, yy + t / 2]];
      const vs = (xx, y1, y2) => [[xx, y1], [xx + t / 2, y1 + t / 2], [xx + t / 2, y2 - t / 2], [xx, y2], [xx - t / 2, y2 - t / 2], [xx - t / 2, y1 + t / 2]];
      const S = { a: hs(L + g0, Rr - g0, Tp), g: hs(L + g0, Rr - g0, 0), d: hs(L + g0, Rr - g0, B), f: vs(L, Tp + g0, -g0), b: vs(Rr, Tp + g0, -g0), e: vs(L, g0, B - g0), c: vs(Rr, g0, B - g0) };
      const on = ['abcdef', 'bc', 'abged', 'abgcd', 'fgbc', 'afgcd', 'afgedc', 'abc', 'abcdefg', 'abcdfg'][n];
      g.save(); g.translate(x, y); g.transform(1, 0, -0.08, 1, 0, 0);
      for (const k of 'abcdefg') { const lit = on.includes(k); g.beginPath(); S[k].forEach(([px, py], j) => j ? g.lineTo(px, py) : g.moveTo(px, py)); g.closePath();
        g.shadowBlur = lit ? H * 0.14 : 0; g.shadowColor = `rgba(255,255,255,${0.7 * a})`; g.fillStyle = lit ? `rgba(246,243,236,${a})` : `rgba(246,243,236,${0.07 * a})`; g.fill(); }
      g.restore();
    }
    draw() {
      const cv = this.cv; if (!cv) return;
      const d = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return;
      if (cv.width !== Math.round(w * d) || cv.height !== Math.round(h * d)) { cv.width = Math.round(w * d); cv.height = Math.round(h * d); this.lay = {}; }
      const g = cv.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0);
      const T = this.T, D = this.DUR, N = this.FR.length;
      const pb = sm(T / D * 1.05), mix = (A, B, t) => A.map((v, j) => Math.round(v + (B[j] - v) * t));
      const BG = mix([112, 108, 103], [12, 10, 9], pb);
      g.fillStyle = `rgb(${BG})`; g.fillRect(0, 0, w, h);
      if (this.pre > 0) return;
      const C1 = mix([226, 216, 200], [214, 170, 112], pb), C2 = mix([180, 172, 160], [168, 120, 82], pb);
      const b = this.breath(T), u = Math.min(w, h), life = sm(T / 6) * (1 - sm((T - (D - 48)) / 46)) * (1 - 0.45 * T / D);
      const hb = this.heart(T), cx = w / 2, cy = h * 0.44, R = u * (0.4 + 0.06 * b + 0.08 * hb) * (1 - 0.2 * T / D);
      if (life > 0.002) {
        const gr = g.createRadialGradient(cx, cy, 0, cx, cy, R);
        gr.addColorStop(0, `rgba(${C1},${(0.3 + 0.08 * b + 0.22 * hb) * life})`); gr.addColorStop(0.35, `rgba(${C2},${(0.16 + 0.06 * b) * life})`); gr.addColorStop(1, `rgba(${BG},0)`);
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
      }
      const fs0 = Math.max(20, Math.min(46, u * 0.045)), maxW = Math.min(w * 0.9, 1800);
      if (!this.lay.all) this.layoutAll(g, fs0, maxW);
      g.textBaseline = 'middle';
      this.FR.forEach((F, i) => {
        const L = this.lay[i], sinkD = 26, end = F.last ? F.out + sinkD : F.out + 2.6 + F.dis, sk = F.smoke;
        if (T < F.s || T > end) return;
        const fade = 0.9 * (1 - 0.4 * i / (N - 1));
        const yTop = h * (0.05 + 0.81 * i / (N - 1)) + h * 0.012 * sm((T - F.s) / (end - F.s));
        const sink = F.last ? h * 0.18 * sm((T - F.out) / sinkD) : 0;
        let cf = 0;
        for (const c of L.chars) {
          const a = sm((T - F.s - c.w * F.gap - (F.pz && c.w > 0 ? F.pz : 0)) / 1.8), lastW = c.w === F.nW - 1;
          const o = F.last ? 1 - sm((T - F.out) / (sinkD - 2)) : 1 - sm((T - (F.out + c.r * 1.5 + (lastW ? 1 : 0))) / F.dis);
          const al = a * o * fade; if (al <= 0.003) continue;
          const q = F.last ? 0 : 1 - o, bl = (1 - a) * 5 + q * (4 + 10 * sk);
          if (c.fs !== cf) { cf = c.fs; g.font = `italic ${cf}px "Cormorant Garamond", Georgia, serif`; }
          const nc = bl > 0.6 ? 3 : 1, br = bl * 0.6;
          g.fillStyle = `rgba(237,227,208,${al / nc})`;
          const sx = sk * q * c.fs * (0.25 + 0.5 * c.r) * Math.sin(c.r * 6.28 + q * 2.2), sy = q * (6 + sk * c.fs * (0.6 + 0.9 * c.r));
          const X = cx - L.wid[c.l] / 2 + c.x + sx, Y = yTop + L.top + L.ly[c.l] - sy + (1 - a) * 4 + sink;
          if (nc === 1) g.fillText(c.ch, X, Y); else { g.fillText(c.ch, X - br, Y); g.fillText(c.ch, X + br, Y - br * 0.5); g.fillText(c.ch, X, Y + br * 0.7); }
        }
        if (F.dg) { const x = (T - F.dS) / F.step, k = Math.floor(x);
          if (k >= 0 && k < F.dg.length) { const p = x - k, a = sm(p / 0.1) * (1 - sm((p - 0.6) / 0.32)), Hd = Math.max(L.last * 1.5, u * 0.07), nl = L.ly.length - 1;
            if (a > 0.003) this.seg7(g, F.dg[k], cx, yTop + L.top + L.ly[nl] + L.last * 0.9 + Hd * 0.6, Hd, a * fade); } }
      });
    }
    layoutAll(g, fs0, maxW) {
      const A = fs0 * 3.6, Z = fs0 * 0.7; let r = 0.9;
      for (let it = 0; it < 4; it++) { let cur = A, n = 0; this.FR.forEach((F, i) => { const L = this.layout(g, F.txt, cur, maxW, i, r); this.lay[i] = L; n += L.lines; cur = L.last * r; }); r = Math.pow(Z / A, 1 / Math.max(1, n - 1)); }
      this.lay.all = true;
    }
    layout(g, txt, fs, maxW, seed, rr) {
      g.font = `italic ${fs}px "Cormorant Garamond", Georgia, serif`;
      const lines = [[]], sp = g.measureText(' ').width; let cur = 0, wi = 0;
      txt.split('\n').forEach((para, pi) => { if (pi) { lines.push([]); cur = 0; }
        para.split(' ').forEach(wd => { const ww = g.measureText(wd).width; if (cur && cur + sp + ww > maxW) { lines.push([]); cur = 0; } lines[lines.length - 1].push([wd, wi++]); cur += (cur ? sp : 0) + ww; }); });
      let r = seed * 9301 + 49297; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
      const chars = [], wid = [], ly = []; let yy = 0;
      lines.forEach((ln, li) => { const full = ln.map(([wd]) => wd).join(' '), lfs = fs * Math.pow(rr, li); let p = 0;
        g.font = `italic ${lfs}px "Cormorant Garamond", Georgia, serif`; if (li) yy += (fs * Math.pow(rr, li - 1) + lfs) * 0.7; ly[li] = yy;
        ln.forEach(([wd, wi2], k) => { if (k) p++; [...wd].forEach(ch => { chars.push({ ch, x: g.measureText(full.slice(0, p)).width, l: li, w: wi2, r: rnd(), fs: lfs }); p += ch.length; }); });
        wid[li] = g.measureText(full).width; });
      return { chars, wid, ly, top: fs * 0.55, lines: lines.length, last: fs * Math.pow(rr, lines.length - 1) };
    }
  }
  window.Alom = Alom;
})();
