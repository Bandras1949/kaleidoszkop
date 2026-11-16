// SZALAG – széles, kockás szalag, amely háromkaréjos csomóban (lóhere-csomó) önmagába tekeredik, és lassan forog.
// A szalag felületét kis négyzetek borítják (mint a mintavideón); a négyzetek a szalag mentén lassan áramlanak.
// Tömör test: a takarásban lévő részek nem látszanak. Háttér mindig fekete, a négyzetek színe fehér ↔ élénk szín között vált.
// A sebesség a zenét követi (window.__zeneSeb).  © Bánky András
(function () {
  const SZINES = ['#F2C14E', '#FF6B6B', '#7CF5D2', '#FFE066', '#C8F560', '#00F0FF', '#FF2BD6', '#39FF14', '#FF7A00', '#8EA8FF'];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const hx = s => [1, 3, 5].map(i => parseInt(s.substr(i, 2), 16));

  class Szalag {
    constructor(cv) {
      this.cv = cv; this.NU = 230;
      this.t = 0; this.last = performance.now(); this.valos = 0;
      this.szin = '#FFFFFF'; this.regi = null; this.szinT = 1; this.kovSzin = 24;
      if (cv.getBoundingClientRect) this.meret();
      if (cv.nodeType) addEventListener('resize', () => this.meret());
    }
    meret() {
      const d = Math.min(2, devicePixelRatio || 1), r = this.cv.getBoundingClientRect();
      this.cv.width = Math.max(1, Math.round(r.width * d)); this.cv.height = Math.max(1, Math.round(r.height * d));
    }
    lepes() {
      const now = performance.now(), dt = Math.min(0.1, (now - this.last) / 1000); this.last = now;
      this.t += dt * (window.__zeneSeb || 1); this.valos += dt;
      if (this.valos >= this.kovSzin) { this.regi = this.szin; this.szinT = 0; this.szin = this.szin === '#FFFFFF' ? pick(SZINES) : '#FFFFFF'; this.kovSzin = this.valos + 20 + Math.random() * 15; }
      if (this.szinT < 1) this.szinT = Math.min(1, this.szinT + dt / 2.5);
    }
    // A TEST GERINCE: spirál, amely lentről-bentről kifelé és felfelé tekeredik; a menetek kissé billegnek
    kozep(u, T) {
      const n = 3.2, r = 0.32 + 1.15 * u, z = -1.1 + 1.35 * u, a = 2 * Math.PI * n * u;
      const b = 0.2 * Math.sin(2 * Math.PI * u * 1.2 + T * 0.3);   // billegés: ettől metszik egymást a menetek
      const X = r * Math.cos(a), Y = r * Math.sin(a);
      return [X, Y * Math.cos(b) - z * Math.sin(b), Y * Math.sin(b) + z * Math.cos(b)];
    }
    rajzol() {
      this.lepes();
      const x = this.cv.getContext('2d'), W = this.cv.width, H = this.cv.height, S = Math.min(W, H), Mx = Math.max(W, H);
      x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
      const k = this.szinT, A = hx(this.regi && k < 1 ? this.regi : this.szin), B = hx(this.szin);
      const fc = A.map((v, i) => v + (B[i] - v) * k);
      const T = this.t, NU = this.NU;
      const forg = T * 0.25, dol = 0.6;
      const cz = Math.cos(forg), sz = Math.sin(forg), ct = Math.cos(dol), st = Math.sin(dol);
      const cam = 2.9, sc = Mx * 0.31;
      const LX = -0.3, LY = -0.55, LZ = 0.78;
      // TÉGLALAP KERESZTMETSZET (térbeli „végtelen téglatest”): négy oldallap, mindegyik négyzetrácsos
      const sz2 = 0.21, mag = 0.21;   // közel négyzetes keresztmetszet: csavarodáskor mind a négy lap szépen előjön   // fél-szélesség (sugárirány) és fél-magasság
      const LAP = [   // [kezdő sarok (s,h), vég sarok, cellák száma, normális (s,h)]
        [[1, 1], [-1, 1], 5, [0, 1]],    // teteje
        [[1, -1], [1, 1], 5, [1, 0]],    // külső fal
        [[-1, -1], [1, -1], 5, [0, -1]], // alja
        [[-1, 1], [-1, -1], 5, [-1, 0]]  // belső fal
      ];
      const nyom = (X, Y, Z) => { const X1 = X * cz - Y * sz, Y1 = X * sz + Y * cz, Y2 = Y1 * ct - Z * st, Z2 = Y1 * st + Z * ct, p = cam / (cam - Z2); return [W / 2 + X1 * p * sc, H * 0.45 + Y2 * p * sc, Z2, X1, Y2]; };
      const fordit = (X, Y, Z) => { const X1 = X * cz - Y * sz, Y1 = X * sz + Y * cz; return [X1, Y1 * ct - Z * st, Y1 * st + Z * ct]; };
      // gerinc menti keretek
      const F = [];
      for (let i = 0; i < NU; i++) {
        const u = i / (NU - 1), e = 1e-4, c0 = this.kozep(u, T), c1 = this.kozep(Math.min(1, u + e), T), cm = this.kozep(Math.max(0, u - e), T);
        let tx = c1[0] - cm[0], ty = c1[1] - cm[1], tz = c1[2] - cm[2]; const tl = Math.hypot(tx, ty, tz); tx /= tl; ty /= tl; tz /= tl;
        // felfelé mutató irány (a függőlegesből a tengelyre merőlegesen), és sugárirány = érintő × fel
        let bx = -tz * tx, by = -tz * ty, bz = 1 - tz * tz; const bl = Math.hypot(bx, by, bz) || 1; bx /= bl; by /= bl; bz /= bl;
        const rx = ty * bz - tz * by, ry = tz * bx - tx * bz, rz = tx * by - ty * bx;
        // CSAVARODÁS: a téglatest keresztmetszete a gerinc mentén és az idővel is elfordul – ahogy a test felfelé jön, forog a saját tengelye körül,
        // így egyre több látszik a lapjaiból (mint az eredeti videón)
        const fi = 2 * Math.PI * 1.6 * u - T * 0.55, cf = Math.cos(fi), sf = Math.sin(fi);
        F.push({ c: c0, r: [rx * cf + bx * sf, ry * cf + by * sf, rz * cf + bz * sf], b: [-rx * sf + bx * cf, -ry * sf + by * cf, -rz * sf + bz * cf] });
      }
      const C = [];
      for (const [s0, s1, n, nn] of LAP) {
        for (let i = 0; i < NU - 1; i++) {
          const f0 = F[i], f1 = F[i + 1];
          // a lap normálisa a kamera felé néz? (a középpontnál nézve)
          const Nw = [f0.r[0] * nn[0] + f0.b[0] * nn[1], f0.r[1] * nn[0] + f0.b[1] * nn[1], f0.r[2] * nn[0] + f0.b[2] * nn[1]];
          const Nv = fordit(...Nw);
          for (let j = 0; j < n; j++) {
            const a0 = j / n, a1 = (j + 1) / n, pt = (f, a) => { const s = (s0[0] + (s1[0] - s0[0]) * a) * sz2, h = (s0[1] + (s1[1] - s0[1]) * a) * mag; return nyom(f.c[0] + f.r[0] * s + f.b[0] * h, f.c[1] + f.r[1] * s + f.b[1] * h, f.c[2] + f.r[2] * s + f.b[2] * h); };
            const A0 = pt(f0, a0), B0 = pt(f1, a0), C0 = pt(f1, a1), D0 = pt(f0, a1);
            const mxp = (A0[3] + C0[3]) / 2, myp = (A0[4] + C0[4]) / 2, mzp = (A0[2] + C0[2]) / 2;
            const vx = -mxp, vy = -myp, vz = cam - mzp;   // a kamera felé mutató irány
            if (Nv[0] * vx + Nv[1] * vy + Nv[2] * vz <= 0) continue;   // hátrafelé néző lap: nem látszik
            const f = Math.max(0, Nv[0] * LX + Nv[1] * LY + Nv[2] * LZ);
            C.push({ a: A0, b: B0, c: C0, d: D0, z: mzp, f, m: i / (NU - 1) });
          }
        }
      }
      C.sort((m, n) => m.z - n.z);
      x.lineJoin = 'round'; x.lineWidth = Math.max(0.8, S * 0.0012); x.strokeStyle = '#000';
      const kis = 0.7;
      for (const q of C) {
        x.fillStyle = '#000'; x.beginPath(); x.moveTo(q.a[0], q.a[1]); x.lineTo(q.b[0], q.b[1]); x.lineTo(q.c[0], q.c[1]); x.lineTo(q.d[0], q.d[1]); x.closePath(); x.fill(); x.stroke();
        const mx = (q.a[0] + q.b[0] + q.c[0] + q.d[0]) / 4, my = (q.a[1] + q.b[1] + q.c[1] + q.d[1]) / 4;
        const g = Math.min(1, (0.3 + 0.85 * q.f) * Math.max(0.15, Math.min(1, 0.25 + q.m * 1.1)));   // fény; lent-bent sötétebb
        x.fillStyle = `rgb(${Math.round(fc[0] * g)},${Math.round(fc[1] * g)},${Math.round(fc[2] * g)})`;
        x.beginPath();
        [q.a, q.b, q.c, q.d].forEach((pnt, k2) => { const X = mx + (pnt[0] - mx) * kis, Y = my + (pnt[1] - my) * kis; k2 ? x.lineTo(X, Y) : x.moveTo(X, Y); });
        x.closePath(); x.fill();
      }
    }
  }
  window.Szalag = Szalag;
})();
