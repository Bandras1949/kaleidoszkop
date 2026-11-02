// ÉVSZAKOK élmény – egy fa, egy pad, egy hinta; körülöttük változik a világ. © Andras Banky
// Teljes év: ŐSZ → TÉL → TAVASZ → NYÁR, évszakonként 60 mp, 10 mp-es áttűnéssel (fény → színek → időjárás). Minden méret „u” egységben (u = a jelenet mérete), a fa tövéhez (0,0) képest; y lefelé nő.
(function () {
  const TAU = Math.PI * 2;
  const cl = (v, a, b) => Math.min(b, Math.max(a, v));
  const sm = (a, b, x) => { const t = cl((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const rgb = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  const rng = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  // juharlevél: 5 karéj, fogazott szél, szár; egységnyi méret
  const LEAFP = (() => { const p = new Path2D();
    for (let i = 0; i <= 50; i++) { const th = i / 50 * TAU, lob = Math.pow(Math.abs(Math.cos(th * 2.5)), 3);
      const r = (0.38 + 0.62 * lob) * (0.72 + 0.28 * Math.cos(th)) + 0.05 * Math.abs(Math.sin(th * 15)) * lob;
      const x = r * Math.sin(th), y = -r * Math.cos(th) * 0.95; i ? p.lineTo(x, y) : p.moveTo(x, y); }
    p.closePath(); return p; })();
  const LEAFS = (() => { const p = new Path2D(); [[0, -1], [0.3, -0.45], [0.85, -0.5], [0.5, 0.05], [0.6, 0.45], [0, 0.6], [-0.6, 0.45], [-0.5, 0.05], [-0.85, -0.5], [-0.3, -0.45]].forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.closePath(); return p; })();
  const RIB = (() => { const p = new Path2D(); p.moveTo(0, 0.75); p.lineTo(0, -0.85); p.moveTo(0, 0.05); p.lineTo(0.62, -0.42); p.moveTo(0, 0.05); p.lineTo(-0.62, -0.42); return p; })();
  function leaf(g, x, y, s, sy, rot, c, a, rib, simple) {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s * sy);
    g.fillStyle = rgb(c, a); g.fill(simple ? LEAFS : LEAFP);
    if (rib) { g.strokeStyle = rgb(mix(c, [60, 35, 20], 0.45), a * 0.8); g.lineWidth = 0.09; g.stroke(RIB); }
    g.restore();
  }
  const LEAF = ['#D4A13A', '#C77A2E', '#B5582A', '#9E4426', '#E0B850', '#A8743A'].map(hex);
  const GREEN = hex('#8F9548'), WITHER = hex('#7A5236'), FRESH = hex('#B2C364'), SUMG = hex('#6C893E');
  const BLOS = ['#F7E9EA', '#F2D4D9', '#FBF4F1'].map(hex);
  const PET = ['#F2B8C6', '#E9A2B4', '#F6CCD6'].map(hex);
  const PETAL = (() => { const p = new Path2D(); p.moveTo(0, 0.95); p.bezierCurveTo(-0.95, 0.35, -0.8, -0.85, -0.16, -0.92); p.lineTo(0, -0.66); p.lineTo(0.16, -0.92); p.bezierCurveTo(0.8, -0.85, 0.95, 0.35, 0, 0.95); p.closePath(); return p; })();
  function petal(g, x, y, s, sy, rot, c, a) {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s * sy);
    g.fillStyle = rgb(c, a); g.fill(PETAL);
    g.fillStyle = rgb(mix(c, [190, 80, 110], 0.35), a * 0.7); g.beginPath(); g.ellipse(0, 0.62, 0.22, 0.3, 0, 0, TAU); g.fill();
    g.restore();
  }
  const BARK = hex('#4B4038'), BARK_HI = hex('#5F6A3C'), WOOD = hex('#5A4A3D'), WOOD_HI = hex('#8B7562');
  // pad (Pixabay, sipa „park bench”, háttér eltávolítva): ferdén, félig a lomb alatt, a fa töve előtt; a jobb 30% mindig szabad
  const BENCH = (() => {   // pad: két kőre fektetett, göcsörtös deszka (a szerző generált képe, háttér eltávolítva); háromnegyed nézet, a bal vége közelebb
    const k = 0.2 / 888, ax = 1, sy = 0, x0 = -0.334, gy = 0.035, left = 0, foot = 413, Wpx = 888;   // tükrözve: a bal vége hátrébb, a jobb vége elöl (a szerző rajza szerint, a lehajló ág alatt)
    const seatAt = x => { const lx = Wpx - (x - x0) / k, ly = 170 + (lx - 40) * (65 - 170) / (860 - 40); return gy + (ly - foot) * k; };
    return { on: true, k, ax, sy, x0, x1: x0 + Wpx * k, gy, left, foot, Wpx, seatAt, seat: seatAt(x0 + Wpx * k / 2), plank: 0.02, free: 0.7,
      flip: true, stones: [[250, 413], [710, 275]].map(([x, y]) => [x0 + (Wpx - x) * k, gy + (y - foot) * k]) }; })();   // a pad jobb 30%-a mindig szabad
  const SWING = { t: [0.42, 0.86], seatY: -0.066 };
  const remain = p => 1 - (0.55 * cl((p - 0.04) / 0.8, 0, 1) + 0.45 * sm(0.04, 0.84, p));   // 0:50-re minden levél leválik, van idejük leérni                // a fán maradt levelek aránya
  const autumnP = d => { const y = d.getFullYear(), s = new Date(y, 8, 22), e = new Date(y, 11, 21); return cl((d - s) / (e - s), 0, 1); };
  const bez = (b, t) => [(1 - t) * (1 - t) * b[0] + 2 * (1 - t) * t * b[2] + t * t * b[4], (1 - t) * (1 - t) * b[1] + 2 * (1 - t) * t * b[3] + t * t * b[5]];

  // a fa mindig ugyanaz (rögzített véletlenmag) – ez az állandóság
  function buildTree() {
    const r = rng(1949), br = [], tips = [];
    const seg = (x0, y0, cx, cy, x1, y1, w0, w1) => br.push([x0, y0, cx, cy, x1, y1, w0, w1]);
    function grow(x, y, ang, len, w, depth, maxD) {
      const bend = (r() - 0.5) * 0.5, x1 = x + Math.cos(ang) * len, y1 = y + Math.sin(ang) * len;
      const nx = -Math.sin(ang), ny = Math.cos(ang);
      seg(x, y, (x + x1) / 2 + nx * len * bend * 0.25, (y + y1) / 2 + ny * len * bend * 0.25, x1, y1, w, w * 0.72);
      if (depth >= maxD - 3) tips.push([x1, y1, x, y]);
      if (depth >= maxD) return;
      const n = depth < 2 ? 2 : (r() < 0.3 ? 3 : 2);
      for (let i = 0; i < n; i++) {
        const sp = (depth < 2 ? 0.5 : 0.4) + r() * 0.25;
        let a = ang + (n === 2 ? (i ? sp : -sp) : (i - 1) * sp) + (r() - 0.5) * 0.25;
        a = cl(a, -Math.PI + 0.12, -0.12);
        grow(x1, y1, a, len * (0.7 + r() * 0.12), w * 0.66, depth + 1, maxD);
      }
    }
    seg(0, 0, -0.012, -0.12, 0.01, -0.23, 0.05, 0.035);                    // törzs
    const sw = [0.0, -0.215, -0.15, -0.34, -0.31, -0.3, 0.024, 0.007];    // a hinta ága, balra
    seg(...sw);
    grow(0.01, -0.23, -Math.PI / 2 - 0.5, 0.17, 0.034, 1, 7);
    grow(0.01, -0.23, -Math.PI / 2 + 0.45, 0.18, 0.034, 1, 7);
    grow(0.005, -0.2, -Math.PI / 2 + 0.05, 0.12, 0.022, 2, 7);
    { const [x, y] = bez(sw, 0.92); grow(x, y, -Math.PI + 0.25, 0.062, 0.0085, 4, 7); }   // kicsit a főág vége előtt nő ki
    { const [x, y] = bez(sw, 0.5); grow(x, y, -Math.PI / 2 - 0.45, 0.08, 0.011, 4, 7); }   // a hinta ágából nő ki, nem a levegőből
    const anch = SWING.t.map(t => bez(sw, t)).sort((a, b) => a[0] - b[0]);
    const leaves = [];
    for (const [tx, ty, sx, sy] of tips) for (let k = 0; k < 3; k++) {
      // a levél az ág végső szakaszán ül (nem lebeg a levegőben); minden ágvégen az első levél nő ki elsőként és hull le utolsóként
      const f = k ? 0.45 + r() * 0.5 : 0.92 + r() * 0.08, ln = Math.hypot(tx - sx, ty - sy) || 1, nx = -(ty - sy) / ln, ny = (tx - sx) / ln, j = (r() - 0.5) * 0.016;
      const ordK = k ? r() * 0.7 : 0.7 + r() * 0.3;
      leaves.push({ x: sx + (tx - sx) * f + nx * j, y: sy + (ty - sy) * f + ny * j - 0.004, ord: ordK, s: 0.013 + r() * 0.007, rot: r() * TAU, c: (r() * LEAF.length) | 0, turn: r() * 0.45 });
    }
    leaves.sort((a, b) => a.ord - b.ord);   // ebben a sorrendben hullanak
    // verebek ülőhelyei: két közeli, vízszintes, közepesen vastag ág
    const cand = br.map((b, i) => ({ b, i, m: bez(b, 0.5), wv: (b[6] + b[7]) / 2, hz: Math.abs(b[4] - b[0]) / Math.hypot(b[4] - b[0], b[5] - b[1]) }))
      .filter(c => c.i > 1 && c.hz > 0.82 && c.wv > 0.006 && c.wv < 0.02 && c.m[1] > -0.5 && c.m[1] < -0.24 && Math.abs(c.m[0]) < 0.36);
    cand.sort((a, b) => Math.hypot(a.m[0] + 0.06, a.m[1] + 0.36) - Math.hypot(b.m[0] + 0.06, b.m[1] + 0.36));
    const p0 = cand[0], p1 = cand.find(c => { const dd = Math.hypot(c.m[0] - p0.m[0], c.m[1] - p0.m[1]); return dd > 0.04 && dd < 0.15; }) || cand[1];
    const perch = [p0, p1].filter(Boolean).map(c => ({ x: c.m[0], y: c.m[1] - c.wv / 2, wv: c.wv }));
    while (perch.length < 2) perch.push({ x: -0.2 + perch.length * 0.06, y: -0.3, wv: 0.01 });
    const drip = br.slice(1).filter(b => Math.abs(b[4] - b[0]) / Math.hypot(b[4] - b[0], b[5] - b[1]) > 0.6 && (b[6] + b[7]) / 2 > 0.006 && b[5] > -0.45).map(b => { const m = bez(b, 0.55); return [m[0], m[1] + (b[6] + b[7]) / 4]; });
    const pc = c => ({ x: c.m[0], y: c.m[1] - c.wv / 2, wv: c.wv });
    const alt = perch.map((h0, k) => { const o = perch[1 - k], c = cand.filter(c => Math.hypot(c.m[0] - h0.x, c.m[1] - h0.y) > 0.03 && Math.hypot(c.m[0] - o.x, c.m[1] - o.y) > 0.03 && Math.hypot(c.m[0] - h0.x, c.m[1] - h0.y) < 0.2)
      .sort((a, b) => Math.hypot(a.m[0] - h0.x, a.m[1] - h0.y) - Math.hypot(b.m[0] - h0.x, b.m[1] - h0.y))[k]; return c ? pc(c) : o; });
    return { br, tips, leaves, anch, perch, alt, drip, sw };
  }
  // a fa képből (Pixabay, pixellabs „ancient tree”): ágvégek, ülőhelyek, a hinta ága a kép átlátszóságából
  function buildImgTree(img) {
    const W = img.width, H = img.height, c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, W, H).data, A = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? 0 : d[(y * W + x) * 4 + 3];
    const BX = 590, BY = 1445, K = 0.62 / 1050, U = (x, y) => [(x - BX) * K, (y - BY) * K];
    const base = document.createElement('canvas'); base.width = W; base.height = H; const bg = base.getContext('2d'); bg.drawImage(img, 0, 0);
    bg.globalCompositeOperation = 'destination-out'; const gr = bg.createLinearGradient(0, 1426, 0, 1478);   // a tő alatti földfolt beleolvad a talajba
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.92)'); bg.fillStyle = gr; bg.fillRect(0, 1426, W, 54);
    const r = rng(1949), cand = [];
    for (let y = 430; y < 1110; y += 5) for (let x = 160; x < 1125; x += 5) {
      if (A(x, y) < 110) continue;
      const n = (A(x + 11, y) > 110) + (A(x - 11, y) > 110) + (A(x, y + 11) > 110) + (A(x, y - 11) > 110);
      if (n <= 1) cand.push([x, y]);
    }
    for (let i = cand.length - 1; i > 0; i--) { const j = (r() * (i + 1)) | 0; [cand[i], cand[j]] = [cand[j], cand[i]]; }
    const pick = []; for (const p of cand) { if (pick.length >= 420) break; if (pick.every(q => (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2 > 256)) pick.push(p); }
    const tips = pick.map(([x, y]) => U(x, y)), leaves = [];
    for (const [tx, ty] of tips) for (let k = 0; k < 5; k++) {   // kisebb, különálló levelek, ritkásan az ágvég körül
      const a = r() * TAU, dd = (k ? 0.005 + r() * 0.014 : r() * 0.003);
      leaves.push({ x: tx + Math.cos(a) * dd, y: ty + Math.sin(a) * dd * 0.8 - 0.003, ord: k ? r() * 0.7 : 0.7 + r() * 0.3, s: 0.0068 + r() * 0.0042, rot: r() * TAU, c: (r() * LEAF.length) | 0, turn: r() * 0.45, v: (r() - 0.5) * 0.5 });
    }
    leaves.sort((a, b) => a.ord - b.ord);
    // ülőhelyek: közepesen vastag, vízszintes ágak teteje
    const tops = [];
    for (let y = 470; y < 820; y += 2) for (let x = 220; x < 1080; x += 3) {   // felső, vékony, vízszintes ágak teteje
      if (A(x, y) < 150 || A(x, y - 2) > 40) continue;
      let t = 0; while (t < 20 && A(x, y + t) > 110) t++;
      if (t < 4 || t > 12) continue;
      const top = xx => { for (let k = -3; k <= 3; k++) if (A(xx, y + k) > 150 && A(xx, y + k - 2) < 40) return true; return false; };
      if (top(x - 9) && top(x + 9) && top(x - 4) && top(x + 4)) { const [ux, uy] = U(x, y); tops.push({ x: ux, y: uy + 0.0008, wv: t * K }); }
    }
    const near = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
    tops.sort((a, b) => Math.hypot(a.x - 0.06, a.y + 0.47) - Math.hypot(b.x - 0.06, b.y + 0.47));
    const p0 = tops[0] || { x: -0.1, y: -0.36, wv: 0.01 }, p1 = tops.find(q => near(q, p0) > 0.035 && near(q, p0) < 0.12) || tops[1] || p0;
    const perch = [p0, p1];
    const alt = perch.map((h0, k) => tops.filter(q => near(q, h0) > 0.03 && near(q, perch[1 - k]) > 0.03 && near(q, h0) < 0.2).sort((a, b) => near(a, h0) - near(b, h0))[k] || perch[1 - k]);
    const sw = [0.183, -0.176, 0.236, -0.181, 0.286, -0.178, 0.024, 0.012];   // a jobb oldali vízszintes ág (hinta)
    const anch = SWING.t.map(t => bez(sw, t)).sort((a, b) => a[0] - b[0]);
    const drip = tips.filter(([x, y]) => y > -0.45).map(([x, y]) => [x, y + 0.003]);
    return { img, base, K, bx: BX, by: BY, br: [], tips, leaves, anch, perch, alt, drip, sw };
  }
  const leafCol = (l, p) => mix(mix(GREEN, LEAF[l.c], cl((p - l.turn) / 0.18 + 0.35, 0, 1)), WITHER, sm(0.6, 1, p) * 0.45);

  class Evszakok {
    constructor(cv, getP, onInfo) {
      this.cv = cv; this.ctx = cv.getContext('2d'); this.getP = getP || (() => ({})); this.onInfo = onInfo;
      this.T = buildTree(); this.N = this.T.leaves.length;
      const im = new Image(); im.onload = () => { try { this.T = buildImgTree(im); this.N = this.T.leaves.length; this.cyc = -1; this.fall = []; this.treeKey = null; } catch (e) { console.warn('fa', e); } };
      im.src = 'evszakok/fa.png';
      const pim = new Image(); pim.onload = () => {   // pad + hósapka (a jobb 30% szabad)
        const W = pim.width, H = pim.height, sn = document.createElement('canvas'); sn.width = W; sn.height = H; const q = sn.getContext('2d');
        const e = document.createElement('canvas'); e.width = W; e.height = H; const eg = e.getContext('2d');
        eg.drawImage(pim, 0, 0); eg.globalCompositeOperation = 'source-in'; eg.fillStyle = 'rgb(248,250,252)'; eg.fillRect(0, 0, W, H);
        eg.globalCompositeOperation = 'destination-out'; eg.drawImage(pim, 0, 8);
        for (let k = 0; k <= 6; k += 2) q.drawImage(e, 0, -k);   // vékony hósapka a peremen
        { const top = [[12, 150], [200, 115], [420, 78], [600, 40], [735, 8], [800, 30], [882, 62], [884, 92], [600, 135], [330, 182], [150, 205], [80, 190], [20, 168]];   // a deszka felső lapja
          const t = document.createElement('canvas'); t.width = W; t.height = H; const tg = t.getContext('2d'), r = rng(31);
          tg.fillStyle = 'rgb(246,248,251)'; tg.beginPath(); top.forEach(([x, y], i) => i ? tg.lineTo(x, y) : tg.moveTo(x, y)); tg.closePath(); tg.fill();
          for (let i = 0; i < 60; i++) { const [x, y] = top[(r() * top.length) | 0]; tg.fillStyle = 'rgb(246,248,251)'; tg.beginPath(); tg.ellipse(x + (r() - 0.5) * 60, y + (r() - 0.5) * 18, 10 + r() * 26, 4 + r() * 8, -0.35, 0, TAU); tg.fill(); }   // szabálytalan szél
          tg.globalCompositeOperation = 'source-atop'; for (let i = 0; i < 40; i++) { tg.fillStyle = `rgba(200,210,226,${0.05 + r() * 0.08})`; tg.beginPath(); tg.ellipse(r() * W, r() * 230, 20 + r() * 50, 6 + r() * 12, -0.35, 0, TAU); tg.fill(); }   // finom árnyalás
          const t2 = document.createElement('canvas'); t2.width = W; t2.height = H; const g2 = t2.getContext('2d'); g2.filter = 'blur(4px)'; g2.drawImage(t, 0, 0); g2.filter = 'none';   // puha szélek
          g2.globalCompositeOperation = 'destination-in'; g2.drawImage(pim, 0, -4);
          q.drawImage(t2, 0, 0); }
        { // tükrözve: a fa felőli (jobb) harmad szabad – puha, szabálytalan átmenettel, nem éles vágással
          const b = BENCH.Wpx * (1 - BENCH.free), r = rng(77); q.globalCompositeOperation = 'destination-out';
          const gr = q.createLinearGradient(b - 150, 0, b + 170, 0); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.45, 'rgba(0,0,0,0.75)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
          q.fillStyle = gr; q.fillRect(0, 0, b + 170, H);
          for (let i = 0; i < 46; i++) { const ex = b - 40 + r() * 330, ey = r() * H; q.fillStyle = `rgba(0,0,0,${0.25 + r() * 0.5})`; q.beginPath(); q.ellipse(ex, ey, 12 + r() * 40, 6 + r() * 16, 0, 0, TAU); q.fill(); }   // olvadt foltok
          q.globalCompositeOperation = 'source-over'; }
        const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
        this.pad = { img: pim, snow: sn, cv, key: null };
      };
      pim.src = 'evszakok/pad.png';
      this.t0 = this.tl = performance.now(); this.w = 0; this.gust = 0; this.nextGust = 9; this.cyc = -1;
      this.fall = []; this.seatL = []; this.benchL = []; this.ground = []; this.puffs = []; this.drops = []; this.pg = []; this.spl = [];
      const d0 = new Date(), md = (d0.getMonth() + 1) * 100 + d0.getDate();
      this.off = (md >= 922 && md < 1221 ? 0 : md >= 1221 || md < 320 ? 1 : md < 621 ? 2 : 3) * 60;   // a naptár szerinti évszak elejéről indul
      this.grain = this.makeGrain();
      this.onR = () => this.resize(); window.addEventListener('resize', this.onR);
      window.__evszak = this;
    }
    P() {
      const p = this.getP() || {};
      return { hinta: p.hinta ?? false, eso: p['eső'] ?? true };
    }
    start() { if (this.run) return; this.run = true; const f = () => { if (!this.run) return; this.frame(); this.raf = requestAnimationFrame(f); }; f(); }
    stop() { this.run = false; cancelAnimationFrame(this.raf); }
    destroy() { this.stop(); window.removeEventListener('resize', this.onR); }

    resize() {
      const d = Math.min(2, window.devicePixelRatio || 1), cw = this.cv.clientWidth, ch = this.cv.clientHeight;
      if (!cw || !ch) return false;
      const w = Math.round(cw * d), h = Math.round(ch * d);
      if (w === this.w && h === this.h && d === this.d) return true;
      this.d = d; this.w = w; this.h = h; this.cv.width = w; this.cv.height = h;
      const portrait = h > w * 1.15;
      this.u = portrait ? Math.min(w * 0.9, h * 0.6) : Math.min(w / 1.45, h * 0.92);
      this.bx = w * (portrait ? 0.5 : 0.47); this.gy = h * (portrait ? 0.66 : 0.8);
      this.bgP = -1; this.treeKey = null; this.groundDirty = true;
      return true;
    }
    makeGrain() {
      const c = document.createElement('canvas'); c.width = c.height = 160; const g = c.getContext('2d'), im = g.createImageData(160, 160);
      for (let i = 0; i < im.data.length; i += 4) { const v = 110 + Math.random() * 100; im.data[i] = v; im.data[i + 1] = v * 0.96; im.data[i + 2] = v * 0.9; im.data[i + 3] = 255; }
      g.putImageData(im, 0, 0); return c;
    }
    cvs(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }

    // ---- állapot egy adott őszi pillanatra ----
    init(p) {
      const r = rng(7), L = this.T.leaves; this.fi = Math.round((1 - remain(p)) * this.N);
      this.fall = []; this.seatL = []; this.benchL = []; this.ground = [];
      for (let i = 0; i < this.fi; i++) {
        const l = L[i], x = l.x * 1.15 + (r() - 0.5) * 0.6, y = -0.04 + Math.pow(r(), 1.5) * 0.32;
        if (BENCH.on && x > BENCH.x0 && x < BENCH.x0 + (BENCH.x1 - BENCH.x0) * BENCH.free && r() < 0.12 && this.benchL.length < 18) this.benchL.push({ x, s: l.s, rot: l.rot, c: leafCol(l, p) });
        else this.ground.push({ x, y, s: l.s, rot: l.rot, c: leafCol(l, Math.min(1, p + 0.15)) });
      }
      this.groundDirty = true; this.treeKey = null; this.p = p; this.cleared = false;
    }
    setupAt(s) {
      this.init(s < 60 ? s / 60 : 1); this.snowSeat = 0;
      if (s >= 60) this.fi = this.N;
      if (s >= 120) { this.fi = 0; this.ground = []; this.benchL = []; this.cleared = true; this.groundDirty = true; }
    }
    release(n, p, vis = true) {
      for (let k = 0; k < n && this.fi < this.N; k++) {
        const l = this.T.leaves[this.fi++], r = Math.random;
        if (!vis) continue;   // a lomb csendben ritkul; csak néhány levél látszik hullani
        this.fall.push({ wk: 0.25 + r() * 1.1, fr: 0.8 + r() * 2.2, fr2: 0.25 + r() * 0.8, ph2: r() * TAU, sw: 0.02 + r() * 0.07, x: l.x, y: l.y, vx: (r() - 0.5) * 0.24, vy: (p > 0.7 ? 0.13 : 0.07) + r() * r() * 0.2, ph: r() * TAU, s: l.s, rot: l.rot, spin: (r() - 0.5) * 2, c: leafCol(l, p), tgt: -0.03 + r() * r() * 0.26, t: 0 });
      }
    }

    // ---- gyorsítótárak ----
    makeBg(p) {
      const { w, h, u, gy } = this, c = this.bg || (this.bg = this.cvs(w, h)); c.width = w; c.height = h; const g = c.getContext('2d'), r = rng(3);
      const hz = gy - 0.07 * u;
      const sT = mix(hex('#E9DDC4'), hex('#D6D3CC'), p), sB = mix(hex('#F4EBD9'), hex('#E8E4DC'), p);
      const gT = mix(hex('#CDBB93'), hex('#B7AC96'), p), gB = mix(hex('#B0976B'), hex('#9C8F7A'), p);
      let gr = g.createLinearGradient(0, 0, 0, hz); gr.addColorStop(0, rgb(sT)); gr.addColorStop(1, rgb(sB)); g.fillStyle = gr; g.fillRect(0, 0, w, hz + 2);
      gr = g.createLinearGradient(0, hz, 0, h); gr.addColorStop(0, rgb(gT)); gr.addColorStop(1, rgb(gB)); g.fillStyle = gr; g.fillRect(0, hz, w, h - hz);
      for (let i = 0; i < 14; i++) {   // ég: nagy, puha foltok
        const x = r() * w, y = r() * hz, rr = (0.2 + r() * 0.4) * u, cc = r() < 0.5 ? [255, 250, 238] : mix(sT, [120, 110, 100], 0.2);
        const q = g.createRadialGradient(x, y, 0, x, y, rr); q.addColorStop(0, rgb(cc, 0.12)); q.addColorStop(1, rgb(cc, 0)); g.fillStyle = q; g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
      }
      g.save(); g.filter = `blur(${Math.round(0.012 * u)}px)`;   // távoli, alig látszó erdősáv
      g.fillStyle = rgb(mix(sB, [96, 104, 112], 0.35), 0.35); g.beginPath(); g.moveTo(0, hz + 2);
      for (let x = 0; x <= w; x += 0.03 * u) g.lineTo(x, hz - (0.012 + 0.014 * Math.abs(Math.sin(x / u * 7.3) * Math.sin(x / u * 2.1 + 1))) * u);
      g.lineTo(w, hz + 2); g.fill(); g.restore();
      gr = g.createLinearGradient(0, hz - 0.05 * u, 0, hz + 0.07 * u);   // puha látóhatár
      gr.addColorStop(0, rgb(sB, 0)); gr.addColorStop(0.42, rgb(mix(sB, gT, 0.5), 1)); gr.addColorStop(1, rgb(gT, 0));
      g.fillStyle = gr; g.fillRect(0, hz - 0.05 * u, w, 0.12 * u);
      for (let i = 0; i < 420; i++) {   // föld: vízszintes ecsetvonások
        const y = hz + Math.pow(r(), 1.4) * (h - hz), k = (y - hz) / (h - hz + 1), cc = mix(mix(gT, gB, k), r() < 0.5 ? [240, 225, 190] : [90, 75, 55], 0.12 + r() * 0.12);
        g.fillStyle = rgb(cc, 0.22 + r() * 0.2); g.beginPath(); g.ellipse(r() * w, y, (0.03 + r() * 0.1) * u * (0.5 + k), (0.0025 + r() * 0.004) * u * (0.5 + k), 0, 0, TAU); g.fill();
      }
      g.save(); g.font = `${Math.round(0.028 * u)}px Georgia, serif`; g.fillStyle = 'rgba(40,30,20,0.022)'; g.textAlign = 'center';   // láthatatlan aláírás: kontrasztemeléssel előhívható
      g.fillText('© Bánky András · 2026. 11. 01. · Évszakok', w * 0.5, hz * 0.42); g.restore();
      this.bgP = p;
    }
    stampGround(g, l) {
      const { u, bx, gy } = this, x = bx + l.x * u, y = gy + l.y * u, k = 0.75 + 0.5 * cl((l.y + 0.05) / 0.3, 0, 1);
g.save(); g.translate(x, y); g.scale(1, 0.42); leaf(g, 0, 0, l.s * u * k, 1, l.rot, mix(l.c, [160, 140, 110], 0.3), 0.85, l.s * u > 7); g.restore();
    }
    makeGround() {
      const c = this.gl || (this.gl = this.cvs(this.w, this.h)); c.width = this.w; c.height = this.h;
      const g = c.getContext('2d'); for (const l of this.ground) this.stampGround(g, l); this.groundDirty = false;
    }
    // moha: néhány szabálytalan, puha, barnás-zöld folt a kéreg napos (bal) oldalán
    moss(g, L, Rr, n) {
      const r = rng(Math.round((L[0][0] + L[0][1]) * 1e5));
      for (let k = 0; k < n; k++) {
        const i = Math.floor(r() * (L.length - 1)), [x1, y1] = L[i], [x2, y2] = Rr[i], ww = Math.hypot(x2 - x1, y2 - y1);
        const f = 0.12 + r() * 0.3, cx = x1 + (x2 - x1) * f, cy = y1 + (y2 - y1) * f, [nx, ny] = L[i + 1], a = Math.atan2(ny - y1, nx - x1);
        g.fillStyle = rgb(mix(BARK_HI, BARK, r() * 0.4), 0.22 + r() * 0.2);
        g.beginPath(); g.ellipse(cx, cy, ww * (0.22 + r() * 0.35), ww * (0.1 + r() * 0.12), a, 0, TAU); g.fill();
      }
    }
    makeTree(st) {
      const { bs, wc } = st;
      const u = this.u, W = 1.7 * u, H = 1.0 * u, ox = 0.85 * u, oy = 0.95 * u;
      const c = this.tc || (this.tc = this.cvs(W, H)); c.width = Math.round(W); c.height = Math.round(H);
      const g = c.getContext('2d'); g.setTransform(u, 0, 0, u, ox, oy); g.lineCap = 'round';
      if (this.T.img) {
        const T = this.T, K = T.K, iw = T.img.width * K * u, ih = T.img.height * K * u, ix = ox - T.bx * K * u, iy = oy - T.by * K * u;
        g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(T.base, ix, iy, iw, ih);
        g.globalCompositeOperation = 'source-atop';
        if (wc > 0.01) { g.fillStyle = `rgba(150,168,196,${0.22 * wc})`; g.fillRect(0, 0, c.width, c.height); }   // télen hidegebb
        if (bs > 0.01) {   // hó az ágak tetején: a kép felső élei
          const sn = this.snc || (this.snc = this.cvs(c.width, c.height)); sn.width = c.width; sn.height = c.height;
          const q = sn.getContext('2d'); q.drawImage(T.base, ix, iy, iw, ih); q.globalCompositeOperation = 'source-in'; q.fillStyle = 'rgb(248,250,252)'; q.fillRect(0, 0, sn.width, sn.height);
          q.globalCompositeOperation = 'destination-out'; q.drawImage(T.base, ix, iy + Math.max(2, 0.005 * u), iw, ih);
          g.globalCompositeOperation = 'source-over'; g.globalAlpha = bs; g.drawImage(sn, 0, 0); g.globalAlpha = 1;
        }
        g.restore();
      } else {
      { // törzs: egyetlen sima, folyamatos forma a földtől az elágazásig (nincs törés)
        const b = this.T.br[0], L = [], Rr = [];
        for (let i = 0; i <= 24; i++) {
          const t = i / 24, [x, y] = bez(b, t), tx = 2 * (1 - t) * (b[2] - b[0]) + 2 * t * (b[4] - b[2]), ty = 2 * (1 - t) * (b[3] - b[1]) + 2 * t * (b[5] - b[3]);
          const n = Math.hypot(tx, ty), nx = -ty / n, ny = tx / n, hw = (b[6] + (b[7] - b[6]) * t) / 2;
          L.push([x - nx * hw, y - ny * hw]); Rr.push([x + nx * hw, y + ny * hw]);
        }
        g.fillStyle = rgb(BARK); g.beginPath(); L.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y + 0.004));
        for (let i = Rr.length - 1; i >= 0; i--) g.lineTo(Rr[i][0], Rr[i][1] + (i ? 0 : 0.004)); g.closePath(); g.fill();
        g.beginPath(); g.arc(b[4], b[5], b[7] / 2, 0, TAU); g.fill();   // lekerekített elágazás, nincs szögletes vég
        this.moss(g, L, Rr, 11);
      }
      g.fillStyle = rgb(BARK);
      for (const b of this.T.br.slice(1)) {   // minden ág folyamatosan vékonyodik (nem egyforma vastag „cső”), lekerekített véggel
        const n = b[6] > 0.01 ? 14 : 6, Lp = [], Rp = [];
        for (let i = 0; i <= n; i++) {
          const t = i / n, [x, y] = bez(b, t), tx = 2 * (1 - t) * (b[2] - b[0]) + 2 * t * (b[4] - b[2]), ty = 2 * (1 - t) * (b[3] - b[1]) + 2 * t * (b[5] - b[3]);
          const ln = Math.hypot(tx, ty) || 1, hw = (b[6] + (b[7] - b[6]) * t) / 2, nx = -ty / ln * hw, ny = tx / ln * hw;
          Lp.push([x + nx, y + ny]); Rp.push([x - nx, y - ny]);
        }
        g.beginPath(); Lp.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); for (let i = n; i >= 0; i--) g.lineTo(Rp[i][0], Rp[i][1]); g.closePath(); g.fill();
        g.beginPath(); g.arc(b[0], b[1], b[6] / 2, 0, TAU); g.arc(b[4], b[5], b[7] / 2, 0, TAU); g.fill();
      }
      for (const b of this.T.br.slice(1)) {   // a bal (napos) oldal világosabb
        if (b[6] < 0.012) continue;   // moha csak a vastag ágakon
        const L2 = [], R2 = [];
        for (let i = 0; i <= 10; i++) { const tt = 0.2 + 0.7 * i / 10, [x, y] = bez(b, tt), hw = (b[6] + (b[7] - b[6]) * tt) / 2; L2.push([x - hw, y]); R2.push([x + hw, y]); }
        this.moss(g, L2, R2, 5 + (b[0] * 1000 & 3));
      }
      if (bs > 0) this.T.br.forEach((b, bi) => {   // hó az ágak tetején: szaggatott foltokban; a meredek és a vastag alsó ágakon nem marad meg
        const dx = b[4] - b[0], dy = b[5] - b[1], hz = Math.abs(dx) / Math.hypot(dx, dy), wv = (b[6] + b[7]) / 2;
        if (hz < 0.45 || wv > 0.017 || bi === 0) return;
        const r = rng(bi * 31 + 7), o = wv * 0.42; g.lineWidth = wv * 0.5 * Math.min(1, hz * 1.2); g.strokeStyle = rgb([248, 250, 252], bs * Math.min(1, (hz - 0.45) * 3));
        let tt = r() * 0.25;
        while (tt < 1) { const len = 0.15 + r() * 0.35, t2 = Math.min(1, tt + len); g.beginPath();
          for (let i = 0; i <= 5; i++) { const [x, y] = bez(b, tt + (t2 - tt) * i / 5); i ? g.lineTo(x, y - o) : g.moveTo(x, y - o); }
          g.stroke(); tt = t2 + 0.08 + r() * 0.25; }
      });

      }
      if (st.bl > 0.01) this.T.tips.forEach(([x, y], i) => {   // tavaszi virágok
        const h1 = Math.abs(Math.sin(i * 91.7)) , h2 = Math.abs(Math.sin(i * 37.3)); if (h1 < 0.35) return;
        const cx = x + (h2 - 0.5) * 0.03, cy = y + (h1 - 0.5) * 0.024, r = 0.0042 * (0.6 + 0.4 * st.bl), c = BLOS[i % 3];
        g.fillStyle = rgb(c, 0.95 * st.bl);
        for (let k = 0; k < 5; k++) { const a = k / 5 * TAU + i; g.beginPath(); g.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, r * 0.85, 0, TAU); g.fill(); }
        g.fillStyle = rgb([226, 190, 96], st.bl); g.beginPath(); g.arc(cx, cy, r * 0.45, 0, TAU); g.fill();
      });
      for (let i = this.fi; i < this.N; i++) {
        const l = this.T.leaves[i], sc = st.grow == null ? 1 : sm(0.3 + 0.42 * (1 - l.ord), 0.44 + 0.42 * (1 - l.ord), st.grow);
        if (sc < 0.04) continue;
        const c0 = st.col(l), cv = l.v ? (l.v > 0 ? mix(c0, [236, 232, 170], l.v * 0.7) : mix(c0, [34, 44, 22], -l.v)) : c0;   // levelenként világosabb / sötétebb árnyalat
        leaf(g, l.x, l.y, l.s * 1.05 * sc, 1, l.rot, cv, 0.95, false, true);   // egyszerű forma: gyors újrarajzolás (nincs akadás)
      }
      const s = this.ts || (this.ts = this.cvs(W, H)); s.width = c.width; s.height = c.height;
      const sg = s.getContext('2d'); sg.drawImage(c, 0, 0); sg.globalCompositeOperation = 'source-in'; sg.fillStyle = rgb(mix([70, 52, 40], [92, 104, 126], wc)); sg.fillRect(0, 0, s.width, s.height);
      // a törzs árnyéka a tőnél ne látsszon (ne hasson kitámasztó rúdnak): alul kitörölve, felfelé fokozatosan jelenik meg
      sg.globalCompositeOperation = 'destination-out';
      const eg = sg.createLinearGradient(0, oy, 0, oy - 0.32 * u); eg.addColorStop(0, 'rgba(0,0,0,1)'); eg.addColorStop(0.45, 'rgba(0,0,0,1)'); eg.addColorStop(1, 'rgba(0,0,0,0)');
      sg.fillStyle = eg; sg.fillRect(0, oy - 0.32 * u, s.width, 0.32 * u + 2);
      sg.globalCompositeOperation = 'source-over';
      this.to = [ox, oy];
    }

    // ---- képkocka ----
    frame() {
      if (!this.resize()) return;
      if (!this.T.img) { this.tl = performance.now(); return; }   // a régi, rajzolt fa soha ne villanjon fel: várunk a képre
      const now = performance.now(), dt = Math.min(0.05, (now - this.tl) / 1000); this.tl = now;
      const t = (now - this.t0) / 1000, P = this.P();
      const T = t + this.off, S = T % 240, cy = Math.floor(T / 240), sW = S < 120 ? S + 240 : S;
      if (this.cyc < 0) { this.cyc = cy; this.setupAt(S); }
      else if (cy !== this.cyc) { this.cyc = cy; this.init(0); this.snowSeat = 0; }
      this.S = S;
      // évszak-súlyok: előbb a fény, aztán a színek, végül az időjárás (kb. 10 mp, két évszakba belelógva)
      const lW = sm(54, 62, S) * (1 - sm(114, 122, S)), lS = sm(114, 122, S) * (1 - sm(174, 182, S)), lU = sm(174, 182, sW) * (1 - sm(234, 242, sW)), lA = Math.max(0, 1 - lW - lS - lU);
      const cW = sm(57, 65, S) * (1 - sm(117, 125, S)), cS = sm(117, 125, S) * (1 - sm(177, 185, S)), cU = sm(177, 185, sW) * (1 - sm(237, 245, sW));
      const p = S < 60 ? S / 60 : S < 120 ? 1 : 0, pBg = S < 60 ? S / 60 : S < 120 ? 1 : 1 - sm(125, 185, S);
      const q = S >= 60 && S < 120 ? (S - 60) / 60 : 0, qS = S >= 120 && S < 180 ? (S - 120) / 60 : S >= 180 ? 1 : 0, spring = S >= 120 && S < 180;
      const fU = S >= 120 ? 1 - sm(234, 246, S) : 1 - sm(234, 246, S + 240);   // a nyári zöld átfordul az őszi színekbe
      const wl = lW, wcol = cW;
      const snowF = q > 0 ? sm(0.28, 0.38, q) * (1 - sm(0.5, 0.6, q)) : 0;
      const cov = S < 60 ? 0 : S < 120 ? sm(0.36, 0.6, q) : spring ? 1 - sm(0.03, 0.4, qS) : 0;
      const bs = (S < 60 ? 0 : S < 120 ? sm(0.38, 0.62, q) : spring ? 1 - sm(0, 0.25, qS) : 0) * 0.95;
      const cloud = Math.max(0.7 * sm(151, 160, S) * (1 - sm(174, 181, S)), sm(206, 215, S) * (1 - sm(227, 233, S)));   // befelhősödés a tavaszi eső és a nyári zápor előtt
      this.cloud = cloud;
      const shower = P.eso ? sm(216, 217.5, S) * (1 - sm(223.5, 229, S)) : 0;   // nyári zápor: 3:36–3:46
      const aprR = P.eso ? sm(160.5, 162, S) * (1 - sm(170.5, 176.5, S)) : 0;   // áprilisi zápor: 2:41–2:50 (napsütéses)
      const rain = Math.max(P.eso && S < 60 ? sm(14, 16, S) * (1 - sm(24.5, 31, S)) : 0, shower, aprR * 0.8);
      this.rbw = 0;   // ősz: 15. mp-től kb. 8 mp eső
      const wet = sm(217, 221, S) * (1 - sm(226, 238, S));
      const bl = spring ? sm(0.04, 0.22, qS) * (1 - sm(0.42, 0.62, qS)) : 0;
      // szél és lökés
      if (t >= this.nextGust) {
        this.gust = 1 - 0.6 * wl; this.gDir = Math.random() < 0.5 ? -1 : 1; this.nextGust = t + 15 + Math.random() * 20;
        if (this.snowSeat > 0.004 && this.sw) { this.snowSeat *= 0.55; this.puffs.push({ x: this.sw.x, y: this.sw.y, t: 0 }); }   // néha lehull egy kevés hó a hintáról
        if (S < 56) { this.release(2 + (Math.random() * 3 | 0), p); this.nextVis = t + 1.2; }
        if (S < 60) for (const l of this.seatL) this.fall.push({ x: l.wx, y: l.wy, vx: (this.gDir || 1) * (0.18 + Math.random() * 0.15), vy: 0.02, ph: Math.random() * TAU, s: l.s, rot: l.rot, spin: 3, c: l.c, tgt: -0.02 + Math.random() * 0.2, t: 0 });
        this.seatL = [];
        if (S < 60 && this.benchL.length && Math.random() < 0.5) { const l = this.benchL.splice(Math.random() * this.benchL.length | 0, 1)[0]; this.fall.push({ x: l.x, y: BENCH.seatAt(l.x) - 0.004, vx: 0.15, vy: 0.02, ph: 0, s: l.s, rot: l.rot, spin: 2.5, c: l.c, tgt: 0.02 + Math.random() * 0.15, t: 0 }); }
      }
      this.gust *= Math.exp(-dt / 2.5);
      const wind = 0.12 * Math.sin(t * 0.23) + this.gust * (this.gDir || 1) * (0.8 + 0.4 * Math.sin(t * 3.1));
      // levelek: ősszel hullanak, a tél elején az utolsók is, tavasszal újra kinőnek
      if (S < 60) { const tg = Math.round((1 - remain(p)) * this.N);
        if (this.fi < tg) { const vis = this.N - this.fi < 40 || (S < 56 && t >= (this.nextVis || 0)); this.release(Math.min(6, tg - this.fi), p, vis); if (vis) { const q = Math.random(); this.nextVis = t + (q < 0.3 ? 0.08 + Math.random() * 0.25 : q < 0.85 ? 0.4 + Math.random() * 0.9 : 1.6 + Math.random() * 1.8); } } }
      else if (S < 120) { if (this.fi < this.N) { this.fi = this.N; this.treeKey = null; } if (this.fall.length && S > 92) this.fall = this.fall.filter(l => l.kind === 'p' || l.y > -0.06); }   // télen nincs levélhullás
      else if (this.fi !== 0) { this.fi = 0; this.treeKey = null; }
      if ((cov > 0.97 || S >= 100) && !this.cleared) { this.cleared = true; this.ground = []; this.benchL = []; this.seatL = []; this.fall = this.fall.filter(l => l.kind === 'p'); this.groundDirty = true; }   // a hó alatt eltűnik az avar (akkor is, ha a lap a háttérben volt)   // a hó alatt eltűnik az avar
      // tavasz: hulló szirmok
      if (spring && qS > 0.36 && qS < 0.62 && Math.random() < dt * 7) {
        const [x, y] = this.T.tips[Math.random() * this.T.tips.length | 0], r = Math.random;
        this.fall.push({ kind: 'p', x, y, vx: (r() - 0.5) * 0.1, vy: 0.03 + r() * 0.02, ph: r() * TAU, s: 0.0062, rot: r() * TAU, spin: (r() - 0.5) * 3, c: PET[r() * 3 | 0], tgt: -0.03 + r() * r() * 0.26, t: 0 });
      }
      const pAc = S < 60 ? p : 0, col = spring ? (l => mix(mix(FRESH, SUMG, sm(0.35, 1, qS)), LEAF[l.c], 0.06)) : (l => mix(leafCol(l, pAc), SUMG, fU));
      if (this.bgP < 0 || Math.abs(pBg - this.bgP) > 0.02) this.makeBg(pBg);
      const key = [Math.round(pAc / 0.012), this.fi / 10 | 0, Math.round(bs / 0.03), Math.round(wcol / 0.05), spring ? Math.round(qS / 0.008) : -1, Math.round(fU / 0.04), Math.round(bl / 0.04)].join();
      if (key !== this.treeKey) { this.treeKey = key; this.makeTree({ bs, wc: wcol, grow: spring ? qS : null, col, bl }); }
      this.snowSeat = Math.max(0, Math.min(0.006, (this.snowSeat || 0) + dt * 0.0003 * snowF - (spring ? dt * 0.0004 : 0)));
      if (this.groundDirty) this.makeGround();
      this.wcol = wcol;
      const { ctx, w, h, u, bx, gy, d } = this;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      ctx.drawImage(this.bg, 0, 0);
      if (this.cloud > 0.01) this.drawClouds(ctx, t);
      { const fl = [[220.2, 0.12, 1], [220.45, 0.09, 0.7]].reduce((a, [t0, d, k]) => S >= t0 && S < t0 + d ? Math.max(a, k * (1 - (S - t0) / d)) : a, 0);   // felhő-felhő villám: a felhők belseje dereng fel
        if (fl > 0) { const hz = gy - 0.07 * u, cx = w * 0.68, cy = hz * 0.32, R0 = Math.max(w, h) * 0.55, g5 = ctx.createRadialGradient(cx, cy, 0, cx, cy, R0);
          g5.addColorStop(0, `rgba(236,238,250,${0.55 * fl})`); g5.addColorStop(0.5, `rgba(220,224,240,${0.2 * fl})`); g5.addColorStop(1, 'rgba(220,224,240,0)');
          ctx.fillStyle = g5; ctx.fillRect(0, 0, w, hz + 0.05 * u); }
        if (this.onEvent) { const pS = this.lgS ?? S; if (pS < 223.6 && S >= 223.6) this.onEvent('dörgés'); } this.lgS = S; }
      if (this.rbw > 0.01) {
        const hz = gy - 0.07 * u, cx = bx + 0.32 * u, cy = gy + 0.25 * u, R0 = 0.95 * u, bw = 0.014 * u;
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, hz + 0.01 * u); ctx.clip(); ctx.filter = `blur(${Math.max(1, Math.round(0.006 * u))}px)`;
        ['#E07A6A', '#EDA766', '#EBD27A', '#9CC383', '#7FADD4', '#9A8CC6'].forEach((c, i) => {
          ctx.strokeStyle = rgb(hex(c), 0.26 * this.rbw); ctx.lineWidth = bw * 1.15; ctx.beginPath(); ctx.arc(cx, cy, R0 - i * bw, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke(); });
        ctx.restore();
      }
      const wH = sm(192, 200, S) * (1 - sm(203, 206, S));
      if (wH > 0.01) {   // forróság: csak a távoli látóhatár fölött, épp hogy sejthetően remeg a levegő
        const y0 = Math.max(0, Math.round(gy - 0.13 * u)), y1 = Math.round(gy - 0.055 * u), st = 2 * d;
        for (let y = y0; y < y1; y += st) {
          const k2 = Math.sin(Math.PI * (y - y0) / (y1 - y0)), off = d * 0.7 * wH * k2 * Math.sin(y * 0.05 / d + t * 2.2);
          ctx.drawImage(this.bg, 0, y, w, st, off, y, w, st);
        }
      }
      { const hz = gy - 0.07 * u;
        const cA = Math.max(0, 1 - cW - cS - cU);
        for (const [c, a] of [[[226, 231, 237], 0.6 * wcol], [[190, 214, 236], 0.62 * cS], [[236, 206, 156], 0.52 * cU], [[226, 196, 178], 0.4 * cA]]) if (a > 0.005) {   // ég: téli reggel / tavaszi délelőtt / nyári délután / őszi este
          const g7 = ctx.createLinearGradient(0, 0, 0, hz + 0.02 * u); g7.addColorStop(0, rgb(c, a)); g7.addColorStop(1, rgb(c, a * 0.55)); ctx.fillStyle = g7; ctx.fillRect(0, 0, w, hz + 0.02 * u); }
        for (const [c, a] of [[[150, 166, 100], 0.5 * cS], [[124, 143, 78], 0.58 * cU]]) if (a > 0.005) {   // föld: tavaszi és nyári zöld
          const g3 = ctx.createLinearGradient(0, hz - 0.01 * u, 0, hz + 0.05 * u); g3.addColorStop(0, rgb(c, 0)); g3.addColorStop(1, rgb(c, a));
          ctx.fillStyle = g3; ctx.fillRect(0, hz - 0.01 * u, w, 0.06 * u); ctx.fillStyle = rgb(c, a); ctx.fillRect(0, hz + 0.05 * u, w, h); } }
      ctx.drawImage(this.gl, 0, 0);
      if (cov > 0) {   // hótakaró a földön
        const hz = gy - 0.07 * u, g2 = ctx.createLinearGradient(0, hz - 0.01 * u, 0, hz + 0.05 * u);
        g2.addColorStop(0, 'rgba(244,246,248,0)'); g2.addColorStop(1, `rgba(244,246,248,${0.93 * cov})`);
        ctx.fillStyle = g2; ctx.fillRect(0, hz - 0.01 * u, w, 0.06 * u); ctx.fillStyle = `rgba(244,246,248,${0.93 * cov})`; ctx.fillRect(0, hz + 0.05 * u, w, h);
        ctx.fillStyle = `rgba(210,218,228,${0.35 * cov})`;
        for (let i = 0; i < 9; i++) { const x = ((i * 0.37 + 0.11) % 1) * w, y = hz + (0.06 + (i * 0.53 % 1) * 0.5) * (h - hz); ctx.beginPath(); ctx.ellipse(x, y, 0.18 * u, 0.008 * u, 0, 0, TAU); ctx.fill(); }
      }
      // a fa árnyéka a főszereplő: hosszan, jobbra előre
      const [ox, oy] = this.to, k = 0.62 + 0.012 * Math.sin(t * 0.21) + this.gust * 0.01 * Math.sin(t * 4) + 0.008 * lU * Math.sin(t * 0.8), f = 0.2, sa = 0.36 * (1 - 0.75 * rain) * (1 - 0.35 * pBg) * (1 - 0.35 * snowF) * (1 + 0.85 * cov) * (1 + 0.45 * lU) * (1 - 0.6 * cloud);
      ctx.globalAlpha = sa * 0.85; ctx.setTransform(1, 0, -k, -f, bx - ox + k * oy, gy + f * oy); ctx.drawImage(this.ts, 0, 0);
      { const tw = 0.07 * u, th3 = 0.26 * u; ctx.globalAlpha = sa * 0.32; ctx.drawImage(this.ts, ox - tw, oy - th3, tw * 2, th3, ox - tw, oy - th3, tw * 2, th3); }   // a törzs árnyéka kicsit erősebb
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
      if (!this.T.img) { // a törzs árnyéka külön, határozottan: a tövétől az elágazás árnyékáig, elvékonyodva
        const H = 0.235 * u, ex = bx + k * H, ey = gy + f * H, w0 = 0.026 * u, w1 = 0.016 * u;
        ctx.save(); ctx.filter = `blur(${Math.max(1, Math.round(0.003 * u))}px)`;
        ctx.fillStyle = `rgba(70,52,40,${Math.min(0.5, sa * 1.25)})`;
        ctx.beginPath(); ctx.moveTo(bx - w0, gy + 0.002 * u); ctx.lineTo(bx + w0, gy - 0.002 * u); ctx.lineTo(ex + w1, ey - 0.004 * u); ctx.lineTo(ex - w1, ey + 0.004 * u); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
      ctx.setTransform(u, 0, 0, u, bx, gy);
      ctx.fillStyle = rgb(mix([70, 52, 40], [92, 104, 126], wcol), sa * 0.9);   // pad árnyéka
      if (BENCH.on) for (const [x, y] of BENCH.stones) { ctx.beginPath(); ctx.ellipse(x + 0.022, y + 0.002, 0.034, 0.007, -0.05, 0, TAU); ctx.fill(); }   // a kövek árnyéka
      // a fa (alig érezhető ringással)
      const sk = 0.003 * Math.sin(t * 0.5) + this.gust * 0.006 * Math.sin(t * 2.3) + 0.002 * lU * Math.sin(t * 0.9); this.sk = sk;
      ctx.setTransform(1, 0, sk, 1, bx - ox - sk * oy, gy - oy); ctx.drawImage(this.tc, 0, 0);
      ctx.setTransform(u, 0, 0, u, bx, gy);
      this.drawBench(ctx, cov);
      if (P.hinta) this.drawSwing(ctx, t, sa, wl, cov);
      // hulló levelek
      const sw = this.sw;
      for (let i = this.fall.length - 1; i >= 0; i--) {
        const l = this.fall[i]; l.t += dt; const s = Math.sin(l.ph + l.t * (l.fr || 1.6)), py = l.y;
        l.x += (s * (l.sw || 0.045) + wind * 0.07 * (l.wk || 1) + l.vx) * dt; l.y += l.vy * (0.7 + 0.3 * Math.abs(s)) * (l.fr2 ? 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(l.ph2 + l.t * l.fr2)) + 0.35 * Math.min(1, l.t / 3) : 1) * dt;   // siklik, majd gyorsul – levelenként másként l.vx *= Math.exp(-dt * 0.25); l.rot += l.spin * dt;
        if (P.hinta && sw && py < sw.y - 0.006 && l.y >= sw.y - 0.006 && Math.abs(l.x - sw.x) < sw.hw && this.seatL.length < 6) { this.seatL.push({ o: l.x - sw.x, s: l.s, rot: l.rot, c: l.c }); this.fall.splice(i, 1); continue; }
        const bt = BENCH.seatAt(l.x) - 0.002;
        if (BENCH.on && py < bt && l.y >= bt && l.tgt > -0.01 && l.tgt < 0.03 && l.x > BENCH.x0 && l.x < BENCH.x0 + (BENCH.x1 - BENCH.x0) * BENCH.free && this.benchL.length < 25) { this.benchL.push({ x: l.x, s: l.s, rot: l.rot, c: l.c }); this.fall.splice(i, 1); continue; }
        if (l.kind === 'p') {
          if (l.y >= l.tgt) { this.fall.splice(i, 1); this.pg.push({ x: l.x, y: l.y, c: l.c, rot: l.rot, t: 0 }); continue; }
          petal(ctx, l.x, l.y, l.s, Math.max(0.18, Math.abs(Math.cos(l.ph + l.t * 2.6))), l.rot, l.c, 0.95); continue;
        }
        if (l.y >= l.tgt) { this.fall.splice(i, 1); this.ground.push(l); this.stampGround(this.gl.getContext('2d'), l); continue; }
        leaf(ctx, l.x, l.y, l.s * 1.1, Math.max(0.12, Math.abs(Math.cos(l.ph + l.t * 2.2))), l.rot, l.c, 0.95, true);
      }
      if (this.ground.length > 3000) this.ground.splice(0, 500);
      for (let k = this.pg.length - 1; k >= 0; k--) { const g4 = this.pg[k]; g4.t += dt; if (g4.t > 2.5) { this.pg.splice(k, 1); continue; } ctx.save(); ctx.translate(g4.x, g4.y); ctx.scale(1, 0.4); petal(ctx, 0, 0, 0.0058, 1, g4.rot, g4.c, 0.9 * (1 - g4.t / 2.5)); ctx.restore(); }
      for (let k = this.puffs.length - 1; k >= 0; k--) { const pf = this.puffs[k]; pf.t += dt; if (pf.t > 1.2) { this.puffs.splice(k, 1); continue; } ctx.fillStyle = `rgba(250,251,252,${0.8 * (1 - pf.t / 1.2)})`; for (let i = 0; i < 9; i++) { const a = i * 0.7; ctx.beginPath(); ctx.arc(pf.x + Math.cos(a) * 0.012 * (i % 3 - 1), pf.y + pf.t * pf.t * 0.04 + (i % 4) * 0.003, 0.0016, 0, TAU); ctx.fill(); } }
      this.drawDrops(ctx, S, dt); this.drawBirds(ctx, S, bs); this.drawButterfly(ctx, S, t); this.drawSpring(ctx, S, t); this.drawCranes(ctx, S, t);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (snowF > 0.01) {   // hópelyhek: lassan, ringatózva
        const n = Math.round(220 * snowF);
        for (let i = 0; i < n; i++) {
          const fx = Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1), fy = Math.abs((Math.sin(i * 78.233) * 12345.678) % 1), z = 0.5 + fx * 0.9;
          const y = ((t * (0.05 + 0.05 * z) + fy) % 1) * (h + 20) - 10, x = ((fx * w * 1.7 + Math.sin(t * 0.6 + i) * 0.02 * u + y * wind * 0.15) % w + w) % w;
          ctx.fillStyle = `rgba(255,255,255,${(0.55 + 0.35 * fy) * Math.min(1, snowF * 1.5)})`;
          ctx.beginPath(); ctx.arc(x, y, 0.0028 * u * z, 0, TAU); ctx.fill();
        }
      }
      // eső
      if (wet > 0.01) { const hz = gy - 0.07 * u, g4 = ctx.createLinearGradient(0, hz - 0.02 * u, 0, hz + 0.05 * u); g4.addColorStop(0, 'rgba(60,58,40,0)'); g4.addColorStop(1, `rgba(60,58,40,${0.2 * wet})`); ctx.fillStyle = g4; ctx.fillRect(0, hz - 0.02 * u, w, 0.07 * u); ctx.fillStyle = `rgba(60,58,40,${0.2 * wet})`; ctx.fillRect(0, hz + 0.05 * u, w, h); }   // nedves föld, puha átmenettel   // a zápor után egy darabig nedves, sötétebb a föld
      if (rain > 0.01) {
        ctx.fillStyle = `rgba(${128 - 30 * shower},${132 - 28 * shower},${138 - 22 * shower},${(0.16 + 0.12 * shower) * rain})`; ctx.fillRect(0, 0, w, h);
        const n = Math.round((150 + 120 * shower) * rain), sl = 0.18 + wind * 0.25, hz = gy - 0.07 * u, big = 1 + 0.45 * shower;
        for (let i = 0; i < n; i++) {   // cseppek: kerek fej, elvékonyodó csóva
          const fx = Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1), fy = Math.abs((Math.sin(i * 78.233) * 12345.678) % 1);
          const sz = (0.6 + fx * 0.6) * big, L = 0.026 * u * sz, rr = 0.0032 * u * sz;
          const y = ((t * (0.75 + fy * 0.3) + fy) % 1) * (h + L * 2) - L, x = ((fx * w * 1.3 + y * sl) % w + w) % w;
          const tx = x - L * sl, ty = y - L;
          ctx.beginPath(); ctx.moveTo(tx, ty);
          ctx.quadraticCurveTo(x + rr * 0.9, y - rr * 2, x + rr, y); ctx.arc(x, y, rr, 0, Math.PI);
          ctx.quadraticCurveTo(x - rr * 0.9, y - rr * 2, tx, ty);
          ctx.fillStyle = `rgba(150,165,180,${0.5 * rain})`; ctx.fill();
          ctx.fillStyle = `rgba(255,255,255,${0.55 * rain})`; ctx.beginPath(); ctx.arc(x - rr * 0.35, y - rr * 0.2, rr * 0.35, 0, TAU); ctx.fill();
        }
        for (let k = Math.round(rain * 4 * (0.5 + Math.random())); k > 0; k--) { const yy = hz + Math.pow(Math.random(), 0.8) * (h - hz); this.spl.push({ x: Math.random() * w, y: yy, t: 0, s: 0.6 + 0.8 * (yy - hz) / (h - hz) }); }
      }
      ctx.lineWidth = d;
      for (let i = this.spl.length - 1; i >= 0; i--) {   // becsapódás: táguló gyűrű a földön
        const q = this.spl[i]; q.t += dt; if (q.t > 0.6) { this.spl.splice(i, 1); continue; }
        const k = q.t / 0.6, r = (0.004 + 0.012 * k) * u * q.s;
        ctx.strokeStyle = `rgba(235,240,245,${0.55 * (1 - k)})`; ctx.beginPath(); ctx.ellipse(q.x, q.y, r, r * 0.3, 0, 0, TAU); ctx.stroke();
      }
      // fény: a napos oldal, ősz végére és esőben halványul
      ctx.globalCompositeOperation = 'soft-light';
      let gr = ctx.createRadialGradient(-0.1 * w, -0.15 * h, 0, -0.1 * w, -0.15 * h, Math.hypot(w, h) * 1.1);
      const LP = [[[255, 186, 128], 0.5 * (1 - 0.35 * (S < 60 ? p : 1)), lA], [[215, 228, 245], 0.38, lW], [[236, 246, 255], 0.5, lS], [[255, 198, 112], 0.8, lU]];
      const lc = [0, 1, 2].map(i => LP.reduce((a, x) => a + x[0][i] * x[2], 0) | 0), li = LP.reduce((a, x) => a + x[1] * x[2], 0) * (1 - rain);
      gr.addColorStop(0, rgb(lc, li)); gr.addColorStop(1, rgb(lc, 0));
      ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      const wS = sm(184, 196, S) * (1 - sm(228, 238, S)) * (1 - 0.92 * sm(214, 217, S) * (1 - sm(225, 229, S))) * (1 - 0.85 * this.cloud);
      if (wS > 0.01) {   // nyári délután: a nap a kép bal széle mögött, csak a meleg ragyogása és halvány sugarai látszanak
        const R0 = Math.min(w, h), sxp = -0.06 * w, syp = 0.26 * h, pulse = 0.88 + 0.12 * Math.sin(t * 0.5) * Math.sin(t * 0.19 + 1);
        ctx.globalCompositeOperation = 'screen';
        const g5 = ctx.createRadialGradient(sxp, syp, 0, sxp, syp, R0 * 1.15);
        g5.addColorStop(0, `rgba(255,214,140,${0.5 * wS * pulse})`); g5.addColorStop(0.18, `rgba(246,190,110,${0.26 * wS * pulse})`); g5.addColorStop(0.55, `rgba(230,170,96,${0.08 * wS})`); g5.addColorStop(1, 'rgba(230,170,96,0)');
        ctx.fillStyle = g5; ctx.fillRect(0, 0, w, h);
        ctx.save(); ctx.translate(sxp, syp);
        for (let i = 0; i < 7; i++) {
          const a = -0.55 + i * 0.19 + 0.04 * Math.sin(t * 0.13 + i), len = R0 * (0.9 + 0.5 * Math.abs(Math.sin(i * 7.7))), wd = 0.03 + 0.02 * Math.abs(Math.sin(i * 3.1));
          const al = wS * 0.06 * pulse * (0.5 + 0.5 * Math.sin(t * 0.35 + i * 1.9));
          const g6 = ctx.createLinearGradient(0, 0, Math.cos(a) * len, Math.sin(a) * len); g6.addColorStop(0, `rgba(255,212,140,${al})`); g6.addColorStop(1, 'rgba(255,212,140,0)');
          ctx.fillStyle = g6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a - wd) * len, Math.sin(a - wd) * len); ctx.lineTo(Math.cos(a + wd) * len, Math.sin(a + wd) * len); ctx.closePath(); ctx.fill();
        }
        ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
      }
      { const cA = Math.max(0, 1 - cW - cS - cU), hz = gy - 0.07 * u;
        if (cA > 0.01) {   // őszi este: kicsit sötétebb, alkonyi tónus és enyhe köd a látóhatáron
          ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgb([226, 204, 196], 0.55 * cA); ctx.fillRect(0, 0, w, h);
          ctx.globalCompositeOperation = 'source-over';
          const g8 = ctx.createLinearGradient(0, hz - 0.2 * u, 0, hz + 0.16 * u);
          g8.addColorStop(0, 'rgba(232,222,216,0)'); g8.addColorStop(0.5, `rgba(232,222,216,${0.42 * cA})`); g8.addColorStop(1, 'rgba(232,222,216,0)');
          ctx.fillStyle = g8; ctx.fillRect(0, hz - 0.2 * u, w, 0.36 * u);
        }
        if (cU > 0.01) { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgb([246, 226, 196], 0.6 * cU); ctx.fillRect(0, 0, w, h); ctx.globalCompositeOperation = 'source-over'; }   // nyári délután: aranybarna
      }
      const wU = sm(186, 196, S) * (1 - sm(197, 204, S));   // porszemek: a felhők előtt eltűnnek, utána nem jönnek vissza
      if (wU > 0.01) for (let i = 0; i < 46; i++) {   // nyár: aranyló porszemek a fényben
        const fx = Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1), fy = Math.abs((Math.sin(i * 78.233) * 12345.678) % 1);
        const x = ((fx * w + t * (0.004 + fy * 0.006) * u + Math.sin(t * 0.3 + i) * 0.03 * u) % w + w) % w, y = (0.08 + fy * 0.7) * h + Math.sin(t * 0.25 + i * 1.7) * 0.03 * u;
        ctx.fillStyle = `rgba(255,238,178,${wU * (0.35 + 0.35 * Math.sin(t * 1.3 + i * 2.1))})`; ctx.beginPath(); ctx.arc(x, y, 0.0022 * u * (0.6 + fx * 0.8), 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = ctx.createPattern(this.grain, 'repeat'); ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1;
      gr = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.4, w / 2, h / 2, Math.hypot(w, h) * 0.62);
      gr.addColorStop(0, 'rgba(80,60,40,0)'); gr.addColorStop(1, 'rgba(80,60,40,0.16)'); ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h);
      if (this.onInfo && (!this.ii || now - this.ii > 1000)) { this.ii = now; this.onInfo(['ősz', 'tél', 'tavasz', 'nyár'][S / 60 | 0], S); }
    }
    // olvadás: a tél végén az első csepp vezet vissza a tavaszba
    drawDrops(ctx, S, dt) {
      if (S >= 115.5 && S < 140 && (this.nextDrop == null || S >= this.nextDrop || S < this.nextDrop - 30)) {
        const first = this.nextDrop == null || this.nextDrop < 115.5 || this.nextDrop > 141, pts = this.T.drip;
        const [x, y] = first ? bez(this.T.sw, 0.45) : pts[Math.random() * pts.length | 0];
        this.drops.push({ x, y: y + 0.004, vy: 0, t: 0, tgt: 0.005 + Math.random() * 0.12 }); this.nextDrop = S + (first ? 2.5 : 0.9 + Math.random() * 1.8);
      }
      if (S < 115) this.nextDrop = null;
      if (BENCH.on && S >= 121 && S < 147 && Math.random() < dt * 1.8) {   // a pad ülőlapjáról csöpög az olvadó hó
        const fw = (BENCH.x1 - BENCH.x0) * BENCH.free;
        const dx0 = BENCH.x0 + 0.01 + Math.random() * (fw - 0.02); this.drops.push({ x: dx0, y: BENCH.seatAt(dx0) + BENCH.plank, vy: 0, t: 0, tgt: 0.004 + Math.random() * 0.014 });
      }
      for (let i = this.drops.length - 1; i >= 0; i--) {
        const q = this.drops[i]; q.t += dt; const hang = Math.min(1, q.t / 0.7);
        if (q.t > 0.7) { q.vy += 1.1 * dt; q.y += q.vy * dt; }
        if (q.y >= q.tgt) { this.drops.splice(i, 1); this.onEvent && this.onEvent('csepp'); const r = 0.7; this.spl.push({ x: this.bx + q.x * this.u, y: this.gy + q.y * this.u, t: 0, s: r }); continue; }
        const r = 0.0031 * (0.5 + 0.5 * hang), st = Math.min(0.012, q.vy * 0.02);
        ctx.fillStyle = 'rgba(176,196,214,0.85)'; ctx.beginPath(); ctx.moveTo(q.x, q.y - r * 1.6 - st); ctx.quadraticCurveTo(q.x + r, q.y - r * 0.4, q.x, q.y + r); ctx.quadraticCurveTo(q.x - r, q.y - r * 0.4, q.x, q.y - r * 1.6 - st); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(q.x - r * 0.3, q.y - r * 0.1, r * 0.3, 0, TAU); ctx.fill();
      }
    }
    // két veréb: berepül, megpihen egy ágon, csiripel, továbbrepül
    drawBirds(ctx, S, bs) {
      if (S < 95 || S > 117) { this.bS = S; return; }
      const { w, u, bx } = this, L = -bx / u - 0.08, Rt = (w - bx) / u + 0.08, sk = this.sk || 0, prev = this.bS ?? S; this.bS = S;
      const hsh = x => Math.abs(Math.sin(x * 127.1) * 43758.5453) % 1;
      for (let k = 0; k < 2; k++) {
        const pc = this.T.perch[k], tin = 96 + k * 0.8, tl = tin + 3.2, tout = 110 + k * 0.9;
        const px = pc.x + sk * pc.y, py = pc.y - pc.wv * 0.3 * bs / 0.95;
        let x, y, dir, flap = null, beak = false;
        if (S < tin || S > tout + 3.5) continue;
        if (S < tl) {
          const f = (S - tin) / (tl - tin), e = 1 - (1 - f) * (1 - f), sx = L - k * 0.05, sy = -0.72 + k * 0.04;
          const cx = (sx + px) / 2, cyy = Math.min(sy, py) - 0.12;
          x = (1 - e) * (1 - e) * sx + 2 * (1 - e) * e * cx + e * e * px; y = (1 - e) * (1 - e) * sy + 2 * (1 - e) * e * cyy + e * e * py;
          dir = 1; flap = f < 0.85 ? Math.sin(S * TAU * 11 + k) : -0.3;
        } else {
          // ülőhelyek sorrendje: saját ág → átszáll egy közeli ágra (→ a 0. veréb vissza is)
          const P0 = c => [c.x + sk * c.y, c.y - c.wv * 0.3 * bs / 0.95], home = P0(pc), alt = P0(this.T.alt[k]);
          const hops = k === 0 ? [[102.0, home, alt], [106.4, alt, home]] : [[104.1, home, alt]];
          let cur = home, hop = null; for (const hp of hops) { if (S >= hp[0] + 0.75) cur = hp[2]; else if (S >= hp[0]) hop = hp; }
          if (S < tout) {
            if (hop) {
              const f = (S - hop[0]) / 0.75, e = sm(0, 1, f), [ax, ay] = hop[1], [bx2, by2] = hop[2], cx = (ax + bx2) / 2, cyy = Math.min(ay, by2) - 0.04;
              x = (1 - e) * (1 - e) * ax + 2 * (1 - e) * e * cx + e * e * bx2; y = (1 - e) * (1 - e) * ay + 2 * (1 - e) * e * cyy + e * e * by2;
              dir = bx2 >= ax ? 1 : -1; flap = Math.sin(S * TAU * 12 + k);
              if (f < 0.1 && bs > 0.1 && !hop.p) { hop.p = 1; this.puffs.push({ x: ax, y: ay, t: 0 }); }
            } else {
              [x, y] = cur; const b = Math.floor((S + k * 1.3) / 2.2); dir = hsh(b + k * 7) > 0.45 ? 1 : -1;
              const cp = (S * 1.6 + k * 0.37) % 1; beak = cp < 0.12 && hsh(Math.floor(S * 1.6) + k * 3) > 0.35;
              if (beak) y -= 0.0012;
            }
            if (beak && !this['bk' + k]) this.onEvent && this.onEvent('veréb'); this['bk' + k] = beak;
            this.drawBird(ctx, x, y, dir, flap, beak); continue;
          }
          const [qx, qy] = cur;
          if (prev < tout && S >= tout && bs > 0.1) this.puffs.push({ x: qx, y: qy, t: 0 });
          const f = (S - tout) / 3.5, e = f * f, ex = Rt + k * 0.05, ey = -0.85 - k * 0.04;
          const cx = (qx + ex) / 2, cyy = qy - 0.06;
          x = (1 - e) * (1 - e) * qx + 2 * (1 - e) * e * cx + e * e * ex; y = (1 - e) * (1 - e) * qy + 2 * (1 - e) * e * cyy + e * e * ey;
          dir = 1; flap = Math.sin(S * TAU * 12 + k * 2);
        }
        this.drawBird(ctx, x, y, dir, flap, beak);
      }
    }
    drawButterfly(ctx, S, t) {
      const t0 = 188, t1 = 191.5, t2 = 204, t3 = 208.5;   // 3:08 berepülnek · kergetőznek · 3:24-től szétrepülnek
      if (S < t0 || S > t3 + 0.5) return;
      const { w, u, bx } = this, Rt = (w - bx) / u + 0.08, L0 = -bx / u - 0.08;
      const cx0 = BENCH.x0 + (BENCH.x1 - BENCH.x0) * 0.6, cy0 = BENCH.seatAt(cx0) - 0.075;
      const qb = (a, c, b, e) => [(1 - e) * (1 - e) * a[0] + 2 * (1 - e) * e * c[0] + e * e * b[0], (1 - e) * (1 - e) * a[1] + 2 * (1 - e) * e * c[1] + e * e * b[1]];
      const loop = tt => [cx0 + 0.11 * Math.sin(tt * 1.05) + 0.03 * Math.sin(tt * 2.7), cy0 + 0.035 * Math.sin(tt * 1.6 + 0.6) + 0.015 * Math.sin(tt * 3.7)];
      const lead = Sx => {   // az első lepke útja; a második kicsit lemaradva követi
        if (Sx < t1) return qb([Rt, -0.3], [(Rt + cx0) / 2, -0.32], loop(0), sm(0, 1, (Sx - t0) / (t1 - t0)));
        return loop(Sx - t1);
      };
      for (let k = 0; k < 2; k++) {
        const lag = k * 0.7, Sx = S - lag; if (Sx < t0) continue;
        let x, y;
        if (S < t2) { [x, y] = lead(Sx); if (k) { x += 0.018 * Math.sin(S * 2.1); y += 0.014 * Math.cos(S * 2.6); } }
        else { const st = k ? lead(t2 - lag) : lead(t2), e = sm(0, 1, (S - t2) / (t3 - t2)), end = k ? [Rt, -0.5] : [L0, -0.55];
          [x, y] = qb(st, [(st[0] + end[0]) / 2, st[1] - 0.15], end, e); }
        y += 0.007 * Math.sin(t * 9 + k * 2);   // libbenő repülés
        const dx = x - (this.bfx?.[k] ?? x); if (!this.bfx) this.bfx = []; this.bfx[k] = x;
        const dir = Math.abs(dx) > 1e-5 ? (dx > 0 ? 1 : -1) : (this.bfd?.[k] ?? 1); if (!this.bfd) this.bfd = []; this.bfd[k] = dir;
        this.drawBf(ctx, x, y, dir, Math.abs(Math.sin(t * 15 + k * 1.3)), k);
      }
    }
    // ősz: darvak V alakban, magasan, lassan délre (balra) húznak – 0:29–0:52
    drawCranes(ctx, S, t) {
      const t0 = 29, t1 = 46; if (S < t0 || S > t1) return;   // kicsit gyorsabban húznak
      if (this.onEvent) { const pS = this.crS ?? S; for (const x of [31, 37.5, 44]) if (pS < x && S >= x) this.onEvent('darvak'); } this.crS = S;
      const { w, u, bx, gy } = this, Rt = (w - bx) / u + 0.25, L0 = -bx / u - 0.25, f = (S - t0) / (t1 - t0);
      const lx = Rt - f * (Rt - L0), ly = -gy / u * 0.72 + 0.03 * Math.sin(f * 2.2), sp = 0.034;
      ctx.save(); ctx.globalAlpha = 0.7 * sm(0, 0.06, f) * (1 - sm(0.94, 1, f));
      for (let k = 0; k < 9; k++) {
        const side = k % 2 ? 1 : -1, r = Math.ceil(k / 2);   // vezető elöl, két szár hátrafelé
        const x = lx + r * sp * 1.15 + 0.002 * Math.sin(t * 0.35 + k), y = ly + side * r * sp * 0.62 + 0.0015 * Math.sin(t * 0.45 + k * 1.3) - 0.0012 * Math.sin(t * 2.2 + k * 0.55);   // csapásonként alig emelkedik
        this.drawCrane(ctx, x, y, Math.sin(t * 2.2 + k * 0.55));
      }
      ctx.restore();
    }
    drawCrane(ctx, x, y, fl) {
      const B = 0.017; ctx.save(); ctx.translate(x, y); ctx.scale(B, B); ctx.fillStyle = 'rgb(84,82,86)'; ctx.strokeStyle = 'rgb(84,82,86)'; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.ellipse(0, 0, 0.38, 0.09, 0, 0, TAU); ctx.fill();   // test
      ctx.lineWidth = 0.07; ctx.beginPath(); ctx.moveTo(-0.3, 0); ctx.lineTo(-0.92, -0.03); ctx.stroke();   // hosszú, kinyújtott nyak (balra, menetirányban)
      ctx.beginPath(); ctx.arc(-0.95, -0.035, 0.06, 0, TAU); ctx.fill(); ctx.lineWidth = 0.035; ctx.beginPath(); ctx.moveTo(-0.98, -0.03); ctx.lineTo(-1.14, -0.01); ctx.stroke();   // fej, csőr
      ctx.lineWidth = 0.035; ctx.beginPath(); ctx.moveTo(0.3, 0.02); ctx.lineTo(0.95, 0.05); ctx.stroke();   // hátranyújtott lábak
      { const a = 0.25 + 0.95 * fl;   // szárny: nagyobb, lágy csapás; soha nem lapul el (nincs villódzás)
        ctx.beginPath(); ctx.moveTo(-0.2, 0); ctx.quadraticCurveTo(-0.08, -0.55 * a, 0.1, -0.95 * a - 0.06); ctx.lineTo(0.22, -0.9 * a - 0.02); ctx.quadraticCurveTo(0.16, -0.35 * a, 0.2, 0.02); ctx.closePath(); ctx.fill(); }
      ctx.restore();
    }
    // tavasz: rigó a fűben (2:05–2:17), fecskék (2:18–2:22), méhek a virágok körül (2:25–2:38)
    drawSpring(ctx, S, t) {
      if (S < 124 || S > 162) return;
      const { w, u, bx } = this, Rt = (w - bx) / u + 0.1, L0 = -bx / u - 0.1;
      const qb = (a, c, b, e) => [(1 - e) * (1 - e) * a[0] + 2 * (1 - e) * e * c[0] + e * e * b[0], (1 - e) * (1 - e) * a[1] + 2 * (1 - e) * e * c[1] + e * e * b[1]];
      const pS = this.spS ?? S; this.spS = S;
      if (this.onEvent) for (const x of [129.2, 135.3, 140.2]) if (pS < x && S >= x) this.onEvent('rigó');   // rigóének: a fűben, a hintán, az ágon
      if (this.splat && S < 175) { const a = 1 - sm(160, 175, S); ctx.fillStyle = `rgba(236,234,226,${0.9 * a})`; ctx.beginPath(); ctx.ellipse(this.splat[0], this.splat[1], 0.004, 0.0013, 0, 0, TAU); ctx.fill(); ctx.fillStyle = `rgba(70,60,50,${0.6 * a})`; ctx.beginPath(); ctx.arc(this.splat[0] + 0.0006, this.splat[1] - 0.0003, 0.0007, 0, TAU); ctx.fill(); }
      else if (S >= 175 || S < 130) this.splat = null;
      // rigó
      { const t0 = 125, t1 = 127.6, t2 = 133.4, tA = 134.8, tB = 137.6, tC = 139, tD = 142.6, t3 = 145, g0 = [0.0, 0.075];
        const bxs = BENCH.x1 - 0.035, seat = [bxs, BENCH.seatAt(bxs) - 0.001];   // a pad fa felőli, szabad vége
        const B0 = this.T.sw, bp = bez(B0, 0.33), bw = B0[6] + (B0[7] - B0[6]) * 0.33, sk = this.sk || 0, br = [bp[0] + sk * bp[1], bp[1] - bw / 2 + 0.001];   // az alsó (hinta-) ág teteje
        if (S >= t0 && S <= t3) {
          let x, y, dir = 1, flap = null, pose = 0;
          const hop = Math.max(0, Math.min(t2, S) - t1), n = Math.floor(hop / 1.25), ph = hop - n * 1.25;
          const gx = g0[0] + Math.min(n, 4) * 0.028 + (ph < 0.3 && n < 5 ? sm(0, 1, ph / 0.3) * 0.028 : 0) - (n >= 5 ? 0 : 0);
          if (S < t1) { const e = sm(0, 1, (S - t0) / (t1 - t0)); [x, y] = qb([L0, -0.42], [-0.6, -0.1], g0, e); flap = e < 0.85 ? Math.sin(S * TAU * 9) : -0.4; }
          else if (S < t2) {
            x = gx; y = g0[1] - (ph < 0.3 && n < 5 ? Math.sin(Math.PI * ph / 0.3) * 0.012 : 0);
            const k = n % 3; pose = ph > 0.45 && ph < 1.05 ? (k === 2 ? 2 : 1) : 0;
            if (n >= 5) { dir = Math.floor(hop * 1.3) % 2 ? -1 : 1; pose = (hop * 2.1) % 1 < 0.4 ? 1 : 2; }
          } else if (S < tA) { const st = [g0[0] + 4 * 0.028, g0[1]], e = sm(0, 1, (S - t2) / (tA - t2)); [x, y] = qb(st, [(st[0] + seat[0]) / 2, seat[1] - 0.07], seat, e); dir = seat[0] >= st[0] ? 1 : -1; flap = e < 0.88 ? Math.sin(S * TAU * 9) : -0.4; }   // felszáll a hintára
          else if (S < tB) { [x, y] = seat; dir = Math.floor((S - tA) * 0.9) % 2 ? -1 : 1; pose = (S - tA) % 1.4 < 0.5 ? 2 : 0; }
          else if (S < tC) { const e = sm(0, 1, (S - tB) / (tC - tB)); [x, y] = qb(seat, [(seat[0] + br[0]) / 2, Math.min(seat[1], br[1]) - 0.06], br, e); dir = br[0] >= seat[0] ? 1 : -1; flap = e < 0.88 ? Math.sin(S * TAU * 9) : -0.4; }   // fel az alsó ágra
          else if (S < tD) { [x, y] = br; dir = Math.floor((S - tC) * 0.8) % 2 ? 1 : -1; pose = (S - tC) % 1.6 < 0.5 ? 2 : 0; }
          else { const e = sm(0, 1, (S - tD) / (t3 - tD)); [x, y] = qb(br, [br[0] + 0.12, br[1] - 0.2], [Rt, -0.6], e); dir = 1; flap = Math.sin(S * TAU * 9); }   // jobbra el, mint a verebek
          this.drawBlackbird(ctx, x, y, dir, flap, pose);
          const pt = 142.1; if (S >= pt) {   // pottyant egyet, mielőtt elrepül
            const dt2 = S - pt, py = br[1] + 0.004 + 0.6 * dt2 * dt2, gnd = 0.012;
            if (py < gnd) { ctx.fillStyle = 'rgba(238,236,228,0.95)'; ctx.beginPath(); ctx.ellipse(br[0] - 0.003, py, 0.0016, 0.0024, 0, 0, TAU); ctx.fill(); }
            else this.splat = [br[0] - 0.003, gnd];
          }
        } }
      // dongó: egyetlen, jól látható, bundás dongó kanyarog át az előtérben, egyszer megáll a levegőben (2:27–2:39)
      { const t0 = 147, t1 = 159; if (S >= t0 && S <= t1) {
        const f = (S - t0) / (t1 - t0), Rt = (w - bx) / u + 0.06, L0 = -bx / u - 0.06;
        const P = [[Rt, -0.2], [0.25, -0.05], [0.02, -0.13], [BENCH.x1 - 0.02, BENCH.seatAt(BENCH.x1 - 0.02) - 0.035], [-0.45, -0.16], [L0, -0.3]];
        const hv = sm(0.42, 0.47, f) * (1 - sm(0.6, 0.65, f)), g2 = f < 0.45 ? f / 0.45 * 0.5 : f < 0.62 ? 0.5 : 0.5 + (f - 0.62) / 0.38 * 0.5;   // a pad fölött megáll
        const seg = g2 * (P.length - 1), i = Math.min(P.length - 2, seg | 0), e = sm(0, 1, seg - i);
        let x = P[i][0] + (P[i + 1][0] - P[i][0]) * e, y = P[i][1] + (P[i + 1][1] - P[i][1]) * e;
        x += (0.014 * Math.sin(t * 2.3) + 0.006 * Math.sin(t * 5.1)) * (1 - 0.7 * hv); y += 0.01 * Math.sin(t * 3.1) + 0.004 * Math.sin(t * 7.7) + 0.003 * hv * Math.sin(t * 11);
        const dx = x - (this.bbx ?? x); this.bbx = x; const dir = Math.abs(dx) > 1e-5 ? (dx > 0 ? 1 : -1) : (this.bbd || -1); this.bbd = dir;
        this.drawBumblebee(ctx, x, y, dir, t);
      } }
    }
    drawClouds(ctx, t) {   // puha, szürke felhők az égen, lassan sodródnak; az ég elszürkül
      const { w, h, u, gy } = this, hz = gy - 0.07 * u, c = this.cloud;
      if (!this.clc || this.clc.width !== w * 2) {
        const cv = this.clc = this.cvs(w * 2, hz + 0.05 * u), g = cv.getContext('2d'), r = rng(5);
        for (let i = 0; i < 46; i++) { const x = r() * cv.width, y = (0.05 + r() * 0.55) * hz, rr = (0.08 + r() * 0.18) * u;
          for (const ox of [-cv.width / 2, 0, cv.width / 2]) { const q = g.createRadialGradient(x + ox, y, 0, x + ox, y, rr); const k = 0.55 + r() * 0.2; q.addColorStop(0, `rgba(${120 * k + 40 | 0},${124 * k + 40 | 0},${132 * k + 44 | 0},0.5)`); q.addColorStop(1, 'rgba(130,134,142,0)'); g.fillStyle = q; g.save(); g.translate(x + ox, y); g.scale(2.2, 1); g.translate(-x - ox, -y); g.fillRect(x + ox - rr, y - rr, rr * 2, rr * 2); g.restore(); } }
      }
      { const g3 = ctx.createLinearGradient(0, 0, 0, hz + 0.08 * u); g3.addColorStop(0, `rgba(148,152,160,${0.35 * c})`); g3.addColorStop(0.75, `rgba(148,152,160,${0.3 * c})`); g3.addColorStop(1, 'rgba(148,152,160,0)'); ctx.fillStyle = g3; ctx.fillRect(0, 0, w, hz + 0.08 * u); }   // puha átmenet a látóhatárig
      const off = (t * 0.006 * u) % (w), y0 = 0;
      ctx.globalAlpha = c; ctx.drawImage(this.clc, -off, y0); ctx.drawImage(this.clc, w * 2 - off, y0); ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(60,62,70,${0.12 * c})`; ctx.fillRect(0, 0, w, h);   // a tájra is borul egy kis homály
    }
    drawBumblebee(ctx, x, y, dir, t) {
      const B = 0.0095; ctx.save(); ctx.translate(x, y); ctx.scale(dir * B, B); ctx.rotate(0.12);
      const wf = Math.abs(Math.sin(t * 70));
      ctx.fillStyle = `rgba(236,240,246,${0.35 + 0.25 * wf})`;   // elmosódott szárnyak
      ctx.beginPath(); ctx.ellipse(-0.1, -0.62, 0.42, 0.2 + 0.1 * wf, -0.5, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-0.25, -0.5, 0.3, 0.14 + 0.06 * wf, -0.2, 0, TAU); ctx.fill();
      const band = (x0, x1, c) => { ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 0.62, 0.42, 0, 0, TAU); ctx.clip(); ctx.fillStyle = c; ctx.fillRect(x0, -0.5, x1 - x0, 1); ctx.restore(); };
      band(-0.7, -0.38, 'rgb(236,228,210)'); band(-0.38, -0.1, 'rgb(34,28,24)'); band(-0.1, 0.22, 'rgb(226,176,52)'); band(0.22, 0.7, 'rgb(34,28,24)');   // fehér far, fekete–sárga csíkok
      ctx.strokeStyle = 'rgba(60,48,36,0.5)'; ctx.lineWidth = 0.05; for (let k = 0; k < 14; k++) { const a = k / 14 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 0.6, Math.sin(a) * 0.4); ctx.lineTo(Math.cos(a) * 0.7, Math.sin(a) * 0.48); ctx.stroke(); }   // bundás szél
      ctx.fillStyle = 'rgb(28,24,20)'; ctx.beginPath(); ctx.arc(0.68, -0.02, 0.26, 0, TAU); ctx.fill();   // fej
      ctx.strokeStyle = 'rgb(28,24,20)'; ctx.lineWidth = 0.05; ctx.beginPath(); ctx.moveTo(0.8, -0.2); ctx.quadraticCurveTo(0.95, -0.45, 1.05, -0.42); ctx.stroke();
      ctx.restore();
    }
    drawBlackbird(ctx, x, y, dir, flap, pose) {
      const B = 0.024, perched = flap === null;
      ctx.save(); ctx.translate(x, y); ctx.scale(dir * B, B);
      const f = (c, p) => { ctx.fillStyle = c; ctx.beginPath(); p(); ctx.fill(); };
      const BK = 'rgb(34,30,30)';
      f(BK, () => { ctx.moveTo(-0.3, -0.38); ctx.lineTo(-1.0, perched ? -0.55 : -0.42); ctx.lineTo(-0.98, perched ? -0.42 : -0.3); ctx.lineTo(-0.28, -0.24); });   // hosszú farok, kicsit felcsapva
      f(BK, () => ctx.ellipse(0, -0.34, 0.46, 0.28, perched ? -0.08 : 0, 0, TAU));
      if (!perched) f('rgb(44,40,40)', () => { ctx.moveTo(-0.15, -0.44); ctx.lineTo(-0.32, -0.44 - 0.8 * flap); ctx.lineTo(0.2, -0.44 - 0.62 * flap); ctx.lineTo(0.22, -0.4); });
      const hy = pose === 1 ? -0.22 : pose === 2 ? -0.78 : -0.6, hx = pose === 1 ? 0.5 : 0.38;
      f(BK, () => ctx.arc(hx, hy, 0.2, 0, TAU));
      f('rgb(232,160,40)', () => { ctx.arc(hx + 0.035, hy - 0.035, 0.05, 0, TAU); });   // sárga szemgyűrű
      f('rgb(20,16,16)', () => ctx.arc(hx + 0.035, hy - 0.035, 0.025, 0, TAU));
      f('rgb(236,168,40)', () => { const by = pose === 1 ? hy + 0.08 : hy; ctx.moveTo(hx + 0.15, by - 0.06); ctx.lineTo(hx + 0.42, by + (pose === 1 ? 0.12 : 0)); ctx.lineTo(hx + 0.15, by + 0.05); });   // narancssárga csőr
      if (perched) { ctx.strokeStyle = 'rgb(60,50,40)'; ctx.lineWidth = 0.05; ctx.beginPath(); ctx.moveTo(-0.02, -0.08); ctx.lineTo(-0.04, 0.02); ctx.moveTo(0.12, -0.08); ctx.lineTo(0.12, 0.02); ctx.stroke(); }
      ctx.restore();
    }
    drawSwallow(ctx, x, y, ang, fl) {
      const B = 0.022; ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(-B, B);
      ctx.fillStyle = 'rgb(38,42,64)';
      ctx.beginPath(); ctx.ellipse(0, 0, 0.42, 0.11, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-0.35, 0); ctx.lineTo(-0.95, -0.16); ctx.lineTo(-0.55, 0); ctx.lineTo(-0.95, 0.16); ctx.closePath(); ctx.fill();   // villás farok
      for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0.1, 0); ctx.quadraticCurveTo(-0.05, sg * (0.45 + 0.25 * fl), -0.5, sg * (0.75 + 0.3 * fl)); ctx.quadraticCurveTo(0.0, sg * 0.25, 0.25, 0.02 * sg); ctx.fill(); }   // sarló alakú szárnyak
      ctx.fillStyle = 'rgb(170,70,50)'; ctx.beginPath(); ctx.arc(0.36, 0.02, 0.06, 0, TAU); ctx.fill();   // rozsdás torok
      ctx.restore();
    }
    drawBf(ctx, x, y, dir, fl, k) {
      const B = 0.016;
      ctx.save(); ctx.translate(x, y); ctx.scale(dir * B, B);
      for (const sgn of [-1, 1]) {
        ctx.save(); ctx.scale(1, 0.25 + 0.75 * fl * (sgn > 0 ? 1 : 0.85));
        ctx.fillStyle = sgn > 0 ? (k ? 'rgb(246,232,130)' : 'rgb(242,224,110)') : (k ? 'rgb(230,212,100)' : 'rgb(226,204,86)');
        ctx.beginPath(); ctx.ellipse(0.18, -0.55, 0.42, 0.55, 0.5, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.ellipse(-0.15, -0.42, 0.3, 0.42, -0.4, 0, TAU); ctx.fill();
        ctx.fillStyle = 'rgb(214,130,60)'; ctx.beginPath(); ctx.arc(0.22, -0.6, 0.06, 0, TAU); ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = 'rgb(70,58,40)'; ctx.beginPath(); ctx.ellipse(0, 0, 0.45, 0.07, -0.25, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgb(70,58,40)'; ctx.lineWidth = 0.04; ctx.beginPath(); ctx.moveTo(0.42, -0.1); ctx.lineTo(0.62, -0.34); ctx.moveTo(0.42, -0.1); ctx.lineTo(0.68, -0.24); ctx.stroke();
      ctx.restore();
    }
    drawBird(ctx, x, y, dir, flap, beak) {
      const B = 0.017, perched = flap === null;
      ctx.save(); ctx.translate(x, y); ctx.scale(dir * B, B); if (!perched) ctx.rotate(-0.08);
      const f = (c, path) => { ctx.fillStyle = rgb(c); ctx.beginPath(); path(); ctx.fill(); };
      f([96, 72, 52], () => { ctx.moveTo(-0.32, -0.32); ctx.lineTo(-0.88, -0.16 + (perched ? 0.04 : -0.08)); ctx.lineTo(-0.84, -0.06 + (perched ? 0.04 : -0.08)); ctx.lineTo(-0.3, -0.2); });
      f([150, 112, 78], () => ctx.ellipse(0, -0.32, 0.43, 0.3, perched ? -0.12 : 0, 0, TAU));
      f([208, 194, 172], () => ctx.ellipse(0.08, -0.2, 0.3, 0.16, -0.1, 0, TAU));
      if (perched) { f([108, 78, 54], () => ctx.ellipse(-0.08, -0.37, 0.32, 0.16, -0.2, 0, TAU)); ctx.strokeStyle = rgb([190, 160, 120]); ctx.lineWidth = 0.04; ctx.beginPath(); ctx.moveTo(-0.3, -0.36); ctx.lineTo(0.08, -0.44); ctx.stroke(); }
      else f([108, 78, 54], () => { ctx.moveTo(-0.15, -0.42); ctx.lineTo(-0.28, -0.42 - 0.75 * flap); ctx.lineTo(0.18, -0.42 - 0.6 * flap); ctx.lineTo(0.2, -0.4); });
      f([126, 94, 66], () => ctx.arc(0.36, -0.6, 0.2, 0, TAU));
      f([118, 118, 116], () => ctx.arc(0.34, -0.7, 0.13, Math.PI, TAU));
      f([222, 212, 196], () => ctx.arc(0.42, -0.54, 0.09, 0, TAU));
      f([30, 26, 22], () => ctx.arc(0.46, -0.63, 0.035, 0, TAU));
      if (beak) { f([70, 58, 46], () => { ctx.moveTo(0.53, -0.63); ctx.lineTo(0.72, -0.68); ctx.lineTo(0.55, -0.59); }); f([70, 58, 46], () => { ctx.moveTo(0.53, -0.56); ctx.lineTo(0.7, -0.5); ctx.lineTo(0.55, -0.6); }); }
      else f([70, 58, 46], () => { ctx.moveTo(0.53, -0.64); ctx.lineTo(0.7, -0.59); ctx.lineTo(0.53, -0.53); });
      if (perched) { ctx.strokeStyle = rgb([80, 64, 50]); ctx.lineWidth = 0.05; ctx.beginPath(); ctx.moveTo(-0.02, -0.06); ctx.lineTo(0, 0.02); ctx.moveTo(0.1, -0.06); ctx.lineTo(0.12, 0.02); ctx.stroke(); }
      ctx.restore();
    }
    // viharvert deszka: tompa, szürkésbarna, egyenetlen szín, erezet, csomók, repedés
    plank(ctx, x, y, w, h, seed, o = {}) {
      const r = rng(seed), base = mix(WOOD, [128, 118, 104], 0.18 + r() * 0.12);
      ctx.fillStyle = rgb(base); ctx.fillRect(x, y, w, h);
      for (let k = 0; k < 4; k++) { const a = x + r() * w, b2 = w * (0.1 + r() * 0.3); ctx.fillStyle = rgb(mix(base, r() < 0.5 ? [150, 140, 124] : [60, 50, 40], 0.25), 0.45); ctx.fillRect(a, y, Math.min(b2, x + w - a), h); }
      ctx.strokeStyle = 'rgba(52,42,34,0.34)'; ctx.lineWidth = Math.max(0.0003, h * 0.06);
      const ng = Math.max(2, Math.round(h / 0.0022));
      for (let k = 0; k < ng; k++) { const yy = y + h * (k + 0.5 + (r() - 0.5) * 0.5) / ng, ph = r() * 9, am = h * 0.08; ctx.beginPath();
        for (let i = 0; i <= 14; i++) { const xx = x + w * i / 14; ctx.lineTo(xx, yy + am * Math.sin(ph + i * 0.9) * Math.sin(i * 0.37 + k)); }
        ctx.stroke(); }
      for (const [kx, ks] of (o.knots || [])) {
        const cx = x + w * kx, cy = y + h * 0.5, rx = h * 0.32 * ks, ry = h * 0.22 * ks;
        ctx.fillStyle = 'rgba(58,44,34,0.75)'; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = 'rgba(52,42,34,0.4)'; ctx.lineWidth = h * 0.05; ctx.beginPath(); ctx.ellipse(cx, cy, rx * 1.9, ry * 1.7, 0, 0, TAU); ctx.stroke();
        ctx.fillStyle = 'rgba(150,132,110,0.35)'; ctx.beginPath(); ctx.ellipse(cx - rx * 0.25, cy - ry * 0.3, rx * 0.35, ry * 0.3, 0, 0, TAU); ctx.fill();
      }
      if (o.crack) {
        const [c0, c1] = o.crack; ctx.strokeStyle = 'rgba(36,28,22,0.75)'; ctx.lineWidth = Math.max(0.0004, h * 0.09); ctx.beginPath();
        let cy = y + h * (0.35 + r() * 0.3); ctx.moveTo(x + w * c0, cy);
        for (let i = 1; i <= 8; i++) { cy += (r() - 0.5) * h * 0.18; ctx.lineTo(x + w * (c0 + (c1 - c0) * i / 8), cy); }
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(150,140,124,0.5)'; ctx.fillRect(x, y, w, Math.max(0.0005, h * 0.12));
      ctx.fillStyle = 'rgba(40,32,26,0.35)'; ctx.fillRect(x, y + h * 0.88, w, h * 0.12);
    }
    // gyalulatlan, göcsörtös deszka: hullámos szélek, kitört darabok, nagy csomók, mély repedés
    roughPlank(ctx, x, y, w, h, seed, o = {}) {
      const r = rng(seed), N = 40, top = [], bot = [];
      const chip = (f, side) => { let d = 0; for (const [cf, cs, cz] of (o.chips || [])) if (cs === side) { const q = (f - cf) / (0.035 * cz); if (Math.abs(q) < 1) d = Math.max(d, (1 - q * q) * h * 0.38 * cz); } return d; };
      const ph1 = r() * 9, ph2 = r() * 9;
      for (let i = 0; i <= N; i++) { const f = i / N, xx = x + w * f;
        const wv = h * (o.wave ?? 1) * (0.11 * Math.sin(ph1 + f * 7.3) + 0.06 * Math.sin(ph2 + f * 19) + 0.04 * (r() - 0.5));
        top.push([xx, y + wv + chip(f, -1)]); bot.push([xx, y + h + wv * 0.8 - chip(f, 1)]); }
      const path = () => { ctx.beginPath(); top.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); for (let i = N; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]); ctx.closePath(); };
      ctx.save(); path();
      ctx.fillStyle = 'rgba(36,28,22,0.35)'; ctx.translate(0, h * 0.14); ctx.fill(); ctx.translate(0, -h * 0.14);   // árnyék alatta
      const base = mix(WOOD, [124, 114, 100], 0.22 + r() * 0.1); ctx.fillStyle = rgb(base); ctx.fill(); ctx.clip();
      for (let k = 0; k < 6; k++) { const a = x + r() * w, b2 = w * (0.08 + r() * 0.25); ctx.fillStyle = rgb(mix(base, r() < 0.5 ? [160, 150, 132] : [56, 46, 36], 0.3), 0.5); ctx.fillRect(a, y - h, b2, h * 3); }
      ctx.lineWidth = h * 0.07;
      for (let k = 0; k < 6; k++) { const yy = y + h * (k + 0.5) / 6, ph = r() * 9; ctx.strokeStyle = `rgba(48,38,30,${0.35 + r() * 0.25})`; ctx.beginPath();
        for (let i = 0; i <= 30; i++) { const f = i / 30, xx = x + w * f; let dy = h * 0.06 * Math.sin(ph + f * 11);
          for (const [kx, ks] of (o.knots || [])) { const q = (f - kx) * w / (h * 1.2 * ks); dy += h * 0.35 * ks * Math.exp(-q * q) * Math.sign(yy - (y + h / 2) || 1); }   // az erezet kikerüli a csomót
          i ? ctx.lineTo(xx, yy + dy) : ctx.moveTo(xx, yy + dy); } ctx.stroke(); }
      for (const [kx, ks] of (o.knots || [])) {
        const cx = x + w * kx, cy = y + h * 0.5, rx = h * 0.34 * ks, ry = h * 0.26 * ks;
        ctx.fillStyle = 'rgba(46,34,26,0.9)'; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0.2, 0, TAU); ctx.fill();
        ctx.strokeStyle = 'rgba(46,34,26,0.55)'; ctx.lineWidth = h * 0.06; for (const m of [1.6, 2.3]) { ctx.beginPath(); ctx.ellipse(cx, cy, rx * m, ry * m * 0.85, 0.2, 0, TAU); ctx.stroke(); }
        ctx.fillStyle = 'rgba(160,140,116,0.45)'; ctx.beginPath(); ctx.ellipse(cx - rx * 0.3, cy - ry * 0.35, rx * 0.35, ry * 0.3, 0, 0, TAU); ctx.fill();
      }
      if (o.crack) { const [c0, c1] = o.crack; let cy = y + h * 0.5; ctx.strokeStyle = 'rgba(28,20,16,0.75)'; ctx.lineWidth = h * 0.08; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + w * c0, cy);
        for (let i = 1; i <= 10; i++) { cy += (r() - 0.5) * h * 0.22; ctx.lineTo(x + w * (c0 + (c1 - c0) * i / 10), cy); } ctx.stroke();
        ctx.strokeStyle = 'rgba(170,156,134,0.35)'; ctx.lineWidth = h * 0.05; ctx.translate(0, h * 0.1); ctx.stroke(); ctx.translate(0, -h * 0.1); }
      ctx.restore();
      ctx.lineWidth = h * 0.07; ctx.strokeStyle = 'rgba(176,164,144,0.6)'; ctx.beginPath(); top.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.stroke();   // kopott, napos felső él
      ctx.strokeStyle = 'rgba(32,24,18,0.55)'; ctx.beginPath(); bot.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.stroke();
      for (const [cf, cs, cz] of (o.chips || [])) {   // a kitört rész friss, világosabb fája
        const cx = x + w * cf, i = Math.round(cf * N), py = cs < 0 ? top[i][1] : bot[i][1];
        ctx.fillStyle = 'rgba(150,128,100,0.75)'; ctx.beginPath(); ctx.ellipse(cx, py - cs * h * 0.04, 0.035 * cz * w * 0.55, h * 0.06, 0, 0, TAU); ctx.fill();
      }
    }
    drawBench(ctx, cov = 0) {
      const P = this.pad; if (!P || !BENCH.on) return; const { k, ax, sy, x0, gy, seatAt } = BENCH;
      // a téli tónus és a hósapka külön vásznon kerül a padra (a jelenetre csak a pad alakja rajzolódik)
      const key = Math.round(this.wcol * 20) + ':' + Math.round(cov * 20);
      if (P.key !== key) { P.key = key; const q = P.cv.getContext('2d'); q.globalCompositeOperation = 'source-over'; q.globalAlpha = 1; q.clearRect(0, 0, P.cv.width, P.cv.height); q.drawImage(P.img, 0, 0);
        if (this.wcol > 0.01) { q.globalCompositeOperation = 'source-atop'; q.fillStyle = `rgba(150,168,196,${0.2 * this.wcol})`; q.fillRect(0, 0, P.cv.width, P.cv.height); q.globalCompositeOperation = 'source-over'; }
        if (cov > 0.01) { q.globalAlpha = Math.min(1, cov * 1.2); q.drawImage(P.snow, 0, 0); q.globalAlpha = 1; } }
      const { left, foot } = BENCH; ctx.save(); ctx.transform(-k, 0, 0, k, x0 + BENCH.Wpx * k, gy - foot * k); ctx.drawImage(P.cv, 0, 0); ctx.restore();
      for (const l of this.benchL) leaf(ctx, l.x, seatAt(l.x) - 0.002, l.s, 0.32, l.rot, l.c, 0.95 * (1 - cov), true);
    }
    // a hinta előre-hátra leng (a néző felé és tőle el): közelebb nagyobb és lejjebb látszik
    drawSwing(ctx, t, sa, wl = 0, cov = 0) {
      const [a1, a2] = this.T.anch, px = (a1[0] + a2[0]) / 2, py = (a1[1] + a2[1]) / 2, L = SWING.seatY - py;
      const th = (0.07 + this.gust * 0.32) * (1 - 0.85 * wl) * Math.sin(t * TAU / 2.9);
      const phi = this.gust * (this.gDir || 1) * 0.1 * (1 - 0.85 * wl) * (0.75 + 0.25 * Math.sin(t * TAU / 2.9 + 1.2));   // oldalirányú kilengés a szél irányába
      const z0 = Math.sin(th) * L, z = z0 > 0 ? z0 * 1.15 : z0, sc = 1 + z * 1.6, sx = px + Math.sin(phi) * L, sy = py + Math.cos(th) * Math.cos(phi) * L + z * 0.55;   // előre (z > 0): nagyobb és lejjebb – a fa vonala elé jön
      const hw = ((a2[0] - a1[0]) / 2 + 0.006) * sc, th2 = 0.007 * sc, top = 0.0016 + Math.max(0, -z) * 0.03;
      this.sw = { x: sx, y: sy - th2 / 2, hw };
      { const sk = this.sk || 0, bw = this.T.sw[6] * 0.55;   // vastag kötél, az ágon kétszer áthurkolva
        const ends = [[a1, sx - hw + 0.004], [a2, sx + hw - 0.004]];
        for (const [[ax0, ay0], ex] of ends) {
          const ax = ax0 + sk * ay0, ay = ay0, ey = sy - th2 / 2;
          ctx.lineCap = 'round';
          ctx.strokeStyle = 'rgb(92,76,58)'; ctx.lineWidth = 0.0036; ctx.beginPath(); ctx.moveTo(ax, ay + bw * 0.6); ctx.lineTo(ex, ey); ctx.stroke();
          ctx.strokeStyle = 'rgba(176,156,124,0.75)'; ctx.lineWidth = 0.0012; ctx.setLineDash([0.002, 0.0025]); ctx.beginPath(); ctx.moveTo(ax - 0.0007, ay + bw * 0.6); ctx.lineTo(ex - 0.0007, ey); ctx.stroke(); ctx.setLineDash([]);   // sodrás
          for (let k = -1; k <= 1; k += 2) {   // hurkok az ág körül
            const hx = ax + k * 0.0032;
            ctx.strokeStyle = 'rgb(84,68,52)'; ctx.lineWidth = 0.0032; ctx.beginPath(); ctx.ellipse(hx, ay, 0.0022, bw * 0.85, k * 0.18, 0, TAU); ctx.stroke();
            ctx.strokeStyle = 'rgba(176,156,124,0.6)'; ctx.lineWidth = 0.0011; ctx.beginPath(); ctx.ellipse(hx - 0.0006, ay, 0.0022, bw * 0.85, k * 0.18, -1.4, 1.4); ctx.stroke();
          }
          ctx.fillStyle = 'rgb(84,68,52)'; ctx.beginPath(); ctx.arc(ex, ey, 0.0026, 0, TAU); ctx.fill();   // csomó az ülésnél
        } }
      this.plank(ctx, sx - hw, sy - th2 / 2, hw * 2, th2, 59, { knots: [[0.3, 0.9]], crack: [0.72, 1] });
      { const r = rng(61); ctx.fillStyle = rgb(mix(WOOD_HI, [130, 122, 110], 0.4), 0.8); ctx.fillRect(sx - hw, sy - th2 / 2 - top, hw * 2, top);
        if (top > 0.002) { ctx.strokeStyle = 'rgba(70,58,46,0.35)'; ctx.lineWidth = 0.0004; for (let k = 1; k < 4; k++) { const yy = sy - th2 / 2 - top * k / 4; ctx.beginPath(); ctx.moveTo(sx - hw, yy); ctx.quadraticCurveTo(sx + (r() - 0.5) * hw, yy + (r() - 0.5) * top * 0.3, sx + hw, yy); ctx.stroke(); } } }
      const ss = (this.snowSeat || 0) * sc;
      if (ss > 0.0005) { ctx.fillStyle = 'rgba(248,250,252,0.97)'; ctx.beginPath(); ctx.moveTo(sx - hw, sy - th2 / 2 - top); ctx.quadraticCurveTo(sx, sy - th2 / 2 - top - ss * 1.6, sx + hw, sy - th2 / 2 - top); ctx.closePath(); ctx.fill(); }
      for (const l of this.seatL) { leaf(ctx, sx + l.o * sc, sy - th2 / 2 - top * 0.5, l.s * sc, 0.32, l.rot, l.c, 0.95 * (1 - cov), true); l.wx = sx + l.o * sc; l.wy = sy - th2; }
    }
  }
  window.Evszakok = Evszakok;
})();
