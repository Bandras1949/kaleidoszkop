// ÍRÁSJELES TÓRUSZ 2 (CSAVART) – a mintaképek szerinti, háromkaréjos keresztmetszetű, csavart tórusz; amelynek felülete írásjelekből áll (+ és @, illetve 0–9).
// A jelek spirálkarokban áramlanak a fánk közepébe; egy körbefutó hullám a jeleket egyenként átfordítja a másik jelkészletre.
// Színek: fehér jelek fekete alapon, vagy egy színpár – véletlenszerűen váltakozva. A sebesség a zenét követi (window.__zeneSeb).
// © Bánky András
(function () {
  const PAROK = [['#F2C14E', '#1B1464'], ['#FF6B6B', '#0B3C49'], ['#7CF5D2', '#3A0CA3'], ['#FFD6E8', '#7B2D26'], ['#E0FBFC', '#C1121F'], ['#FFE066', '#247BA0'], ['#C8F560', '#5A189A'], ['#FFFFFF', '#0B6E4F']];
  const SZINES = ['#F2C14E', '#FF6B6B', '#7CF5D2', '#FFE066', '#C8F560', '#00F0FF', '#FF2BD6', '#39FF14', '#FF7A00', '#8EA8FF'];
  const JA = ['+', '@'], JB = '0123456789'.split('');
  const pick = a => a[Math.floor(Math.random() * a.length)];

  class Torusz2 {
    constructor(cv) {
      this.cv = cv; this.x = cv.getContext('2d');
      this.NU = 84; this.NV = 36;
      this.t = 0; this.last = performance.now();
      this.pts = [];
      for (let i = 0; i < this.NU; i++) for (let j = 0; j < this.NV; j++) {
        // A készlet: spirálkaronként váltakozva @ és + (a karok a csavarodás mentén futnak)
        // a csavarvonalak mentén (azonos j) futnak a karok: minden harmadik @-ból, a többi +-ból
        this.pts.push({ i, j, a: Math.floor(j / 2) % 3 === 0 ? '@' : '+', b: pick(JB), flip: 0 });
      }
      this.keszlet = 0;          // 0 = +/@, 1 = számjegyek
      this.hullam = null;        // futó átváltás: { t0, cel }
      this.kovValt = 9;          // következő átváltás ideje (mp)
      this.szin = { fg: '#FFFFFF', bg: '#000000' }; this.szinRegi = null; this.szinT = 1;
      this.kovSzin = 24;
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
        if (ch === '+') { x.fillRect(48 - 9, 48 - 34, 18, 68); x.fillRect(48 - 34, 48 - 9, 68, 18); }   // vastag, szögletes kereszt (mint a mintaképeken)
        else x.fillText(ch, 48, 52);
        this.atlasz[ch] = c;
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
        this.kovSzin = this.valos + 20 + Math.random() * 15;
      }
      if (this.szinT < 1) this.szinT = Math.min(1, this.szinT + dt / 2.5);
    }
    rajzol() {
      this.lepes();
      const x = this.cv.getContext('2d'), W = this.cv.width, H = this.cv.height, S = Math.min(W, H);
      const keveres = (a, b, k) => { const h = s => [1, 3, 5].map(i => parseInt(s.substr(i, 2), 16)); const A = h(a), B = h(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`; };
      const k = this.szinT, bg = this.szinRegi && k < 1 ? keveres(this.szinRegi.bg, this.szin.bg, k) : this.szin.bg;
      const fg = this.szinRegi && k < 0.5 ? this.szinRegi.fg : this.szin.fg;
      x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.fillStyle = bg; x.fillRect(0, 0, W, H);
      this.keszitAtlasz(fg);
      // CSAVART, LEKEREKÍTETT HÁROMSZÖG KERESZTMETSZETŰ TÓRUSZ (mint a mintaképeken):
      // a cső keresztmetszete háromkaréjos, és körbe haladva egy teljes fordulatot csavarodik – ettől lesz a lyuk és a körvonal háromszöges, hullámzó.
      // A felület fényt kap (ami felénk és a fény felé néz, világos), a hátoldal csak halványan dereng át.
      const R = 1, r = 0.6, a3 = 0.34, csavar = 1, tilt = 0.62, yaw = 0.15, cam = 4.6, sc = S * 0.26;   // erősebben döntve: látszik a külső fal is, így jön ki a háromhurkos csavar
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const ct = Math.cos(tilt), st = Math.sin(tilt), T = this.t;
      const fu = T * 0.12, folyas = T * 0.45;   // forgás a tengely körül + a keresztmetszet körbefordulása (ettől „hullámzik” a forma)
      const LX = -0.35, LY = -0.55, LZ = 0.76;   // fény: felülről, kissé balról, elölről
      const L = [];
      for (const q of this.pts) {
        const u0 = (q.i / this.NU) * Math.PI * 2, u = u0 + fu;
        const ph = (q.j / this.NV) * Math.PI * 2;   // a keresztmetszet mentén
        const th = ph + csavar * u0 + folyas;      // elforgatott szög a keresztmetszetben
        const rho = r * (1 + a3 * Math.cos(3 * ph)), drho = -3 * r * a3 * Math.sin(3 * ph);
        const cr = Math.cos(th), sr = Math.sin(th), cu = Math.cos(u), su = Math.sin(u);
        const rad = R + rho * cr, X = rad * cu, Y = rad * su, Z = rho * sr;
        // a keresztmetszet görbéjének normálisa (radiális + függőleges összetevő)
        let nr = rho * cr + drho * sr, nz = rho * sr - drho * cr; const nl = Math.hypot(nr, nz) || 1; nr /= nl; nz /= nl;
        const NX = nr * cu, NY = nr * su, NZ = nz;
        // döntés (ferdén felülről nézzük)
        const Y2 = Y * ct - Z * st, Z2 = Y * st + Z * ct, NY2 = NY * ct - NZ * st, NZ2 = NY * st + NZ * ct;
        // kis oldalirányú elfordítás (a mintaképeken a lyuk nem pontosan középen van)
        const X3 = X * cy + Z2 * sy, Z3 = -X * sy + Z2 * cy, NX3 = NX * cy + NZ2 * sy, NZ3 = -NX * sy + NZ2 * cy;
        const p = cam / (cam - Z3), px = W / 2 + X3 * p * sc, py = H / 2 + Y2 * p * sc;
        const fele = NZ3;   // >0: felénk néz
        const feny = Math.max(0, NX3 * LX + NY2 * LY + NZ3 * LZ);
        let ch = this.keszlet === 0 ? q.a : q.b;
        if (this.hullam) {
          const hely = q.i / this.NU, elol = this.hullamP - hely;
          if (elol > 0) ch = this.hullam.cel === 0 ? q.a : q.b;
          q.flip = elol > 0 && elol < 0.08 ? 1 - elol / 0.08 : 0;
        } else q.flip = 0;
        const fenyes = fele > 0 ? 0.22 + 0.85 * feny : 0.07;   // hátoldal: alig dereng
        L.push({ px, py, p, z: Z3, ch, flip: q.flip, fenyes, fele });
      }
      // TÖMÖR TEST: a felületet háttérszínű négyszögekből építjük fel, hátulról előre rajzolva.
      // Így ami mögöttük van (a hátoldal és a cső takarásban lévő részei), az eltűnik – csak a felénk néző, látható jelek maradnak.
      const NU = this.NU, NV = this.NV, C = [];
      for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) {
        const a = L[i * NV + j], b = L[((i + 1) % NU) * NV + j], c = L[((i + 1) % NU) * NV + (j + 1) % NV], d = L[i * NV + (j + 1) % NV];
        C.push({ a, b, c, d, z: (a.z + b.z + c.z + d.z) / 4 });
      }
      C.sort((m, n) => m.z - n.z);
      const alap = S * 0.027;
      x.fillStyle = bg; x.strokeStyle = bg; x.lineWidth = Math.max(0.8, S * 0.0012); x.lineJoin = 'round';
      for (const q of C) {
        x.globalAlpha = 1;
        x.beginPath(); x.moveTo(q.a.px, q.a.py); x.lineTo(q.b.px, q.b.py); x.lineTo(q.c.px, q.c.py); x.lineTo(q.d.px, q.d.py); x.closePath(); x.fill(); x.stroke();
        const e = q.a; if (e.fele <= 0) continue;   // hátoldal: nem rajzolunk jelet
        // a jel a saját négyszögének közepére kerül, a négyszög méretéhez igazítva (a lyuk felé összenyomódik, mint a mintán)
        const cx = (q.a.px + q.b.px + q.c.px + q.d.px) / 4, cy = (q.a.py + q.b.py + q.c.py + q.d.py) / 4;
        const ter = Math.abs((q.c.px - q.a.px) * (q.d.py - q.b.py) - (q.d.px - q.b.px) * (q.c.py - q.a.py)) / 2;
        const s = Math.min(alap * e.p * 1.2, Math.sqrt(ter) * 0.82) * (1 + 0.25 * e.flip), im = this.atlasz[e.ch];
        if (s < 1.2) continue;
        x.globalAlpha = Math.min(1, e.fenyes);
        x.drawImage(im, cx - s / 2, cy - s / 2, s, s);
      }
      x.globalAlpha = 1;
    }
  }
  window.Torusz2 = Torusz2;
})();
