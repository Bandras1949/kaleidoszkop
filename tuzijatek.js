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
  ALS = ['Virág', 'Gömb', 'Szív', 'Felirat']; alR = null;
  alk() { const a = this.props['alakzat'] ?? 'Virág'; if (a !== 'Véletlen') return a; if (!this.alR) this.alR = this.ALS[0]; return this.alR; }
  pickAl() { this.alR = this.ALS[(this.ALS.indexOf(this.alR) + 1) % this.ALS.length]; }
  kep() { return this.alk() === 'Kép'; }
  buildKep(n) {
    if (!this.KI) { const im = new Image(); im.onload = () => { this.KIok = true; if (this.F === 'kép') { const cy = this.cycle; this.init(); this.cycle = cy; } }; im.src = 'mintak/kep-macska.png'; this.KI = im; }
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
    const P = this.KP.P;
    for (let i = 0; i < n; i++) { const p = P[Math.floor(R() * P.length)]; tg[0][i] = p[0]; tg[1][i] = p[1]; tg[2][i] = 0; T[i] = R() < 0.1 ? [255, 248, 225] : [p[2], p[3], p[4]]; Q[i] = 0; }
  }
  felirat() { return this.alk() === 'Felirat'; }
  buildFelirat(n) {
    const txt = String(this.props['felirat'] ?? 'incredible') || 'incredible', FN = '"DM Sans"';
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
  applyAlak() { if (this.kep()) { this.F = 'kép'; this.C = 'arany'; return; } if (this.felirat()) { this.F = 'felirat'; this.C = 'arany'; return; } if (this.virag()) { this.F = 'virág'; this.vt = 'D'; this.pickVP(); return; } if (this.logo()) { this.F = 'logó'; this.C = 'arany'; return; } if (this.fenyo()) { this.F = 'fenyő'; this.fv = Math.random() < 0.5 ? 'gömb' : 'cukor'; } else { const al = this.alk(); this.FS = al === 'Szív' ? ['szív', '3 szív'] : al === 'Gömb' ? ['gömb'] : ['gömb', 'szív', '3 szív']; this.fi = 0; this.F = this.FS[0]; } }
  nextLook() { if (this.felirat() || this.kep()) return; if (this.virag()) { this.vt = this.VORD[(this.VORD.indexOf(this.vt) + 1) % 4]; this.pickVP(); return; } if (this.logo()) return; if (this.fenyo()) { this.bi = (this.bi + 1 + Math.floor(Math.random() * (this.BALLS.length - 1))) % this.BALLS.length; this.fv = Math.random() < 0.5 ? 'gömb' : 'cukor'; return; } this.fi = (this.fi + 1) % this.FS.length; this.F = this.FS[this.fi]; const o = this.CS.filter(c => c !== this.C); this.C = o[Math.floor(Math.random() * o.length)]; }
  componentDidMount() { this.t0 = performance.now(); this.last = this.t0; this.applyAlak(); this.init(); this.raf = requestAnimationFrame(this.loop); }
  componentWillUnmount() { cancelAnimationFrame(this.raf); }
  componentDidUpdate(pp) { if (pp['mód'] !== this.props['mód']) this.rf = undefined; if (pp['pontszám'] !== this.props['pontszám'] || pp['mód'] !== this.props['mód'] || pp['alakzat'] !== this.props['alakzat'] || pp['felirat'] !== this.props['felirat'] || pp['robbanásStílus'] !== this.props['robbanásStílus'] || pp['rakéták'] !== this.props['rakéták']) { this.applyAlak(); this.init(); this.t0 = performance.now(); this.cs = 0; } }
  init() {
    this.pickEx();
    const n0 = Math.max(200, Math.min(2500, +(this.props['pontszám'] ?? 900))), n1 = this.F === 'logó' ? Math.max(n0, 7500) : this.F === 'virág' ? Math.max(n0, 3200) : this.F === 'felirat' ? Math.max(n0, 9000) : this.F === 'kép' ? Math.max(n0, 7000) : n0; const n = this.exS === 'pálma' ? Math.max(n1, 7000) : n1;
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
    else if (FM !== 'gömb') {
      const hx = u => 16 * Math.pow(Math.sin(u), 3) / 15, hy = u => (-2.5 - (13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u))) / 15;
      for (let i = 0; i < n; i++) { const u = Math.random() * Math.PI * 2, rim = i % 10 < 3, s = rim ? 1 : Math.sqrt(Math.random()), d = rim ? (Math.random() * 2 - 1) * 0.12 : (Math.random() < 0.5 ? -1 : 1) * 0.36 * Math.sqrt(1 - s * s);
        const j = three ? i % 3 : 1, sc = three ? 0.42 : 1, ox = three ? (j - 1) * 0.95 : 0; this.hj[i] = j; this.ox[i] = ox;
        this.tg[0][i] = hx(u) * s * sc + ox; this.tg[1][i] = hy(u) * s * sc; this.tg[2][i] = d * sc; }
    } else for (let i = 0; i < n; i++) { const y = 1 - 2 * (i + 0.5) / n, r = Math.sqrt(1 - y * y), a = i * ga; this.tg[0][i] = Math.cos(a) * r; this.tg[1][i] = y; this.tg[2][i] = Math.sin(a) * r; }
    this.exploded = false; this.conv0 = false; this.cycle = 1; this.conf = null;
  }
  buildVirag(n) {
    const tg = this.tg, T = this.trgb = new Array(n), Q = this.ty8 = new Uint8Array(n), VP = this.vp = new Float32Array(n * 4), R = Math.random, [ci, co, ct] = this.VPAL[this.vpk];
    const NP = this.VSH[this.vt].NP, lerp = (a, b, k) => a.map((v, j) => Math.round(v + (b[j] - v) * k));
    for (let i = 0; i < n; i++) { const r = i / n;
      if (r < 0.08) { const a = R() * 6.283, rr = Math.sqrt(R()) * 0.09; VP[i * 4] = -1; VP[i * 4 + 1] = a; VP[i * 4 + 2] = rr; VP[i * 4 + 3] = R(); T[i] = R() < 0.5 ? [255, 205, 60] : [255, 240, 160]; Q[i] = 13; }
      else { const TH = this.VSH[this.vt].TH, L = r < TH[0] ? 0 : r < TH[1] ? 1 : 2, j = Math.floor(R() * NP[L]), al = (j + (L % 2) * 0.5) / NP[L] * 6.283, rim = R() < 0.38, u = rim ? (R() < 0.3 ? 0.95 + R() * 0.05 : Math.pow(R(), 0.7)) : Math.pow(R(), 0.75), v = rim ? (R() < 0.5 ? -1 : 1) * (0.88 + R() * 0.12) : (R() * 2 - 1) * Math.sqrt(R()) * 0.85;
        VP[i * 4] = L; VP[i * 4 + 1] = al; VP[i * 4 + 2] = u; VP[i * 4 + 3] = v;
        const c0 = lerp(ci, co, L / 2), c = lerp(c0, ct, Math.pow(u, 1.5) * 0.55), sh = (0.62 + 0.38 * u) * (1.08 - Math.abs(v) * 0.32) * (j % 2 ? 0.88 : 1.06); T[i] = c.map(x => Math.min(255, Math.round(x * sh))); Q[i] = 12; }
      tg[0][i] = 0; tg[1][i] = 0.2; tg[2][i] = 0; }
  }
  viragPt(i, open, tt, out) { const VP = this.vp, L = VP[i * 4], u = VP[i * 4 + 2]; let v = VP[i * 4 + 3]; const lk = this._lnk || 0;
    if (lk > 0 && L >= 0) { let m = Math.min(1, lk / 0.6); m = m * m * (3 - 2 * m); let tv; if (Math.abs(v) >= 0.88) tv = Math.sign(v); else { const sn = Math.sin(Math.PI * u) * 1.1; tv = 0; let bd = Math.abs(v); for (const v0 of [-0.75, -0.45, 0.45, 0.75]) { const c = v0 * sn, d = Math.abs(v - c); if (d < bd) { bd = d; tv = c; } } } v += (tv - v) * m; }
    this.vpAt(L, VP[i * 4 + 1], u, v, open, tt, out); }
  vpAt(L, a, u, v, open, tt, out) {
    const Y0 = 0.1;
    if (L < 0) { const rr = u * 1.4, hh = 0.09 * (1 - u / 0.09) + 0.02 * Math.sin(tt * 3 + v * 20); out[0] = Math.cos(a) * rr; out[1] = Y0 - 0.06 - hh; out[2] = Math.sin(a) * rr; return; }
    const VS = this.VSH[this.vt], LP = VS.LP[L], W = VS.W[L], th0 = 1.45, th1 = VS.th1[L], th = th0 - (th0 - th1) * open, curl = -0.55 * open * (0.4 + L * 0.3) * VS.cu;
    const ph = th + curl * u * 0.5, r0 = 0.05 + L * 0.03, rho = r0 + LP * u * Math.cos(ph), y = -LP * u * Math.sin(ph), w = (VS.pt ? Math.pow(Math.sin(Math.PI * Math.min(1, u * 0.97 + 0.03)), 0.85) : Math.sqrt(Math.sin(Math.PI * Math.min(1, u * 0.92 + 0.04)))) * W * LP * 0.68 * (0.35 + 0.65 * open), lat = v * w;
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
    if (this.trgb) { const T = this.trgb[i], S = (this.rgb0 && this.rgb0[i]) || T; return 'rgba(' + Math.round(S[0] + (T[0] - S[0]) * cf) + ',' + Math.round(S[1] + (T[1] - S[1]) * cf) + ',' + Math.round(S[2] + (T[2] - S[2]) * cf) + ',' + al + ')'; }
    if ((this.F) === '3 szív') { const T = [[230, 30, 45], [250, 250, 250], [25, 170, 75]][this.hj[i]], S = (this.rgb0 && this.rgb0[i]) || T;
      return 'rgba(' + Math.round(S[0] + (T[0] - S[0]) * cf) + ',' + Math.round(S[1] + (T[1] - S[1]) * cf) + ',' + Math.round(S[2] + (T[2] - S[2]) * cf) + ',' + al + ')'; }
    const hh = this.hue[i] + (this.holoHue(this.tg[1][i], tt, i) - this.hue[i]) * cf; return 'hsla(' + hh + ',100%,68%,' + al + ')';
  }
  EXS = ['krizantém', 'bazsarózsa', 'gyűrű', 'virágfej', 'pálma']; KEPS = { 'macska': ['gyűrű', 'bazsarózsa'] };
  loadPalm() { if (this.PALMI) return; const im = new Image(); im.onload = () => { const W = im.naturalWidth, H = im.naturalHeight, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, W, H).data, P = [], S = H / 2.5, ox = W * 0.5, oy = H * 0.405;
      for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) { const k = (y * W + x) * 4, L = d[k] * 0.3 + d[k + 1] * 0.59 + d[k + 2] * 0.11; if (L > 110) P.push([(x - ox) / S, (y - oy) / S]); }
      this.PALMP = P; }; im.src = 'mintak/kiserlet-palma.png'; this.PALMI = im; }
  pickEx() { this.loadPalm(); const R = Math.random, st = ({ 'pálmalevél': 'banánlevél' })[this.props['robbanásStílus']] ?? this.props['robbanásStílus'] ?? 'véletlen', rk = this.props['rakéták'] ?? 'véletlen';
    if (st === 'véletlen') { const o = this.EXS.filter(x => x !== this.exS); this.exS = o[Math.floor(R() * o.length)]; } else this.exS = st;
    let nr = rk === 'véletlen' ? 1 + Math.floor(R() * 3) : Math.max(1, Math.min(3, +rk || 1)); this.exHue = null;
    if (this.F === 'kép') { const ks = this.KEPS['macska']; if (st === 'véletlen') { this._ki = ((this._ki ?? -1) + 1) % ks.length; this.exS = ks[this._ki]; } if (rk === 'véletlen') nr = 2; this.exHue = [44, 205]; }
    this.exC = nr === 1 ? [[0, -0.32]] : nr === 2 ? [[-1.2, -0.15 - R() * 0.2], [1.2, -0.4 - R() * 0.2]] : [[-1.45, -0.05 - R() * 0.15], [0, -0.6 - R() * 0.12], [1.45, -0.1 - R() * 0.15]];
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
        if (S === 'virágfej') { if (R() < 0.16) { sp = 0.34 * Math.sqrt(R()); z = (R() - 0.5) * 0.3; ctr = true; } else sp = 2.3 * (0.22 + 0.78 * Math.pow(Math.abs(Math.cos(2.5 * (an + ph + ci))), 0.7)) * (0.94 + R() * 0.12); }
        else { const K = 5, arm = Math.floor(R() * K), a0 = arm / K * 6.283 + ph + ci; x = Math.cos(a0); y = Math.sin(a0); sp = 2.4 * (0.15 + 0.85 * Math.floor(R() * 9) / 8); this.cu[i] = (ci % 2 ? -1 : 1) * 2.4; } }
      else if (S === 'pálma' || S === 'banánlevél') { const A = arms[ci], a = A[Math.floor(R() * A.length)]; x = a[0] + (R() - 0.5) * 0.07; y = a[1] + (R() - 0.5) * 0.07; z = a[2] + (R() - 0.5) * 0.07; sp = 2.7 * (0.35 + 0.65 * R()); }
      else if (S === 'gyűrű') { const [u, w] = rings[ci], an = R() * 6.283; x = Math.cos(an) * u[0] + Math.sin(an) * w[0]; y = Math.cos(an) * u[1] + Math.sin(an) * w[1]; z = Math.cos(an) * u[2] + Math.sin(an) * w[2]; sp = 2.4 * (0.97 + R() * 0.06); }
      else { x = R() * 2 - 1; y = R() * 2 - 1; z = R() * 2 - 1; sp = S === 'szomorúfűz' ? (1.0 + R() * 0.55) * 1.15 : S === 'bazsarózsa' ? (2.0 + R() * 0.3) * 1.2 : (1.4 + R() * 0.9) * 1.25; }
      const l = Math.hypot(x, y, z) || 1;
      if (nC > 1 && !SH[ci]) { const spc = nC === 2 ? 2.4 : 1.45, tg0 = { 'bazsarózsa': 0.48, 'krizantém': 0.48, 'gyűrű': 0.56 }[S], bm = { 'bazsarózsa': 2.76, 'krizantém': 2.875, 'gyűrű': 2.47 }[S]; sp = tg0 ? sp / bm * (tg0 * spc / 0.72) : sp * 0.5; }
      p[0][i] = c[0]; p[2][i] = 0; p[1][i] = c[1]; v[0][i] = x / l * sp; v[1][i] = y / l * sp; v[2][i] = z / l * sp; this.hue[i] = S === 'pálma' ? 38 + R() * 10 : this.exHue ? this.exHue[ci % this.exHue.length] + (R() - 0.5) * 12 : S === 'szomorúfűz' || S === 'pálma' || S === 'folyondár' ? 38 + R() * 14 : f(); if (ctr) this.bb[i] = 1 + (CH[ci] | 0) % 3; }
    this.rgb0 = Array.from(this.hue, hh => { const l = S === 'pálma' ? 0.49 : 0.65, c = (1 - Math.abs(2 * l - 1)), x = c * (1 - Math.abs((hh / 60) % 2 - 1)), m = l - c / 2, k = Math.floor(hh / 60) % 6, r = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][k]; return r.map(q => Math.round((q + m) * 255)); });
    this.exploded = true;
  }
  restart = () => { this.init(); this.t0 = performance.now(); this.cs = 0; };
  loop = now => {
    this.raf = requestAnimationFrame(this.loop);
    const cv = this.cvRef.current; if (!cv) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1), W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr);
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    const g = cv.getContext('2d'), dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    const md = 'tűzijáték', rnd = false; if (rnd && this.rf === undefined) this.rf = true;
    const fire = rnd ? this.rf : md !== 'hologram';
    const XE = 1.1 + Math.max(2, +(this.props['robbanásMp'] ?? 5)) + (this.exS === 'pálma' ? 1.8 : 0), CE = XE + 2.8, T = CE + 8 + (this.F === 'virág' ? 6.8 : this.F === 'kép' ? 3 : 3.2), tt = (now - this.t0) / 1000, t = fire ? tt - (this.cs || 0) : CE + 1 + tt;
    const bS = this.F === 'virág' ? CE + 8 + 3.57 : T - 3.2, bxg = fire && this.F !== 'kép' && t > bS ? t - bS : 0;
    const fzS = CE + 8, vz = this.F === 'virág' && fire, ttf = vz && t > fzS ? tt - (t - fzS) : tt; let fz = vz ? Math.max(0, Math.min(1, (t - fzS) / 1.2)) : 0; fz = fz * fz * (3 - 2 * fz); this._ttf = ttf;
    let lnk = vz ? Math.max(0, Math.min(0.74, (t - fzS) / 2.8)) : 0; this._vf = 1 - Math.max(0, Math.min(1, (lnk - 0.74) / 0.26)); this._lnk = lnk; { let q = (this.F === 'felirat' || this.F === 'kép') && fire ? Math.max(0, Math.min(1, (t - CE - 0.3) / (this.F === 'kép' ? 1.8 : 1.5))) : 0; this._flt = q * q * (3 - 2 * q) * (bxg > 0 ? Math.max(0, 1 - bxg / 0.35) : 1); this._tk = t - CE; }
    const trl = Math.max(0, Math.min(100, +(this.props['csíkHossz'] ?? 90))) / 100, trA = (this.exS === 'bazsarózsa' || this.exS === 'virágfej' || this.exS === 'folyondár' || this.exS === 'banánlevél') && fire && t > 1.1 && t < XE ? 0.38 : this.exS === 'pálma' && fire && t > 1.1 && t < XE ? 0.22 : this.exS === 'gyűrű' && fire && t > 1.1 && t < XE ? 0.35 : this.exS === 'szomorúfűz' && fire && t > 1.1 && t < XE ? 0.09 : 0.2 - 0.17 * trl;
    if (rnd && tt > (this.rf ? T : 18)) { this.rf = this.rf ? Math.random() < 0.55 : true; if ((this.props['alakzat'] ?? 'Virág') === 'Véletlen') { this.pickAl(); this.applyAlak(); } else this.nextLook(); this.init(); this.t0 = now; this.cycle = 1; this.cs = 0; }
    else if (!rnd && fire && t > T) { if ((this.props['alakzat'] ?? 'Virág') === 'Véletlen') { this.pickAl(); this.applyAlak(); } else this.nextLook(); this.init(); this.cs = tt; }
    const rot = Math.PI * 2 / Math.max(3, +(this.props['forgásMp'] ?? 29)), heart = this.F === 'szív' || this.F === '3 szív', sway = this.F !== 'gömb', a = this.F === 'virág' ? ttf * rot : sway ? Math.sin(tt * rot) * (heart ? 0.85 : this.F === 'felirat' || this.F === 'kép' ? 0 : 0.45) : tt * rot, ca = Math.cos(a), sa = Math.sin(a), b = this.F === 'virág' ? 0.62 + 0.95 * fz : sway ? 0.1 : 0.38, cb = Math.cos(b), sb = Math.sin(b);
    const cx = W / 2, cy = H / 2, R = this.F === 'felirat' ? Math.min(Math.min(W, H) * 0.3, W * 0.44 / (2.5 * 1.25)) : Math.min(W, H) * 0.3;
    const prj = (x, y, z) => { const x1 = x * ca + z * sa, z1 = -x * sa + z * ca, y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb; const k = 3 / (3 + z2); return [cx + x1 * R * k, cy + y1 * R * k, k, z2]; };
    const prjW = (x, y, z) => { const k = 3 / (3 + z); return [cx + x * R * k, cy + y * R * k, k, z]; };
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
      for (const c of (this.exC || [[0, -0.32]])) { const y = c[1] + (1.7 - c[1]) * (1 - e), [sx, sy] = prjW(c[0] * (0.7 + 0.3 * e), y, 0);
      g.fillStyle = 'hsla(45,100%,75%,0.95)'; g.beginPath(); g.arc(sx, sy, 3 * dpr, 0, 7); g.fill();
      for (let j = 0; j < 6; j++) { g.fillStyle = 'hsla(35,100%,60%,' + (0.5 - j * 0.07) + ')'; g.fillRect(sx - dpr + (Math.random() - 0.5) * 3 * dpr, sy + j * 6 * dpr + Math.random() * 6 * dpr, 2 * dpr, 2 * dpr); } }
    } else if (fire && t < XE) {
      if (!this.exploded) this.explode();
      const dr = Math.pow(this.exD ?? 0.25, dt), gv = 0.55 * (this.exG ?? 1);
      for (let i = 0; i < n; i++) {
        v[0][i] *= dr; v[1][i] = v[1][i] * dr + gv * dt; if (this.wv) { v[0][i] += this.wv[0][i] * dt; v[1][i] += this.wv[1][i] * dt; } if (this.cu && this.cu[i]) { const w = this.cu[i] * dt, cw = Math.cos(w), sw = Math.sin(w), vx = v[0][i]; v[0][i] = vx * cw - v[1][i] * sw; v[1][i] = vx * sw + v[1][i] * cw; } v[2][i] *= dr; p[0][i] += v[0][i] * dt; p[1][i] += v[1][i] * dt; p[2][i] += v[2][i] * dt;
        const [sx, sy, k] = prjW(p[0][i], p[1][i], p[2][i]), life = Math.max(0, 1 - (t - 1.1) / (XE - 1.1 + 1)), tw = Math.random() < 0.12 ? 1.6 : 1;
        if (this.bb && this.bb[i]) { g.fillStyle = ['', 'rgba(255,105,180,', 'rgba(255,225,40,', 'rgba(255,255,255,'][this.bb[i]] + Math.min(1, 0.55 + life) * tw + ')'; const z = Math.max(1.2, 2.6 * k * dpr); g.fillRect(sx - z / 2, sy - z / 2, z, z); }
        else if ((heart || this.trgb) && this.exS !== 'pálma') { const cf = Math.max(0, Math.min(1, (t - 1.1) / (XE - 1.1) * 1.7 - 0.7)) * 0.6, z = 6 * k * dpr; g.fillStyle = this.colAt(i, cf, tt, Math.min(1, 0.35 + life) * tw); if (heart) { g.setTransform(z, 0, 0, z, sx, sy); g.fill(this.HP); g.setTransform(1, 0, 0, 1, 0, 0); } else { const zz = Math.max(1, 2.4 * k * dpr); g.fillRect(sx - zz / 2, sy - zz / 2, zz, zz); } }
        else { const wl = this.exS === 'szomorúfűz'; g.fillStyle = 'hsla(' + this.hue[i] + ',100%,' + (wl ? 48 + 10 * life : this.exS === 'pálma' ? 46 + 6 * life : this.exS === 'folyondár' ? 52 + 8 * life : 62 + 20 * life) + '%,' + Math.min(1, 0.35 + life) * tw * (wl ? 0.4 : this.exS === 'pálma' ? 0.2 : this.exS === 'banánlevél' || this.exS === 'folyondár' ? 0.45 : 1) + ')'; const z = Math.max(1, 2.2 * k * dpr); g.fillRect(sx - z / 2, sy - z / 2, z, z); }
      }
    } else {
      const br = this.F === 'gömb' ? 1 + 0.12 * Math.sin(tt * 2 * Math.PI / 5) : 1;
      if (this.F === 'logó' || this.F === 'virág' || this.F === 'felirat') g.globalCompositeOperation = 'source-over';
      let ck = 1; const kk = fire && t < CE ? (t - XE) / 2.8 : 1, pg = this.exS === 'pálma' && fire && t < CE, cfC = pg ? Math.pow(Math.max(0, Math.min(1, (kk - 0.8) / 0.2)), 1.5) : Math.min(1, 0.6 + 0.4 * Math.min(1, kk * 2.5)), pgA = pg ? 0.2 + 0.8 * Math.pow(Math.max(0, Math.min(1, (kk - 0.75) / 0.25)), 1.5) : 1;
      if (fire && t < CE) { if (!this.conv0) { for (let q = 0; q < 3; q++) s[q].set(p[q]); this.conv0 = true; } const k = (t - XE) / 2.8; ck = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }
      const hu = this.holoHue(0, tt, 0);
      if (this.fv === 'cukor' && this.F === 'fenyő' && ck >= 1 && this.BL) for (const L of this.BL) { const fx = L.x, fy = L.fy - 0.07, x1 = fx * ca, z1 = -fx * sa, y1 = fy * cb - z1 * sb, z2 = fy * sb + z1 * cb, [gx, gy] = prjW(x1, y1, z2), pu = 0.5 + 0.5 * Math.sin(tt * 3.2 + L.ph * 1.3), fl = 0.8 + 0.4 * pu, hb = (tt * 45 + L.ph * 72) % 360;
        const gr = g.createRadialGradient(gx, gy, 0, gx, gy, R * 0.26 * fl); gr.addColorStop(0, 'hsla(' + hb + ',100%,60%,' + (0.1 + 0.2 * pu) * fade + ')'); gr.addColorStop(1, 'hsla(' + hb + ',100%,55%,0)'); g.fillStyle = gr; g.beginPath(); g.arc(gx, gy, R * 0.28 * fl, 0, 7); g.fill(); }
      if (holoPh && this.F === 'gömb' && bxg > 0) { g.globalCompositeOperation = 'lighter'; const al3 = Math.max(0, 1 - Math.max(0, bxg - 2.4) / 0.8);
        for (let q = 0; q < 260; q++) { const an = q / 260 * 6.283 + ((q * 0.37) % 1) * 0.05, rr = R * (0.97 * br + Math.pow(bxg, 1.25) * (0.5 + ((q * 0.618) % 1) * 1.6)), sx = cx + Math.cos(an) * rr, sy = cy + Math.sin(an) * rr, z = (1.6 + bxg * 0.6) * dpr;
          g.fillStyle = 'hsla(' + hu + ',100%,65%,' + al3 * (0.6 + 0.4 * Math.sin(tt * 9 + q)) + ')'; g.fillRect(sx - z * 1.5, sy - z * 0.28, z * 3, z * 0.56); g.fillRect(sx - z * 0.28, sy - z * 1.5, z * 0.56, z * 3); } }
      if (holoPh && this.F === 'gömb' && bxg <= 0) {
        const gr = g.createRadialGradient(cx, cy, R * 0.82 * br, cx, cy, R * 1.12 * br); gr.addColorStop(0, 'hsla(' + hu + ',100%,60%,0)'); gr.addColorStop(0.55, 'hsla(' + hu + ',100%,60%,' + 0.16 * fade + ')'); gr.addColorStop(1, 'hsla(' + hu + ',100%,60%,0)');
        g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, R * 1.15 * br, 0, 7); g.fill();
      }
      for (let i = 0; i < n; i++) {
        const ox = this.ox[i]; let tx = tg[0][i] - ox, ty = tg[1][i], tz = tg[2][i], sl = -1; const qq = this.ty8 ? this.ty8[i] : -1;
        if (this.ty8) { const q = this.ty8[i];
          if (q === 12 || q === 13) { let o = Math.max(0, Math.min(1, (t - CE - 0.2) / 3.5)); o = o * o * (3 - 2 * o); o *= 0.9 + 0.1 * Math.sin(this._ttf * 2 * Math.PI / 7); const P3 = this._p3 || (this._p3 = [0, 0, 0]); this.viragPt(i, o, tt, P3); tx = P3[0]; ty = P3[1]; tz = P3[2]; }
          else if (q === 8) { let m = Math.max(0, Math.min(1, (t - CE - 0.6) / 1.8)); m = m * m * (3 - 2 * m); tx = this.al[0][i] + (tx - this.al[0][i]) * m; ty = this.al[1][i] + (ty - this.al[1][i]) * m; tz = this.al[2][i] + (tz - this.al[2][i]) * m; }
          else if (q === 3) { const bx = this.cc[i], aa = tt * (bx > 0.5 ? -1.1 : 1.3), dx = tx - bx, dz = tz; tx = bx + dx * Math.cos(aa) + dz * Math.sin(aa); tz = -dx * Math.sin(aa) + dz * Math.cos(aa); }
          else if (q === 5 && ck >= 1) { const sdi = this.sd[i]; sl = (tt * 1.1 + sdi * 7) % 1; const an = sdi * 40, sp = 0.18 + (sdi * 13 % 1) * 0.32; tx += Math.cos(an) * sl * sp; ty += Math.sin(an) * sl * sp + sl * sl * 0.22; tz += Math.sin(an * 1.7) * sl * sp * 0.6; } }
        const x1 = tx * ca + tz * sa + ox, z1 = -tx * sa + tz * ca, y1 = ty * cb - z1 * sb, z2 = ty * sb + z1 * cb;
        let X = x1 * br, Y = y1 * br, Z = z2 * br, h = this.holoHue(ty, tt, i);
        if (ck < 1) { X = s[0][i] + (X - s[0][i]) * ck; Y = s[1][i] + (Y - s[1][i]) * ck; Z = s[2][i] + (Z - s[2][i]) * ck; h = this.hue[i] + (h - this.hue[i]) * ck; }
        if (bxg > 0) { const r = Math.hypot(X, Y) || 0.01, e2 = Math.pow(bxg, 1.25) * (0.5 + ((i * 0.618) % 1) * 1.6), ja = (((i * 0.37) % 1) - 0.5) * 0.9, ux = X / r, uy = Y / r; X += (ux * Math.cos(ja) - uy * Math.sin(ja)) * e2; Y += (ux * Math.sin(ja) + uy * Math.cos(ja)) * e2; }
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
      if (this.F === 'kép' && this._flt > 0 && this.KP) { const K = this.KP, p0 = prjW(0, 0, 0), p1 = prjW(1, 0, 0), u = p1[0] - p0[0], w = K.hw * u, hh = K.hh * u, x0 = p0[0] - w / 2, y0 = p0[1] - hh / 2, tk = this._tk;
        const bx = tk - 7.2, bo = bx > 0 ? Math.max(0, 1 - bx / 0.35) : 1;
        g.save(); g.globalCompositeOperation = 'source-over'; g.globalAlpha = this._flt * (bx > 0 ? bo : fade); if (g.globalAlpha > 0) g.drawImage(K.body, x0, y0, w, hh);
        let ea = Math.max(0, Math.min(1, (tk - 2.4) / 0.8)); ea = ea * ea * (3 - 2 * ea) * bo;
        if (bx > 0) { g.globalCompositeOperation = 'lighter'; const e2 = Math.pow(bx, 1.35); for (const s2 of K.ST) { const sx = p0[0] + (s2[0] + s2[2] * e2) * u, sy = p0[1] + (s2[1] + s2[3] * e2) * u, tw2 = 0.65 + 0.35 * Math.sin(tt * 9 + s2[7]), z = s2[8] * dpr * (1 + bx * 0.5);
            if (sx < -20 || sy < -20 || sx > W + 20 || sy > H + 20) continue; g.globalAlpha = Math.min(1, 0.3 + bx * 2) * tw2; g.fillStyle = 'rgb(' + s2[4] + ',' + s2[5] + ',' + s2[6] + ')'; g.fillRect(sx - z * 1.6, sy - z * 0.3, z * 3.2, z * 0.6); g.fillRect(sx - z * 0.3, sy - z * 1.6, z * 0.6, z * 3.2); } g.globalCompositeOperation = 'source-over'; }
        if (ea > 0) { const bt = tk - 5.2, bl = bt > 0 && bt < 0.45 ? 1 - Math.abs(Math.cos(bt / 0.45 * Math.PI)) * 0 - Math.sin(bt / 0.45 * Math.PI) : 1, sy = Math.max(0.04, bl), ey = p0[1] + K.ecy * u;
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
        if (sk && Math.random() < 0.012) { const y = Math.random() * H, hh = (8 + Math.random() * 30) * dpr; g.drawImage(cv, 0, y, W, hh, (Math.random() - 0.5) * 24 * dpr, y, W, hh); }
      }
    }
  };
}
class Tuzijatek extends TuziCore {
  constructor(cv, gp) { super(); this.cvRef = { current: cv }; this._gp = gp; this._pp = null; this.on = false; }
  get props() { return (this._gp && this._gp()) || {}; }
  start() { if (this.on) return; this.on = true; this._pp = Object.assign({}, this.props); this.componentDidMount(); }
  stop() { if (!this.on) return; this.on = false; cancelAnimationFrame(this.raf); }
  sync() { if (!this.on) return; const p = this.props, pp = this._pp || {}; if (Object.keys(p).some(k => p[k] !== pp[k])) { this.componentDidUpdate(pp); this._pp = Object.assign({}, p); } }
}
window.Tuzijatek = Tuzijatek;
})();
