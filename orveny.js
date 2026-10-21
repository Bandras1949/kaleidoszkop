(function () {
  const COL = { piros: '#e8202a', narancs: '#ff7a00', sárga: '#ffd400', zöld: '#1fa84a', kék: '#1f5fe0', lila: '#8a2be2', fehér: '#f5efe4', fekete: '#0f0f0f' };
  const PAL = ['#6b69f2', '#3ea805', '#dc0efb', '#ffb300', '#00c2c7', '#ff4d6d'];
  const TARGYAK = ['X-02', 'X-03', 'X-04', 'X-06', 'X-07', 'X-10', 'X-11', 'X-12', 'X-13', 'X-14-a', 'X-14-b', 'X-15', 'X-16', 'X-17'];
  const SZINEK = ['háttérrel azonos, késleltetve', 'háttérrel azonos, késleltetve', 'sárga', 'fehér', 'piros', 'kék', 'zöld', 'lila', 'narancs'];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const rnd = (a, b) => a + Math.random() * (b - a);

  const SEQ = ['orv', 'spir', 'mir', 'hold', 'hole', 'figure'], OV = ['orv', 'spir', 'hold'];
  const FORMS = ['pálcika', 'korong', 'négyzet', 'háromszög', 'csillag', 'H-betű'];
  const SP1 = ['#3C78E6', '#C0392B', '#1B6B3A', '#F5E62A', '#FF2BD6', '#39FF14', '#00F0FF', '#FF7A00'];
  const SP2 = ['#F5F5FA', '#F5F5FA', '#8E5BD6', '#8EE07A', '#E0C25A', '#00F0FF'];
  const HCYC = ['#00F0FF', '#F5E62A', '#FF2BD6', '#39FF14', '#FF7A00', '#F5F5F0'];
  const hex = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
  const mix = (A, B, u) => A.map((v, q) => v + (B[q] - v) * u);
  const ez = (o, k, v, dt) => { o[k] = o[k] == null ? v : o[k] + (v - o[k]) * (1 - Math.pow(0.97, dt * 60)); return o[k]; };
  function cycle(st, L, dt, per, fade, i0) {
    st.cT = (st.cT || 0) + dt; const n = Math.floor(st.cT / per), into = st.cT - n * per;
    let u = into > per - fade ? (into - (per - fade)) / fade : 0; u = u * u * (3 - 2 * u);
    return mix(hex(L[(i0 + n) % L.length]), hex(L[(i0 + n + 1) % L.length]), u);
  }
  class Spir {
    constructor() { this.t = 0; this.e = {}; this.rnd = null; this.form0 = pick(FORMS); }
    shuffle() { this.rnd = { karok: Math.floor(rnd(2, 9)), csav: rnd(-0.8, 0.8), dir: Math.random() < 0.5 ? -1 : 1, k: rnd(0.7, 1.3), forma: pick(FORMS), c2: pick(SP2) }; }
    draw(x, W, H, dt, F, P) {
      const r = this.rnd || {}, sp = ez(this.e, 'sp', (r.dir ?? 1) * Math.min(9, (F ? 9 : 5) * (r.k ?? 1)), dt);
      this.t += sp * dt; const t = this.t, ARMS = r.karok ?? 5, TW = ez(this.e, 'tw', r.csav ?? 0.35, dt);
      const pf = P['spirálForma'] ?? 'véletlen', FORM = pf !== 'véletlen' ? pf : (r.forma ?? this.form0);
      const base = cycle(this, SP1, dt, F ? 5 : 8, 2, 0), wh = hex(r.c2 ?? '#F5F5FA');
      const M = Math.min(W, H), S = M / 600, cx = W / 2, cy = H / 2, RR = Math.hypot(cx, cy) / S;
      const GAP = 285 / 17, RINGS = Math.ceil(RR / GAP) + 1, DGAP = 24, d = 8 * S, DW = 4 * S;
      x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
      const NB = 12, paths = Array.from({ length: NB }, () => new Path2D()), stroke = FORM === 'pálcika' || FORM === 'H-betű';
      for (let i = 1; i <= RINGS; i++) {
        const rr = i * GAP + 5, n = Math.max(3, Math.floor(2 * Math.PI * rr / DGAP));
        for (let j = 0; j < n; j++) {
          const th = 2 * Math.PI * j / n, s = 0.5 + 0.5 * Math.tanh(3 * Math.cos(ARMS * th - i * TW - t));
          const rel = Math.PI / 2 * s, a = th + Math.PI / 2 + rel, k = Math.sin(rel);
          const X = cx + S * rr * Math.cos(th), Y = cy + S * rr * Math.sin(th);
          if (X < -20 || Y < -20 || X > W + 20 || Y > H + 20) continue;
          const p = paths[Math.min(NB - 1, Math.round(k * (NB - 1)))], ca = Math.cos(a), sa = Math.sin(a);
          const L = (u, v) => [X + u * ca - v * sa, Y + u * sa + v * ca];
          if (FORM === 'korong') { p.moveTo(X + d * 0.6, Y); p.arc(X, Y, d * 0.6, 0, 2 * Math.PI); }
          else if (FORM === 'H-betű') { const e = d * 0.6; for (const [a1, b1, a2, b2] of [[-e, -e, e, -e], [-e, e, e, e], [0, -e, 0, e]]) { p.moveTo(...L(a1, b1)); p.lineTo(...L(a2, b2)); } }
          else if (FORM === 'pálcika') { p.moveTo(...L(-d, 0)); p.lineTo(...L(d, 0)); }
          else {
            const pts = FORM === 'négyzet' ? [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [u * d * 0.55, v * d * 0.55])
              : FORM === 'háromszög' ? [0, 1, 2].map(q => [d * 0.75 * Math.cos(q * 2.0944), d * 0.75 * Math.sin(q * 2.0944)])
              : Array.from({ length: 10 }, (_, q) => { const rr2 = q % 2 ? d * 0.32 : d * 0.8; return [rr2 * Math.cos(q * Math.PI / 5), rr2 * Math.sin(q * Math.PI / 5)]; });
            pts.forEach(([u, v], q) => p[q ? 'lineTo' : 'moveTo'](...L(u, v))); p.closePath();
          }
        }
      }
      x.lineCap = 'round'; x.lineWidth = FORM === 'H-betű' ? DW * 0.6 : DW;
      paths.forEach((p, b) => { const c = 'rgb(' + mix(base, wh, b / (NB - 1)).map(Math.round) + ')'; if (stroke) { x.strokeStyle = c; x.stroke(p); } else { x.fillStyle = c; x.fill(p); } });
    }
  }
  class Hold {
    constructor() { this.t = 0; this.e = {}; this.rnd = null; this.flip = false; this.v0 = Math.random() < 0.5 ? 'HOLDAK' : 'KAROK'; }
    shuffle() { this.rnd = { karok: Math.floor(rnd(1, 7)), csav: rnd(-3, 3), wv: rnd(0.5, 3), spn: Math.floor(rnd(-4, 5)), dir: Math.random() < 0.5 ? -1 : 1, k: rnd(0.7, 1.3) }; if (Math.random() < 0.3) this.flip = !this.flip; }
    build(W, H) {
      const key = W + 'x' + H; if (this.key === key) return; this.key = key;
      const M = Math.min(W, H), S = M / 600, cx = W / 2, cy = H / 2, RR = Math.hypot(cx, cy), SP = 18 * S, hr = 12 * S, gold = Math.PI * (3 - Math.sqrt(5));
      this.holes = []; for (let n = 1; SP * Math.sqrt(n) < RR + 2 * hr; n++) { const r = SP * Math.sqrt(n), a = n * gold; this.holes.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), r }); }
      this.R = RR; this.hr = hr; this.S = S; this.M = M;
      const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
      const pl = mk(), p = pl.getContext('2d'); p.fillStyle = '#6E6E6A'; p.fillRect(0, 0, W, H); p.globalCompositeOperation = 'destination-out';
      const all = new Path2D(); for (const h of this.holes) { all.moveTo(h.x + hr, h.y); all.arc(h.x, h.y, hr, 0, 2 * Math.PI); } p.fill(all);
      const s0c = mk(), s0 = s0c.getContext('2d'); s0.fillStyle = 'rgba(0,0,0,.55)'; s0.fill(all); s0.globalCompositeOperation = 'destination-out'; s0.translate(3 * S, 4 * S); s0.fill(all);
      const sh = mk(), s = sh.getContext('2d'); s.filter = 'blur(' + (1.5 * S) + 'px)'; s.drawImage(s0c, 0, 0);
      this.plate = pl; this.shade = sh;
    }
    draw(x, W, H, dt, F, P) {
      this.build(W, H);
      const r = this.rnd || {}, e = this.e, pv = String(P['holdVáltozat'] ?? 'holdak').toUpperCase(), b0 = pv === 'VEGYES' || pv === 'VÉLETLEN' ? this.v0 : pv;
      const V = this.flip ? (b0 === 'HOLDAK' ? 'KAROK' : 'HOLDAK') : b0;
      const sp = ez(e, 'sp', (r.dir ?? 1) * Math.min(6, (F ? 4.5 : 2) * (r.k ?? 1)), dt), tw = ez(e, 'tw', r.csav ?? 1.2, dt);
      const wv = ez(e, 'wv', r.wv ?? 1, dt), spn = ez(e, 'spn', r.spn ?? 0, dt), arms = Math.max(1, r.karok ?? 3);
      this.t += sp * dt; const t = this.t, cx = W / 2, cy = H / 2, R = this.R, hr = this.hr;
      x.fillStyle = 'rgb(' + cycle(this, HCYC, dt, F ? 5 : 8, 2, 0).map(Math.round) + ')'; x.fillRect(0, 0, W, H);
      x.fillStyle = '#0A0A0A';
      if (V === 'KAROK') {
        const Rm = this.M / 2, w = Math.min(0.95, Math.max(0.05, 0.5 + 0.35 * Math.sin(t * 0.7))), span = 2 * Math.PI / arms * w, ST = 60;
        for (let i = 0; i < arms; i++) {
          const a0 = 2 * Math.PI * i / arms + t * 0.5; x.beginPath();
          for (let s = 0; s <= ST; s++) { const rr = R * 1.05 * s / ST, a = a0 + tw * rr / Rm; x.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); }
          for (let s = ST; s >= 0; s--) { const rr = R * 1.05 * s / ST, a = a0 + span + tw * rr / Rm; x.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); }
          x.closePath(); x.fill();
        }
        x.beginPath(); x.arc(cx, cy, Rm * 0.4 * (0.5 + 0.5 * Math.sin(t * 0.45)), 0, 2 * Math.PI); x.fill();
      } else {
        const p = new Path2D();
        for (const h of this.holes) {
          const ang = Math.atan2(h.y - cy, h.x - cx), ph = 2 * Math.PI * wv * h.r / R - t + spn * ang;
          const c = -Math.cos(ph) * hr * 1.15, dir = ang + 0.6 * Math.sin(t * 0.3 + h.r / R * 3);
          if (c <= -hr) continue;
          if (c >= hr) { p.moveTo(h.x + hr, h.y); p.arc(h.x, h.y, hr, 0, 2 * Math.PI); continue; }
          const phi = Math.acos(c / hr); p.moveTo(h.x + hr * Math.cos(dir + phi), h.y + hr * Math.sin(dir + phi)); p.arc(h.x, h.y, hr, dir + phi, dir + 2 * Math.PI - phi); p.closePath();
        }
        x.fill(p);
      }
      x.drawImage(this.shade, 0, 0); x.drawImage(this.plate, 0, 0);
    }
  }
  class Orveny {
    constructor(canvas, host) {
      this.cv = canvas; this.host = host;
      this.grays = {}; this.t = 0; this.last = performance.now(); this.op = 0;
      TARGYAK.forEach(n => { const im = new Image(); im.onload = () => { this.grays[n] = this.prep(im); }; im.src = 'mintak/' + n + '.png?v=24'; });
      this.th = 0; this.th2 = 0; this.lt = 0;
      this.bg = this.newWave(0); this.ob = this.newWave(3); this.ob.el = 2;
      this.pairLeft = 0; this.bgToggle = false; this.ai = null; this.kind = null; this.spir = new Spir(); this.hold = new Hold();
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
      const z1 = P['tárgy1Szín'] ?? 'véletlen', z2 = P['tárgy2Szín'] ?? 'másikkal azonos', hb = P['örvényHáttér'] ?? 'váltakozó';
      this.bgToggle = !this.bgToggle;
      this.cfg = {
        n1, n2, ...(() => { const one = z => z === 'véletlen' || z === 'másikkal azonos' ? pick(SZINEK) : z; let a = one(z1), b = one(z2); if (z2 === 'másikkal azonos') b = a; else if (z1 === 'másikkal azonos') a = b; return { szin1: a, szin2: b }; })(),
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
      const st = this.host(); const P = st.P || {}; this.P = P;
      let dt = Math.min(0.1, (now - this.last) / 1000); this.last = now;
      if (st.paused) dt = 0;
      this.fast = P['tempó'] === 'pörgős';
      const pairSec = this.fast ? 3.5 : +(P['párosításMp'] ?? 10);
      if (!this.cfg) { this.newPair(P); this.pairLeft = pairSec; }
      this.pairLeft -= dt;
      let kind = null;
      if (st.mode === 'alt') {
        if (this.ai == null) { this.ai = 0; this.segLeft = this.segDur(SEQ[0], pairSec); }
        this.segLeft -= dt;
        if (this.segLeft <= 0 || this.jump) { this.jump = false; this.ai = (this.ai + 1) % SEQ.length; const s = SEQ[this.ai]; this.segLeft = this.segDur(s, pairSec); if (!OV.includes(s)) st.setSeg && st.setSeg(s); }
        const s = SEQ[this.ai]; kind = OV.includes(s) ? s : null;
      } else { this.ai = null; kind = OV.includes(st.mode) ? st.mode : null; }
      if (kind && this.kind && kind !== this.kind && this.op > 0.02) this.snapshot();
      if (kind) this.kind = kind;
      const want = kind && !st.ad ? 1 : 0;
      this.op += (want - this.op) * Math.min(1, dt * 1.6 + (st.paused ? 0 : 0.002));
      if (want === 0 && this.op < 0.01) this.op = 0;
      if (want === 1 && this.op > 0.995) this.op = 1;
      if (this.cv._op !== this.op) { this.cv.style.opacity = this.op.toFixed(3); this.cv._op = this.op; }
      st.setSkip && st.setSkip(this.op >= 1);
      if (this.pairLeft <= 0) { this.pairLeft = pairSec; if (this.kind === 'orv' && this.op > 0 && !this.fast) this.snapshot(); this.newPair(P); }
      if (this.op <= 0 || (st.paused && this.drawnOnce)) return;
      this.render(dt);
    }
    segDur(s, pairSec) { const F = this.fast; return s === 'orv' ? pairSec * (3 + Math.floor(Math.random() * 2)) : s === 'spir' || s === 'hold' ? (F ? 15 : 30) : (F ? 10 : 30); }
    next() {
      const st = this.host();
      if (st.mode === 'alt') { this.jump = true; return true; }
      if (st.mode === 'orv') { this.snapshot(); this.newPair(this.P || {}); this.pairLeft = this.fast ? 3.5 : +((this.P || {})['párosításMp'] ?? 10); return true; }
      if (st.mode === 'spir') { this.spir.shuffle(); return true; }
      if (st.mode === 'hold') { this.hold.shuffle(); return true; }
      return false;
    }
    render(dt) {
      const cv = this.cv, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr);
      if (!W || !H) return;
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      const x0 = cv.getContext('2d'); x0.setTransform(1, 0, 0, 1, 0, 0); x0.globalAlpha = 1; x0.globalCompositeOperation = 'source-over'; x0.filter = 'none';
      if (this.kind === 'spir') this.spir.draw(x0, W, H, dt, true, this.P || {});
      else if (this.kind === 'hold') this.hold.draw(x0, W, H, dt, true, this.P || {});
      else this.renderOrv(dt, W, H);
      if (this.snapA > 0 && this.snap) { x0.globalAlpha = this.snapA; x0.drawImage(this.snap, 0, 0, W, H); x0.globalAlpha = 1; this.snapA = Math.max(0, this.snapA - dt / 1.4); }
      this.drawnOnce = true;
    }
    renderOrv(dt, W, H) {
      const cv = this.cv, c = this.cfg, F = this.fast, waveSec = F ? 1.5 : 3, soft = F ? 0.15 : 0.3;
      for (const key of ['bg', 'ob']) { const w = this[key]; w.el += dt; if (w.el >= waveSec) { const nw = this.newWave(0, w); nw.el = w.el - waveSec; if (key === 'bg') this.bgPrev = w; this[key] = nw; } }
      const kOf = (w, el) => Math.min(1, (el ?? w.el) / waveSec) * (1 + soft) - soft / 2;
      const x = cv.getContext('2d'), cx = W / 2, cy = H / 2, RR = Math.hypot(cx, cy);
      x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
      if (c.wave) this.paint(x, this.bg, cx, cy, RR, kOf(this.bg), soft); else { x.fillStyle = COL.fekete; x.fillRect(0, 0, W, H); }
      const g1 = this.grays[c.n1], g2 = this.grays[c.n2];
      if (g1 && g2) {
        this.th += dt * Math.PI * 2 / (F ? 6 : 15); this.th2 -= dt * Math.PI * 2 / (F ? 4 : 10); this.lt += dt;
        const colOf = sz => { if (COL[sz]) return { flat: COL[sz] }; if (c.wave) { const e = this.bg.el - 0.2; return e >= 0 || !this.bgPrev ? { w: this.bg, k: kOf(this.bg, Math.max(0, e)) } : { w: this.bgPrev, k: kOf(this.bgPrev, waveSec + e) }; } return { w: this.ob, k: kOf(this.ob) }; };
        const col1 = colOf(c.szin1), col2 = colOf(c.szin2);
        const PP = this.P || {}, amp = (+(PP['lélegzés'] ?? 60)) / 100, per = Math.max(1, +(PP['lélegzésMp'] ?? 12));
        const br = ph => 1 - amp * (0.5 - 0.5 * Math.cos(this.lt * Math.PI * 2 / (F ? Math.min(5, per) : per) + ph));
        const M = Math.min(W, H);
        this.obj(x, 'oc', Math.round(M * c.s1 / 100 * br(c.ph)), this.th, col1, g1, cx, cy, RR, soft);
        this.obj(x, 'oc2', Math.round(M * c.s2 / 100 * br(c.ph + Math.PI)), this.th2 + c.off, col2, g2, cx, cy, RR, soft);
      }
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
