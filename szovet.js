// SZÖVET üzemmód – szőtt minták tiszta színekkel és fekete szálvonalakkal, kaleidoszkóp-tükrözéssel.
// © Bánky András – Kaleidoszkóp. Használat: new window.Szovet(canvas, () => ({ want, paused, P }))
(function () {
  if (window.Szovet) return;
  const COLORS = ['#6E2BFF', '#1FBF16', '#19B6F0', '#FF7A2A', '#F04FA8', '#B312D9', '#F01438', '#F2CB1D'];
  const WEAVES = {
    'vászon': (i, j) => ((i + j) % 2 + 2) % 2 === 0,
    'sávoly': (i, j) => ((i - j) % 4 + 4) % 4 < 2,
    'panama': (i, j) => (((Math.floor(i / 2) + Math.floor(j / 2)) % 2) + 2) % 2 === 0,
  };
  const NAMES = ['lila', 'zöld', 'kék', 'narancs', 'rózsa', 'bíbor', 'piros', 'sárga'];
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const num = (v, d) => { const n = +v; return Number.isFinite(n) ? n : d; };

  function makeSeq(vary) {
    const n = rnd(2, 4), pool = [...COLORS.keys()].sort(() => Math.random() - .5).slice(0, n);
    const half = [], parts = rnd(3, 5);
    for (let i = 0; i < parts; i++) half.push({ c: pool[i % n], k: rnd(1, 6), w: vary ? pick([0.55, 0.8, 1, 1, 1.3, 1.7]) : 1 });
    return half.concat(half.slice(0, -1).reverse());
  }
  const threads = seq => { const o = []; seq.forEach(s => { for (let i = 0; i < s.k; i++) o.push({ c: s.c, w: s.w }); }); return o; };

  class Szovet {
    constructor(cv, host) {
      this.cv = cv; this.host = host; this.op = 0; this.t = 0; this.left = 0; this.last = performance.now();
      this.src = document.createElement('canvas'); this.snap = null; this.snapA = 0; this.cloth = null; this.drawnOnce = false;
      const tick = now => { try { this.frame(now); } catch (e) { console.error(e); } this.raf = requestAnimationFrame(tick); };
      this.raf = requestAnimationFrame(tick);
    }
    // új szövet véletlen paraméterekkel (a beállítások korlátain belül)
    newCloth(P) {
      const fajta = P['szövetFajta'] === 'kétszínű' || P['szövetFajta'] === 'csíkos-kockás' ? P['szövetFajta'] : pick(['kétszínű', 'csíkos-kockás']);
      const kotes = WEAVES[P['szövetKötés']] ? P['szövetKötés'] : pick(['vászon', 'sávoly', 'sávoly', 'panama']);
      const tm = String(P['szövetTükör'] ?? 'váltakozó'), mir = ['6', '8', '12'].includes(tm) ? +tm : pick([6, 8, 8, 12]);
      let W, F;
      if (fajta === 'kétszínű') {
        const fa = NAMES.indexOf(P['szövetLánc']), fb = NAMES.indexOf(P['szövetVetülék']);
        const a = fa >= 0 ? fa : rnd(0, 7); let b = fb >= 0 ? fb : rnd(0, 7); if (fb < 0) while (b === a) b = rnd(0, 7);
        W = [{ c: a, w: 1 }]; F = [{ c: b, w: 1 }];
      } else {
        const vary = P['csík: változó szélesség'] !== false, same = P['csík: lánc = vetülék'] !== false;
        W = threads(makeSeq(vary)); F = same ? W : threads(makeSeq(vary));
      }
      this.cloth = { W, F, rule: WEAVES[kotes], mir, dir: Math.random() < .5 ? 1 : -1 };
      this.key = null; // újrarajzolás
    }
    paintSrc(P, need) {
      const dpr = this.dpr, base = Math.max(6, num(P['szálszélesség'], 22)) * dpr, c = this.cloth;
      const key = [need, base, c].map(x => typeof x === 'object' ? '' : x).join('|') + (this._cid || 0);
      if (this.key === key) return; this.key = key;
      const S = this.src; S.width = S.height = need; const x = S.getContext('2d');
      const cols = [], rows = [];
      for (let p = 0, i = 0; p < need; i++) { const t = c.W[i % c.W.length], w = Math.max(4, base * t.w); cols.push({ x: p, w, c: t.c, i }); p += w; }
      for (let p = 0, j = 0; p < need; j++) { const t = c.F[j % c.F.length], h = Math.max(4, base * t.w); rows.push({ y: p, h, c: t.c, j }); p += h; }
      const R = c.rule;
      for (const r of rows) for (const q of cols) { const up = R(q.i, r.j); x.fillStyle = COLORS[up ? q.c : r.c]; x.fillRect(q.x, r.y, q.w + .5, r.h + .5); }
      x.strokeStyle = '#000'; x.lineWidth = Math.max(1.5, base * 0.09); x.lineCap = 'square'; x.beginPath();
      for (const r of rows) for (const q of cols) {
        const up = R(q.i, r.j), L = q.x, Rt = q.x + q.w, T = r.y, B = r.y + r.h;
        if (up) { x.moveTo(L, T); x.lineTo(L, B); x.moveTo(Rt, T); x.lineTo(Rt, B); if (!R(q.i, r.j - 1)) { x.moveTo(L, T); x.lineTo(Rt, T); } if (!R(q.i, r.j + 1)) { x.moveTo(L, B); x.lineTo(Rt, B); } }
        else { x.moveTo(L, T); x.lineTo(Rt, T); x.moveTo(L, B); x.lineTo(Rt, B); if (R(q.i - 1, r.j)) { x.moveTo(L, T); x.lineTo(L, B); } if (R(q.i + 1, r.j)) { x.moveTo(Rt, T); x.lineTo(Rt, B); } }
      }
      x.stroke();
    }
    snapshot() {
      const cv = this.cv; if (!cv.width || !cv.height || !this.drawnOnce) return;
      if (!this.snap) this.snap = document.createElement('canvas');
      this.snap.width = cv.width; this.snap.height = cv.height; this.snap.getContext('2d').drawImage(cv, 0, 0); this.snapA = 1;
    }
    next() { if (this.op < 0.5) return false; this.snapshot(); this.newCloth(this.P || {}); this._cid = (this._cid || 0) + 1; this.left = Math.max(5, num((this.P || {})['szövetVáltásMp'], 15)); return true; }
    frame(now) {
      const st = this.host() || {}, P = st.P || {}; this.P = P;
      let dt = Math.min(0.1, (now - this.last) / 1000); this.last = now;
      if (st.paused) dt = 0;
      const want = st.want ? 1 : 0;
      if (want && !this.cloth) { this.newCloth(P); this.left = Math.max(5, num(P['szövetVáltásMp'], 15)); }
      const k = Math.min(1, dt * 1.6 + (st.paused ? 0 : 0.002));
      this.op += (want - this.op) * k; if (want === 0 && this.op < 0.01) this.op = 0; if (want === 1 && this.op > 0.995) this.op = 1;
      if (this.cv._op !== this.op) { this.cv.style.opacity = this.op.toFixed(3); this.cv._op = this.op; }
      if (this.op <= 0) { this.drawnOnce = false; return; }
      // beállítás-változás → új szövet
      const pk = ['szövetFajta', 'szövetLánc', 'szövetVetülék', 'csík: lánc = vetülék', 'csík: változó szélesség', 'szövetKötés', 'szövetTükör'].map(q => P[q]).join('|');
      if (this.pk != null && pk !== this.pk) this.next(); this.pk = pk;
      if (want) { this.left -= dt; if (this.left <= 0) this.next(); }
      if (st.paused && this.drawnOnce) return;
      this.t += dt; this.render(dt, P);
    }
    render(dt, P) {
      const cv = this.cv, dpr = this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr); if (!W || !H) return;
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      const zoom = Math.max(0.7, num(P['szövetNagyítás'], 100) / 100), spin = num(P['szövetForgás'], 3);
      const Rr = Math.hypot(W, H) / 2, drift = 200 * dpr;
      const need = Math.min(3600, Math.ceil(2 * (Rr / zoom + drift + 20)));
      this.paintSrc(P, need);
      const x = cv.getContext('2d'), c = this.cloth, S = this.src, n = c.mir, a = Math.PI * 2 / n, cx = W / 2, cy = H / 2;
      const ang = this.t * spin * 0.025 * c.dir, dd = (this.t * spin * 6 * dpr);
      x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
      for (let i = 0; i < n; i++) {
        x.save(); x.translate(cx, cy);
        if (i % 2) { x.rotate((i + 1) * a); x.scale(1, -1); } else x.rotate(i * a);
        x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, Rr + 4, -0.002, a + 0.002); x.closePath(); x.clip();
        x.scale(zoom, zoom); x.rotate(ang); x.translate(-S.width / 2 + (dd % drift), -S.height / 2 + ((dd * 0.6) % drift));
        x.drawImage(S, 0, 0); x.restore();
      }
      if (this.snapA > 0 && this.snap) { x.globalAlpha = this.snapA; x.drawImage(this.snap, 0, 0, W, H); x.globalAlpha = 1; this.snapA = Math.max(0, this.snapA - dt / 1.4); }
      this.drawnOnce = true;
    }
  }
  window.Szovet = Szovet;
})();
