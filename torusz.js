// ÍRÁSJELES TÓRUSZ – megcsavart fánk, amelynek felülete írásjelekből áll (+ és @, illetve 0–9).
// A jelek spirálkarokban áramlanak a fánk közepébe; egy körbefutó hullám a jeleket egyenként átfordítja a másik jelkészletre.
// Színek: fehér jelek fekete alapon, vagy egy színpár – véletlenszerűen váltakozva. A sebesség a zenét követi (window.__zeneSeb).
// © Bánky András
(function () {
  const PAROK = [['#F2C14E', '#1B1464'], ['#FF6B6B', '#0B3C49'], ['#7CF5D2', '#3A0CA3'], ['#FFD6E8', '#7B2D26'], ['#E0FBFC', '#C1121F'], ['#FFE066', '#247BA0'], ['#C8F560', '#5A189A'], ['#FFFFFF', '#0B6E4F']];
  const SZINES = ['#F2C14E', '#FF6B6B', '#7CF5D2', '#FFE066', '#C8F560', '#00F0FF', '#FF2BD6', '#39FF14', '#FF7A00', '#8EA8FF'];
  const JA = ['+', '@'], JB = '0123456789'.split('');
  const pick = a => a[Math.floor(Math.random() * a.length)];

  class Torusz {
    constructor(cv) {
      this.cv = cv; this.x = cv.getContext('2d');
      this.NU = 96; this.NV = 26;
      this.t = 0; this.last = performance.now();
      this.pts = [];
      for (let i = 0; i < this.NU; i++) for (let j = 0; j < this.NV; j++) {
        // A készlet: spirálkaronként váltakozva @ és + (a karok a csavarodás mentén futnak)
        // a csavarvonalak mentén (azonos j) futnak a karok: minden harmadik @-ból, a többi +-ból
        this.pts.push({ i, j, a: j % 3 === 0 ? '@' : '+', b: pick(JB), flip: 0 });
      }
      this.keszlet = 0;          // 0 = +/@, 1 = számjegyek
      this.hullam = null;        // futó átváltás: { t0, cel }
      this.kovValt = 9;          // következő átváltás ideje (mp)
      this.szin = { fg: '#FFFFFF', bg: '#000000' }; this.szinRegi = null; this.szinT = 1;
      this.kovSzin = 5;   // az első színváltás már 5 mp után (a spirálforma kb. 15 mp-enként vált)
      this.atlasz = {}; this.atlaszSzin = null;
      this.meret();
      addEventListener('resize', () => this.meret());
    }
    meret() {
      const d = Math.min(2, devicePixelRatio || 1), r = this.cv.getBoundingClientRect();
      this.cv.width = Math.max(1, Math.round(r.width * d)); this.cv.height = Math.max(1, Math.round(r.height * d));
    }
    // jelképek előre megrajzolva (gyors rajzolás); színváltáskor újrarajzoljuk
    keszitAtlasz(fg) {
      if (this.atlaszSzin === fg) return; this.atlaszSzin = fg; this.atlasz = {};
      for (const ch of JA.concat(JB)) {
        const c = document.createElement('canvas'); c.width = c.height = 96; const x = c.getContext('2d');
        x.fillStyle = fg; x.font = '600 76px "DejaVu Sans Mono", Menlo, Consolas, monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText(ch, 48, 52); this.atlasz[ch] = c;
      }
    }
    lepes() {
      const now = performance.now(), dt = Math.min(0.1, (now - this.last) / 1000); this.last = now;
      const seb = window.__zeneSeb || 1; this.t += dt * seb; this.valos = (this.valos || 0) + dt;
      // átváltó hullám indítása
      if (!this.hullam && this.valos >= this.kovValt) { this.hullam = { t0: this.valos, cel: 1 - this.keszlet }; }
      if (this.hullam) {
        const p = (this.valos - this.hullam.t0) / 4;   // 4 mp alatt fut körbe
        if (p >= 1.15) { this.keszlet = this.hullam.cel; this.hullam = null; this.kovValt = this.valos + 10 + Math.random() * 8; this.pts.forEach(q => q.b = pick(JB)); }
        else this.hullamP = p;
      }
      // színváltás: fehér/fekete ↔ véletlen színpár
      if (this.valos >= this.kovSzin) {
        this.szinRegi = this.szin; this.szinT = 0;
        this.szin = this.szin.fg === '#FFFFFF' ? { fg: pick(SZINES), bg: '#000000' } : { fg: '#FFFFFF', bg: '#000000' };   // a háttér mindig fekete, csak a jelek színe vált
        this.kovSzin = this.valos + 6 + Math.random() * 3;
      }
      if (this.szinT < 1) this.szinT = Math.min(1, this.szinT + dt / 1.5);
    }
    rajzol() {
      this.lepes();
      const x = this.cv.getContext('2d'), W = this.cv.width, H = this.cv.height, S = Math.min(W, H);
      const keveres = (a, b, k) => { const h = s => [1, 3, 5].map(i => parseInt(s.substr(i, 2), 16)); const A = h(a), B = h(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`; };
      const k = this.szinT, bg = this.szinRegi && k < 1 ? keveres(this.szinRegi.bg, this.szin.bg, k) : this.szin.bg;
      const fg = this.szinRegi && k < 0.5 ? this.szinRegi.fg : this.szin.fg;
      x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.fillStyle = bg; x.fillRect(0, 0, W, H);
      this.keszitAtlasz(fg);
      const R = 1, r = 0.64, tw = 1, tilt = 0.55, cam = 4.2, sc = S * 0.46;
      const ct = Math.cos(tilt), st = Math.sin(tilt), T = this.t;
      const fu = T * 0.16, fv = -T * 0.55;   // forgás a tengely körül, áramlás a cső körül (befelé a lyukba)
      const L = [];
      for (const q of this.pts) {
        const u = (q.i / this.NU) * Math.PI * 2 + fu;
        const v = (q.j / this.NV) * Math.PI * 2 + tw * (q.i / this.NU) * Math.PI * 2 + fv;
        const rr = R + r * Math.cos(v);
        let X = rr * Math.cos(u), Y = rr * Math.sin(u), Z = r * Math.sin(v);
        const Y2 = Y * ct - Z * st, Z2 = Y * st + Z * ct;   // döntés: ferdén felülről nézzük
        const p = cam / (cam - Z2), px = W / 2 + X * p * sc / 1.9, py = H / 2 + Y2 * p * sc / 1.9;
        const melyseg = (Z2 + 1.7) / 3.4;   // 0 = hátul, 1 = elöl
        // melyik jelkészlet: a hullám u szerint fut körbe
        let ch = this.keszlet === 0 ? q.a : q.b;
        if (this.hullam) {
          const hely = ((q.i / this.NU) + 1) % 1, elol = this.hullamP - hely;
          if (elol > 0) ch = this.hullam.cel === 0 ? q.a : q.b;
          q.flip = elol > 0 && elol < 0.08 ? 1 - elol / 0.08 : 0;
        } else q.flip = 0;
        const belso = Math.max(0, Math.min(1, (rr - (R - r)) / (r * 0.9)));   // a lyuk szélén sűrűsödő jeleket halványítjuk
        L.push({ px, py, p, melyseg, ch, flip: q.flip, belso });
      }
      L.sort((a, b) => a.melyseg - b.melyseg);
      for (const e of L) {
        const s = S * 0.024 * e.p * (1 + 0.35 * e.flip), im = this.atlasz[e.ch];
        x.globalAlpha = Math.max(0.05, Math.min(1, (0.12 + e.melyseg * e.melyseg * 1.1) * (0.35 + 0.65 * e.belso)));
        x.drawImage(im, e.px - s / 2, e.py - s / 2, s, s);
      }
      x.globalAlpha = 1;
    }
  }
  window.Torusz = Torusz;
})();
