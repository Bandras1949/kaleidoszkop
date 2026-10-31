(function () {
class TuziCore {
  cvRef = { current: null };
  FS = ['gömb', 'szív', '3 szív']; CS = ['szivárvány', 'arany', 'neon', 'rózsa']; fi = 0; F = 'gömb'; C = this.CS[Math.floor(Math.random() * 4)];
  BALLS = [[[210, 30, 40], [255, 215, 90]], [[40, 90, 225], [235, 235, 245]], [[230, 170, 40], [255, 245, 210]], [[200, 200, 215], [210, 40, 50]], [[30, 150, 90], [255, 215, 90]]]; bi = 0;
  fenyo() { return this.alk() === 'Fenyőág'; }
  fv = 'gömb';
  VPAL = { 'rózsa': [[255, 190, 210], [235, 80, 130], [190, 35, 85], 'rózsa'], 'lótusz': [[255, 246, 246], [250, 175, 205], [228, 105, 160], 'rózsa'], 'napsárga': [[255, 238, 130], [255, 172, 40], [238, 105, 20], 'arany'], 'lila': [[232, 205, 255], [162, 92, 232], [108, 48, 188], 'szivárvány'], 'kék': [[205, 232, 255], [92, 152, 242], [40, 88, 210], 'szivárvány'] };
  vpk = 'rózsa'; vt = 'A';
  VSH = { A: { NP: [6, 8, 10], LP: [0.6, 0.85, 1.1], W: [0.55, 0.6, 0.62], th1: [0.7, 0.45, 0.16], pt: false, cu: 1, TH: [0.3, 0.62], LAY: [2, 1, 0] }, B: { NP: [5, 9, 13], LP: [0.55, 0.82, 1.1], W: [0.5, 0.4, 0.33], th1: [0.78, 0.42, 0.08], pt: true, cu: 1.6, TH: [0.3, 0.62], LAY: [2, 1, 0] },
    C: { NP: [1, 1, 5], LP: [1, 1, 1.05], W: [1, 1, 0.6], th1: [1, 1, 0.22], pt: false, cu: 0.7, TH: [0, 0], LAY: [2], cp: 0.3, f0: 0.3 }, D: { NP: [1, 1, 3], LP: [1, 1, 1.08], W: [1, 1, 1.0], th1: [1, 1, 0.28], pt: true, cu: 0.9, TH: [0, 0], LAY: [2], cp: 0.5, f0: 0.3 },
    E: { NP: [1, 1, 7], LP: [1, 1, 1.05], W: [1, 1, 0.5], th1: [1, 1, 0.2], pt: false, cu: 0.8, TH: [0, 0], LAY: [2], cp: 0.35, f0: 0.3 }, G: { NP: [1, 1, 9], LP: [1, 1, 1.08], W: [1, 1, 0.46], th1: [1, 1, 0.16], pt: true, cu: 1.2, TH: [0, 0], LAY: [2], cp: 0.4, f0: 0.3 } };
  VORD = ['D', 'G', 'E', 'C'];
  virag() { return this.alk() === 'Virág'; }
  pickVP() { const ks = Object.keys(this.VPAL).filter(k => k !== this.vpk); this.vpk = ks[Math.floor(Math.random() * ks.length)]; this.C = this.VPAL[this.vpk][3]; }
  ALS = ['Virág', 'Gömb', 'Szív', 'Felirat', 'Csápos']; alR = null;
  alk() { const a = this.props['alakzat'] ?? 'Virág'; if (a !== 'Véletlen') return a; if (!this.alR) this.alR = this.ALS[0]; return this.alR; }
  pickAl() { this.alR = this.ALS[(this.ALS.indexOf(this.alR) + 1) % this.ALS.length]; }
  kep() { return this.alk() === 'Kép'; }
  buildKep(n) {
    const kk = this.kk || 'macska'; this.KC = this.KC || {}; if (this._kcur !== kk) { if (this._kcur) this.KC[this._kcur] = { KI: this.KI, KIok: this.KIok, KP: this.KP }; const c0 = this.KC[kk] || {}; this.KI = c0.KI; this.KIok = c0.KIok; this.KP = c0.KP; this._kcur = kk; }
    if (!this.KI) { const im = new Image(); im.onload = () => { if (this._kcur === kk) this.KIok = true; else (this.KC[kk] = this.KC[kk] || {}).KIok = true; if (this.F === 'kép' && this._kcur === kk) { const cy = this.cycle; this._kre = true; this.init(); this.cycle = cy; } }; im.src = ({ farkas: 'mintak/kep-farkas.jpg', korona: 'mintak/kep-korona.png', szem: 'mintak/kep-szem.png' })[kk] || 'mintak/kep-macska.png'; this.KI = im; }
    if (this.KIok && !this.KP && kk === 'farkas') this.KP = this.buildWolf();
    if (this.KIok && !this.KP && (kk === 'korona' || kk === 'szem')) this.KP = this.buildGlow(kk);
    const tg = this.tg, T = this.trgb = new Array(n), Q = this.ty8 = new Uint8Array(n), R = Math.random;
    if (!this.KIok) { for (let i = 0; i < n; i++) { const a = R() * 6.283, r = Math.sqrt(R()) * 0.9; tg[0][i] = Math.cos(a) * r; tg[1][i] = Math.sin(a) * r; tg[2][i] = 0; T[i] = [255, 210, 110]; Q[i] = 0; } return; }
    if (!this.KP) { const im = this.KI, W = im.naturalWidth, H = im.naturalHeight, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.drawImage(im, 0, 0); const id = g.getImageData(0, 0, W, H), d = id.data;
      const isB = k => d[k + 2] > d[k] + 50 && d[k + 2] > 110, bb = [[1e9, 1e9, -1, -1], [1e9, 1e9, -1, -1]];
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (isB((y * W + x) * 4)) { const b = bb[x < W / 2 ? 0 : 1]; if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y; }
      const inEye = (x, y) => bb.some(b => b[2] > 0 && x >= b[0] - 3 && x <= b[2] + 3 && y >= b[1] - 3 && y <= b[3] + 3);
      const eye = document.createElement('canvas'); eye.width = W; eye.height = H; const eg = eye.getContext('2d'), ed = eg.createImageData(W, H), P = [], S = H / 2.6;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const k = (y * W + x) * 4; if (inEye(x, y)) { for (let j = 0; j < 4; j++) ed.data[k + j] = d[k + j]; d[k] = d[k + 1] = d[k + 2] = 0; continue; }
        const L = d[k] * 0.3 + d[k + 1] * 0.59 + d[k + 2] * 0.11; if (L > 85 && (x + y) % 2 === 0 && y % 2 === 0) P.push([(x - W / 2) / S, (y - H / 2) / S, d[k], d[k + 1], d[k + 2]]); }
      const ramp = (D, k) => { const L = D[k] * 0.3 + D[k + 1] * 0.59 + D[k + 2] * 0.11; D[k + 3] = Math.round(D[k + 3] * Math.max(0, Math.min(1, (L - 30) / 60))); };
      for (let k = 0; k < d.length; k += 4) { ramp(d, k); if (ed.data[k + 3]) { const e = ed.data, L = e[k] * 0.3 + e[k + 1] * 0.59 + e[k + 2] * 0.11, blue = e[k + 2] > e[k] + 30; if (!blue && L < 30) e[k + 3] = 0; } }
      g.putImageData(id, 0, 0); eg.putImageData(ed, 0, 0);
      const ecy = ((bb[0][1] + bb[0][3] + bb[1][1] + bb[1][3]) / 4 - H / 2) / S;
      const ST = []; for (let q = 0; q < 1600; q++) { const p = P[Math.floor(Math.random() * P.length)], r = Math.hypot(p[0], p[1]) || 0.01, sp = 1.2 + Math.random() * 3; ST.push([p[0], p[1], p[0] / r * sp + (Math.random() - 0.5) * 0.6, p[1] / r * sp + (Math.random() - 0.5) * 0.6, p[2], p[3], p[4], Math.random() * 6.283, 0.6 + Math.random() * 1.2]); }
      this.KP = { P, body: c, eye, hw: W / S, hh: H / S, ecy, ST }; }
    const P = this.KP.P; if (this.KP.my == null) { let my = -9; for (const p of P) if (p[1] > my) my = p[1]; this.KP.my = my; } let ks = 1, oy; if (this.kk === 'szem') { const top = -(this._ym ?? 1.9) * 0.94, bot = (this._yHw ?? 1.5) - 0.06, RIu = 0.39 * this.KP.hw; ks = Math.min(1, (bot - top) / (3.0 * RIu), ((this._xm ?? 0.9) * 2 * 0.94) / (3.0 * RIu)); const fr = bot - top - 2.95 * RIu * ks; oy = top + 1.75 * RIu * ks + fr * 0.35; } else oy = Math.min(0, ((this._yHw ?? 1.5) - 0.12) - this.KP.my); this.kSc = ks; this.kOy = oy;
    for (let i = 0; i < n; i++) { const p = P[Math.floor(R() * P.length)]; tg[0][i] = p[0] * ks; tg[1][i] = p[1] * ks + oy; tg[2][i] = 0; T[i] = R() < 0.1 ? [255, 248, 225] : [p[2], p[3], p[4]]; Q[i] = 0; }
  }
  buildCsapos(n) {
    const tg = this.tg, T = this.trgb = new Array(n), Q = this.ty8 = new Uint8Array(n), R = Math.random, N = 28, PH = (1 + Math.sqrt(5)) / 2, bone = false, h0 = R() * 360;
    const nz = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }, cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const hsl = (h, S, L) => { h = ((h % 360) + 360) % 360; S /= 100; L /= 100; const k = m => (m + h / 30) % 12, a = S * Math.min(L, 1 - L), f = m => L - a * Math.max(-1, Math.min(k(m) - 3, 9 - k(m), 1)); return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]; };
    this.CT = []; this.csBone = bone;
    for (let j = 0; j < N; j++) { const y = 1 - j / (N - 1) * 2, r = Math.sqrt(1 - y * y), th = 2 * Math.PI * j / PH, d = [Math.cos(th) * r, y, Math.sin(th) * r], p = nz(cr(d, Math.abs(d[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), q = cr(d, p); this.CT.push({ d, p, q, ph: j * 0.73, fr: 0.8 + R() * 0.4, h: h0 + (y + 1) * 55 }); }
    const J = this.cpJ = new Int16Array(n), U = this.cpU = new Float32Array(n), A = this.cpA = new Float32Array(n), E = this.cpE = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const rr = i / n; tg[0][i] = 0; tg[1][i] = 0; tg[2][i] = 0; Q[i] = 14;
      if (rr < 0.16) { const y = 1 - 2 * (i + 0.5) / (n * 0.16), r = Math.sqrt(Math.max(0, 1 - y * y)), a = i * 2.39996; E[i * 3] = Math.cos(a) * r; E[i * 3 + 1] = y; E[i * 3 + 2] = Math.sin(a) * r; J[i] = -1; const sh = 0.86 + R() * 0.14; T[i] = bone ? [245, 235, 215].map(x => Math.round(x * sh)) : hsl(h0 + 30 + y * 25, 95, 30 + 14 * sh); }
      else if (rr < 0.3) { const e = nz([R() - 0.5, R() - 0.5, R() - 0.5]); E[i * 3] = e[0]; E[i * 3 + 1] = e[1]; E[i * 3 + 2] = e[2]; J[i] = i % N; U[i] = 2; A[i] = 0.25 + R() * 0.75; T[i] = bone ? [255, 250, 240] : hsl(this.CT[i % N].h + 40, 100, 78); }
      else { const j = i % N, u = Math.pow(R(), 1.25); J[i] = j; U[i] = u; A[i] = R() * 6.283; const C = this.CT[j]; T[i] = bone ? [240 - 38 * u, 228 - 40 * u, 205 - 42 * u].map(Math.round) : hsl(C.h + u * 35, 100, 52 + 16 * u); } }
  }
  csPt(i, tt, out) { const w = tt * 1.2, j = this.cpJ[i], E = this.cpE, S = 0.68;
    if (j < 0) { const pr = 0.3 * (1 + Math.sin(w * 1.5) * 0.06); out[0] = E[i * 3] * pr * (1 + Math.sin(w) * 0.03) * S; out[1] = E[i * 3 + 1] * pr * (1 + Math.cos(w * 1.2) * 0.04) * S; out[2] = E[i * 3 + 2] * pr * S; return; }
    const C = this.CT[j], bud = this.cpU[i] > 1.5, u = bud ? 1 : this.cpU[i], dist = 0.26 + u * 1.38, off = Math.sin(w * C.fr * 2 + u * 5 + C.ph) * 0.2 * Math.pow(u, 1.5);
    let x = C.d[0] * dist + C.p[0] * off, y = C.d[1] * dist + C.p[1] * off, z = C.d[2] * dist + C.p[2] * off;
    if (bud) { const rb = Math.cbrt(this.cpA[i] || 1); x += E[i * 3] * 0.06 * rb; y += E[i * 3 + 1] * 0.09 * rb; z += E[i * 3 + 2] * 0.06 * rb; }
    else { const th = 0.074 + (0.006 - 0.074) * u, ca = Math.cos(this.cpA[i]) * th, sa = Math.sin(this.cpA[i]) * th; x += C.p[0] * ca + C.q[0] * sa; y += C.p[1] * ca + C.q[1] * sa; z += C.p[2] * ca + C.q[2] * sa; }
    out[0] = x * S; out[1] = y * S; out[2] = z * S; }
  buildWolf() { const im = this.KI, W = im.naturalWidth, H = im.naturalHeight, sc = W / 1024, S = H / 2.6, mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
    const poly = [[212,455],[218,398],[242,398],[252,432],[300,427],[360,419],[405,417],[428,430],[456,446],[466,480],[446,515],[400,528],[330,523],[260,511],[222,501]], path = g => { g.beginPath(); poly.forEach(([x, y], q) => q ? g.lineTo(x * sc, y * sc) : g.moveTo(x * sc, y * sc)); g.closePath(); };
    const eb = [518, 255, 578, 300].map(v => v * sc), body = mk(), jaw = mk(), eye = mk(), g = body.getContext('2d'), jg = jaw.getContext('2d'), eg = eye.getContext('2d');
    g.drawImage(im, 0, 0); jg.save(); path(jg); jg.clip(); jg.drawImage(im, 0, 0); jg.restore(); eg.drawImage(im, eb[0], eb[1], eb[2] - eb[0], eb[3] - eb[1], eb[0], eb[1], eb[2] - eb[0], eb[3] - eb[1]);
    const ed = k => { const q = k >> 2, x = q % W, y = (q / W) | 0; return Math.max(0, Math.min(1, (W - x) / (0.16 * W))) * Math.max(0, Math.min(1, (H - y) / (0.16 * H))); }, wm = (D, k) => Math.max(0, Math.min(1, (D[k] - D[k + 2] + 5) / 40)), al = (D, k) => { const L = D[k] * 0.3 + D[k + 1] * 0.59 + D[k + 2] * 0.11, a = Math.max(0, Math.min(1, (L - 55) / 70)) * wm(D, k) * ed(k); D[k + 3] = Math.round(D[k + 3] * a); };
    const id = g.getImageData(0, 0, W, H), d = id.data, P = [];
    for (let y = 0; y < H; y += 2) for (let x = (y / 2) % 2; x < W; x += 2) { const k = (y * W + x) * 4, L = d[k] * 0.3 + d[k + 1] * 0.59 + d[k + 2] * 0.11; if (L > 85 && d[k] > d[k + 2] + 20 && Math.random() < ed(k)) P.push([(x - W / 2) / S, (y - H / 2) / S, d[k], d[k + 1], d[k + 2]]); }
    for (let k = 0; k < d.length; k += 4) al(d, k); g.putImageData(id, 0, 0);
    [jaw, eye].forEach((c, ci) => { const x = c.getContext('2d'), q = x.getImageData(0, 0, W, H), D = q.data; for (let k = 0; k < D.length; k += 4) if (D[k + 3]) { if (ci) al(D, k); else D[k + 3] = Math.round(D[k + 3] * wm(D, k)); } x.putImageData(q, 0, 0); });
   
    const ST = []; for (let q = 0; q < 1600; q++) { const p = P[Math.floor(Math.random() * P.length)], r = Math.hypot(p[0], p[1]) || 0.01, sp = 1.2 + Math.random() * 3; ST.push([p[0], p[1], p[0] / r * sp + (Math.random() - 0.5) * 0.6, p[1] / r * sp + (Math.random() - 0.5) * 0.6, p[2], p[3], p[4], Math.random() * 6.283, 0.6 + Math.random() * 1.2]); }
    return { P, body, jaw, eye, wolf: true, hw: W / S, hh: H / S, hx: (458 * sc - W / 2) / S, hy: (470 * sc - H / 2) / S, ecy: 0, ST }; }
  buildGlow(kk) { const im = this.KI, W = im.naturalWidth, H = im.naturalHeight, S = H / 2.6, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const id = g.getImageData(0, 0, W, H), d = id.data, P = [], Lm = k => d[k] * 0.3 + d[k + 1] * 0.59 + d[k + 2] * 0.11;
    for (let y = 0; y < H; y += 2) for (let x = (y / 2) % 2; x < W; x += 2) { const k = (y * W + x) * 4; if (Lm(k) > 80) P.push([(x - W / 2) / S, (y - H / 2) / S, d[k], d[k + 1], d[k + 2]]); }
    const JW = []; if (kk === 'korona') { const y0 = Math.round(H * 0.68), y1 = Math.round(H * 0.78), cols = new Float32Array(W); for (let y = y0; y < y1; y++) for (let x = 0; x < W; x++) { const k = (y * W + x) * 4; if (Lm(k) > 235) cols[x]++; }
      let inb = false, a = 0, sx = 0, sw = 0; for (let x = 0; x < W; x++) { const v = cols[x] > 6; if (v && !inb) { inb = true; a = x; sx = 0; sw = 0; } if (v) { sx += x * cols[x]; sw += cols[x]; } if (!v && inb) { inb = false; if (x - a > 8) { let sy = 0, sn = 0; for (let y = y0; y < y1; y++) for (let xx = a; xx < x; xx++) { const k = (y * W + xx) * 4; if (Lm(k) > 235) { sy += y; sn++; } } JW.push([sx / sw, sn ? sy / sn : (y0 + y1) / 2, (x - a) / 2]); } } } }
    for (let k = 0; k < d.length; k += 4) { const L = Lm(k), bl = d[k + 2] > d[k] + 12, a = Math.max(0, Math.min(1, (L - (bl && kk === 'szem' ? 8 : 22)) / (bl && kk === 'szem' ? 40 : 70))); d[k + 3] = Math.round(d[k + 3] * a); } g.putImageData(id, 0, 0);
    const ST = []; for (let q = 0; q < 1600; q++) { const p = P[Math.floor(Math.random() * P.length)], r = Math.hypot(p[0], p[1]) || 0.01, sp = 1.2 + Math.random() * 3; ST.push([p[0], p[1], p[0] / r * sp + (Math.random() - 0.5) * 0.6, p[1] / r * sp + (Math.random() - 0.5) * 0.6, p[2], p[3], p[4], Math.random() * 6.283, 0.6 + Math.random() * 1.2]); }
    return { P, body: c, eye: null, glow: kk, JW: JW.map(([x, y, r]) => [(x - W / 2) / S, (y - H / 2) / S, r / S]), pr: (W * 0.105) / S, hw: W / S, hh: H / S, ecy: 0, ST }; }
  felirat() { return this.alk() === 'Felirat'; }
  buildFelirat(n) {
    const txt = String(this.props['felirat'] ?? 'KALEIDOSZKÓP') || 'KALEIDOSZKÓP', FN = '"DM Sans"';
    if (!this.FTok && document.fonts && !this.FTwait) { this.FTwait = true; document.fonts.load('600 200px ' + FN).then(() => { this.FTok = true; this.FTP = null; if (this.F === 'felirat') { const cy = this.cycle; this.init(); this.cycle = cy; } }).catch(() => {}); }
    if (!this.FTP || this.FTk !== txt) { const c = document.createElement('canvas'), W = 1800, H = 520; c.width = W; c.height = H; const g = c.getContext('2d');
      let fs = 300; g.font = '600 ' + fs + 'px ' + (this.FTok ? FN : 'sans-serif'); const mw = g.measureText(txt).width; if (mw > W * 0.92) { fs = fs * W * 0.92 / mw; g.font = '600 ' + fs + 'px ' + (this.FTok ? FN : 'sans-serif'); }
      g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, W / 2, H * 0.52);
      const d = g.getImageData(0, 0, W, H).data, PX = W / 2 / 1.32, P = [], ED = [], op = (x, y) => x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] > 120;
      for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (op(x, y)) { P.push([(x - W / 2) / PX, (y - H / 2) / PX]); if (!op(x - 4, y) || !op(x + 4, y) || !op(x, y - 4) || !op(x, y + 4)) ED.push(P.length - 1); }
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const p of P) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
      const sc = 5.0 / Math.max(0.01, x1 - x0), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2; for (const p of P) { p[0] = (p[0] - cx) * sc; p[1] = (p[1] - cy) * sc; }
      this.FTS = { txt, ax: -cx * sc, ay: ((H * 0.52 - H / 2) / PX - cy) * sc, fsW: fs / PX * sc, font: this.FTok ? FN : 'sans-serif' };
      this.FTP = P; this.FTE = ED; this.FTk = txt; }
    const P = this.FTP, ED = this.FTE, tg = this.tg, T = this.trgb = new Array(n), Q = this.ty8 = new Uint8Array(n), R = Math.random;
    const GOLD = [[255, 214, 110], [245, 185, 60], [255, 236, 170], [225, 160, 45]];
    for (let i = 0; i < n; i++) { const e = R() < 0.4 && ED.length, p = e ? P[ED[Math.floor(R() * ED.length)]] : P[Math.floor(R() * P.length)];
      tg[0][i] = p[0]; tg[1][i] = p[1]; tg[2][i] = (R() - 0.5) * 0.03; T[i] = R() < 0.12 ? [255, 250, 235] : GOLD[i % 4]; Q[i] = 0; }
  }
  logo() { return this.alk() === 'Logó'; }
  applyAlak() { if (this.alk() === 'Csápos') { this.F = 'csápos'; this.C = 'arany'; return; } if (this.kep()) { this.F = 'kép'; this.C = 'arany'; return; } if (this.felirat()) { this.F = 'felirat'; this.C = 'arany'; return; } if (this.virag()) { this.F = 'virág'; this.vt = 'D'; this.pickVP(); return; } if (this.logo()) { this.F = 'logó'; this.C = 'arany'; return; } if (this.fenyo()) { this.F = 'fenyő'; this.fv = Math.random() < 0.5 ? 'gömb' : 'cukor'; } else { const al = this.alk(); this.FS = al === 'Szív' ? ['szív', '3 szív'] : al === 'Gömb' ? ['gömb'] : ['gömb', 'szív', '3 szív']; this.fi = 0; this.F = this.FS[0]; } }
  nextLook() { if (this.felirat() || this.kep() || this.F === 'csápos') return; if (this.virag()) { this.vt = this.VORD[(this.VORD.indexOf(this.vt) + 1) % 4]; this.pickVP(); return; } if (this.logo()) return; if (this.fenyo()) { this.bi = (this.bi + 1 + Math.floor(Math.random() * (this.BALLS.length - 1))) % this.BALLS.length; this.fv = Math.random() < 0.5 ? 'gömb' : 'cukor'; return; } this.fi = (this.fi + 1) % this.FS.length; this.F = this.FS[this.fi]; const o = this.CS.filter(c => c !== this.C); this.C = o[Math.floor(Math.random() * o.length)]; }
  componentDidMount() { this.t0 = performance.now(); this.last = this.t0; this.applyAlak(); this.init(); this.raf = requestAnimationFrame(this.loop); }
  componentWillUnmount() { cancelAnimationFrame(this.raf); }
  componentDidUpdate(pp) { if (pp['mód'] !== this.props['mód']) this.rf = undefined; if (pp['pontszám'] !== this.props['pontszám'] || pp['mód'] !== this.props['mód'] || pp['alakzat'] !== this.props['alakzat'] || pp['felirat'] !== this.props['felirat'] || pp['robbanásStílus'] !== this.props['robbanásStílus'] || pp['rakéták'] !== this.props['rakéták'] || pp['csápSzín'] !== this.props['csápSzín'] || pp['kép'] !== this.props['kép']) { this.applyAlak(); this.init(); this.t0 = performance.now(); this.cs = 0; } }
  init() {
    this.pickEx();
    const n0 = Math.max(200, Math.min(2500, +(this.props['pontszám'] ?? 900))), n1 = this.F === 'logó' ? Math.max(n0, 7500) : this.F === 'virág' ? Math.max(n0, 8000) : this.F === 'felirat' ? Math.max(n0, 9000) : this.F === 'kép' ? Math.max(n0, 7000) : this.F === 'csápos' ? Math.max(n0, 5200) : n0; const n = this.exS === 'pálma' ? Math.max(n1, 7000) : this.exS === 'virágfénygömb' ? Math.max(n1, 3600) : n1;
    const A = k => new Float32Array(n);
    this.n = n; this.p = [A(), A(), A()]; this.v = [A(), A(), A()]; this.s = [A(), A(), A()]; this.tg = [A(), A(), A()]; this.hue = A();
    const ga = Math.PI * (3 - Math.sqrt(5));
    const FM = this.F, three = FM === '3 szív'; this.ox = A(); this.hj = new Uint8Array(n); this.rgb0 = null; this.trgb = null; this.ty8 = null;
    if (!this.HP) { const P = new Path2D(); for (let q = 0; q <= 24; q++) { const u = q / 24 * Math.PI * 2; P[q ? 'lineTo' : 'moveTo'](16 * Math.pow(Math.sin(u), 3) / 17, (-2.5 - (13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u))) / 17); } P.closePath(); this.HP = P; }
    if (FM === 'fenyő') this.buildFenyo(n);
    else if (FM === 'logó') this.buildLogo(n);
    else if (FM === 'virág') this.buildVirag(n);
    else if (FM === 'felirat') this.buildFelirat(n);
    else if (FM === 'kép') this.buildKep(n);
    else if (FM === 'csápos') this.buildCsapos(n);
    else if (FM !== 'gömb') {
      const hx = u => 16 * Math.pow(Math.sin(u), 3) / 15, hy = u => (-2.5 - (13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u))) / 15;
      for (let i = 0; i < n; i++) { const u = Math.random() * Math.PI * 2, rim = i % 10 < 3, s = rim ? 1 : Math.sqrt(Math.random()), d = rim ? (Math.random() * 2 - 1) * 0.12 : (Math.random() < 0.5 ? -1 : 1) * 0.36 * Math.sqrt(1 - s * s);
        const j = three ? i % 3 : 1, sc = three ? 0.42 : 1, ox = three ? (j - 1) * 0.95 : 0; this.hj[i] = j; this.ox[i] = ox;
        this.tg[0][i] = hx(u) * s * sc + ox; this.tg[1][i] = hy(u) * s * sc; this.tg[2][i] = d * sc; }
    } else for (let i = 0; i < n; i++) { const y = 1 - 2 * (i + 0.5) / n, r = Math.sqrt(1 - y * y), a = i * ga; this.tg[0][i] = Math.cos(a) * r; this.tg[1][i] = y; this.tg[2][i] = Math.sin(a) * r; }
    this.exploded = false; this.conv0 = false; this.cycle = 1; this.conf = null; this._fyB = -9; this._fyT = 9; this._fS = null;
  }
  buildVirag(n) {
    const tg = this.tg, T = this.trgb = new Array(n), Q = this.ty8 = new Uint8Array(n), VP = this.vp = new Float32Array(n * 4), R = Math.random, [ci, co, ct] = this.VPAL[this.vpk];
    const NP = this.VSH[this.vt].NP, lerp = (a, b, k) => a.map((v, j) => Math.round(v + (b[j] - v) * k));
    for (let i = 0; i < n; i++) { const r = i / n;
      if (r < 0.08) { const a = R() * 6.283, rr = Math.sqrt(R()) * 0.09; VP[i * 4] = -1; VP[i * 4 + 1] = a; VP[i * 4 + 2] = rr; VP[i * 4 + 3] = R(); T[i] = R() < 0.5 ? [255, 205, 60] : [255, 240, 160]; Q[i] = 13; }
      else { const TH = this.VSH[this.vt].TH, L = r < TH[0] ? 0 : r < TH[1] ? 1 : 2, j = Math.floor(R() * NP[L]), al = (j + (L % 2) * 0.5) / NP[L] * 6.283, rim = R() < 0.5, cap = rim && R() < 0.24, u = cap ? 0.9 + Math.sqrt(R()) * 0.1 : rim ? Math.pow(R(), 0.6) : Math.pow(R(), 0.75), v = cap ? (R() < 0.5 ? -1 : 1) * (0.9 + R() * 0.1) : rim ? (R() < 0.5 ? -1 : 1) * (0.88 + R() * 0.12) : (R() * 2 - 1) * Math.sqrt(R()) * 0.85;
        VP[i * 4] = L; VP[i * 4 + 1] = al; VP[i * 4 + 2] = u; VP[i * 4 + 3] = v;
        const c0 = lerp(ci, co, L / 2), c = lerp(c0, ct, Math.pow(u, 1.5) * 0.55), sh = (0.62 + 0.38 * u) * (1.08 - Math.abs(v) * 0.32) * (j % 2 ? 0.88 : 1.06); T[i] = c.map(x => Math.min(255, Math.round(x * sh))); Q[i] = 12; }
      tg[0][i] = 0; tg[1][i] = 0.2; tg[2][i] = 0; }
  }
  viragPt(i, open, tt, out) { const VP = this.vp, L = VP[i * 4], u = VP[i * 4 + 2]; let v = VP[i * 4 + 3]; const lk = this._lnk || 0;
    if (lk > 0 && L >= 0 && u < 0.96) { let m = Math.min(1, lk / 0.6); m = m * m * (3 - 2 * m); let tv; if (Math.abs(v) >= 0.88) tv = Math.sign(v); else { const sn = Math.sin(Math.PI * u) * 1.1; tv = 0; let bd = Math.abs(v); for (const v0 of [-0.75, -0.45, 0.45, 0.75]) { const c = v0 * sn, d = Math.abs(v - c); if (d < bd) { bd = d; tv = c; } } } v += (tv - v) * m; }
    this.vpAt(L, VP[i * 4 + 1], u, v, open, tt, out); }
  vpAt(L, a, u, v, open, tt, out) {
    const Y0 = 0.1;
    if (L < 0) { const rr = u * 1.4, hh = 0.09 * (1 - u / 0.09) + 0.02 * Math.sin(tt * 3 + v * 20); out[0] = Math.cos(a) * rr; out[1] = Y0 - 0.06 - hh; out[2] = Math.sin(a) * rr; return; }
    const VS = this.VSH[this.vt], LP = VS.LP[L], W = VS.W[L], th0 = 1.45, th1 = VS.th1[L], th = th0 - (th0 - th1) * open, curl = -0.55 * open * (0.4 + L * 0.3) * VS.cu;
    const ph = th + curl * u * 0.5, r0 = 0.05 + L * 0.03, rho = r0 + LP * u * Math.cos(ph), y = -LP * u * Math.sin(ph), w = (VS.pt ? Math.pow(Math.sin(Math.PI * Math.min(1, u * 0.97 + 0.03)), 0.7) : Math.sqrt(Math.sin(Math.PI * Math.min(1, u * 0.96 + 0.04)))) * W * LP * 0.68 * (0.35 + 0.65 * open), lat = v * w;
    const cup = v * v * w * 0.5 * (1 - u * 0.5) * (VS.cp ?? 1), rr2 = rho - cup * Math.cos(th) * 0.3;
    out[0] = rr2 * Math.cos(a) - lat * Math.sin(a); out[1] = Y0 + y - cup * Math.sin(th) * 0.6; out[2] = rr2 * Math.sin(a) + lat * Math.cos(a);
  }
  buildLogo(n) {
    if (!this.LI) { const im = new Image(); im.onload = () => { this.LIok = true; if (this.F === 'logó') { const cy = this.cycle; this.init(); this.cycle = cy; } }; im.src = 'brand/logo-nyitokep.png'; this.LI = im; }
    if (!this.LIok) return this.buildLogoGeo(n);
    if (!this.LP) { const im = this.LI, W = im.naturalWidth, H = im.naturalHeight, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, W, H).data, PX = W / 2 / 1.34, P = [], IN = [], TX = [], ED = [], BD = [];
      const op = (x, y) => x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] > 100;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const k = (y * W + x) * 4; if (d[k + 3] > 200) { const ux = (x - W / 2) / PX, uy = (y - H / 2) / PX, rr = Math.hypot(ux, uy); P.push([ux, uy, d[k], d[k + 1], d[k + 2]]); const id = P.length - 1;
        if (rr < 0.62) IN.push(id); if (rr > 0.95 && rr < 1.24) TX.push(id); else { BD.push(id); if (!op(x - 2, y) || !op(x + 2, y) || !op(x, y - 2) || !op(x, y + 2)) ED.push(id); } } }
      this.LP = P; this.LPin = IN; this.LPtx = TX; this.LPed = ED; this.LPbd = BD; }
    const P = this.LP, IN = this.LPin, tg = this.tg, T = this.trgb = new Array(n), Q = this.ty8 = new Uint8Array(n), AL = this.al = [new Float32Array(n), new Float32Array(n), new Float32Array(n)], R = Math.random;
    const TX = this.LPtx, ED = this.LPed, BD = this.LPbd, pk = L => P[L[Math.floor(R() * L.length)]];
    for (let i = 0; i < n; i++) { const r0 = R(), p = r0 < 0.34 ? pk(TX) : r0 < 0.6 ? pk(ED) : pk(BD), rr = Math.hypot(p[0], p[1]); tg[0][i] = p[0]; tg[1][i] = p[1]; tg[2][i] = 0; T[i] = [p[2], p[3], p[4]];
      if (rr > 0.95 && rr < 1.24) { Q[i] = 8; const a = P[IN[Math.floor(R() * IN.length)]]; AL[0][i] = a[0]; AL[1][i] = a[1]; AL[2][i] = 0; } else Q[i] = 11; }
  }
  buildLogoGeo(n) {
    const tg = this.tg, T = this.trgb = new Array(n), Q = this.ty8 = new Uint8Array(n), FC = this.fc = new Uint8Array(n), AL = this.al = [new Float32Array(n), new Float32Array(n), new Float32Array(n)], R = Math.random, S = 0.72;
    const V = k => { const a = -Math.PI / 2 + k * Math.PI / 4; return [Math.cos(a) * S, Math.sin(a) * S, 0]; }, Wv = k => { const a = -Math.PI / 2 + k * Math.PI / 4; return [Math.cos(a) * S * 0.49, Math.sin(a) * S * 0.49, -0.16 * S]; };
    const F = []; for (let k = 0; k < 8; k++) F.push([V(k), V(k + 1), Wv(k)], [V(k + 1), Wv(k + 1), Wv(k)]);
    this.FN = F.map(([a, b, c]) => { const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]; let x = u[1] * v[2] - u[2] * v[1], y = u[2] * v[0] - u[0] * v[2], z = u[0] * v[1] - u[1] * v[0]; const l = Math.hypot(x, y, z) || 1; x /= l; y /= l; z /= l; if (z > 0) { x = -x; y = -y; z = -z; } return [x, y, z]; });
    const AR = F.map(([a, b, c]) => Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2), TA = AR.reduce((s, v) => s + v, 0);
    const pf = () => { let r = R() * TA, f = 0; while (f < 15 && r > AR[f]) { r -= AR[f]; f++; } let u = R(), v = R(); if (u + v > 1) { u = 1 - u; v = 1 - v; } if (R() < 0.3) { const e = Math.floor(R() * 3), s = R(); if (e === 0) { u = s; v = 0; } else if (e === 1) { u = 0; v = s; } else { u = 1 - s; v = s; } }
      const [a, b, c] = F[f], w = 1 - u - v, cx = (a[0] + b[0] + c[0]) / 3, cy = (a[1] + b[1] + c[1]) / 3, cz = (a[2] + b[2] + c[2]) / 3, sh = 0.82;
      return [f, cx + (a[0] * w + b[0] * u + c[0] * v - cx) * sh, cy + (a[1] * w + b[1] * u + c[1] * v - cy) * sh, cz + (a[2] * w + b[2] * u + c[2] * v - cz) * sh]; };
    const LIGHT = [242, 214, 148], DARK = [168, 124, 52];
    const cv = document.createElement('canvas'), PX = 260, SZ = 1024; cv.width = cv.height = SZ; const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 62px Georgia, "Times New Roman", serif';
    const word = 'BRILLIDEA', rT = 1.12 * PX; for (let k = 0; k < word.length; k++) { const an = (-152 + k * (124 / (word.length - 1))) * Math.PI / 180; g.save(); g.translate(SZ / 2 + Math.cos(an) * rT, SZ / 2 + Math.sin(an) * rT); g.rotate(an + Math.PI / 2); g.fillText(word[k], 0, 0); g.restore(); }
    for (const an of [0, Math.PI]) { const x0 = SZ / 2 + Math.cos(an) * rT, y0 = SZ / 2; g.beginPath(); g.moveTo(x0 - 18, y0 - 6); g.lineTo(x0 - 10, y0 - 13); g.lineTo(x0 + 10, y0 - 13); g.lineTo(x0 + 18, y0 - 6); g.lineTo(x0, y0 + 16); g.closePath(); g.fill(); }
    const id = g.getImageData(0, 0, SZ, SZ).data, TP = []; for (let y = 0; y < SZ; y += 2) for (let x = 0; x < SZ; x += 2) if (id[(y * SZ + x) * 4 + 3] > 128) TP.push([(x - SZ / 2) / PX, (y - SZ / 2) / PX]);
    for (let i = 0; i < n; i++) { const r = i / n; let x, y, z, c, q = 9;
      if (r < 0.56) { const [fi, a, b, cz] = pf(); x = a; y = b; z = cz; FC[i] = fi; c = (fi % 4 === 0 || fi % 4 === 3) ? LIGHT : DARK; }
      else if (r < 0.86) { const p = TP[Math.floor(R() * TP.length)] || [0, -1.2]; x = p[0]; y = p[1]; z = 0; c = [226, 190, 112]; q = 8; const [, a, b, cz] = pf(); AL[0][i] = a; AL[1][i] = b; AL[2][i] = cz; }
      else { const outer = r < 0.94, rad = (outer ? 1.3 : 0.94) + (R() - 0.5) * (outer ? 0.016 : 0.008), an = R() * 6.283; x = Math.cos(an) * rad; y = Math.sin(an) * rad; z = 0; c = DARK; q = 10; }
      tg[0][i] = x; tg[1][i] = y; tg[2][i] = z; T[i] = c; Q[i] = q; }
  }
  buildFenyo(n) {
    const tg = this.tg, T = this.trgb = new Array(n), Q = this.ty8 = new Uint8Array(n), sd = this.sd = new Float32Array(n), CC = this.cc = new Float32Array(n), R = Math.random, cuk = this.fv === 'cukor';
    const P0 = [-1.35, -0.12], P1 = [0.05, 0.22], P2 = [1.3, -0.28], B = t => [(1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0], (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1]];
    const D = t => { const a = B(Math.max(0, t - 0.01)), b = B(Math.min(1, t + 0.01)), l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
    const S = B(0.56), BC = this.BC = [S[0], S[1] + 0.78, 0], BR = 0.3, K = cuk ? B(0.26) : B(0.19), TIP = cuk ? [K[0] + 0.16, K[1] - 0.72] : [K[0] + 0.24, K[1] - 0.66], [bc, sc] = this.BALLS[this.bi];
    const GB = [0.49, 0.83].map((t, k) => { const p = B(t), r = k ? 0.21 : 0.27, L = k ? 0.3 : 0.5; return { p, c: [p[0], p[1] + L + r + 0.07, 0], r, col: this.BALLS[(this.bi + k * 2) % this.BALLS.length] }; });
    const G = [[30, 150, 60], [60, 195, 90], [20, 115, 50], [95, 210, 120]];
    const FOIL = [[235, 190, 60], [215, 35, 50], [205, 205, 222], [40, 165, 85], [55, 105, 225], [155, 65, 195]].sort(() => R() - 0.5);
    const CN = [0.4, 0.53, 0.66, 0.78].map((t, k) => { const p = B(t), L = 0.22 + ((k * 0.37 + R() * 0.3) % 1) * 0.28; return { p, cy: p[1] + L + 0.2, col: FOIL[k] }; });
    const BL = this.BL = cuk ? [0.08, 0.27, 0.47, 0.72, 0.94].map((t, k) => { const p = B(t); return { x: p[0], by: p[1], fy: p[1] - 0.1, ph: k }; }) : null, BK = this.bk = new Uint8Array(n);
    const cut = cuk ? [0.5, 0.54, 0.8, 0.86] : null;
    for (let i = 0; i < n; i++) { const r = i / n; let x, y, z, c, q;
      if (r < 0.08) { const t = R(), p = B(t); x = p[0]; y = p[1] + (R() - 0.5) * 0.04; z = (R() - 0.5) * 0.05; c = [120, 78, 45]; q = 0; }
      else if (r < 0.5) { const t = 0.03 + R() * 0.97, p = B(t), [dx, dy] = D(t), nx = -dy, ny = dx, side = R() < 0.5 ? -1 : 1, ph = (R() - 0.5) * 2.2, len = 0.24 * (1 - 0.45 * t) * (0.75 + R() * 0.4), u = R();
        const ex = dx * 0.55 + nx * side * Math.cos(ph) * 0.84, ey = dy * 0.55 + ny * side * Math.cos(ph) * 0.84, ez = Math.sin(ph) * 0.84;
        x = p[0] + ex * len * u; y = p[1] + ey * len * u; z = ez * len * u; c = G[i % 4]; q = 1; }
      else if (cuk) {
        if (r < cut[1]) { const C = CN[i % 4], u = R(); x = C.p[0]; y = C.p[1] + u * (C.cy - 0.2 - C.p[1]); z = 0; c = [225, 205, 150]; q = 2; }
        else if (r < cut[2]) { const C = CN[i % 4], part = R(), a = R() * 6.283; let yy, rr;
          if (part < 0.66) { yy = (R() * 2 - 1) * 0.15; rr = 0.075 * (1 - Math.pow(Math.abs(yy) / 0.16, 4) * 0.4); }
          else if (part < 0.74) { yy = (R() < 0.5 ? -1 : 1) * (0.15 + R() * 0.025); rr = 0.022; }
          else { const sg = R() < 0.5 ? -1 : 1, u = R(); yy = sg * (0.175 + u * 0.085); rr = 0.022 + u * 0.06 + Math.sin(a * 6) * 0.01 * u; }
          x = C.p[0] + Math.cos(a) * rr; y = C.cy + yy; z = Math.sin(a) * rr; CC[i] = C.p[0];
          const sh = Math.sin(a * 3 + yy * 30) > 0.55; c = sh ? C.col.map(v => Math.min(255, v + 55)) : C.col; q = 7; }
        else if (r < cut[3]) { const L = BL[i % 5], a = R() * 6.283, u = R(), rr = u > 0.8 ? 0.034 : 0.028; x = L.x + Math.cos(a) * rr; y = L.by - u * 0.1; z = Math.sin(a) * rr; c = u > 0.8 ? [40, 130, 60] : [28, 105, 50]; q = 4; }
        else { const k = i % 5, L = BL[k], u = R(), w = 0.052 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.12 + u * 0.98)), 0.7) * (1 - u * 0.35), a = R() * 6.283, rr = w * (R() < 0.6 ? 1 : Math.sqrt(R()));
          x = L.x + Math.cos(a) * rr; y = L.fy - u * 0.16; z = Math.sin(a) * rr; c = [255, 220, 160]; q = 6; BK[i] = k; }
      }
      else if (r < 0.53) { const Gb = GB[i % 2], u = R(); x = Gb.p[0]; y = Gb.p[1] + u * (Gb.c[1] - Gb.r - 0.07 - Gb.p[1]); z = 0; c = [225, 205, 150]; q = 2; }
      else if (r < 0.55) { const Gb = GB[i % 2], a = R() * 6.283, cr = Gb.r * 0.2; x = Gb.c[0] + Math.cos(a) * cr; y = Gb.c[1] - Gb.r - R() * 0.07; z = Math.sin(a) * cr; c = [235, 185, 70]; q = 2; }
      else if (r < 0.84) { const u = (i - 0.55 * n) / (0.29 * n), bi2 = u < 0.6 ? 0 : 1, Gb = GB[bi2], k = bi2 ? (u - 0.6) / 0.4 : u / 0.6, yy = 1 - 2 * k, rr = Math.sqrt(Math.max(0, 1 - yy * yy)), a = i * 2.39996;
        x = Gb.c[0] + Math.cos(a) * rr * Gb.r; y = Gb.c[1] + yy * Gb.r; z = Math.sin(a) * rr * Gb.r; CC[i] = Gb.c[0];
        const lon = Math.atan2(z, x - Gb.c[0]); c = Math.sin(lon * 6) > 0.75 || Math.abs(yy) < 0.06 ? Gb.col[1] : Gb.col[0]; q = 3; }
      else if (r < 0.88) { const u = R(); x = K[0] + (TIP[0] - K[0]) * u; y = K[1] + (TIP[1] - K[1]) * u; z = 0; c = [165, 165, 175]; q = 4; }
      else { x = TIP[0]; y = TIP[1]; z = 0; c = R() < 0.5 ? [255, 225, 140] : [255, 250, 235]; q = 5; }
      tg[0][i] = x; tg[1][i] = y; tg[2][i] = z; T[i] = c; Q[i] = q; sd[i] = R(); }
  }
  pal() {
    const c = this.C;
    if (c === 'arany') return () => 38 + Math.random() * 14;
    if (c === 'neon') { const H = [300, 180, 95, 50]; return () => H[Math.floor(Math.random() * H.length)]; }
    if (c === 'rózsa') return () => (335 + Math.random() * 40) % 360;
    return () => Math.random() * 360;
  }
  holoHue(ty, t, i) {
    const c = this.C;
    if (c === 'arany') return 40 + ty * 8 + Math.sin(t * 0.8 + i) * 4;
    if (c === 'neon') return (i % 2 ? 300 : 180) + ty * 20;
    if (c === 'rózsa') return (348 + ty * 14 + Math.sin(t * 0.9 + i * 0.3) * 8 + 360) % 360;
    return (200 + ty * 90 + t * 35) % 360;
  }
  colAt(i, cf, tt, al) {
    if (this.trgb) { const T = this.trgb[i]; let S = (this.rgb0 && this.rgb0[i]) || T; if (this._csOn && this.exR2) { const c2 = this.exR2[i % this.exR2.length].rgb, a = this.exIn && this.exIn[i] ? 0 : this._csS, b = this._csF; S = S.map((v, k) => { const u = v + (c2[k] - v) * a; return u + (255 - u) * b; }); } return 'rgba(' + Math.round(S[0] + (T[0] - S[0]) * cf) + ',' + Math.round(S[1] + (T[1] - S[1]) * cf) + ',' + Math.round(S[2] + (T[2] - S[2]) * cf) + ',' + al + ')'; }
    if ((this.F) === '3 szív') { const T = [[230, 30, 45], [250, 250, 250], [25, 170, 75]][this.hj[i]], S = (this.rgb0 && this.rgb0[i]) || T;
      return 'rgba(' + Math.round(S[0] + (T[0] - S[0]) * cf) + ',' + Math.round(S[1] + (T[1] - S[1]) * cf) + ',' + Math.round(S[2] + (T[2] - S[2]) * cf) + ',' + al + ')'; }
    const hh = this.hue[i] + (this.holoHue(this.tg[1][i], tt, i) - this.hue[i]) * cf; return 'hsla(' + hh + ',100%,68%,' + al + ')';
  }
  EXS = ['krizantém', 'bazsarózsa', 'gyűrű', 'virágfej', 'pálma', 'virágfénygömb', 'sípolófűz']; KEPS = { 'macska': ['gyűrű', 'bazsarózsa'], 'farkas': ['bazsarózsa', 'krizantém'], 'korona': ['bazsarózsa', 'gyűrű'], 'szem': ['gyűrű', 'krizantém'] }; KORD = ['macska', 'farkas', 'korona', 'szem'];
  loadPalm() { if (this.PALMI) return; const im = new Image(); im.onload = () => { const W = im.naturalWidth, H = im.naturalHeight, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, W, H).data, P = [], S = H / 2.5, ox = W * 0.5, oy = H * 0.405;
      for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) { const k = (y * W + x) * 4, L = d[k] * 0.3 + d[k + 1] * 0.59 + d[k + 2] * 0.11; if (L > 110) P.push([(x - ox) / S, (y - oy) / S]); }
      this.PALMP = P; }; im.src = 'mintak/kiserlet-palma.png'; this.PALMI = im; }
  pickEx() { this.loadPalm(); const R = Math.random, st = ({ 'pálmalevél': 'banánlevél' })[this.props['robbanásStílus']] ?? this.props['robbanásStílus'] ?? 'véletlen', rk = this.props['rakéták'] ?? 'véletlen';
    if (st === 'véletlen') { const o = this.EXS.filter(x => x !== this.exS); this.exS = o[Math.floor(R() * o.length)]; } else this.exS = st;
    this.exWh = this.exS === 'sípolófűz'; if (this.exWh) this.exS = 'szomorúfűz';
    let nr = this.exWh ? 1 : rk === 'véletlen' ? 1 + Math.floor(R() * 3) : Math.max(1, Math.min(3, +rk || 1)); this.exHue = null;
    if (this.F === 'kép') { const kp = this.props['kép'] ?? 'véletlen'; if (this._kre) this._kre = false; else this.kk = this.KORD.includes(kp) ? kp : this.KORD[(this.KORD.indexOf(this.kk) + 1) % this.KORD.length]; }
    if (this.F === 'kép') { const ks = this.KEPS[this.kk || 'macska']; if (st === 'véletlen') { this._ki = ((this._ki ?? -1) + 1) % ks.length; this.exS = ks[this._ki]; } if (rk === 'véletlen') nr = 2; this.exHue = ({ farkas: [40, 18], korona: [42, 30], szem: [190, 44] })[this.kk] || [44, 205]; if (this.kk === 'szem' && st === 'véletlen') this.exS = R() < 0.6 ? 'gyűrű' : 'krizantém'; }
    const xm = this._xm || 0.95, ym = this._ym || 1.9, po = ym > xm * 1.25, fl = R() < 0.5 ? 1 : -1, j = () => (R() - 0.5) * 0.08 * ym;
    this.exC = nr === 1 ? [[0, -0.32]] : nr === 2 ? (po ? [[-0.46 * xm, -0.42 * ym + j()], [0.46 * xm, 0.12 * ym + j()]] : [[-0.5 * xm, -0.3 * ym + j()], [0.5 * xm, 0.02 * ym + j()]]) : (po ? [[-0.56 * xm, -0.5 * ym + j()], [0, -0.08 * ym + j()], [0.56 * xm, 0.3 * ym + j()]] : [[-0.64 * xm, -0.02 * ym + j()], [0, -0.22 * ym + j()], [0.64 * xm, -0.32 * ym + j()]]);
    if (nr > 1 && fl < 0) this.exC = this.exC.map(([x, y]) => [-x, y]);
    if (this.exWh) this.exC = [[(R() - 0.5) * 0.6 * xm, -0.6 * ym]];
    { const Z = nr === 1 ? [0.82 + R() * 0.18] : nr === 2 ? [1, 0.6] : [1, 0.74, 0.55]; for (let q = Z.length - 1; q > 0; q--) { const k = Math.floor(R() * (q + 1)); [Z[q], Z[k]] = [Z[k], Z[q]]; } this.exZ = Z; }
    if (this.exS === 'pálma') this.exC = this.exC.map(([x, y]) => [x, y + 0.3]);
    this.exG = { 'pálma': 0.12, 'banánlevél': 0.12, 'szomorúfűz': 1.7, 'folyondár': 0.1 }[this.exS] ?? 1; this.exD = { 'szomorúfűz': 0.12, 'gyűrű': 0.3 }[this.exS] ?? 0.25; }
  explode() {
    const f = this.pal(), [p, v] = [this.p, this.v], S = this.exS || 'krizantém', C = this.exC || [[0, -0.32]], R = Math.random, nC = C.length;
    this.cu = new Float32Array(this.n); this._vph = 0; this.wv = null;
    const SH = C.map(() => { if (S !== 'banánlevél' && S !== 'folyondár' && S !== 'pálma') return null; const P = [], ph = R() * 6.283;
      if (S === 'banánlevél') { const L = 2.2, wd = u => 0.3 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.02)), 0.75);
        for (const a of [-Math.PI / 2 + 0.95 + (R() - 0.5) * 0.15, -Math.PI / 2 - 0.95 + (R() - 0.5) * 0.15]) { const ca = Math.cos(a), sa = Math.sin(a), put = (u, w) => { const lx = u * L, ly = w; P.push([lx * ca - ly * sa, lx * sa + ly * ca + 0.6 * u * u * L]); };
          for (let q = 0; q < 90; q++) put(q / 90, 0);
          for (let q = 0; q < 140; q++) { const u = q / 140; put(u, wd(u)); put(u, -wd(u)); }
          for (let vn = 1; vn < 22; vn++) { const u0 = vn / 22 * 0.92; for (const sg of [-1, 1]) for (let q = 1; q <= 9; q++) { const tq = q / 9, u = u0 + tq * 0.1; put(u, sg * tq * wd(u) * 0.97); } } } }
      else if (S === 'pálma' && this.PALMP) { for (const q of this.PALMP) P.push([q[0], q[1]]); }
      else if (S === 'pálma') { const J = () => (R() - 0.5) * 0.035;
        for (let q = 0; q < 260; q++) { const u = q / 260; P.push([J() * 0.6, u * 1.25 + J()]); }
        for (let q = 0; q < 90; q++) { const u = q / 90; P.push([J() * 0.6, -u * 0.95 + J()]); }
        for (const a0 of [-1.3, -1.0, -0.68, -0.38, 0.38, 0.68, 1.0, 1.3, -1.55, 1.55]) { const L = 0.95 + Math.abs(a0) * 0.22, dx = Math.sin(a0) * 0.85, dy = -Math.cos(a0 * 0.8);
          for (let q = 0; q < 120; q++) { const u = q / 120; P.push([dx * u * L + J(), dy * u * L + 0.38 * u * u * L * (0.6 + Math.abs(a0) * 0.4) + J()]); } } }
      else { const J = () => (R() - 0.5) * 0.01, sc2 = 0.55;
        for (let k = 0; k < 13; k++) { const a0 = -1.35 + k / 12 * 2.7, L = 0.5 + 0.18 * Math.cos(a0 * 1.1), dx = Math.sin(a0), dy = -Math.cos(a0);
          for (let q = 0; q < 34; q++) { const u = q / 34; P.push([dx * u * L, dy * u * L + 0.5 * u * u * L]); }
          const ex = dx * L, ey = dy * L + 0.5 * L; for (let q = 0; q < 14; q++) { const an = q / 14 * 6.283; P.push([ex + Math.cos(an) * 0.022, ey + Math.sin(an) * 0.022]); }
          if (k % 2) for (let q = 0; q < 4; q++) P.push([ex + J(), ey + 0.06 + q * 0.05]); }
        for (let q = 0; q < 120; q++) { const u = q / 120; P.push([Math.sin(u * 3.1) * 0.12, u * 1.1]); }
        for (const sg of [-1, 1]) { const by = 0.5, bx = Math.sin(by / 1.1 * 3.1) * 0.12, L = 0.42, a = sg * 0.9;
          const ca = Math.cos(a), sa = Math.sin(a), put = (u, w) => { const lx = w, ly = -u * L; P.push([bx + lx * ca - ly * sa, by + lx * sa + ly * ca]); }, wd = u => 0.08 * Math.sin(Math.PI * u);
          for (let q = 0; q < 50; q++) { const u = q / 50; put(u, wd(u)); put(u, -wd(u)); put(u, 0); }
          const cx2 = sg * 0.62, cy2 = 1.0, rr = 0.2; for (let q = 0; q < 90; q++) { const tq = q / 90, an = (sg > 0 ? Math.PI : 0) + sg * tq * 1.5 * 6.283, r = rr * (1 - 0.85 * tq); P.push([cx2 + Math.cos(an) * r, cy2 + Math.sin(an) * r]); }
          for (let q = 0; q < 60; q++) { const u = q / 60; P.push([sg * (0.05 + u * 0.38), 1.08 - Math.sin(u * Math.PI) * 0.16]); } }
        for (const p of P) { p[0] *= 1.15; p[1] = (p[1] - 0.3) * 1.15; } }
      return P; });
    const arms = C.map(() => { if (S !== 'pálma') return null; const K = 6 + Math.floor(R() * 3), A = []; while (A.length < K) { let x = R() * 2 - 1, y = R() * 2 - 1, z = R() * 2 - 1; const l = Math.hypot(x, y, z); if (l > 1 || l < 0.2) continue; x /= l; y /= l; z /= l; if (y > 0.25) continue; A.push([x, y, z]); } return A; });
    const rings = C.map(() => { const tl = nC > 1 ? 0.5 : 1.2; let nx = (R() - 0.5) * tl, ny = (R() - 0.5) * tl, nz = 1; const nl = Math.hypot(nx, ny, nz); nx /= nl; ny /= nl; nz /= nl; let ux = ny, uy = -nx, uz = 0, ul = Math.hypot(ux, uy) || 1; ux /= ul; uy /= ul; const wx = ny * uz - nz * uy, wy = nz * ux - nx * uz, wz = nx * uy - ny * ux; return [[ux, uy, uz], [wx, wy, wz]]; });
    const o3 = [0, 1, 2].sort(() => R() - 0.5), CH = o3; this.bb = new Uint8Array(this.n);
    for (let i = 0; i < this.n; i++) { const ci = i % nC, c = C[ci]; let x, y, z, sp, ctr = false;
      if (SH[ci]) { const q = SH[ci][Math.floor(R() * SH[ci].length)], scl = nC === 1 ? 1 : nC === 2 ? 0.62 : 0.45; x = q[0] + (R() - 0.5) * 0.012; y = q[1] + (R() - 0.5) * 0.012; z = (R() - 0.5) * 0.02; sp = Math.hypot(x, y, z) / 0.72 * scl * (S === 'folyondár' ? 1.25 : 1);
 }
      else if (S === 'virágfej' || S === 'folyondár') { const an = R() * 6.283, ph = this._vph || (this._vph = R() * 6.283); x = Math.cos(an); y = Math.sin(an); z = (R() - 0.5) * 0.12;
        if (S === 'virágfej') { if (R() < 0.06) { sp = 0.16 + 0.18 * Math.sqrt(R()); z = (R() - 0.5) * 0.2; ctr = true; } else sp = 2.3 * (0.22 + 0.78 * Math.pow(Math.abs(Math.cos(2.5 * (an + ph + ci))), 0.7)) * (0.94 + R() * 0.12); }
        else { const K = 5, arm = Math.floor(R() * K), a0 = arm / K * 6.283 + ph + ci; x = Math.cos(a0); y = Math.sin(a0); sp = 2.4 * (0.15 + 0.85 * Math.floor(R() * 9) / 8); this.cu[i] = (ci % 2 ? -1 : 1) * 2.4; } }
      else if (S === 'pálma' || S === 'banánlevél') { const A = arms[ci], a = A[Math.floor(R() * A.length)]; x = a[0] + (R() - 0.5) * 0.07; y = a[1] + (R() - 0.5) * 0.07; z = a[2] + (R() - 0.5) * 0.07; sp = 2.7 * (0.35 + 0.65 * R()); }
      else if (S === 'gyűrű') { const [u, w] = rings[ci], an = R() * 6.283; x = Math.cos(an) * u[0] + Math.sin(an) * w[0]; y = Math.cos(an) * u[1] + Math.sin(an) * w[1]; z = Math.cos(an) * u[2] + Math.sin(an) * w[2]; sp = 2.4 * (0.97 + R() * 0.06); }
      else { x = R() * 2 - 1; y = R() * 2 - 1; z = R() * 2 - 1; sp = S === 'szomorúfűz' ? (1.0 + R() * 0.55) * 1.15 : S === 'bazsarózsa' ? (2.0 + R() * 0.3) * 1.2 : (1.4 + R() * 0.9) * 1.25; }
      const l = Math.hypot(x, y, z) || 1;
      if (nC > 1 && !SH[ci]) { const spc = nC === 2 ? 2.4 : 1.45, tg0 = { 'bazsarózsa': 0.48, 'krizantém': 0.48, 'gyűrű': 0.56 }[S], bm = { 'bazsarózsa': 2.76, 'krizantém': 2.875, 'gyűrű': 2.47 }[S]; sp = tg0 ? sp / bm * (tg0 * spc / 0.72) : sp * 0.5; }
      p[0][i] = c[0]; p[2][i] = 0; p[1][i] = c[1]; v[0][i] = x / l * sp; v[1][i] = y / l * sp; v[2][i] = z / l * sp; this.hue[i] = S === 'pálma' ? 38 + R() * 10 : this.exHue ? this.exHue[ci % this.exHue.length] + (R() - 0.5) * 12 : S === 'szomorúfűz' || S === 'pálma' || S === 'folyondár' ? 38 + R() * 14 : f(); if (ctr) this.bb[i] = 1 + (CH[ci] | 0) % 3; }
    if (S === 'virágfénygömb') { const ga = Math.PI * (3 - Math.sqrt(5)), K = 2, sc = nC === 1 ? 1 : nC === 2 ? 0.72 : 0.56; this.vfR = 0.78 * sc; this.vfV = 0.4; this.VFS = [];
      C.forEach((c, ci) => { const a0 = (R() - 0.5) * 1.2, h0 = f(); let h1 = f(); for (let q = 0; q < 6 && Math.abs(h1 - h0) < 40; q++) h1 = f(); for (let q = 0; q < K; q++) { const so = c[0] > 0.3 ? 1 : c[0] < -0.3 ? -1 : 0, an = so ? (q ? Math.PI / 2 + so * 0.2 : -Math.PI / 2 - so * 0.2) + (R() - 0.5) * 0.25 : a0 + q * Math.PI, zz = (R() - 0.5) * 0.4, dx = Math.cos(an), dy = so ? Math.sin(an) - 0.15 : Math.sin(an) * 0.7 - 0.25, l = Math.hypot(dx, dy, zz); this.VFS.push({ c, ci, d: [dx / l, dy / l, zz / l], hue: q ? h1 : h0, k: [5, 6, 8][Math.floor(R() * 3)], ph: R() * 6.283, sz: (0.42 + R() * 0.08) * (0.55 + 0.45 * sc), P: [0, 0, 0] }); } });
      const NS = this.VFS.length; this.vfJ = new Uint16Array(this.n); this.vfD = new Float32Array(this.n * 3); this.vfA = new Float32Array(this.n); this.vfS = new Float32Array(this.n);
      for (let i = 0; i < this.n; i++) { const ci = i % nC, j = ci * K + Math.floor(R() * K), d = this.VFS[j].d; let x = d[0] + (R() - 0.5) * 2.2, y = d[1] + (R() - 0.5) * 2.2, z = d[2] + (R() - 0.5) * 2.2; const l = Math.hypot(x, y, z) || 1;
        this.vfJ[i] = j; this.vfD[i * 3] = x / l; this.vfD[i * 3 + 1] = y / l; this.vfD[i * 3 + 2] = z / l; this.vfA[i] = R() * 6.283; this.vfS[i] = R() < 0.14 ? R() * 0.18 : 0.72 + R() * 0.28; this.hue[i] = this.VFS[j].hue; this.bb[i] = 0; } }
    this.rgb0 = Array.from(this.hue, hh => { const l = S === 'pálma' ? 0.49 : 0.65, c = (1 - Math.abs(2 * l - 1)), x = c * (1 - Math.abs((hh / 60) % 2 - 1)), m = l - c / 2, k = Math.floor(hh / 60) % 6, r = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][k]; return r.map(q => Math.round((q + m) * 255)); });
    { const hs = (h, l) => { h = ((h % 360) + 360) % 360; const c = 1 - Math.abs(2 * l - 1), x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][Math.floor(h / 60) % 6]; return r.map(q => Math.round((q + m) * 255)); };
      this.exL2 = false; this.exIn = null; if (['bazsarózsa', 'gyűrű'].includes(S) && !this.exWh) { this.exL2 = true; const nC2 = C.length, H2 = C.map((c, ci) => ((this.hue[ci] ?? 40) + 140 + R() * 80) % 360);
        const IN = this.exIn = new Uint8Array(this.n); for (let i = 0; i < this.n; i++) { if (Math.floor(i / nC2) % 3) continue; IN[i] = 1; const k = (S === 'krizantém' ? 0.36 : 0.44) + R() * 0.05; v[0][i] *= k; v[1][i] *= k; v[2][i] *= k; const h = H2[i % nC2]; this.hue[i] = h; if (this.rgb0) this.rgb0[i] = hs(h, S === 'krizantém' ? 0.5 : 0.58); } }
      this.exR2 = C.map((c, ci) => { const h0 = this.hue[ci] ?? 40, o = [8, 42, h0 + 160, 285, 190]; let h2 = this.exS === 'szomorúfűz' ? 16 : o[Math.floor(R() * o.length)]; if (Math.abs(((h2 - h0) % 360 + 540) % 360 - 180) < 40) h2 = h0 + 160; return { h: h2, rgb: hs(h2, 0.6) }; }); }
    this.exploded = true;
  }
  mus() { const ac = this.props['_ac'] || this._ownAc, url = this.props['_zene'], want = !!(ac && url && this.props['_hang'] && this.on !== false), M = this._mu;
    if (!want) { if (M && M.src) this.musStop(); return; } if (ac.state !== 'running') return;
    if (!M || M.ac !== ac || M.url !== url) { if (M && M.src) this.musStop(); const N = this._mu = { ac, url, buf: null, src: null }; fetch(url).then(r => r.arrayBuffer()).then(b => new Promise((ok, no) => ac.decodeAudioData(b, ok, no))).then(b => { N.buf = this.musLevel(ac, b); }).catch(() => {}); return; }
    if (M.buf && !M.src) { const g = ac.createGain(), t = ac.currentTime; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(this.props['_zeneHang'] ?? 0.1, t + 1.5); g.connect(ac.destination); const s = ac.createBufferSource(); s.buffer = M.buf; s.loop = true; s.loopStart = 0; s.loopEnd = Math.max(1, M.buf.duration - 5); s.connect(g); s.start(); M.src = s; M.g = g; }
    if (M.g) { const v = this.props['_zeneHang'] ?? 0.1; if (Math.abs((M.v ?? v) - v) > 1e-3) M.g.gain.setTargetAtTime(v, ac.currentTime, 0.2); M.v = v; } }
  musLevel(ac, b) { const sr = b.sampleRate, L = b.length, C = b.numberOfChannels, W = Math.floor(sr * 0.25), nW = Math.ceil(L / W), rm = new Float32Array(nW), ch = []; for (let c = 0; c < C; c++) ch.push(b.getChannelData(c));
    for (let w = 0; w < nW; w++) { let a = 0, k = 0; for (let i = w * W; i < Math.min(L, (w + 1) * W); i += 3) { for (let c = 0; c < C; c++) a += ch[c][i] * ch[c][i]; k += C; } rm[w] = Math.sqrt(a / Math.max(1, k)); }
    const sm = new Float32Array(nW), R = 6; for (let w = 0; w < nW; w++) { let a = 0, k = 0; for (let j = Math.max(0, w - R); j <= Math.min(nW - 1, w + R); j++) { a += rm[j]; k++; } sm[w] = a / k; }
    const srt = Array.from(sm).sort((x, y) => x - y), tg = srt[Math.floor(nW * 0.6)] || 0.1, gn = Array.from(sm, v => Math.max(0.4, Math.min(4, tg / Math.max(1e-4, v))));
    const o = ac.createBuffer(C, L, sr); for (let c = 0; c < C; c++) { const d = ch[c], od = o.getChannelData(c); for (let i = 0; i < L; i++) { const f = i / W - 0.5, w0 = Math.max(0, Math.min(nW - 1, Math.floor(f))), w1 = Math.min(nW - 1, w0 + 1), k = Math.max(0, Math.min(1, f - w0)); od[i] = Math.max(-1, Math.min(1, d[i] * (gn[w0] + (gn[w1] - gn[w0]) * k))); } }
    return o; }
  musStop() { const M = this._mu; if (!M || !M.src) return; const t = M.ac.currentTime; try { M.g.gain.setTargetAtTime(0.0001, t, 0.25); M.src.stop(t + 1.2); } catch (e) {} M.src = null; M.g = null; }
  PZ = 8;
  pz() { if (this._pzN == null) this._pzN = 3; if (--this._pzN > 0) { this.BMS = null; return 0.6; } this._pzN = null; this.newBeams(); return this.PZ; }
  newBeams() { const R = Math.random, n = R() < 0.5 ? 2 : 3, B = this.BMS = []; for (let q = 0; q < n; q++) B.push({ x: (q + 0.5) / n + (R() - 0.5) * 0.12, a0: (R() - 0.5) * 0.5, am: 0.35 + R() * 0.25, w: 0.5 + R() * 0.5, ph: R() * 6.3, d: q % 2 ? 1 : -1, h: R() < 0.7 ? 215 : 45 }); }
  beam(c, x0, y0, ang, len, w0, w1, a, h) { c.save(); c.translate(x0, y0); c.rotate(ang); const gr = c.createLinearGradient(0, 0, 0, -len); gr.addColorStop(0, 'hsla(' + h + ',40%,88%,' + a + ')'); gr.addColorStop(0.5, 'hsla(' + h + ',35%,80%,' + a * 0.45 + ')'); gr.addColorStop(1, 'hsla(' + h + ',30%,75%,0)'); c.fillStyle = gr; c.beginPath(); c.moveTo(-w0, 0); c.lineTo(w0, 0); c.lineTo(w1, -len); c.lineTo(-w1, -len); c.closePath(); c.fill(); c.restore(); }
  litUpd(t, XE, bxg) { const L = this.lit || (this.lit = []), st = this._ls || (this._ls = {}); if (t < (st.pt ?? 1e9) - 0.5) { st.X = false; st.B = false; } st.pt = t; const now = performance.now() / 1000, EC = this.exC || [[0, -0.32]], hu = i => this.hue && this.hue.length ? this.hue[i % this.hue.length] : 40;
    const SM = this.SM || (this.SM = []), R = Math.random, puff = (x, y, sp, r, k, d) => { for (let q = 0; q < k; q++) { const an = R() * 6.283, dd = Math.sqrt(R()) * sp; SM.push({ x: x + Math.cos(an) * dd, y: y + Math.sin(an) * dd * 0.8, r: r * (0.7 + R() * 0.6), t0: now + R() * 0.8, d: d * (0.8 + R() * 0.4) }); } if (SM.length > 48) SM.splice(0, SM.length - 48); };
    if (!st.X && t >= 1.1) { st.X = true; EC.forEach((c, q) => { const z = (this.exZ || [])[q] ?? 1; L.push({ x: c[0], y: c[1], h: hu(q), t0: now, a: 0.35 + 0.65 * z, d: 2.2 }); puff(c[0], c[1], 0.45 * z, 0.26 * z, 7, 9); }); }
    if (!st.B && bxg > 0) { st.B = true; L.push({ x: 0, y: -0.1, h: hu(0), t0: now, a: 1.25, d: 2.6 }); puff(0, -0.1, 0.6, 0.3, 9, 10); }
    if (L.length > 6) L.splice(0, L.length - 6); }
  mkSky(W, H) { const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }, R = Math.random, S = mk(W, H), g = S.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#02030a'); gr.addColorStop(0.6, '#060a1a'); gr.addColorStop(1, '#0d1328'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let q = 0; q < (W * H) / 9000; q++) { const y = Math.pow(R(), 1.6) * H * 0.85, a = 0.15 + R() * 0.55, z = R() < 0.06 ? 1.6 : 1; g.fillStyle = 'rgba(220,228,255,' + a + ')'; g.fillRect(R() * W, y, z * (this._dpr || 1), z * (this._dpr || 1)); }
    const w = Math.max(64, Math.round(W / 6)), h = Math.max(64, Math.round(H / 6)), M = mk(w, h), m = M.getContext('2d');
    const hz = this.hzF(W, H), blob = (x, y, r, a) => { for (const ox of [-w, 0, w]) { const X = x + ox; if (X + r < 0 || X - r > w) continue; const rg = m.createRadialGradient(X, y, 0, X, y, r); rg.addColorStop(0, 'rgba(255,255,255,' + a + ')'); rg.addColorStop(1, 'rgba(255,255,255,0)'); m.fillStyle = rg; m.beginPath(); m.arc(X, y, r, 0, 7); m.fill(); } };
    for (let b = 0; b < 7; b++) { const cy = h * (0.12 + R() * (hz - 0.22)), cx = R() * w, len = w * (0.3 + R() * 0.5); for (let q = 0; q < 26; q++) blob(cx + (R() - 0.5) * len, cy + (R() - 0.5) * h * 0.09, h * (0.04 + R() * 0.09), 0.16 + R() * 0.2); }
    for (let q = 0; q < 26; q++) blob(R() * w, h * (hz - 0.09 + R() * 0.07), h * (0.04 + R() * 0.07), 0.12 + R() * 0.14);
    const tint = mk(w, h), tg = tint.getContext('2d'); tg.drawImage(M, 0, 0); tg.globalCompositeOperation = 'source-in'; tg.fillStyle = '#2c3456'; tg.fillRect(0, 0, w, h);
    const yH = Math.round(H * this.hzF(W, H)), ns = (x, f, o) => Math.sin(x * f + o) * 0.5 + Math.sin(x * f * 2.3 + o * 1.7) * 0.3 + Math.sin(x * f * 5.1 + o * 0.6) * 0.2;
    [[0.075, 1.3, '#0d1328', R() * 9], [0.045, 2.4, '#05091a', R() * 9]].forEach(([hh, f, col, o]) => { g.fillStyle = col; g.beginPath(); g.moveTo(0, yH); for (let x = 0; x <= W; x += 4) g.lineTo(x, yH - H * hh * (0.35 + 0.65 * Math.max(0, ns(x / W * 6.283, f, o) * 0.5 + 0.5))); g.lineTo(W, yH); g.closePath(); g.fill(); });
    const wg = g.createLinearGradient(0, yH, 0, H); wg.addColorStop(0, '#16203f'); wg.addColorStop(0.3, '#0e1630'); wg.addColorStop(1, '#060a18'); g.fillStyle = wg; g.fillRect(0, yH, W, H - yH);
    for (let q = 0; q < (H - yH) / 3; q++) { const y = yH + Math.pow(R(), 1.4) * (H - yH), l = W * (0.05 + R() * 0.25); g.fillStyle = 'rgba(130,150,210,' + (0.05 + R() * 0.07) + ')'; g.fillRect(R() * W - l / 2, y, l, Math.max(1, (this._dpr || 1) * 0.8)); }
    g.fillStyle = 'rgba(160,180,235,0.16)'; g.fillRect(0, yH, W, Math.max(1, this._dpr || 1));
    const FG = mk(W, H), fg = FG.getContext('2d'), FL = mk(W, H), fl = FL.getContext('2d'), po = H > W * 1.2, d0 = this._dpr || 1, U = Math.min(W, H), sw = R() < 0.5, sx = x => sw ? W - x : x, RD = [];
    const fb = (x, y, r) => { fg.beginPath(); fg.arc(sx(x), y, r, 0, 7); fg.fill(); }, trunk = (x, y0, y1, w) => { fg.beginPath(); fg.moveTo(sx(x - w), y0); fg.lineTo(sx(x - w * 0.4), y1); fg.lineTo(sx(x + w * 0.4), y1); fg.lineTo(sx(x + w), y0); fg.fill(); };
    const TB = [], TL = [], tree = (x, ht) => { const grow = (x0, y0, an, ln, w, d) => { const x1 = x0 + Math.sin(an) * ln, y1 = y0 - Math.cos(an) * ln; TB.push([sx(x0), y0, sx(x1), y1, w]);
        if (d >= 2) for (let q = 0; q < (d >= 4 ? 7 : 3); q++) { const t = 0.4 + R() * 0.6, lx = x0 + (x1 - x0) * t + (R() - 0.5) * ln * 0.5, ly = y0 + (y1 - y0) * t + (R() - 0.5) * ln * 0.4; TL.push({ x: sx(lx), y: ly, a: R() * 6.283, l: U * (0.007 + R() * 0.008), sw: Math.max(0, (yH - ly) / ht), ph: R() * 6.3 }); }
        if (d < 5) { const nb = d < 1 ? 3 : 2 + (R() < 0.4 ? 1 : 0); for (let q = 0; q < nb; q++) grow(x1, y1, an + (q - (nb - 1) / 2) * (0.45 + R() * 0.35) + (R() - 0.5) * 0.3, ln * (0.62 + R() * 0.16), w * 0.62, d + 1); } };
      grow(x, yH + 2 * d0, (R() - 0.5) * 0.12, ht * 0.34, U * 0.009, 0); };
    const bush = (x, ht, wd) => { const gr = (x0, y0, an, ln, w, d) => { const x1 = x0 + Math.sin(an) * ln, y1 = y0 - Math.cos(an) * ln; TB.push([sx(x0), y0, sx(x1), y1, w]);
        if (d >= 1) for (let q = 0; q < 3; q++) { const t = 0.3 + R() * 0.7, lx = x0 + (x1 - x0) * t + (R() - 0.5) * ln * 0.5, ly = y0 + (y1 - y0) * t + (R() - 0.5) * ln * 0.4; TL.push({ x: sx(lx), y: ly, a: R() * 6.283, l: U * (0.005 + R() * 0.006), sw: Math.max(0, (yH - ly) / (ht * 2.2)), ph: R() * 6.3 }); }
        if (d < 3) for (let q = 0; q < 2; q++) gr(x1, y1, an + (q ? 1 : -1) * (0.35 + R() * 0.4), ln * (0.6 + R() * 0.2), w * 0.6, d + 1); };
      for (let q = 0; q < 6; q++) { const t = R(); gr(x + (t - 0.5) * wd * 0.6, yH + d0, (t - 0.5) * 1.3 + (R() - 0.5) * 0.3, ht * (0.4 + R() * 0.25), U * 0.0035, 0); } };
    fg.fillStyle = '#010206';
    if (po) bush(W * 0.07, U * 0.06, W * 0.2);
    else { tree(W * 0.045, U * 0.3); tree(W * 0.12, U * 0.21); bush(W * 0.015, U * 0.07, W * 0.06); }
    fg.save(); fg.strokeStyle = '#080d22'; fg.lineCap = 'round'; for (const [a, b, c, e, w] of TB) { fg.lineWidth = Math.max(0.7 * d0, w); fg.beginPath(); fg.moveTo(a, b); fg.lineTo(c, e); fg.stroke(); } fg.restore();
    fg.fillRect(0, yH, sw ? W : W * (po ? 0.3 : 0.24), 2 * d0); if (sw) fg.clearRect(0, yH, W * (po ? 0.7 : 0.76), 2 * d0);
    fl.drawImage(FG, 0, 0); fl.globalCompositeOperation = 'source-in'; fl.fillStyle = '#5a6a9a'; fl.fillRect(0, 0, W, H);
    const nR = po ? 78 : 120, rx0 = sw ? W * 0.02 : W * (po ? 0.72 : 0.8), rx1 = sw ? W * (po ? 0.28 : 0.2) : W * 0.985;
    for (let q = 0; q < nR; q++) RD.push({ x: rx0 + (rx1 - rx0) * Math.pow(R(), 0.8), h: U * (0.025 + R() * 0.045) * (po ? 0.85 : 1), w: (0.7 + R() * 0.9) * d0, ph: R() * 6.3, k: 0.6 + R() * 0.8, cat: R() < 0.3, y: yH + R() * 4 * d0 });
    const G = mk(w, h), GM = mk(w, h), MS = mk(w, h); return { W, H, S, M, G, GM, MS, CT: tint, w, h, yH, FG, FL, RD, TL }; }
  compose(now) { const cv = this.cvRef.current; if (!cv || !this.BF || !cv.width) return; const W = cv.width, H = cv.height, c = cv.getContext('2d'); if (!this.SKY || this.SKY.W !== W || this.SKY.H !== H) this.SKY = this.mkSky(W, H); const K = this.SKY;
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.drawImage(K.S, 0, 0);
    const L = this.lit || [], ts = now / 1000, P = this._prjW, co = ((ts * K.w / 60) % K.w + K.w) % K.w, cX = co * W / K.w;
    c.globalAlpha = 0.36; c.drawImage(K.CT, -cX, 0, W, H); c.drawImage(K.CT, W - cX, 0, W, H); c.globalAlpha = 1;
    { const ms = K.MS.getContext('2d'); ms.globalCompositeOperation = 'source-over'; ms.clearRect(0, 0, K.w, K.h); ms.drawImage(K.M, -co, 0); ms.drawImage(K.M, K.w - co, 0); }
    const SM = this.SM || []; if (SM.length && P) { const o0 = P(0, 0, 0), ru = P(1, 0, 0)[0] - o0[0], ms = K.MS.getContext('2d'), sx = K.w / W; let w = 0;
      for (const q of SM) { const age = ts - q.t0; if (age > q.d) continue; SM[w++] = q; const a = Math.min(1, age / 1.2) * Math.pow(1 - age / q.d, 1.5), [x, y] = P(q.x + age * 0.035 + age * age * 0.0015, q.y - age * 0.006, 0), r = q.r * ru * (1 + age * 0.09); if (a < 0.01) continue;
        const rg = c.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, 'rgba(175,165,160,' + 0.3 * a + ')'); rg.addColorStop(0.55, 'rgba(140,135,140,' + 0.16 * a + ')'); rg.addColorStop(1, 'rgba(110,110,120,0)'); c.fillStyle = rg; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
        const X = x * sx, Y = y * sx, rr = r * sx, mg = ms.createRadialGradient(X, Y, 0, X, Y, rr); mg.addColorStop(0, 'rgba(255,255,255,' + 0.85 * a + ')'); mg.addColorStop(1, 'rgba(255,255,255,0)'); ms.fillStyle = mg; ms.beginPath(); ms.arc(X, Y, rr, 0, 7); ms.fill(); }
      SM.length = w; }
    const bT = this._bmT || 0, bm = bT > 0 && this.BMS ? Math.max(0, Math.min(1, bT / 0.9, (this.PZ - bT) / 0.9)) : 0;
    if (bm > 0) { const el = this.PZ - bT; c.globalCompositeOperation = 'lighter'; for (const b of this.BMS) this.beam(c, b.x * W, K.yH, b.a0 + b.d * b.am * Math.sin(el * b.w + b.ph), H * 1.25, W * 0.006, W * 0.09, 0.13 * bm, b.h); c.globalCompositeOperation = 'source-over'; }
    if ((L.length && P) || bm > 0) { const g = K.G.getContext('2d'), sx = K.w / W; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, K.w, K.h); let any = bm > 0;
      if (bm > 0) { const el = this.PZ - bT; g.globalCompositeOperation = 'lighter'; for (const b of this.BMS) this.beam(g, b.x * K.w, K.yH * K.w / W, b.a0 + b.d * b.am * Math.sin(el * b.w + b.ph), K.h * 1.25, K.w * 0.006, K.w * 0.11, 0.95 * bm, b.h); }
      for (const e of L) { const age = ts - e.t0, I = e.a * Math.min(1, age / 0.06) * Math.exp(-age / e.d); if (I < 0.01) continue; any = true; const [x, y] = P(e.x, e.y, 0), r = Math.max(K.w, K.h) * 0.75, X = x * sx, Y = y * sx;
        const rg = g.createRadialGradient(X, Y, 0, X, Y, r); rg.addColorStop(0, 'hsla(' + e.h + ',85%,62%,' + Math.min(1, 0.7 * I) + ')'); rg.addColorStop(0.35, 'hsla(' + e.h + ',80%,45%,' + 0.35 * I + ')'); rg.addColorStop(1, 'hsla(' + e.h + ',80%,40%,0)'); g.globalCompositeOperation = 'lighter'; g.fillStyle = rg; g.fillRect(0, 0, K.w, K.h); }
      this.lit = L.filter(e => ts - e.t0 < e.d * 4);
      if (any) { const m = K.GM.getContext('2d'); m.globalCompositeOperation = 'source-over'; m.clearRect(0, 0, K.w, K.h); m.drawImage(K.G, 0, 0); m.globalCompositeOperation = 'destination-in'; m.drawImage(K.MS, 0, 0);
        c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.1; c.drawImage(K.G, 0, 0, W, H); c.globalAlpha = 1; c.drawImage(K.GM, 0, 0, W, H); } }
    c.globalCompositeOperation = 'lighter'; c.globalAlpha = 1; c.drawImage(this.BF, 0, 0);
    { let li = bm * 0.9; for (const e of L) { const age = ts - e.t0; li += e.a * Math.min(1, age / 0.06) * Math.exp(-age / e.d); } li = Math.min(1, li * 0.5); const d0 = this._dpr || 1;
      if (li > 0.02) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = li * 0.4; c.drawImage(K.FL, 0, -1.4 * d0); }
      c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; c.drawImage(K.FG, 0, 0);
      const gu = Math.sin(ts * 0.37) * 0.5 + Math.sin(ts * 0.83 + 1) * 0.3; c.lineCap = 'round';
      if (K.TL.length) { const lc = li > 0.02 ? 'rgb(' + Math.round(8 + 14 * li) + ',' + Math.round(13 + 16 * li) + ',' + Math.round(34 + 26 * li) + ')' : '#080d22'; c.strokeStyle = lc; c.lineWidth = 1.6 * d0;
        c.beginPath(); for (const f of K.TL) { const sw = f.sw * f.sw, dx = (Math.sin(ts * 1.9 + f.ph) * 0.0022 + gu * 0.004) * K.H * sw, a = f.a + Math.sin(ts * 3.1 + f.ph) * 0.35 * (0.3 + sw), x = f.x + dx, y = f.y + Math.abs(dx) * 0.15; c.moveTo(x - Math.cos(a) * f.l * 0.5, y - Math.sin(a) * f.l * 0.5); c.lineTo(x + Math.cos(a) * f.l * 0.5, y + Math.sin(a) * f.l * 0.5); } c.stroke(); }
      for (const r of K.RD) { const a = (Math.sin(ts * 1.6 * r.k + r.ph) * 0.07 + gu * 0.09 + 0.03) , bx = r.x, by = r.y, tx = bx + Math.sin(a) * r.h, ty = by - Math.cos(a) * r.h, mx = bx + Math.sin(a * 0.4) * r.h * 0.5, my = by - r.h * 0.5;
        c.strokeStyle = li > 0.02 ? 'rgb(' + Math.round(1 + 12 * li) + ',' + Math.round(2 + 14 * li) + ',' + Math.round(6 + 24 * li) + ')' : '#010206'; c.lineWidth = r.w; c.beginPath(); c.moveTo(bx, by); c.quadraticCurveTo(mx, my, tx, ty); c.stroke();
        if (r.cat) { c.fillStyle = c.strokeStyle; c.save(); c.translate(mx + (tx - mx) * 0.72, my + (ty - my) * 0.72); c.rotate(a); c.beginPath(); c.ellipse(0, 0, r.w * 1.6, r.h * 0.09, 0, 0, 7); c.fill(); c.restore(); } } }
    c.globalCompositeOperation = 'lighter';
    { const yH = K.yH, wh = H - yH, d0 = this._dpr || 1, st = Math.max(2, Math.round(2.5 * d0)); c.save(); c.beginPath(); c.rect(0, yH, W, wh); c.clip();
      for (let d = 0; d < wh; d += st) { const sy = yH - d * 1.1 - st, ox = Math.sin(d * 0.09 / d0 + ts * 1.7) * (1 + d * 0.025) * d0 + Math.sin(d * 0.023 / d0 - ts * 0.9) * 2 * d0; if (sy < 0) break; c.globalAlpha = 0.5 * Math.pow(1 - d / wh, 1.3); c.drawImage(c.canvas, 0, sy, W, st, ox, yH + d, W, st); }
      c.restore(); }
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; }
  sfxOut() { const ac = this.props['_ac'] || this._ownAc; if (!ac || !this.props['_hang'] || ac.state !== 'running') return null;
    if (this._sAc !== ac) { this._sAc = ac; const o = ac.createGain(); o.gain.value = 2.2; const cp = ac.createDynamicsCompressor(); cp.threshold.value = -4; cp.knee.value = 4; cp.ratio.value = 8; cp.attack.value = 0.002; cp.release.value = 0.15; o.connect(cp); cp.connect(ac.destination); this._sO = o;
      const L = ac.sampleRate * 2, b = ac.createBuffer(1, L, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < L; i++) d[i] = Math.random() * 2 - 1; this._nz = b; }
    return ac; }
  sNode(ac, x) { const o = this._sO; if (!ac.createStereoPanner) return o; const p = ac.createStereoPanner(); p.pan.value = Math.max(-0.8, Math.min(0.8, x * 0.7)); p.connect(o); return p; }
  sNoise(ac, t, dur, type, f0, f1, q, vol, x, att) { const src = ac.createBufferSource(); src.buffer = this._nz; src.loop = true; const f = ac.createBiquadFilter(); f.type = type; f.Q.value = q; f.frequency.setValueAtTime(f0, t); if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + (att || 0.004)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); src.connect(f); f.connect(g); g.connect(this.sNode(ac, x)); src.start(t, Math.random() * 1.5); src.stop(t + dur + 0.05); }
  sTone(ac, t, dur, f0, f1, vol, x, type) { const o = ac.createOscillator(); o.type = type || 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur); const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(this.sNode(ac, x)); o.start(t); o.stop(t + dur + 0.05); }
  sWhistle(ac, t, d, x) { const o = ac.createOscillator(), o2 = ac.createOscillator(), lf = ac.createOscillator(), lg = ac.createGain(), g = ac.createGain(), g2 = ac.createGain(), f0 = 2300 + Math.random() * 300;
    o.type = 'sine'; o2.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f0 * 1.32, t + d * 0.85); o.frequency.linearRampToValueAtTime(f0 * 1.2, t + d);
    o2.frequency.setValueAtTime(f0 * 2, t); o2.frequency.linearRampToValueAtTime(f0 * 2.64, t + d * 0.85); o2.frequency.linearRampToValueAtTime(f0 * 2.4, t + d);
    lf.frequency.value = 7 + Math.random() * 3; lg.gain.value = f0 * 0.025; lf.connect(lg); lg.connect(o.frequency);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.06); g.gain.setValueAtTime(0.5, t + d * 0.8); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    g2.gain.setValueAtTime(0.0001, t); g2.gain.exponentialRampToValueAtTime(0.09, t + 0.06); g2.gain.setValueAtTime(0.09, t + d * 0.8); g2.gain.exponentialRampToValueAtTime(0.0001, t + d);
    const nd = this.sNode(ac, x); o.connect(g); o2.connect(g2); g.connect(nd); g2.connect(nd); [o, o2, lf].forEach(q => { q.start(t); q.stop(t + d + 0.05); }); }
  sBoom(ac, t, x, big, m) { const k = (big ? 2.2 : 1) * (m ?? 1), p = 0.85 + Math.random() * 0.3;
    this.sNoise(ac, t, 0.05, 'highpass', 1800, 1800, 0.7, 0.9 * k, x, 0.002);
    this.sTone(ac, t, 0.5 * k, 95 * p, 32, 1.0 * k, x);
    this.sNoise(ac, t, 1.6 * k, 'lowpass', 900 * p, 90, 0.8, 0.95 * k, x, 0.006);
    this.sNoise(ac, t + 0.05, 2.4 * k, 'bandpass', 600, 200, 0.5, 0.25 * k, -x, 0.2);
    if (big) { this.sNoise(ac, t, 0.9, 'bandpass', 320, 110, 1, 2.2, x, 0.003); this.sTone(ac, t, 0.8, 200, 50, 1.1, x, 'triangle'); this.sNoise(ac, t + 0.09, 0.6, 'bandpass', 520, 170, 1, 1.4, -x * 0.5, 0.004); this.sNoise(ac, t + 0.22, 1.2, 'bandpass', 380, 120, 0.9, 1.1, x * 0.5, 0.005); this.sTone(ac, t + 0.22, 0.7, 150, 45, 0.8, -x * 0.4, 'triangle'); this.sNoise(ac, t + 0.45, 2.0, 'lowpass', 700, 120, 0.7, 0.9, 0, 0.02); } }
  sCrk(ac, t, x, v) { const f = 1800 + Math.random() * 5000; this.sNoise(ac, t, 0.008 + Math.random() * 0.03, 'highpass', f, f, 1.2, v * 2.6, x, 0.0008); if (Math.random() < 0.3) this.sNoise(ac, t, 0.04 + Math.random() * 0.05, 'bandpass', 900 + Math.random() * 900, 400, 1.5, v * 1.8, x, 0.001); }
  sfx(t, XE, bxg, dt) { const ac = this.sfxOut(); if (!ac) return; const now = ac.currentTime + 0.02, EC = this.exC || [[0, -0.32]], st = this._sf || (this._sf = {});
    if (t < (st.pt ?? 1e9) - 0.5 || t < 0.05 && !st.L) { this._sf = { L: false, X: false, B: false, pt: t }; } const S = this._sf; S.pt = t;
    if (!S.L && t < 0.5 && this.exWh) { S.L = true; const x = EC[0][0]; this.sWhistle(ac, now, 1.45, x); this.sNoise(ac, now, 1.3, 'highpass', 3000, 5000, 0.8, 0.35, x, 0.08); for (let q = 0; q < 26; q++) this.sCrk(ac, now + Math.random() * 1.2, x + (Math.random() - 0.5) * 0.3, 0.3 + Math.random() * 0.3); }
    if (!S.L && t < 0.5) { S.L = true; EC.forEach((c, q) => { const d = q * 0.07, x = c[0]; this.sTone(ac, now + d, 1.05, 700 + q * 180, 2300 + q * 300, 0.12, x, 'triangle'); this.sNoise(ac, now + d, 1.1, 'bandpass', 900, 4200, 2.5, 0.3, x, 0.3); }); }
    if (!S.X && t >= 1.1) { S.X = true; const Z = this.exZ || []; EC.forEach((c, q) => { const z = Z[q] ?? 1; this.sBoom(ac, now + q * 0.06 + (1 - z) * 0.9, c[0], false, 0.45 + 0.55 * z); }); }
    const te = t - 1.1, vf = this.exS === 'virágfénygömb', act = t < XE && (vf ? te > 2.3 : te > 0.9);
    if (act) { const rate = (vf ? 180 : 260) * EC.length, nn = Math.min(30, Math.floor(rate * dt + Math.random())); for (let q = 0; q < nn; q++) { const c = EC[Math.floor(Math.random() * EC.length)]; const z = (this.exZ || [])[EC.indexOf(c)] ?? 1; this.sCrk(ac, now + Math.random() * dt + (1 - z) * 0.9, c[0] + (Math.random() - 0.5) * 0.8, (0.4 + Math.random() * 0.6) * (0.4 + 0.6 * z)); } }
    if (t >= XE && bxg <= 0 && !(this.F === 'kép' && (this._tkN ?? 0) > 6.75)) { const nn = Math.min(20, Math.floor(110 * dt + Math.random())); for (let q = 0; q < nn; q++) this.sCrk(ac, now + Math.random() * dt, (Math.random() - 0.5) * 1.4, 0.3 + Math.random() * 0.5); }
    if (!S.B && bxg > 0) { S.B = true; this.sBoom(ac, now, 0, true); if (this.F === 'kép') this.sBoom(ac, now + 0.03, 0, true); this.sNoise(ac, now + 0.1, 3.2, 'bandpass', 6500, 3000, 0.8, 0.35, 0, 0.3); }
    if (bxg > 0.15 && bxg < 2.4) { const nn = Math.min(30, Math.floor(320 * Math.max(0, 1 - bxg / 2.4) * dt + Math.random())); for (let q = 0; q < nn; q++) this.sCrk(ac, now + Math.random() * dt, (Math.random() - 0.5) * 1.6, 0.4 + Math.random() * 0.6); } }
  hzF(W, H) { return H > W * 1.2 ? 0.82 : 0.8; }
  applyDepth() { const Z = this.exZ, EC = this.exC; if (!Z || !EC) return; const nC = EC.length, v = this.v, n = this.n, vf = this.exS === 'virágfénygömb';
    if (vf && this.VFS) { for (const q of this.VFS) { const z = Z[q.ci] ?? 1; q.sz *= 0.55 + 0.45 * z; q.dz = z; } }
    for (let i = 0; i < n; i++) { const z = Z[i % nC] ?? 1; if (z >= 0.99) continue; if (!vf) { v[0][i] *= z; v[1][i] *= z; v[2][i] *= z; } const c = this.rgb0 && this.rgb0[i]; if (c) { const b = 1 - z; this.rgb0[i] = [Math.round(c[0] * (1 - 0.75 * b)), Math.round(c[1] * (1 - 0.6 * b)), Math.round(Math.min(255, c[2] * (1 - 0.3 * b) + 40 * b))]; } } }
  fitEx(W, H, R) { const EC = this.exC || [[0, -0.32]], d = Math.min(0.97, this.exD ?? 0.25), Fd = (1 - Math.pow(d, 1.6)) / -Math.log(d), gy = 0.55 * (this.exG ?? 1) * 1.6 * Fd * 0.5, xm = W / 2 / R * 0.82, ym = H / 2 / R * 0.78, ymB = Math.min(ym, (this._yHw ?? ym) - 0.06), n = this.n, p = this.p, v = this.v, sc = EC.map(() => 1), ci = new Uint8Array(n);
    for (let i = 0; i < n; i++) { const b = i % EC.length; ci[i] = b; const c = EC[b], dx = v[0][i] * Fd, dy = v[1][i] * Fd;
      if (dx > 1e-4) sc[b] = Math.min(sc[b], (xm - c[0]) / dx); else if (dx < -1e-4) sc[b] = Math.min(sc[b], (-xm - c[0]) / dx); if (dy > 1e-4) sc[b] = Math.min(sc[b], (ymB - gy - c[1]) / dy); else if (dy < -1e-4) sc[b] = Math.min(sc[b], (-ym - c[1]) / dy); }
    for (let i = 0; i < n; i++) { const k = Math.max(0.25, sc[ci[i]]); if (k < 1) { v[0][i] *= k; v[1][i] *= k; v[2][i] *= k; } } }
  drawVFG(g, u, D, prjW, dpr, tt) {
    const S = this.VFS, p = this.p, n = this.n, r1 = this.vfR, sh = 1 - Math.pow(1 - Math.min(1, u / 2.1), 3), w = Math.max(0, u - 2.7), wN = Math.min(1, w / Math.max(1, D - 2.7)), mv = Math.pow(wN, 1.2) * this.vfV * 3.6;
    let m = Math.min(1, w / 0.7); m = m * m * (3 - 2 * m); let bl = Math.min(1, w / 1.0); bl = 1 - Math.pow(1 - bl, 2);
    const al0 = 1 - 0.2 * wN, rr = r1 * sh + mv, gy = 0.35 * wN * wN, grow = 1 + 0.35 * mv;
    const o0 = prjW(0, 0, 0), ru = prjW(1, 0, 0)[0] - o0[0], bx = o0[0] / ru * 0.94, by = o0[1] / ru * 0.94;
    for (const q of S) { q.P[0] = q.c[0] + q.d[0] * rr; q.P[1] = q.c[1] + q.d[1] * rr + gy; q.P[2] = q.d[2] * Math.min(rr, 1.2) * 0.4; const kq = 3 / (3 + q.P[2]), m = q.sz * grow * 1.15, lx = bx / kq - m, ly = Math.max(0.15, (q.P[1] > 0 ? Math.min(by, (this._yHw ?? by) - 0.06) : by) / kq - m); q.ex = lx * Math.tanh(q.P[0] / lx) - q.P[0]; q.ey = ly * Math.tanh(q.P[1] / ly) - q.P[1]; q.P[0] += q.ex; q.P[1] += q.ey; }
    if (bl > 0 && al0 > 0) for (const q of S) { const [sx, sy, k] = prjW(q.P[0], q.P[1], q.P[2]), R0 = prjW(q.P[0] + q.sz * grow * 1.5, q.P[1], q.P[2])[0] - sx; if (R0 < 1) continue;
      const gr = g.createRadialGradient(sx, sy, 0, sx, sy, R0); gr.addColorStop(0, 'hsla(' + q.hue + ',100%,70%,' + 0.22 * bl * al0 + ')'); gr.addColorStop(1, 'hsla(' + q.hue + ',100%,55%,0)'); g.fillStyle = gr; g.beginPath(); g.arc(sx, sy, R0, 0, 7); g.fill(); }
    if (al0 > 0) { const a = Math.max(0, w - 0.75), gw = Math.min(1, a / 0.6), gr = 1 - Math.pow(1 - gw, 3), en = Math.max(0, Math.min(1, (D - u) / 0.5)), f = gr * en, HU = [120, 52, 212, 0, 282], bX = (this._xm || 0.9) * 0.93, bY = (this._ym || 1.9) * 0.93;
      if (f > 0.01) S.forEach((q, qi) => { const pe = q.sz * grow * bl; for (let m = 0; m < q.k; m++) { const th = -q.ph + m * 2 * Math.PI / q.k, ux = Math.cos(th), uy = Math.sin(th), x0 = q.P[0] + ux * pe * 1.05, y0 = q.P[1] + uy * pe * 1.05, rr = pe * 0.32, md = Math.max(0, Math.min(ux > 1e-3 ? (bX - rr - x0) / ux : ux < -1e-3 ? (-bX + rr - x0) / ux : 9, uy > 1e-3 ? (Math.min(bY, (this._yHw ?? bY) - 0.03) - rr - y0) / uy : uy < -1e-3 ? (-bY + rr - y0) / uy : 9, 1.3)), om = pe * 1.05 + md * (1 - Math.exp(-0.34 * a / Math.max(0.05, md))), rx = ux * om, ry = uy * om;
        this.drawMini(g, prjW, dpr, q.P[0] + rx, q.P[1] + ry, q.P[2], pe * 0.3 * f, 5, q.ph + m + u * 0.3, HU[(qi * 3 + m) % 5], Math.min(1, gw * 2) * (0.5 + 0.5 * en) * al0, qi * 7 + m, 130); } }); }
    for (let i = 0; i < n; i++) { const q = S[this.vfJ[i]], dx = this.vfD[i * 3] + (q.d[0] - this.vfD[i * 3]) * m, dy = this.vfD[i * 3 + 1] + (q.d[1] - this.vfD[i * 3 + 1]) * m, dz = this.vfD[i * 3 + 2] + (q.d[2] - this.vfD[i * 3 + 2]) * m;
      const th = this.vfA[i], fr = this.vfS[i], pe = q.sz * grow * bl * fr * (0.3 + 0.7 * Math.pow(Math.abs(Math.cos(q.k / 2 * (th + q.ph))), 0.6));
      const X = q.c[0] + dx * rr + Math.cos(th) * pe + q.ex * (0.4 + 0.6 * m), Y = q.c[1] + dy * rr + gy + Math.sin(th) * pe + q.ey * (0.4 + 0.6 * m), Z = dz * Math.min(rr, 1.2) * 0.4; p[0][i] = X; p[1][i] = Y; p[2][i] = Z;
      const [sx, sy, k] = prjW(X, Y, Z), tw = Math.random() < 0.1 ? 1.6 : 1, ctr = fr < 0.2 && bl > 0, a = Math.min(1, al0 * (w > 0 ? 0.9 : 0.55 + 0.45 * Math.sin(tt * 7 + i))) * tw; if (a <= 0.01) continue;
      g.fillStyle = ctr ? 'rgba(255,245,215,' + a + ')' : 'hsla(' + q.hue + ',100%,' + (w > 0 ? 58 + 20 * fr * (1 - bl * 0.3) : 74) + '%,' + a + ')'; const z = Math.max(1, (ctr ? 2.8 : 2.2 + 0.4 * bl) * k * dpr); g.fillRect(sx - z / 2, sy - z / 2, z, z); }
  }
  akna(g, prjW, dpr, t, XE, dt, CE, bxg) { const A = this.AK || (this.AK = []); if (t < (this._akT ?? 1e9) - 0.5) A.length = 0; this._akT = t; const fin = t > CE + 0.5 && !(bxg > 0), side = fin && this.F !== 'kép';
    if (((t > 1.5 && t < XE + 1.2) || side) && A.length < (side ? 3 : 4) && Math.random() < (side ? 0.7 : 1.1) * dt) { const R = Math.random, xw = this._xm || 0.9, xm = xw * 0.85, yH = this._yHw ?? 1.4, sd = R() < 0.5 ? -1 : 1, x = side ? sd * xw * (0.72 + R() * 0.16) : (R() * 2 - 1) * xm, y = side ? yH - 0.35 - R() * 0.55 : yH - 0.16 - R() * 0.2, hu = [0, 40, 52, 120, 200, 280, 320][Math.floor(R() * 7)], N = 70 + Math.floor(R() * 40), P = [];
      for (let q = 0; q < N; q++) { const an = R() * 6.283, sp = (0.42 + R() * 0.5) * (R() < 0.2 ? 0.5 : 1); P.push([x, y, Math.cos(an) * sp, Math.sin(an) * sp - 0.08, R() < 0.18]); }
      A.push({ P, hu, l: 0, d: side ? 1.8 + R() * 0.8 : 0.9 + R() * 0.5, x, s: side }); const ac = this.sfxOut(); if (ac) { const now = ac.currentTime + 0.02; this.sBoom(ac, now, x, false, 0.32); for (let q = 0; q < 10; q++) this.sCrk(ac, now + 0.05 + Math.random() * 0.5, x, 0.35); }
      (this.lit || (this.lit = [])).push({ x, y, h: hu, t0: performance.now() / 1000, a: 0.3, d: 1.1 }); }
    let w = 0; for (const a of A) { a.l += dt; if (a.l > a.d) continue; const k = a.l / a.d, al = (k < 0.1 ? 1 : Math.pow(1 - k, a.s ? 1.1 : 1.4)), dr = Math.pow(a.s ? 0.2 : 0.12, dt);
      for (const p of a.P) { p[2] *= dr; p[3] = p[3] * dr + (a.s ? 0.22 : 0.35) * dt; p[0] += p[2] * dt; p[1] += p[3] * dt; const [sx, sy, kk] = prjW(p[0], p[1], 0), tw = Math.random() < 0.15 ? 1.5 : 1, z = Math.max(1, 1.9 * kk * dpr);
        g.fillStyle = p[4] ? 'rgba(255,245,220,' + Math.min(1, al * tw) + ')' : 'hsla(' + a.hu + ',100%,' + (60 + 18 * (1 - k)) + '%,' + Math.min(1, al * tw) + ')'; g.fillRect(sx - z / 2, sy - z / 2, z, z); }
      A[w++] = a; } A.length = w; }
  twX(c, e) { const w = this._tw || (this._tw = [Math.random() * 6.3, Math.random() * 6.3, Math.random() * 6.3]), q = (this.exC || []).indexOf(c); return this.exWh ? Math.sin(e * 14 + w[0]) * 0.13 * (1 - e * 0.7) + Math.sin(e * 31 + w[1]) * 0.03 : Math.sin(e * 3.2 + w[Math.max(0, q) % 3]) * 0.035 * (1 - e) * (this.exS === 'pálma' ? 2.2 : 1); }
  drawTrail(g, prjW, dpr, e, fa, pal, te) { const EC = this.exC || [[0, -0.32]], N = 46, L = pal ? 1 : 0.92;
    for (const c of EC) { const pts = []; for (let j = 0; j <= N; j++) { const ee = Math.max(0, e - L + L * j / N), y = c[1] + ((this._yHw ?? 1.7) - c[1]) * (1 - ee), [sx, sy] = prjW(c[0] * (0.7 + 0.3 * ee) + this.twX(c, ee), y + (pal ? 0.06 : 0), 0); pts.push([sx, sy]); }
      const [hx, hy] = pts[N], [tx, ty] = pts[0], gr = g.createLinearGradient(hx, hy, tx, ty);
      if (pal) { gr.addColorStop(0, 'hsla(38,95%,62%,' + 0.55 * fa + ')'); gr.addColorStop(0.5, 'hsla(28,90%,42%,' + 0.42 * fa + ')'); gr.addColorStop(1, 'hsla(22,80%,30%,' + 0.12 * fa + ')'); }
      else { gr.addColorStop(0, 'hsla(48,100%,82%,' + 0.5 * fa + ')'); gr.addColorStop(0.35, 'hsla(35,100%,60%,' + 0.22 * fa + ')'); gr.addColorStop(1, 'hsla(30,90%,50%,0)'); }
      g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = gr;
      const wd = pal ? [10, 4.2] : [6, 1.8];
      for (const [k, lw] of [[0.35, wd[0]], [1, wd[1]]]) { g.globalAlpha = k; g.lineWidth = lw * dpr; g.beginPath(); pts.forEach(([x, y], j) => j ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); }
      g.globalAlpha = 1;
      if (pal) { g.strokeStyle = 'hsla(30,70%,20%,' + 0.5 * fa + ')'; g.lineWidth = 1.2 * dpr; for (let j = 3; j < N; j += 3) { const [x0, y0] = pts[j - 1], [x1, y1] = pts[j + 1], dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, w = (2 + 2.5 * (1 - j / N)) * dpr, [x, y] = pts[j]; g.beginPath(); g.moveTo(x - dy / l * w, y + dx / l * w); g.lineTo(x + dy / l * w, y - dx / l * w); g.stroke(); } }
      const ns = pal ? 5 : this.exWh ? 14 : 3; for (let q = 0; q < ns; q++) { const j = Math.floor(Math.random() * N), [x, y] = pts[j]; g.fillStyle = 'rgba(255,230,180,' + 0.8 * fa + ')'; g.fillRect(x + (Math.random() - 0.5) * 4 * dpr, y + (Math.random() - 0.5) * 4 * dpr, 1.6 * dpr, 1.6 * dpr); } } }
  drawMini(g, prjW, dpr, X, Y, Z, r, k, ph, hue, al, sd, M) { for (let j = 0; j < M; j++) { const an = j * 2.39996 + sd, fr = (j * 0.6180339 + sd) % 1, ctr = fr < 0.12, f = ctr ? fr * 2 : 0.62 + 0.38 * Math.sqrt((fr - 0.12) / 0.88), rr = r * f * (ctr ? 1 : 0.22 + 0.78 * Math.pow(Math.abs(Math.cos(k / 2 * (an + ph))), 0.7));
      const [sx, sy, kk] = prjW(X + Math.cos(an) * rr, Y + Math.sin(an) * rr, Z), a = al * (Math.random() < 0.12 ? 1 : 0.8); if (a < 0.02) continue; g.fillStyle = ctr ? 'rgba(255,248,225,' + a + ')' : 'hsla(' + hue + ',100%,' + (56 + 16 * (1 - f)) + '%,' + a + ')'; const z = Math.max(1, (ctr ? 2 : 1.8) * kk * dpr); g.fillRect(sx - z / 2, sy - z / 2, z, z); } }
  restart = () => { this.init(); this.t0 = performance.now(); this.cs = 0; };
  loop = now => { this.raf = requestAnimationFrame(this.loop); this.loop0(now); this.compose(now); };
  loop0 = now => {
    const cv = this.cvRef.current; if (!cv) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1), W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr);
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    if (!this.BF) this.BF = document.createElement('canvas'); if (this.BF.width !== W || this.BF.height !== H) { this.BF.width = W; this.BF.height = H; }
    const g = this.BF.getContext('2d'), dt = Math.min(0.05, (now - this.last) / 1000); this.last = now; this._dpr = dpr;
    const md = 'tűzijáték', rnd = false; if (rnd && this.rf === undefined) this.rf = true;
    const fire = rnd ? this.rf : md !== 'hologram';
    const XE = 1.1 + Math.max(2, +(this.props['robbanásMp'] ?? 5)) + (this.exS === 'pálma' ? 1.8 : this.exS === 'virágfénygömb' ? 1.5 : 0), CE = XE + 2.8, T = CE + 8 + (this.F === 'virág' ? 6.8 : this.F === 'kép' ? 3 : 3.2), tt = (now - this.t0) / 1000, t = fire ? tt - (this.cs || 0) : CE + 1 + tt;
    if (fire && t < 0) { this._bmT = -t; this.mus(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(0, 0, W, H); return; } this._bmT = 0;
    const bS = this.F === 'virág' ? CE + 8 + 3.57 : T - 3.2, bxg = fire && this.F !== 'kép' && t > bS ? t - bS : 0;
    this._tkN = t - CE; if (fire) this.litUpd(t, XE, bxg || (this.F === 'kép' && t - CE > 7.2 ? t - CE - 7.2 : 0)); this.mus(); if (fire) this.sfx(t, XE, bxg || (this.F === 'kép' && t - CE > 7.2 ? t - CE - 7.2 : 0), dt);
    const fzS = CE + 8, vz = this.F === 'virág' && fire, ttf = vz && t > fzS ? tt - (t - fzS) : tt; let fz = vz ? Math.max(0, Math.min(1, (t - fzS) / 1.2)) : 0; fz = fz * fz * (3 - 2 * fz); this._ttf = ttf;
    let lnk = vz ? Math.max(0, Math.min(0.74, (t - fzS) / 2.8)) : 0; this._vf = 1 - Math.max(0, Math.min(1, (lnk - 0.74) / 0.26)); this._lnk = lnk; { let q = (this.F === 'felirat' || this.F === 'kép') && fire ? Math.max(0, Math.min(1, (t - CE - 0.3) / (this.F === 'kép' ? 1.8 : 1.5))) : 0; this._flt = q * q * (3 - 2 * q) * (bxg > 0 ? Math.max(0, 1 - bxg / 0.35) : 1); this._tk = t - CE; }
    const trl = Math.max(0, Math.min(100, +(this.props['csíkHossz'] ?? 90))) / 100, trA = this.exS === 'virágfénygömb' && fire && t > 1.1 && t < XE ? 0.3 : (this.exS === 'bazsarózsa' || this.exS === 'virágfej' || this.exS === 'folyondár' || this.exS === 'banánlevél') && fire && t > 1.1 && t < XE ? 0.38 : this.exS === 'pálma' && fire && t > 1.1 && t < XE ? 0.22 : this.exS === 'gyűrű' && fire && t > 1.1 && t < XE ? 0.35 : this.exS === 'szomorúfűz' && fire && t > 1.1 && t < XE ? 0.09 : 0.2 - 0.17 * trl;
    if (rnd && tt > (this.rf ? T : 18)) { this.rf = this.rf ? Math.random() < 0.55 : true; if ((this.props['alakzat'] ?? 'Virág') === 'Véletlen') { this.pickAl(); this.applyAlak(); } else this.nextLook(); this.init(); this.t0 = now + this.pz() * 1000; this.cycle = 1; this.cs = 0; }
    else if (!rnd && fire && t > T) { if ((this.props['alakzat'] ?? 'Virág') === 'Véletlen') { this.pickAl(); this.applyAlak(); } else this.nextLook(); this.init(); this.cs = tt + this.pz(); }
    const rot = Math.PI * 2 / Math.max(3, +(this.props['forgásMp'] ?? 29)), heart = this.F === 'szív' || this.F === '3 szív', sway = this.F !== 'gömb' && this.F !== 'csápos', a = this.F === 'virág' ? ttf * rot : sway ? Math.sin(tt * rot) * (heart ? 0.85 : this.F === 'felirat' || this.F === 'kép' ? 0 : 0.45) : tt * rot, ca = Math.cos(a), sa = Math.sin(a), b = this.F === 'virág' ? 0.62 + 0.95 * fz : sway ? 0.1 : 0.38, cb = Math.cos(b), sb = Math.sin(b);
    const cx = W / 2, cy = H / 2, R = this.F === 'felirat' ? Math.min(Math.min(W, H) * 0.3, W * 0.44 / (2.5 * 1.25)) : Math.min(W, H) * 0.3;
    const prj = (x, y, z) => { const x1 = x * ca + z * sa, z1 = -x * sa + z * ca, y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb; const k = 3 / (3 + z2); return [cx + x1 * R * k, cy + y1 * R * k, k, z2]; };
    const prjW = (x, y, z) => { const k = 3 / (3 + z); return [cx + x * R * k, cy + y * R * k, k, z]; }; this._prjW = prjW; this._xm = W / 2 / R; this._ym = H / 2 / R; this._yHw = (H * this.hzF(W, H) - cy) / R;
    const holoPh = t >= CE, fade = bxg > 0 ? 1 - Math.max(0, (bxg - 2.6) / 0.6) : fire && t > T - 1 ? 1 - (t - (T - 1)) : 1;
    g.globalCompositeOperation = 'source-over'; g.fillStyle = holoPh ? (bxg > 0 ? 'rgba(0,0,0,0.62)' : 'rgba(0,0,0,0.38)') : 'rgba(0,0,0,' + (fire && t > 1.1 && t < XE + 0.6 ? (heart ? 0.32 : trA) : 0.2) + ')'; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'lighter';
    if (!fire || t > XE - 0.8) { if (!this.conf) { const R = Math.random; this.conf = Array.from({ length: 150 }, () => ({ x: R(), y: R(), v: 0.07 + R() * 0.08, sw: 0.6 + R() * 1.2, am: 0.6 + R() * 1.4, rs: (R() - 0.5) * 4, fs: 2 + R() * 4, ph: R() * 6.283, s: 5 + R() * 6, hu: 40 + R() * 12, l: 50 + R() * 24 })); }
      const ts = fire ? t - (XE - 0.8) : tt, fi = Math.min(1, ts / 0.8) * fade; g.globalCompositeOperation = 'source-over';
      for (const c of this.conf) { const d = ts * c.v * H - c.y * H * 1.1; if (d < 0) continue; const y = (d % (H * 1.1)) - H * 0.05, x = c.x * W + Math.sin(ts * c.sw + c.ph) * c.am * W * 0.025, fl = Math.cos(ts * c.fs + c.ph), z = c.s * dpr;
        g.save(); g.translate(x, y); g.rotate(ts * c.rs + c.ph); g.scale(Math.max(0.12, Math.abs(fl)), 1); g.fillStyle = 'hsla(' + c.hu + ',90%,' + (c.l - 18 * (1 - Math.abs(fl))) + '%,' + 0.85 * fi + ')'; g.fillRect(-z / 2, -z * 0.3, z, z * 0.6); g.restore(); }
      g.globalCompositeOperation = 'lighter'; }
    const n = this.n, [p, v, s, tg] = [this.p, this.v, this.s, this.tg];
    if (fire && t < 1.1) {
      const k = t / 1.1, e = 1 - Math.pow(1 - k, 2);
      this.drawTrail(g, prjW, dpr, e, 1, false);
      for (const c of (this.exC || [[0, -0.32]])) { const y = c[1] + ((this._yHw ?? 1.7) - c[1]) * (1 - e), [sx, sy] = prjW(c[0] * (0.7 + 0.3 * e) + this.twX(c, e), y, 0);
      g.fillStyle = 'hsla(45,100%,80%,1)'; g.beginPath(); g.arc(sx, sy, 3.4 * dpr, 0, 7); g.fill();
      for (let j = 0; j < 6; j++) { g.fillStyle = 'hsla(35,100%,60%,' + (0.5 - j * 0.07) + ')'; g.fillRect(sx - dpr + (Math.random() - 0.5) * 3 * dpr, sy + j * 6 * dpr + Math.random() * 6 * dpr, 2 * dpr, 2 * dpr); } }
    } else if (fire && t < XE) {
      if (!this.exploded) { this.explode(); if (this.exWh) { const v = this.v, k = Math.min(1.5, (this._xm || 0.9) * 1.1) * 0.45; this.exD = 0.5; this.exG = 0.45; for (let i = 0; i < this.n; i++) { const sp = 0.75 + Math.random() * 0.5; v[0][i] *= k * 0.72 * sp; v[1][i] = (v[1][i] < 0 ? v[1][i] * 0.5 : v[1][i] * 0.35) * sp; } } else if (this.exS !== 'virágfénygömb') this.fitEx(W, H, R); this.applyDepth(); }
      { const te0 = t - 1.1, pal = this.exS === 'pálma', fa = pal ? Math.max(0, Math.min(1, (XE - t) / 0.8)) * Math.min(1, 0.55 + te0 * 0.8) : Math.exp(-te0 / 0.7); if (fa > 0.02) this.drawTrail(g, prjW, dpr, 1, fa, pal, te0); }
      const te = t - 1.1, tH = 0.9, hold = te > tH && this.exS !== 'szomorúfűz', hk = hold ? Math.min(1, (te - tH) / 0.4) : 0, pa = 0;
      const dE = hold ? dt : dt * 1.6, dr = Math.pow(this.exD ?? 0.25, dE) * (1 - hk) + Math.pow(0.03, dt) * hk, gv = 0.55 * (this.exG ?? 1) * (1 - hk), xm = W / 2 / R * 0.85, ym = H / 2 / R * 0.8, cl = 1 - Math.pow(0.15, dt), EC = this.exC || [[0, -0.32]];
      if (!hold || !this.crk) this.crk = [];
      { const D = XE - 1.1, u = Math.max(0, Math.min(1, (te / D - 0.3) / 0.5)), on = this.exS !== 'pálma'; this._csOn = on; this._csS = on ? u * u * (3 - 2 * u) * (this.exS === 'szomorúfűz' ? 0.45 : 0.85) : 0; this._csF = on ? Math.pow(Math.max(0, 1 - te / 0.22), 1.5) : 0;
        if (te < 0.16) { const Z = this.exZ || []; g.globalCompositeOperation = 'lighter'; EC.forEach((c, q) => { const z = Z[q] ?? 1, [sx, sy] = prjW(c[0], c[1], 0), r0 = (prjW(c[0] + 0.32 * z, c[1], 0)[0] - sx) * (0.6 + te * 3), a = 1 - te / 0.16; const gr = g.createRadialGradient(sx, sy, 0, sx, sy, r0); gr.addColorStop(0, 'rgba(255,255,255,' + 0.9 * a + ')'); gr.addColorStop(0.3, 'rgba(255,245,220,' + 0.4 * a + ')'); gr.addColorStop(1, 'rgba(255,240,210,0)'); g.fillStyle = gr; g.fillRect(sx - r0, sy - r0, 2 * r0, 2 * r0); }); } }
      if (!hold) { this.hs = null; this.MF = null; } else if (!this.hs) { const S = new Float32Array(n * 2), CI = new Uint8Array(n), D = new Float32Array(n * 2), M = EC.map(() => 1);
        for (let i = 0; i < n; i++) { const x = p[0][i], y = p[1][i]; S[i * 2] = x; S[i * 2 + 1] = y; const b = i % EC.length; CI[i] = b; const c = EC[b];
          if (Math.abs(x - c[0]) > 1e-3) M[b] = Math.max(M[b], Math.abs(x) / xm > 1 ? Math.abs(x - c[0]) / Math.max(0.05, xm - Math.sign(x) * c[0]) : 0); if (Math.abs(y - c[1]) > 1e-3) M[b] = Math.max(M[b], Math.abs(y) / ym > 1 ? Math.abs(y - c[1]) / Math.max(0.05, ym - Math.sign(y) * c[1]) : 0);
          const an = Math.random() * 6.283, sp = (0.015 + Math.random() * 0.045) * ((this.exZ || [])[b] ?? 1) * (this.exIn && this.exIn[i] ? 0.35 : 1); D[i * 2] = Math.cos(an) * sp; D[i * 2 + 1] = Math.sin(an) * sp; v[0][i] = 0; v[1][i] = 0; v[2][i] = 0; }
        this.hs = { S, CI, D, sc: M.map(() => 1) };
        if (this.exS === 'virágfej') { const ph = this._vph || 0, MF = this.MF = [], HU = [120, 52, 212, 0, 282]; let hc = 0;
          EC.forEach((c, b) => { for (let m = 0; m < 5; m++) { const an = m * Math.PI / 2.5 - ph - b, ca = Math.cos(an), sa = Math.sin(an); let best = 0, bx = c[0] + ca * 0.3, by = c[1] + sa * 0.3;
            for (let i = 0; i < n; i += 2) { if (CI[i] !== b) continue; const dx = S[i * 2] - c[0], dy = S[i * 2 + 1] - c[1], d = Math.hypot(dx, dy); if (d > best && (dx * ca + dy * sa) / (d || 1) > 0.97) { best = d; bx = S[i * 2]; by = S[i * 2 + 1]; } }
            const dd = Math.hypot(bx - c[0], by - c[1]);
            MF.push({ x: bx + ca * dd * 0.4, y: by + sa * dd * 0.4, d: dd * 1.4, r: dd * 0.4, k: 5, ph: Math.random() * 6.3, h: HU[hc++ % 5], sd: Math.random() * 9, cx: c[0], cy: c[1] });
            MF.push({ x: c[0] + Math.cos(an + 0.63) * dd * 0.95, y: c[1] + Math.sin(an + 0.63) * dd * 0.95, d: dd * 0.95, r: dd * 0.28, k: 5, ph: Math.random() * 6.3, h: HU[hc++ % 5], sd: Math.random() * 9, cx: c[0], cy: c[1] }); } }); } }
      const HS = this.hs, hd = hold ? te - tH : 0, hk2 = hk * hk * (3 - 2 * hk);
      if (this.exS === 'virágfénygömb') this.drawVFG(g, t - 1.1, XE - 1.1, prjW, dpr, tt); else for (let i = 0; i < n; i++) {
        v[0][i] *= dr; v[1][i] = v[1][i] * dr + gv * dE; if (this.wv) { v[0][i] += this.wv[0][i] * dt; v[1][i] += this.wv[1][i] * dt; } if (this.cu && this.cu[i]) { const w = this.cu[i] * dt, cw = Math.cos(w), sw = Math.sin(w), vx = v[0][i]; v[0][i] = vx * cw - v[1][i] * sw; v[1][i] = vx * sw + v[1][i] * cw; } v[2][i] *= dr; p[0][i] += v[0][i] * dE; p[1][i] += v[1][i] * dE; p[2][i] += v[2][i] * dE;
        let ecx = EC[0][0], ecy = EC[0][1];
        if (hold) { const b = HS.CI[i], c = EC[b], f = 1 + (HS.sc[b] - 1) * hk2; ecx = c[0]; ecy = c[1]; p[0][i] = c[0] + (HS.S[i * 2] - c[0]) * f + HS.D[i * 2] * hd; p[1][i] = c[1] + (HS.S[i * 2 + 1] - c[1]) * f + HS.D[i * 2 + 1] * hd + 0.028 * hd * hd * (0.35 + Math.hypot(HS.S[i * 2] - c[0], HS.S[i * 2 + 1] - c[1]));
          if (t < XE - 0.3 && Math.random() < 0.006) this.crk.push({ x: p[0][i], y: p[1][i], vx: (p[0][i] - ecx) * (0.6 + Math.random()) + (Math.random() - 0.5) * 0.5, vy: (p[1][i] - ecy) * (0.6 + Math.random()) + (Math.random() - 0.5) * 0.5, l: 0.35 + Math.random() * 0.3 }); }
        const [sx, sy, k] = prjW(p[0][i] + (p[0][i] - ecx) * pa, p[1][i] + (p[1][i] - ecy) * pa, p[2][i]), life = Math.max(0, 1 - (t - 1.1) / (XE - 1.1 + 1)), tw = hold ? (Math.random() < 0.2 ? 2 : 0.85) : Math.random() < 0.12 ? 1.6 : 1;
        if (this.bb && this.bb[i]) { g.fillStyle = ['', 'rgba(255,105,180,', 'rgba(255,225,40,', 'rgba(255,255,255,'][this.bb[i]] + Math.min(1, 0.55 + life) * tw + ')'; const z = Math.max(1.2, 2.6 * k * dpr); g.fillRect(sx - z / 2, sy - z / 2, z, z); }
        else if ((heart || this.trgb) && this.exS !== 'pálma') { const cf = Math.max(0, Math.min(1, (t - 1.1) / (XE - 1.1) * 1.7 - 0.7)) * 0.6, z = 6 * k * dpr; g.fillStyle = this.colAt(i, cf, tt, Math.min(1, 0.35 + life) * tw); if (heart) { g.setTransform(z, 0, 0, z, sx, sy); g.fill(this.HP); g.setTransform(1, 0, 0, 1, 0, 0); } else { const zz = Math.max(1, 2.4 * k * dpr * (this.exIn && this.exIn[i] ? 1.7 : 1)); if (this.exIn && this.exIn[i] && this.exS === 'krizantém') (this._ip || (this._ip = [])).push(sx, sy, zz, g.fillStyle); else g.fillRect(sx - zz / 2, sy - zz / 2, zz, zz); } }
        else { const wl = this.exS === 'szomorúfűz', h2 = this._csOn && this.exR2 ? this.exR2[i % this.exR2.length].h : this.hue[i], dh = ((h2 - this.hue[i]) % 360 + 540) % 360 - 180, csF = this._csOn ? this._csF : 0, inr = this.exIn && this.exIn[i]; g.fillStyle = 'hsla(' + (this.hue[i] + (inr ? 0 : dh * (this._csOn ? this._csS : 0))) + ',' + (100 - 85 * csF) + '%,' + Math.min(97, csF * 40 + (inr ? (this.exS === 'krizantém' ? 50 : 48) + 6 * life : wl ? 48 + 10 * life : this.exS === 'pálma' ? 46 + 6 * life : this.exS === 'folyondár' ? 52 + 8 * life : 62 + 20 * life)) + '%,' + Math.min(1, 0.35 + life) * tw * (wl ? 0.4 : this.exS === 'pálma' ? 0.2 : this.exS === 'banánlevél' || this.exS === 'folyondár' ? 0.45 : 1) + ')'; const z = Math.max(1, 2.2 * k * dpr * (inr ? 1.7 : 1)); if (inr && this.exS === 'krizantém') (this._ip || (this._ip = [])).push(sx, sy, z, g.fillStyle); else g.fillRect(sx - z / 2, sy - z / 2, z, z); }
      }
      if (this._ip && this._ip.length) { const ip = this._ip, oc = g.globalCompositeOperation; g.globalCompositeOperation = 'source-over'; for (let q = 0; q < ip.length; q += 4) { g.fillStyle = ip[q + 3]; g.fillRect(ip[q] - ip[q + 2] / 2, ip[q + 1] - ip[q + 2] / 2, ip[q + 2], ip[q + 2]); } g.globalCompositeOperation = oc; ip.length = 0; }
      if (this.MF && hold) { const a = Math.max(0, hd - 0.12), gw = Math.min(1, a / 0.5), gr = 1 - Math.pow(1 - gw, 3), en = Math.max(0, Math.min(1, (XE - t) / 0.5)), f = gr * en, bX = W / 2 / R * 0.93, bY = H / 2 / R * 0.93;
        if (f > 0.01) for (const q of this.MF) { const dx = q.x - q.cx, dy = q.y - q.cy, l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, rr = q.r * 1.05, md = Math.max(0, Math.min(ux > 1e-3 ? (bX - rr - q.x) / ux : ux < -1e-3 ? (-bX + rr - q.x) / ux : 9, uy > 1e-3 ? (Math.min(bY, (this._yHw ?? bY) - 0.03) - rr - q.y) / uy : uy < -1e-3 ? (-bY + rr - q.y) / uy : 9, 1.6)), mv = md * (1 - Math.exp(-0.38 * a / Math.max(0.05, md))); this.drawMini(g, prjW, dpr, q.x + ux * mv, q.y + uy * mv, 0, q.r * f, q.k, q.ph + hd * 0.25, q.h, Math.min(1, gw * 2) * (0.5 + 0.5 * en), q.sd, 220); } }
      if (this.crk.length) { const cr = this.crk; let w = 0; for (const c of cr) { c.l -= dt; if (c.l <= 0) continue; c.vy += 0.4 * dt; c.x += c.vx * dt; c.y += c.vy * dt; const [sx, sy, k] = prjW(c.x, c.y, 0), z = Math.max(1, 1.8 * k * dpr); g.fillStyle = 'rgba(255,240,200,' + Math.min(1, c.l * 2.5) + ')'; g.fillRect(sx - z / 2, sy - z / 2, z, z); cr[w++] = c; } cr.length = w; }
    } else {
      const br = this.F === 'gömb' ? 1 + 0.12 * Math.sin(tt * 2 * Math.PI / 5) : 1;
      if (this.F === 'logó' || this.F === 'virág' || this.F === 'felirat' || (this.F === 'csápos' && this.csBone)) g.globalCompositeOperation = 'source-over';
      let ck = 1; const kk = fire && t < CE ? (t - XE) / 2.8 : 1, pg = this.exS === 'pálma' && fire && t < CE, cfC = pg ? Math.pow(Math.max(0, Math.min(1, (kk - 0.8) / 0.2)), 1.5) : Math.min(1, 0.6 + 0.4 * Math.min(1, kk * 2.5)), pgA = pg ? 0.2 + 0.8 * Math.pow(Math.max(0, Math.min(1, (kk - 0.75) / 0.25)), 1.5) : 1;
      if (fire && t < CE) { if (!this.conv0) { for (let q = 0; q < 3; q++) s[q].set(p[q]); this.conv0 = true; } const k = (t - XE) / 2.8; ck = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }
      const fitF = this.F !== 'kép'; let fS = 1, fO = 0; if (fitF) { const gm = this.F === 'gömb' ? 1.16 : 1.04, bl = (this._yHw ?? 1.5) - 0.12, tl = -(this._ym ?? 1.9) + 0.06, B = Math.max(0.3, this._fyB ?? 1) * gm, Tp = Math.min(-0.3, this._fyT ?? -1) * gm; const sc = Math.min(1, (bl - tl) / Math.max(0.01, B - Tp)); let o = Math.min(0, bl - B * sc); if (Tp * sc + o < tl) o = tl - Tp * sc; if (this._fS == null) { this._fS = sc; this._fO = o; } else { this._fS += (sc - this._fS) * 0.12; this._fO += (o - this._fO) * 0.12; } fS = this._fS; fO = this._fO; }
      const hu = this.holoHue(0, tt, 0), cyF = cy + fO * R, brF = br * fS;
      if (this.fv === 'cukor' && this.F === 'fenyő' && ck >= 1 && this.BL) for (const L of this.BL) { const fx = L.x, fy = L.fy - 0.07, x1 = fx * ca, z1 = -fx * sa, y1 = fy * cb - z1 * sb, z2 = fy * sb + z1 * cb, [gx, gy] = prjW(x1, y1, z2), pu = 0.5 + 0.5 * Math.sin(tt * 3.2 + L.ph * 1.3), fl = 0.8 + 0.4 * pu, hb = (tt * 45 + L.ph * 72) % 360;
        const gr = g.createRadialGradient(gx, gy, 0, gx, gy, R * 0.26 * fl); gr.addColorStop(0, 'hsla(' + hb + ',100%,60%,' + (0.1 + 0.2 * pu) * fade + ')'); gr.addColorStop(1, 'hsla(' + hb + ',100%,55%,0)'); g.fillStyle = gr; g.beginPath(); g.arc(gx, gy, R * 0.28 * fl, 0, 7); g.fill(); }
      if (holoPh && this.F === 'gömb' && bxg > 0) { g.globalCompositeOperation = 'lighter'; const al3 = Math.max(0, 1 - Math.max(0, bxg - 2.4) / 0.8);
        for (let q = 0; q < 260; q++) { const an = q / 260 * 6.283 + ((q * 0.37) % 1) * 0.05, rr = R * (0.97 * brF + Math.pow(bxg, 1.25) * (0.5 + ((q * 0.618) % 1) * 1.6)), sx = cx + Math.cos(an) * rr, sy = cyF + Math.sin(an) * rr, z = (1.6 + bxg * 0.6) * dpr;
          g.fillStyle = 'hsla(' + hu + ',100%,65%,' + al3 * (0.6 + 0.4 * Math.sin(tt * 9 + q)) + ')'; g.fillRect(sx - z * 1.5, sy - z * 0.28, z * 3, z * 0.56); g.fillRect(sx - z * 0.28, sy - z * 1.5, z * 0.56, z * 3); } }
      if (holoPh && this.F === 'gömb' && bxg <= 0) {
        const gr = g.createRadialGradient(cx, cyF, R * 0.82 * brF, cx, cyF, R * 1.12 * brF); gr.addColorStop(0, 'hsla(' + hu + ',100%,60%,0)'); gr.addColorStop(0.55, 'hsla(' + hu + ',100%,60%,' + 0.16 * fade + ')'); gr.addColorStop(1, 'hsla(' + hu + ',100%,60%,0)');
        g.fillStyle = gr; g.beginPath(); g.arc(cx, cyF, R * 1.15 * brF, 0, 7); g.fill();
      }
      for (let i = 0; i < n; i++) {
        const ox = this.ox[i]; let tx = tg[0][i] - ox, ty = tg[1][i], tz = tg[2][i], sl = -1; const qq = this.ty8 ? this.ty8[i] : -1;
        if (this.ty8) { const q = this.ty8[i];
          if (q === 12 || q === 13) { let o = Math.max(0, Math.min(1, (t - CE - 0.2) / 3.5)); o = o * o * (3 - 2 * o); o *= 0.9 + 0.1 * Math.sin(this._ttf * 2 * Math.PI / 7); const P3 = this._p3 || (this._p3 = [0, 0, 0]); this.viragPt(i, o, tt, P3); tx = P3[0]; ty = P3[1]; tz = P3[2]; }
          else if (q === 14) { const P3 = this._p3 || (this._p3 = [0, 0, 0]); this.csPt(i, tt, P3); tx = P3[0]; ty = P3[1]; tz = P3[2]; }
          else if (q === 8) { let m = Math.max(0, Math.min(1, (t - CE - 0.6) / 1.8)); m = m * m * (3 - 2 * m); tx = this.al[0][i] + (tx - this.al[0][i]) * m; ty = this.al[1][i] + (ty - this.al[1][i]) * m; tz = this.al[2][i] + (tz - this.al[2][i]) * m; }
          else if (q === 3) { const bx = this.cc[i], aa = tt * (bx > 0.5 ? -1.1 : 1.3), dx = tx - bx, dz = tz; tx = bx + dx * Math.cos(aa) + dz * Math.sin(aa); tz = -dx * Math.sin(aa) + dz * Math.cos(aa); }
          else if (q === 5 && ck >= 1) { const sdi = this.sd[i]; sl = (tt * 1.1 + sdi * 7) % 1; const an = sdi * 40, sp = 0.18 + (sdi * 13 % 1) * 0.32; tx += Math.cos(an) * sl * sp; ty += Math.sin(an) * sl * sp + sl * sl * 0.22; tz += Math.sin(an * 1.7) * sl * sp * 0.6; } }
        const x1 = tx * ca + tz * sa + ox, z1 = -tx * sa + tz * ca, y1 = ty * cb - z1 * sb, z2 = ty * sb + z1 * cb;
        let X = x1 * br, Y = y1 * br, Z = z2 * br, h = this.holoHue(ty, tt, i);
        if (fitF) { if (Y > this._fyB) this._fyB = Y; if (Y < this._fyT) this._fyT = Y; X *= fS; Y = Y * fS + fO; Z *= fS; }
        if (ck < 1) { X = s[0][i] + (X - s[0][i]) * ck; Y = s[1][i] + (Y - s[1][i]) * ck; Z = s[2][i] + (Z - s[2][i]) * ck; h = this.hue[i] + (h - this.hue[i]) * ck; }
        if (bxg > 0) { const r = Math.hypot(X, Y - fO) || 0.01, e2 = Math.pow(bxg, 1.25) * (0.5 + ((i * 0.618) % 1) * 1.6), ja = (((i * 0.37) % 1) - 0.5) * 0.9, ux = X / r, uy = (Y - fO) / r; X += (ux * Math.cos(ja) - uy * Math.sin(ja)) * e2; Y += (ux * Math.sin(ja) + uy * Math.cos(ja)) * e2; }
        const [sx, sy, k] = prjW(X, Y, Z), front = 0.35 + 0.65 * (1 - (Z + 1) / 2), tw = Math.random() < 0.04 ? 1.7 : 1;
        if (heart || this.trgb) { const al = Math.min(1, front * tw) * fade * pgA * (vz ? this._vf : 1) * (this.F === 'felirat' || this.F === 'kép' ? 1 - (this._flt || 0) : 1) * (qq === 13 ? 1 : 1 - Math.max(0, Math.min(1, ((this._lnk || 0) - 0.72) / 0.28))) * (sl >= 0 ? 1 - sl : 1) * (sl >= 0 ? 1.6 : 1);
          if (heart && holoPh && i % 10 < 3) { g.fillStyle = this.colAt(i, 1, tt, 0.07 * fade); const gz = 9 * k * dpr; g.fillRect(sx - gz / 2, sy - gz / 2, gz, gz); }
          if ((qq === 11 || qq === 8) && ck >= 1 && this.LP) { const sw = ((tt * 0.3) % 1) * 3.6 - 1.8, dd = (tg[0][i] + tg[1][i]) * 0.7071 - sw, bd = Math.exp(-dd * dd / 0.02), C = this.trgb[i], kf = 0.92 + 0.45 * bd;
            g.fillStyle = 'rgba(' + Math.min(255, Math.round(C[0] * kf + 120 * bd)) + ',' + Math.min(255, Math.round(C[1] * kf + 110 * bd)) + ',' + Math.min(255, Math.round(C[2] * kf + 90 * bd)) + ',' + al + ')'; }
          else if (qq === 9 && ck >= 1) { const N = this.FN[this.fc[i]], nx = N[0] * ca + N[2] * sa, ny = N[1], nz = -N[0] * sa + N[2] * ca, df = Math.max(0, nx * -0.42 + ny * -0.5 + nz * -0.76);
            let lx = Math.sin(tt * 0.9) * 0.85, ly = -0.3, lz = -0.45; const ll = Math.hypot(lx, ly, lz); const sp = Math.pow(Math.max(0, (nx * lx + ny * ly + nz * lz) / ll), 22) * 0.95, C = this.trgb[i], kf = 0.42 + 0.78 * df;
            g.fillStyle = 'rgba(' + Math.min(255, Math.round(C[0] * kf + 255 * sp)) + ',' + Math.min(255, Math.round(C[1] * kf + 245 * sp)) + ',' + Math.min(255, Math.round(C[2] * kf + 220 * sp)) + ',' + al + ')'; }
          else if (qq === 6 && ck >= 1) { const ph = this.bk[i], pu = 0.5 + 0.5 * Math.sin(tt * 3.2 + ph * 1.3); g.fillStyle = 'hsla(' + ((tt * 45 + ph * 72) % 360) + ',100%,' + (55 + 25 * pu) + '%,' + Math.min(1, al * (0.55 + 0.6 * pu)) + ')'; }
          else g.fillStyle = this.colAt(i, cfC, tt, al);
          if (ck < 1 && heart) { const z = (6 - 4 * ck) * k * dpr; g.setTransform(z, 0, 0, z, sx, sy); g.fill(this.HP); g.setTransform(1, 0, 0, 1, 0, 0); } else if (sl >= 0) { const z = Math.max(1, 2.8 * k * dpr * (1 - sl * 0.5)); g.fillRect(sx - z / 2, sy - z / 2, z, z); } else { const z = Math.max(1, (this.F === 'logó' && this.LP ? 1.2 : this.F === 'virág' ? 1.8 : this.F === 'felirat' ? 1.6 : 2.1) * k * dpr); if (bxg > 0) { const zz = z * (1.4 + bxg * 0.45); g.fillRect(sx - zz * 1.5, sy - zz * 0.28, zz * 3, zz * 0.56); g.fillRect(sx - zz * 0.28, sy - zz * 1.5, zz * 0.56, zz * 3); } else g.fillRect(sx - z / 2, sy - z / 2, z, z); }
          continue; }
        g.fillStyle = 'hsla(' + h + ',100%,' + (58 + 22 * front) + '%,' + Math.min(1, front * tw) * fade + ')'; const z = Math.max(1, 2.1 * k * dpr); g.fillRect(sx - z / 2, sy - z / 2, z, z);
      }
      if (this.F === 'kép' && this._flt > 0 && this.KP) { const K = this.KP, p0 = prjW(0, this.kOy || 0, 0), p1 = prjW(1, this.kOy || 0, 0), u = (p1[0] - p0[0]) * (this.kSc || 1), w = K.hw * u, hh = K.hh * u, x0 = p0[0] - w / 2, y0 = p0[1] - hh / 2, tk = this._tk;
        const bx = tk - 7.2, bo = bx > 0 ? Math.max(0, 1 - bx / 0.35) : 1;
        g.save(); g.globalCompositeOperation = 'source-over'; g.globalAlpha = this._flt * (bx > 0 ? bo : fade); if (g.globalAlpha > 0) g.drawImage(K.body, x0, y0, w, hh);
        let ea = Math.max(0, Math.min(1, (tk - 2.4) / 0.8)); ea = ea * ea * (3 - 2 * ea) * bo;
        if (K.wolf && g.globalAlpha > 0) { const sn = Math.max(0, tk - 2.6), c0 = Math.max(0, Math.min(1, (sn - 0.3) / 0.7)), cy = c0 * c0 * (3 - 2 * c0), op = ea * (0.03 + 0.14 * cy), hx = p0[0] + K.hx * u, hy = p0[1] + K.hy * u;
          if (ea > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = ea * fade * (0.55 + 0.45 * Math.sin(tt * 3.1)); g.shadowColor = 'rgba(255,110,25,1)'; g.shadowBlur = 26 * dpr; g.drawImage(K.eye, x0, y0, w, hh); g.restore(); } }
        if (bx > 0) { g.globalCompositeOperation = 'lighter'; const e2 = Math.pow(bx, 1.35); for (const s2 of K.ST) { const sx = p0[0] + (s2[0] + s2[2] * e2) * u, sy = p0[1] + (s2[1] + s2[3] * e2) * u, tw2 = 0.65 + 0.35 * Math.sin(tt * 9 + s2[7]), z = s2[8] * dpr * (1 + bx * 0.5);
            if (sx < -20 || sy < -20 || sx > W + 20 || sy > H + 20) continue; g.globalAlpha = Math.min(1, 0.3 + bx * 2) * tw2; g.fillStyle = 'rgb(' + s2[4] + ',' + s2[5] + ',' + s2[6] + ')'; g.fillRect(sx - z * 1.6, sy - z * 0.3, z * 3.2, z * 0.6); g.fillRect(sx - z * 0.3, sy - z * 1.6, z * 0.6, z * 3.2); } g.globalCompositeOperation = 'source-over'; }
        if (K.glow && g.globalAlpha > 0) { const A = g.globalAlpha;
          const ej = Math.max(0, Math.min(1, (tk - 0.8) / 0.5)) * bo; if (K.glow === 'korona' && ej > 0 && K.JW.length) { g.save(); g.globalCompositeOperation = 'lighter'; const nJ = K.JW.length, ph = (Math.max(0, tk - 0.8) * 3.2) % (nJ + 2); K.JW.forEach(([jx, jy, jr], q) => { const dd = Math.abs(ph - q), b = Math.max(0, 1 - dd / 1.1); const a2 = ej * A * (0.18 + 0.82 * b * b); if (a2 < 0.02) return; const X = p0[0] + jx * u, Y = p0[1] + jy * u, R2 = jr * u * (1.8 + 1.6 * b); const gr = g.createRadialGradient(X, Y, 0, X, Y, R2); gr.addColorStop(0, 'rgba(255,252,235,' + a2 + ')'); gr.addColorStop(0.35, 'rgba(255,215,120,' + 0.6 * a2 + ')'); gr.addColorStop(1, 'rgba(255,170,60,0)'); g.fillStyle = gr; g.fillRect(X - R2, Y - R2, 2 * R2, 2 * R2); if (b > 0.6) { g.fillStyle = 'rgba(255,255,255,' + a2 + ')'; const z = R2 * 0.9; g.fillRect(X - z, Y - 0.6 * dpr, 2 * z, 1.2 * dpr); g.fillRect(X - 0.6 * dpr, Y - z, 1.2 * dpr, 2 * z); } }); g.restore(); }
          if (K.glow === 'szem' && !(bx > 0)) { const t2 = Math.max(0, tk - 1.6), op = Math.min(1, t2 / 1.4), o2 = op * op * (3 - 2 * op), br = t2 > 2.6 ? 0.5 - 0.5 * Math.cos((t2 - 2.6) * 2 * Math.PI / 6) : 0, f = 1 + 0.4 * o2 * (t2 < 2.6 ? Math.sin(Math.min(1, t2 / 2.6) * Math.PI) : 0) + 0.14 * br, R2 = K.pr * u * f, X = p0[0], Y = p0[1];
            if (f > 1.005) { g.save(); g.globalCompositeOperation = 'source-over'; g.globalAlpha = A; const gr = g.createRadialGradient(X, Y, R2 * 0.92, X, Y, R2 * 1.08); g.fillStyle = '#000'; g.beginPath(); g.arc(X, Y, R2, 0, 7); g.fill(); g.globalCompositeOperation = 'lighter'; gr.addColorStop(0, 'rgba(150,230,255,0)'); gr.addColorStop(0.5, 'rgba(170,235,255,' + 0.75 * A + ')'); gr.addColorStop(1, 'rgba(150,230,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(X, Y, R2 * 1.08, 0, 7); g.fill(); g.restore(); }
            { const ef = Math.max(0, Math.min(1, (tk - 1.0) / 1.4)) * A, RI = 0.39 * K.hw * u; if (ef > 0.01) {
                if (!K.HR) { let sd = 7; const rn = () => (sd = (sd * 16807) % 2147483647) / 2147483647, H = K.HR = { up: [], lo: [], br: [] };
                  for (let q = 0; q < 74; q++) { const t = Math.min(0.97, Math.max(0.03, (q + rn() * 0.8) / 74)); H.up.push([t, (0.2 + 0.34 * Math.pow(1 - t, 1.3)) * (0.7 + 0.45 * rn()), (rn() - 0.5) * 0.25, rn() < 0.22]); }
                  for (let q = 0; q < 26; q++) { const t = 0.08 + 0.84 * Math.pow(rn(), 0.8); H.lo.push([t, (0.06 + 0.1 * (1 - t)) * (0.6 + 0.6 * rn()), (rn() - 0.5) * 0.4]); }
                  for (let q = 0; q < 460; q++) { const t = Math.pow(rn(), 0.85), w = (rn() - 0.5) * 2; H.br.push([t, w, (0.1 + 0.11 * rn()) * (1 - 0.35 * t), (rn() - 0.5) * 0.35, rn()]); } }
                const H = K.HR, Q = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c, P2 = (A0, C0, B0, t) => [X + RI * Q(A0[0], C0[0], B0[0], t), Y + RI * Q(A0[1], C0[1], B0[1], t)], D2 = (A0, C0, B0, t) => { const dx = 2 * (1 - t) * (C0[0] - A0[0]) + 2 * t * (B0[0] - C0[0]), dy = 2 * (1 - t) * (C0[1] - A0[1]) + 2 * t * (B0[1] - C0[1]), l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
                const uL = [-1.36, 0.02], uR = [1.3, 0.16], uC = [-0.12, -2.08], lC = [0.02, 1.9], cA = [-1.24, -0.3], cC = [-0.12, -2.55], cB = [1.18, -0.12];
                g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.shadowColor = 'rgba(90,200,255,0.85)'; g.shadowBlur = 9 * dpr;
                const curve = (A0, C0, B0, st, lw) => { const a = P2(A0, C0, B0, 0), c = [X + RI * C0[0], Y + RI * C0[1]], b = P2(A0, C0, B0, 1); g.strokeStyle = st; g.lineWidth = lw * dpr; g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(c[0], c[1], b[0], b[1]); g.stroke(); };
                curve(uL, uC, uR, 'rgba(175,235,255,' + 0.9 * ef + ')', 2.4); curve(uL, lC, uR, 'rgba(150,215,245,' + 0.5 * ef + ')', 1.3); curve(cA, cC, cB, 'rgba(150,210,240,' + 0.22 * ef + ')', 1.1);
                g.shadowBlur = 0; const pu = [new Path2D(), new Path2D()]; g.lineWidth = 1.05 * dpr; for (const [t, L, jt, gd] of H.up) { const [px, py] = P2(uL, uC, uR, t), [tx, ty] = D2(uL, uC, uR, t), nx = ty, ny = -tx, sd = (t - 0.22) * 1.7 + jt, sx = tx * sd, sy = ty * sd, Lp = L * RI * 1.15;
                  const pp = pu[gd ? 1 : 0]; pp.moveTo(px, py); pp.bezierCurveTo(px + nx * 0.55 * Lp, py + ny * 0.55 * Lp, px + (nx * 1.0 + sx * 0.3) * Lp, py + (ny * 1.0 + sy * 0.3) * Lp, px + (nx * 0.7 + sx * 1.05) * Lp, py + (ny * 0.7 + sy * 1.05) * Lp - Lp * (0.25 + 0.45 * t * t)); } g.strokeStyle = 'rgba(185,240,255,' + 0.85 * ef + ')'; g.stroke(pu[0]); g.strokeStyle = 'rgba(255,215,140,' + 0.85 * ef + ')'; g.stroke(pu[1]);
                g.lineWidth = 0.8 * dpr; const pl = new Path2D(); for (const [t, L, jt] of H.lo) { const [px, py] = P2(uL, lC, uR, t), [tx, ty] = D2(uL, lC, uR, t), nx = -ty, ny = tx, out = (0.5 - t) * 0.8 + jt, dx = nx + tx * out, dy = ny + ty * out, l = Math.hypot(dx, dy), Lp = L * RI; pl.moveTo(px, py); pl.lineTo(px + dx / l * Lp, py + dy / l * Lp); } g.strokeStyle = 'rgba(160,220,250,' + 0.5 * ef + ')'; g.stroke(pl);
                g.restore(); } }
            const pc0 = Math.max(0, Math.min(1, (tk - 4.6) / 2.4)), pc = pc0 * pc0 * (3 - 2 * pc0) * bo; if (pc > 0.01) { const hu = 222 - 26 * pc0, Rp = K.pr * u * f * 0.98; g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = A; const pg = g.createRadialGradient(X, Y, 0, X, Y, Rp); pg.addColorStop(0, 'hsla(' + hu + ',100%,' + (62 + 22 * pc0) + '%,' + 0.95 * pc + ')'); pg.addColorStop(0.6, 'hsla(' + hu + ',95%,' + (50 + 16 * pc0) + '%,' + 0.55 * pc + ')'); pg.addColorStop(1, 'hsla(' + hu + ',100%,35%,' + 0.15 * pc + ')'); g.fillStyle = pg; g.beginPath(); g.arc(X, Y, Rp, 0, 7); g.fill(); g.restore(); } } }
        if (ea > 0 && !K.wolf && !K.glow) { const bt = tk - 5.2, bl = bt > 0 && bt < 0.45 ? 1 - Math.abs(Math.cos(bt / 0.45 * Math.PI)) * 0 - Math.sin(bt / 0.45 * Math.PI) : 1, sy = Math.max(0.04, bl), ey = p0[1] + K.ecy * u;
          g.globalAlpha = ea * fade; g.translate(0, ey); g.scale(1, sy); g.translate(0, -ey); g.shadowColor = 'rgba(80,170,255,' + 0.9 * ea + ')'; g.shadowBlur = 22 * dpr; g.drawImage(K.eye, x0, y0, w, hh); }
        g.restore(); }
      if (this.F === 'felirat' && this._flt > 0 && this.FTS) { const S = this.FTS, p0 = prjW(S.ax, S.ay * cb, S.ay * sb), p1 = prjW(S.ax + 1, S.ay * cb, S.ay * sb), ppu = p1[0] - p0[0], al2 = this._flt * fade;
        g.save(); g.globalCompositeOperation = 'source-over'; g.font = '600 ' + (S.fsW * ppu) + 'px ' + S.font; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.shadowColor = 'rgba(255,190,80,' + 0.6 * al2 + ')'; g.shadowBlur = 18 * dpr; g.fillStyle = 'rgba(255,222,140,' + al2 + ')'; g.fillText(S.txt, p0[0], p0[1]); g.restore(); }
      if (this.F === 'virág' && this._lnk > 0) { const lk = fade * this._vf * (bxg > 0 ? Math.max(0, 1 - bxg / 0.3) : 1), pr = Math.max(0, Math.min(0.9, (this._lnk - 0.25) / 0.6)), fa = Math.max(0, Math.min(1, (this._lnk - (this.VSH[this.vt].f0 ?? 0.6)) / 0.4)), oF = 0.9 + 0.1 * Math.sin(this._ttf * 2 * Math.PI / 7), P = [0, 0, 0], NP = this.VSH[this.vt].NP, [ci, co, ct] = this.VPAL[this.vpk];
        const pt = (L, al, u, v) => { this.vpAt(L, al, u, v, oF, tt, P); const x1 = P[0] * ca + P[2] * sa, z1 = -P[0] * sa + P[2] * ca, y1 = P[1] * cb - z1 * sb, z2 = P[1] * sb + z1 * cb; return prjW(x1, y1, z2); };
        const col = (c, k) => 'rgba(' + c.map(x => Math.min(255, Math.round(x * k))).join(',') + ',';
        g.lineJoin = 'round'; g.lineCap = 'round';
        for (const L of this.VSH[this.vt].LAY) { const c0 = ci.map((v, j) => v + (co[j] - v) * L / 2), cE = c0.map((v, j) => v + (ct[j] - v) * 0.5);
          for (let j = 0; j < NP[L]; j++) { const al = (j + (L % 2) * 0.5) / NP[L] * 6.283;
            if (fa > 0) { g.beginPath(); let s = true; const add = q => { if (s) { g.moveTo(q[0], q[1]); s = false; } else g.lineTo(q[0], q[1]); };
              for (let q = 0; q <= 16; q++) add(pt(L, al, q / 16, -1)); for (let q = 1; q < 8; q++) add(pt(L, al, 1, -1 + q / 4)); for (let q = 16; q >= 0; q--) add(pt(L, al, q / 16, 1)); g.closePath(); g.fillStyle = 'rgba(8,6,10,' + 0.92 * fa * lk + ')'; g.fill(); }
            if (pr <= 0) continue;
            g.strokeStyle = col(cE, 1.15) + lk + ')'; g.lineWidth = 1.6 * dpr;
            for (const sg of [-1, 1]) { g.beginPath(); const N = Math.max(1, Math.round(16 * pr)); for (let q = 0; q <= N; q++) { const p = pt(L, al, q / 16 * (pr * 16 / N), sg); q ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); } g.stroke(); }
            if (pr >= 1) { g.beginPath(); for (let q = 0; q <= 8; q++) { const p = pt(L, al, 1, -1 + q / 4); q ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); } g.stroke(); }
            g.strokeStyle = col(c0, 1) + 0.75 * lk + ')'; g.lineWidth = 1 * dpr;
            for (const [v0, u0, u1] of [[0, 0.02, 0.93], [-0.45, 0.18, 0.8], [0.45, 0.18, 0.8], [-0.75, 0.35, 0.7], [0.75, 0.35, 0.7]]) { const ue = u0 + (u1 - u0) * pr; if (ue <= u0) continue; g.beginPath(); for (let q = 0; q <= 10; q++) { const u = u0 + (ue - u0) * q / 10, vv = v0 * Math.sin(Math.PI * u) * 1.1, p = pt(L, al, u, vv); q ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); } g.stroke(); } } }
        for (let q = 0; q < 36; q++) { const an = q / 36 * 6.283 + (q % 2) * 0.09, r1 = 0.1 + (q % 3) * 0.06, x0 = Math.cos(an) * 0.015, z0 = Math.sin(an) * 0.015, x9 = Math.cos(an) * r1 * 1.4, z9 = Math.sin(an) * r1 * 1.4;
          const pr = (x, y, z) => { const x1 = x * ca + z * sa, z1 = -x * sa + z * ca, y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb; return prjW(x1, y1, z2); }, A = pr(x0, 0.03, z0), Bp = pr(x9, -0.03, z9);
          if (pr <= 0) break; g.strokeStyle = 'rgba(255,215,90,' + lk * pr + ')'; g.lineWidth = 1.3 * dpr; g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(Bp[0], Bp[1]); g.stroke(); g.fillStyle = 'rgba(255,240,170,' + lk * pr + ')'; g.beginPath(); g.arc(Bp[0], Bp[1], 3.5 * dpr, 0, 7); g.fill(); } }
      if (holoPh) {
        const cs = 0, e = 0, S = 0, a2 = tt * rot * 1.6, a3 = tt * rot * 0.9;
        const V = []; for (const X of [-1, 1]) for (const Y of [-1, 1]) for (const Z of [-1, 1]) {
          let x = X * S, y = Y * S, z = Z * S; let x1 = x * Math.cos(a2) + z * Math.sin(a2), z1 = -x * Math.sin(a2) + z * Math.cos(a2); let y1 = y * Math.cos(a3) - z1 * Math.sin(a3), z2 = y * Math.sin(a3) + z1 * Math.cos(a3);
          V.push(prj(x1, y1, z2)); }
        const E = [[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];
        g.lineCap = 'round';
        E.forEach(([i, j], q) => { const hh = (this.holoHue(0, tt, q) + q * 18) % 360;
          for (const [w, al] of [[9, 0.1], [4, 0.22], [1.6, 0.95]]) { g.strokeStyle = 'hsla(' + hh + ',100%,' + (w > 2 ? 60 : 82) + '%,' + al * e * fade + ')'; g.lineWidth = w * dpr; g.beginPath(); g.moveTo(V[i][0], V[i][1]); g.lineTo(V[j][0], V[j][1]); g.stroke(); } });
        g.globalCompositeOperation = 'source-over';
        const sk = this.props['szkenner'] ?? false;
        if (sk) { g.fillStyle = 'rgba(0,0,0,0.16)'; for (let y = (Math.floor(tt * 40) % 4) * dpr; y < H; y += 4 * dpr) g.fillRect(0, y, W, dpr);
        const by = ((tt * 0.35) % 1.3 - 0.15) * H, bg = g.createLinearGradient(0, by - 40 * dpr, 0, by + 40 * dpr); bg.addColorStop(0, 'rgba(255,255,255,0)'); bg.addColorStop(0.5, 'hsla(' + hu + ',100%,80%,0.07)'); bg.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = bg; g.fillRect(0, by - 40 * dpr, W, 80 * dpr); }
        if (sk && Math.random() < 0.012) { const y = Math.random() * H, hh = (8 + Math.random() * 30) * dpr; g.drawImage(g.canvas, 0, y, W, hh, (Math.random() - 0.5) * 24 * dpr, y, W, hh); }
      }
    }
    if (fire) this.akna(g, prjW, dpr, t, XE, dt, CE, bxg);
  };
}
class Tuzijatek extends TuziCore {
  constructor(cv, gp) { super(); this.cvRef = { current: cv }; this._gp = gp; this._pp = null; this.on = false; }
  get props() { return (this._gp && this._gp()) || {}; }
  clr() { if (this.BF && this.BF.width) { const b = this.BF.getContext('2d'); b.setTransform(1, 0, 0, 1, 0, 0); b.globalCompositeOperation = 'source-over'; b.fillStyle = '#000'; b.fillRect(0, 0, this.BF.width, this.BF.height); } this.lit = []; this.SM = []; const c = this.cvRef.current; if (c && c.width) { const g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, c.width, c.height); } }
  start() { if (this.on) return; this.on = true; this.clr(); this.cs = 0; this._sf = null; this._pp = Object.assign({}, this.props); this.componentDidMount(); }
  stop() { if (!this.on) return; this.on = false; cancelAnimationFrame(this.raf); this.musStop(); this.clr(); }
  sync() { if (!this.on) return; const p = this.props, pp = this._pp || {}; if (Object.keys(p).some(k => p[k] !== pp[k])) { this.componentDidUpdate(pp); this._pp = Object.assign({}, p); } }
}
window.Tuzijatek = Tuzijatek;
})();
