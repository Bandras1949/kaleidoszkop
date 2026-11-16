// MÉRŐSZALAG – feltekert centiméterszalag: lapos szalag, amely önmagát nem metszve, csigavonalban tekeredik.
// A szalagon centiméterenként szám, közte fél- és milliméter-jelek. Lassan forog és tekeredik, a háttér fekete,
// a szalag színe fehér ↔ élénk szín között vált. A sebesség a zenét követi (window.__zeneSeb).  © Bánky András
(function () {
  const SZINES = ['#F2C14E', '#FF6B6B', '#7CF5D2', '#FFE066', '#C8F560', '#00F0FF', '#FF2BD6', '#39FF14', '#FF7A00', '#8EA8FF'];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const hx = s => [1, 3, 5].map(i => parseInt(s.substr(i, 2), 16));

  class Meroszalag {
    constructor(cv) {
      this.cv = cv; this.t = 0; this.last = performance.now(); this.valos = 0;
      this.szin = '#FFFFFF'; this.regi = null; this.szinT = 1; this.kovSzin = 5;   // az első színváltás már 5 mp után (a spirálforma kb. 15 mp-enként vált)
      if (cv.nodeType) { this.meret(); addEventListener('resize', () => this.meret()); }
    }
    meret() {
      const d = Math.min(2, devicePixelRatio || 1), r = this.cv.getBoundingClientRect();
      this.cv.width = Math.max(1, Math.round(r.width * d)); this.cv.height = Math.max(1, Math.round(r.height * d));
    }
    lepes() {
      const now = performance.now(), dt = Math.min(0.1, (now - this.last) / 1000); this.last = now;
      this.t += dt * (window.__zeneSeb || 1); this.valos += dt;
      if (this.valos >= this.kovSzin) { this.regi = this.szin; this.szinT = 0; this.szin = this.szin === '#FFFFFF' ? pick(SZINES) : '#FFFFFF'; this.kovSzin = this.valos + 6 + Math.random() * 3; }
      if (this.szinT < 1) this.szinT = Math.min(1, this.szinT + dt / 1.5);
    }
    rajzol() {
      this.lepes();
      const x = this.cv.getContext('2d'), W = this.cv.width, H = this.cv.height, S = Math.min(W, H);
      x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
      const k = this.szinT, A = hx(this.regi && k < 1 ? this.regi : this.szin), B = hx(this.szin), fc = A.map((v, i) => v + (B[i] - v) * k);
      const T = this.t;
      // csigavonal (Arkhimédész-spirál): a menetek egyenletes távolságra vannak, így a szalag sosem metszi önmagát
      const r0 = 0.2, g = 0.17, N = 5.5, h = 0.13, cm = 0.075;   // belső sugár, menettávolság, menetek, szalagszélesség, 1 cm hossza
      const forg = -T * 0.22, dol = 0.95 + 0.1 * Math.sin(T * 0.07), cam = 3.2, sc = S * 0.6;
      const cz = Math.cos(forg), sz = Math.sin(forg), ct = Math.cos(dol), st = Math.sin(dol);
      const LX = -0.3, LY = -0.5, LZ = 0.81;
      const ny = (X, Y, Z) => { const X1 = X * cz - Y * sz, Y1 = X * sz + Y * cz, Y2 = Y1 * ct - Z * st, Z2 = Y1 * st + Z * ct, p = cam / (cam - Z2); return [W / 2 + X1 * p * sc, H / 2 + Y2 * p * sc, Z2]; };
      // a spirál menti pontok egyenletes ívhossz szerint (1 cm-enként)
      const P = []; let th = 0, s = 0, nxt = 0, n = 0;
      const thMax = 2 * Math.PI * N, dth = 0.002;
      while (th <= thMax) {
        const r = r0 + g * th / (2 * Math.PI);
        if (s >= nxt) { P.push({ th, r, n }); n++; nxt += cm; }
        s += r * dth; th += dth;
      }
      // cellák: centiméterenként egy négyszög (alsó és felső él)
      // PIRAMIS: a belső menetek időnként felemelkednek (a legkisebb a legmagasabbra), majd visszasüllyednek; a legkülső helyben marad
      const rMax = r0 + g * N, emel = 0.55 * (0.5 - 0.5 * Math.cos(T * 0.22));
      const zOf = r => emel * Math.pow(1 - (r - r0) / (rMax - r0), 1.3);
      const C = [];
      for (let i = 0; i < P.length - 1; i++) {
        const p0 = P[i], p1 = P[i + 1];
        const X0 = p0.r * Math.cos(p0.th), Y0 = p0.r * Math.sin(p0.th), X1 = p1.r * Math.cos(p1.th), Y1 = p1.r * Math.sin(p1.th);
        const z0 = zOf(p0.r), z1 = zOf(p1.r);
        const a = ny(X0, Y0, z0 - h / 2), b = ny(X1, Y1, z1 - h / 2), c = ny(X1, Y1, z1 + h / 2), d = ny(X0, Y0, z0 + h / 2);
        // a szalag normálisa (sugárirány) – a fényhez
        const th2 = (p0.th + p1.th) / 2, NX = Math.cos(th2), NY = Math.sin(th2);
        const NX1 = NX * cz - NY * sz, NY1 = NX * sz + NY * cz, NY2 = NY1 * ct, NZ2 = NY1 * st;
        const f = Math.abs(NX1 * LX + NY2 * LY + NZ2 * LZ);
        C.push({ a, b, c, d, z: (a[2] + c[2]) / 2, f, n: p0.n });
      }
      C.sort((m, q) => m.z - q.z);
      x.lineJoin = 'round';
      for (const q of C) {
        const g2 = 0.38 + 0.75 * q.f;
        x.setTransform(1, 0, 0, 1, 0, 0);
        x.fillStyle = `rgb(${Math.round(fc[0] * g2)},${Math.round(fc[1] * g2)},${Math.round(fc[2] * g2)})`;
        x.beginPath(); x.moveTo(q.a[0], q.a[1]); x.lineTo(q.b[0], q.b[1]); x.lineTo(q.c[0], q.c[1]); x.lineTo(q.d[0], q.d[1]); x.closePath(); x.fill();
        // a cella saját koordinátarendszere: bal felső sarok = d, vízszintes = d→c, függőleges = d→a (0..100 egység)
        let ox = q.d[0], oy = q.d[1], ux = q.c[0] - q.d[0], uy = q.c[1] - q.d[1], vx = q.a[0] - q.d[0], vy = q.a[1] - q.d[1];
        if (ux * vy - uy * vx < 0) { ox = q.c[0]; oy = q.c[1]; ux = -ux; uy = -uy; vx = q.b[0] - q.c[0]; vy = q.b[1] - q.c[1]; }   // hátoldal: ne tükörírás legyen
        const hossz = Math.hypot(ux, uy); if (hossz < 1.5) continue;
        x.setTransform(ux / 100, uy / 100, vx / 100, vy / 100, ox, oy);
        const sot = `rgba(0,0,0,${0.55 + 0.4 * q.f})`;
        x.fillStyle = sot;
        // jelek: cm (hosszú), fél cm (közepes), mm (rövid) – a szalag felső szélétől lefelé
        x.fillRect(-1.5, 0, 3, 46);
        x.fillRect(48.5, 0, 3, 30);
        if (hossz > 9) for (let m = 1; m < 10; m++) if (m !== 5) x.fillRect(m * 10 - 1, 0, 2, 16);
        if (hossz > 5) { x.font = '700 40px system-ui, Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.fillText(String(q.n), q.n >= 100 ? 50 : 50, 92); }
      }
      x.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
  window.Meroszalag = Meroszalag;
})();
