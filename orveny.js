(function () {
  const COL = { piros: '#e8202a', narancs: '#ff7a00', sárga: '#ffd400', zöld: '#1fa84a', kék: '#1f5fe0', lila: '#8a2be2', fehér: '#f5efe4', fekete: '#0f0f0f' };
  const PAL = ['#6b69f2', '#3ea805', '#dc0efb', '#ffb300', '#00c2c7', '#ff4d6d'];
  const TARGYAK = ['X-02', 'X-03', 'X-04', 'X-06', 'X-07', 'X-10'];
  const SZINEK = ['háttérrel azonos, késleltetve', 'háttérrel azonos, késleltetve', 'sárga', 'fehér', 'piros', 'kék', 'zöld', 'lila', 'narancs'];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const rnd = (a, b) => a + Math.random() * (b - a);

  class Orveny {
    constructor(canvas, host) {
      this.cv = canvas; this.host = host;
      this.grays = {}; this.t = 0; this.last = performance.now(); this.op = 0;
      TARGYAK.forEach(n => { const im = new Image(); im.onload = () => { this.grays[n] = this.prep(im); }; im.src = 'mintak/' + n + '.png?v=14'; });
      this.th = 0; this.th2 = 0; this.lt = 0;
      this.bg = this.newWave(0); this.ob = this.newWave(3); this.ob.el = 2;
      this.seg = 'orv'; this.segLeft = 35; this.pairLeft = 0; this.pairN = 0; this.mirAlt = false; this.bgToggle = false;
      const tick = now => { try { this.frame(now); } catch (e) { console.error(e); } this.raf = requestAnimationFrame(tick); };
      this.raf = requestAnimationFrame(tick);
    }
    destroy() { cancelAnimationFrame(this.raf); }
    prep(im) {
      const S = 1024, c = document.createElement('canvas'); c.width = c.height = S;
      const x = c.getContext('2d'); x.drawImage(im, 0, 0, S, S);
      const d = x.getImageData(0, 0, S, S), p = d.data, L = [];
      for (let i = 0; i < p.length; i += 4) if (p[i + 3] > 200) L.push(p[i] * .3 + p[i + 1] * .59 + p[i + 2] * .11);
      L.sort((a, b) => a - b); const hi = L[Math.floor(L.length * .97)] || 255;
      for (let i = 0; i < p.length; i += 4) { const v = Math.round(255 * Math.min(1, Math.pow((p[i] * .3 + p[i + 1] * .59 + p[i + 2] * .11) / hi, 0.75))); p[i] = p[i + 1] = p[i + 2] = v; }
      x.putImageData(d, 0, 0); return c;
    }
    newWave(i, prev) {
      const from = prev ? prev.to : PAL[i % PAL.length];
      let to; do { to = pick(PAL); } while (to === from);
      return { from, to, el: 0, kind: prev ? (prev.kind === 'kifele' ? 'befele' : 'kifele') : 'kifele' };
    }
    paint(x, w, cx, cy, R, k, soft) {
      const A = w.from, B = w.to, s = soft / 2, a = Math.max(0, Math.min(1, k - s)), b = Math.max(0, Math.min(1, k + s));
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, R);
      if (w.kind === 'kifele') { g.addColorStop(0, B); g.addColorStop(a, B); g.addColorStop(b, A); g.addColorStop(1, A); }
      else { g.addColorStop(0, A); g.addColorStop(1 - b, A); g.addColorStop(1 - a, B); g.addColorStop(1, B); }
      x.fillStyle = g; x.fillRect(cx - R, cy - R, R * 2, R * 2);
    }
    newPair(P) {
      const t1 = P['tárgy1'] ?? 'véletlen', t2 = P['tárgy2'] ?? 'véletlen';
      const n1 = t1 === 'véletlen' ? pick(TARGYAK) : t1;
      const n2 = t2 === 'véletlen' ? (Math.random() < 0.5 ? n1 : pick(TARGYAK)) : t2;
      const sz = P['örvénySzín'] ?? 'véletlen', hb = P['örvényHáttér'] ?? 'váltakozó';
      this.bgToggle = !this.bgToggle;
      this.cfg = {
        n1, n2, szin: sz === 'véletlen' ? pick(SZINEK) : sz,
        wave: hb === 'színhullám' || (hb === 'váltakozó' && this.bgToggle),
        s1: rnd(100, 118), s2: rnd(60, 115), off: rnd(15, 45) * Math.PI / 180, ph: Math.random() * Math.PI * 2
      };
    }
    snapshot() {
      const c = this.cv; if (!c.width) return;
      if (!this.snap || this.snap.width !== c.width || this.snap.height !== c.height) { this.snap = document.createElement('canvas'); this.snap.width = c.width; this.snap.height = c.height; }
      const s = this.snap.getContext('2d'); s.clearRect(0, 0, c.width, c.height); s.drawImage(c, 0, 0); this.snapA = 1;
    }
    frame(now) {
      const st = this.host(); const P = st.P || {};
      let dt = Math.min(0.1, (now - this.last) / 1000); this.last = now;
      if (st.paused) dt = 0;
      const pairSec = +(P['párosításMp'] ?? 10);
      if (!this.cfg) { this.newPair(P); this.pairLeft = pairSec; }
      this.pairLeft -= dt;
      if (st.mode === 'alt') {
        this.segLeft -= dt;
        if (this.segLeft <= 0) {
          if (this.seg === 'orv') { this.seg = 'other'; this.segLeft = 30; this.mirAlt = !this.mirAlt; st.setMir && st.setMir(this.mirAlt); }
          else { this.seg = 'orv'; this.segLeft = pairSec * (3 + Math.floor(Math.random() * 2)); }
        }
      } else { this.seg = 'orv'; this.segLeft = pairSec * 3; }
      const want = (st.mode === 'on' || (st.mode === 'alt' && this.seg === 'orv')) && !st.ad ? 1 : 0;
      this.op += (want - this.op) * Math.min(1, dt * 1.6 + (st.paused ? 0 : 0.002));
      if (want === 0 && this.op < 0.01) this.op = 0;
      if (want === 1 && this.op > 0.995) this.op = 1;
      if (this.cv._op !== this.op) { this.cv.style.opacity = this.op.toFixed(3); this.cv._op = this.op; }
      st.setSkip && st.setSkip(this.op >= 1);
      if (this.pairLeft <= 0) { this.pairLeft = pairSec; if (this.op > 0) this.snapshot(); this.newPair(P); }
      if (this.op <= 0 || (st.paused && this.drawnOnce)) return;
      this.render(dt);
    }
    render(dt) {
      const cv = this.cv, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr);
      if (!W || !H) return;
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      const c = this.cfg, waveSec = 3, soft = 0.3;
      for (const key of ['bg', 'ob']) { const w = this[key]; w.el += dt; if (w.el >= waveSec) { const nw = this.newWave(0, w); nw.el = w.el - waveSec; if (key === 'bg') this.bgPrev = w; this[key] = nw; } }
      const kOf = (w, el) => Math.min(1, (el ?? w.el) / waveSec) * (1 + soft) - soft / 2;
      const x = cv.getContext('2d'), cx = W / 2, cy = H / 2, RR = Math.hypot(cx, cy);
      x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
      if (c.wave) this.paint(x, this.bg, cx, cy, RR, kOf(this.bg), soft); else { x.fillStyle = COL.fekete; x.fillRect(0, 0, W, H); }
      const g1 = this.grays[c.n1], g2 = this.grays[c.n2];
      if (g1 && g2) {
        this.th += dt * Math.PI * 2 / 15; this.th2 -= dt * Math.PI * 2 / 10; this.lt += dt;
        let col;
        if (COL[c.szin]) col = { flat: COL[c.szin] };
        else if (c.wave) { const e = this.bg.el - 0.2; col = e >= 0 || !this.bgPrev ? { w: this.bg, k: kOf(this.bg, Math.max(0, e)) } : { w: this.bgPrev, k: kOf(this.bgPrev, waveSec + e) }; }
        else col = { w: this.ob, k: kOf(this.ob) };
        const br = ph => 1 - 0.6 * (0.5 - 0.5 * Math.cos(this.lt * Math.PI * 2 / 12 + ph));
        const M = Math.min(W, H);
        this.obj(x, 'oc', Math.round(M * c.s1 / 100 * br(c.ph)), this.th, col, g1, cx, cy, RR, soft);
        this.obj(x, 'oc2', Math.round(M * c.s2 / 100 * br(c.ph + Math.PI)), this.th2 + c.off, col, g2, cx, cy, RR, soft);
      }
      if (this.snapA > 0 && this.snap) {
        x.globalAlpha = this.snapA; x.drawImage(this.snap, 0, 0, W, H); x.globalAlpha = 1;
        this.snapA = Math.max(0, this.snapA - dt / 1.4);
      }
      this.drawnOnce = true;
    }
    obj(x, key, D, ang, col, gray, cx, cy, RR, soft) {
      if (D < 2) return;
      if (!this[key] || this[key].width !== D) { this[key] = document.createElement('canvas'); this[key].width = this[key].height = D; }
      const cvs = this[key], o = cvs.getContext('2d'), r = D / 2;
      o.globalCompositeOperation = 'source-over'; o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, D, D);
      if (col.flat) { o.fillStyle = col.flat; o.fillRect(0, 0, D, D); }
      else { o.save(); o.translate(r - cx, r - cy); this.paint(o, col.w, cx, cy, RR, col.k, soft); o.restore(); }
      o.save(); o.translate(r, r); o.rotate(ang);
      o.globalCompositeOperation = 'multiply'; o.drawImage(gray, -r, -r, D, D);
      o.globalCompositeOperation = 'destination-in'; o.drawImage(gray, -r, -r, D, D);
      o.restore(); o.globalCompositeOperation = 'source-over';
      x.save(); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = D * 0.03; x.shadowOffsetY = D * 0.012;
      x.drawImage(cvs, cx - r, cy - r); x.restore();
    }
  }
  Orveny.TARGYAK = TARGYAK;
  window.Orveny = Orveny;
})();
