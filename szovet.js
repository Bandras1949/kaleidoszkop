// SZÖVET üzemmód – ÉLŐ SZÖVÉS: a lánc (függőleges szálak) mindig ott van, a vetélő középről kifelé haladva soronként
// beszövi a vetüléket; a kész szövet lebeg, aztán felbomlik, és jön a következő. A szálak térhatásúak (alá-fölé árnyék),
// a színek egy-egy harmóniából jönnek (főleg egy szín pasztell és mély árnyalatai). A vetélő a zene ütemére gyorsul.
// Kaleidoszkóp-tükrözéssel. © Bánky András – Kaleidoszkóp. Használat: new window.Szovet(canvas, () => ({ want, paused, P }))
(function () {
  if (window.Szovet) return;
  const COLORS = ['#6E2BFF', '#1FBF16', '#19B6F0', '#FF7A2A', '#F04FA8', '#B312D9', '#F01438', '#F2CB1D'];
  const NAMES = ['lila', 'zöld', 'kék', 'narancs', 'rózsa', 'bíbor', 'piros', 'sárga'];
  const WEAVES = {
    'vászon': (i, j) => ((i + j) % 2 + 2) % 2 === 0,
    'sávoly': (i, j) => ((i - j) % 4 + 4) % 4 < 2,
    'panama': (i, j) => (((Math.floor(i / 2) + Math.floor(j / 2)) % 2) + 2) % 2 === 0,
  };
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const num = (v, d) => { const n = +v; return Number.isFinite(n) ? n : d; };
  const hsl = (h, s, l) => `hsl(${((h % 360) + 360) % 360},${s}%,${l}%)`;
  const hueOf = hex => { const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.substr(i, 2), 16) / 255), M = Math.max(r, g, b), m = Math.min(r, g, b), d = M - m; if (!d) return 0; const h = M === r ? ((g - b) / d) % 6 : M === g ? (b - r) / d + 2 : (r - g) / d + 4; return h * 60; };

  // SZÍNHARMÓNIA: 3–4 összeillő szín; a leggyakoribb egy szín árnyalatai (pasztelltől a mélyig)
  function harmonia(h) {
    h = h ?? Math.random() * 360;
    const f = pick(['árnyalatok', 'árnyalatok', 'árnyalatok', 'pasztell', 'kiegészítő', 'szomszédos']);
    if (f === 'árnyalatok') return [hsl(h, 55, 84), hsl(h, 62, 64), hsl(h, 66, 46), hsl(h, 60, 30)];
    if (f === 'pasztell') { const d = pick([40, 120, 150]); return [hsl(h, 60, 82), hsl(h + d, 52, 76), hsl(h + 2 * d, 48, 86), hsl(h, 45, 62)]; }
    if (f === 'kiegészítő') return [hsl(h, 45, 74), hsl(h, 55, 42), hsl(h + 180, 42, 76), hsl(h + 180, 52, 44)];
    return [hsl(h, 55, 70), hsl(h + 28, 58, 58), hsl(h + 56, 50, 76), hsl(h + 14, 60, 38)];
  }
  function makeSeq(vary, n) {
    const pool = [...Array(n).keys()].sort(() => Math.random() - .5), half = [], parts = rnd(3, 5);
    for (let i = 0; i < parts; i++) half.push({ c: pool[i % n], k: rnd(1, 6), w: vary ? pick([0.55, 0.8, 1, 1, 1.3, 1.7]) : 1 });
    return half.concat(half.slice(0, -1).reverse());
  }
  const threads = seq => { const o = []; seq.forEach(s => { for (let i = 0; i < s.k; i++) o.push({ c: s.c, w: s.w }); }); return o; };
  // árnyékcsíkok a szálak térhatásához (a szál közepe világos, a széle sötét)
  function arnyek(vert) {
    const c = document.createElement('canvas'); c.width = vert ? 32 : 1; c.height = vert ? 1 : 32; const x = c.getContext('2d');
    const g = vert ? x.createLinearGradient(0, 0, 32, 0) : x.createLinearGradient(0, 0, 0, 32);
    g.addColorStop(0, 'rgba(0,0,0,.42)'); g.addColorStop(.32, 'rgba(255,255,255,.10)'); g.addColorStop(.5, 'rgba(255,255,255,.22)'); g.addColorStop(.7, 'rgba(255,255,255,.06)'); g.addColorStop(1, 'rgba(0,0,0,.48)');
    x.fillStyle = g; x.fillRect(0, 0, c.width, c.height); return c;
  }

  class Szovet {
    constructor(cv, host) {
      this.cv = cv; this.host = host; this.op = 0; try { cv.dataset.szovet = '1'; } catch (e) {}   // a középső logó így ismeri fel this.t = 0; this.last = performance.now();
      this.src = document.createElement('canvas'); this.lanc = document.createElement('canvas');
      this.shV = arnyek(true); this.shH = arnyek(false);
      this.snap = null; this.snapA = 0; this.cloth = null; this.drawnOnce = false;
      this.fazis = 'sző'; this.p = 0; this.ft = 0;   // fázis: sző → lebeg → bomlik; p: a beszőtt rész aránya
      const tick = now => { try { this.frame(now); } catch (e) { console.error(e); } this.raf = requestAnimationFrame(tick); };
      this.raf = requestAnimationFrame(tick);
    }
    newCloth(P) {
      const fajta = P['szövetFajta'] === 'kétszínű' || P['szövetFajta'] === 'csíkos-kockás' ? P['szövetFajta'] : pick(['kétszínű', 'csíkos-kockás', 'csíkos-kockás']);
      const kotes = WEAVES[P['szövetKötés']] ? P['szövetKötés'] : pick(['vászon', 'sávoly', 'sávoly', 'panama']);
      const tm = String(P['szövetTükör'] ?? 'váltakozó'), mir = tm === 'nincs' ? 0 : ['6', '8', '12'].includes(tm) ? +tm : pick([6, 8, 8, 12]);
      const fa = NAMES.indexOf(P['szövetLánc']), fb = NAMES.indexOf(P['szövetVetülék']);
      let pal, W, F;
      if (fa >= 0 && fb >= 0) pal = [COLORS[fa], COLORS[fb]];   // a felhasználó két megnevezett színe
      else if (window.__promoSzov) pal = pick(window.__promoSzov).slice();   // a promóvideó rögzített színei
      else pal = harmonia(fa >= 0 ? hueOf(COLORS[fa]) : fb >= 0 ? hueOf(COLORS[fb]) : null);
      if (fajta === 'kétszínű') {
        if (pal.length === 2) { W = [{ c: 0, w: 1 }]; F = [{ c: 1, w: 1 }]; }
        else { const a = rnd(0, 1), b = rnd(2, 3); W = [{ c: a, w: 1 }]; F = [{ c: b, w: 1 }]; }   // világos és sötét árnyalat egymással szemben
      } else {
        const vary = P['csík: változó szélesség'] !== false, same = P['csík: lánc = vetülék'] !== false;
        W = threads(makeSeq(vary, pal.length)); F = same ? W : threads(makeSeq(vary, pal.length));
      }
      this.cloth = { W, F, pal, rule: WEAVES[kotes], mir, dir: Math.random() < .5 ? 1 : -1 };
      this.key = null; this.fazis = 'sző'; this.p = 0; this.ft = 0;
    }
    // a kész szövet (src) és a csupasz lánc (lanc: egy keskeny csík, függőlegesen nyújtva) megrajzolása
    paintSrc(P, need) {
      const dpr = this.dpr, base = Math.max(6, num(P['szálszélesség'], 22)) * dpr, c = this.cloth;
      const key = need + '|' + base + '|' + (this._cid || 0);
      if (this.key === key) return; this.key = key;
      const S = this.src; S.width = S.height = need; const x = S.getContext('2d');
      const cols = [], rows = [];
      for (let p = 0, i = 0; p < need; i++) { const t = c.W[i % c.W.length], w = Math.max(4, base * t.w); cols.push({ x: p, w, c: t.c, i }); p += w; }
      for (let p = 0, j = 0; p < need; j++) { const t = c.F[j % c.F.length], h = Math.max(4, base * t.w); rows.push({ y: p, h, c: t.c, j }); p += h; }
      this.rows = rows;
      const R = c.rule, pal = c.pal;
      x.fillStyle = '#000'; x.fillRect(0, 0, need, need);
      for (const r of rows) for (const q of cols) {
        const up = R(q.i, r.j);
        x.fillStyle = pal[up ? q.c : r.c]; x.fillRect(q.x, r.y, q.w + .5, r.h + .5);
        if (up) x.drawImage(this.shV, q.x, r.y, q.w + .5, r.h + .5); else x.drawImage(this.shH, q.x, r.y, q.w + .5, r.h + .5);
      }
      // alá-fölé: ahol a szál a másik alá bukik, rövid, lágy árnyék
      x.strokeStyle = 'rgba(0,0,0,.55)'; x.lineWidth = Math.max(1, base * 0.07); x.beginPath();
      for (const r of rows) for (const q of cols) {
        const up = R(q.i, r.j), L = q.x, Rt = q.x + q.w, T = r.y, B = r.y + r.h;
        if (up) { if (!R(q.i, r.j - 1)) { x.moveTo(L, T); x.lineTo(Rt, T); } if (!R(q.i, r.j + 1)) { x.moveTo(L, B); x.lineTo(Rt, B); } }
        else { if (R(q.i - 1, r.j)) { x.moveTo(L, T); x.lineTo(L, B); } if (R(q.i + 1, r.j)) { x.moveTo(Rt, T); x.lineTo(Rt, B); } }
      }
      x.stroke();
      // csupasz lánc: a függőleges szálak, kissé sötétebben, köztük rés
      const Lc = this.lanc; Lc.width = need; Lc.height = 8; const y = Lc.getContext('2d');
      y.clearRect(0, 0, need, 8);
      for (const q of cols) { const g = Math.max(1, q.w * 0.14); y.fillStyle = pal[q.c]; y.fillRect(q.x + g / 2, 0, q.w - g, 8); y.drawImage(this.shV, q.x + g / 2, 0, q.w - g, 8); }
      y.fillStyle = 'rgba(0,0,0,.38)'; y.fillRect(0, 0, need, 8);
    }
    snapshot() {
      const cv = this.cv; if (!cv.width || !cv.height || !this.drawnOnce) return;
      if (!this.snap) this.snap = document.createElement('canvas');
      this.snap.width = cv.width; this.snap.height = cv.height; this.snap.getContext('2d').drawImage(cv, 0, 0); this.snapA = 1;
    }
    next() { if (this.op < 0.5) return false; this.snapshot(); this.newCloth(this.P || {}); this.t += 30 + Math.random() * 90; this._cid = (this._cid || 0) + 1; return true; }
    frame(now) {
      const st = this.host() || {}, P = st.P || {}; this.P = P;
      let dt = Math.min(0.1, (now - this.last) / 1000); this.last = now;
      if (st.paused) dt = 0;
      const want = st.want ? 1 : 0;
      if (want && !this.cloth) this.newCloth(P);
      const k = Math.min(1, dt * 1.6 + (st.paused ? 0 : 0.002));
      this.op += (want - this.op) * k; if (want === 0 && this.op < 0.01) this.op = 0; if (want === 1 && this.op > 0.995) this.op = 1;
      window.__nincsDobbanasSz = this.op > 0.3;   // a SZÖVET alatt nincs zenei dobbanás (a kép nem rándul össze)
      if (this.cv._op !== this.op) { this.cv.style.opacity = this.op.toFixed(3); this.cv._op = this.op; }
      if (this.op <= 0) { this.drawnOnce = false; return; }
      const pk = ['szövetFajta', 'szövetLánc', 'szövetVetülék', 'csík: lánc = vetülék', 'csík: változó szélesség', 'szövetKötés', 'szövetTükör'].map(q => P[q]).join('|');
      if (this.pk != null && pk !== this.pk) this.next(); this.pk = pk;
      // FÁZISOK: sző (kb. 9 mp, a zene ütésein gyorsul) → lebeg → bomlik (3 mp) → új szövet
      const utes = (window.__zene && window.__zene.utes) || 0;
      this.ft += dt;
      if (this.fazis === 'sző') { this.p = Math.min(1, this.p + dt / 9 * (0.75 + 1.8 * utes)); if (this.p >= 1) { this.fazis = 'lebeg'; this.ft = 0; } }
      else if (this.fazis === 'lebeg') { const hold = Math.max(4, num(P["szövetVáltásMp"], 15) - 7); if (want && P['szövetVáltás'] !== false && this.ft > hold) { this.fazis = 'bomlik'; this.ft = 0; } }
      else if (this.fazis === 'bomlik') { this.p = Math.max(0, this.p - dt / 3); if (this.p <= 0) { this.newCloth(P); this._cid = (this._cid || 0) + 1; this.snapshot(); this.snapA = 0.6; } }
      if (st.paused && this.drawnOnce) return;
      const zs = window.__zeneSeb || 1; this.t += dt * zs; this.render(dt * zs, P, utes);
    }
    render(dt, P, utes) {
      const cv = this.cv, dpr = this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr); if (!W || !H) return;
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      const zoom = Math.max(0.7, num(P['szövetNagyítás'], 100) / 100), spin = num(P['szövetForgás'], 3);
      const Rr = Math.hypot(W, H) / 2, drift = 200 * dpr;
      const need = Math.min(3600, Math.ceil(2 * (Rr / zoom + drift + 20)));
      this.paintSrc(P, need);
      const x = cv.getContext('2d'), c = this.cloth, S = this.src, n = c.mir, a = Math.PI * 2 / (n || 1), cx = W / 2, cy = H / 2;
      // lebegés: a kész szövet lassan hullámzik (finom forgás- és méretlélegzés); szövés közben alig
      const lb = this.fazis === 'lebeg' ? Math.min(1, this.ft / 1.5) : 0.25, T = this.t;
      const ang = T * spin * 0.025 * c.dir + lb * 0.035 * Math.sin(T * 0.7), zz = zoom * (1 + lb * 0.025 * Math.sin(T * 0.9 + 1));
      const dd = (T * spin * 6 * dpr);
      // a beszőtt sáv: középről kifelé, két front
      const ease = q => q * q * (3 - 2 * q), hb = this.p >= 1 ? need / 2 : Math.min(need / 2, ease(this.p) * (Rr / zz + drift)), sy = need / 2 - hb, sh = 2 * hb;
      const sx = need / 2 + need * 0.42 * Math.sin(this.t * 2.4), fej = (16 + 26 * utes) * dpr;   // vetélő helye és fénye
      x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
      const reteg = () => {
        x.drawImage(this.lanc, 0, 0, need, 8, 0, 0, need, need);   // csupasz lánc
        if (sh > 1) x.drawImage(S, 0, sy, need, sh, 0, sy, need, sh);   // beszőtt rész
        if (this.p > 0 && this.p < 1) {   // vetélő a két fronton
          x.save(); x.globalCompositeOperation = 'lighter';
          for (const yy of [sy, sy + sh]) { const g = x.createRadialGradient(sx, yy, 0, sx, yy, fej * 2.2); g.addColorStop(0, 'rgba(255,248,225,.95)'); g.addColorStop(.35, 'rgba(240,210,140,.45)'); g.addColorStop(1, 'rgba(240,210,140,0)'); x.fillStyle = g; x.fillRect(sx - fej * 2.2, yy - fej * 2.2, fej * 4.4, fej * 4.4); }
          x.restore();
        }
      };
      if (!n) { x.save(); x.translate(cx, cy); x.scale(zz, zz); x.rotate(ang * 0.5); x.translate(-need / 2, -need / 2); reteg(); x.restore(); }
      for (let i = 0; n && i < n; i++) {
        x.save(); x.translate(cx, cy);
        if (i % 2) { x.rotate((i + 1) * a); x.scale(1, -1); } else x.rotate(i * a);
        x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, Rr + 4, -0.002, a + 0.002); x.closePath(); x.clip();
        x.scale(zz, zz); x.rotate(ang); x.translate(-need / 2 + (dd % drift), -need / 2 + ((dd * 0.6) % drift));
        reteg(); x.restore();
      }
      if (this.snapA > 0 && this.snap) { x.globalAlpha = this.snapA; x.drawImage(this.snap, 0, 0, W, H); x.globalAlpha = 1; this.snapA = Math.max(0, this.snapA - dt / 1.4); }
      this.drawnOnce = true;
    }
  }
  window.Szovet = Szovet;
})();
