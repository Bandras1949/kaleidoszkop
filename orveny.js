(function () {
  const COL = { piros: '#e8202a', narancs: '#ff7a00', sárga: '#ffd400', zöld: '#1fa84a', kék: '#1f5fe0', lila: '#8a2be2', fehér: '#f5efe4', fekete: '#0f0f0f', arany: '#e8b923', bronz: '#c27a3a', ezüst: '#dfe3e8' };
  const PAL = ['#6b69f2', '#3ea805', '#dc0efb', '#ffb300', '#00c2c7', '#ff4d6d'];
  const TARGYAK = ['X-02', 'X-03', 'X-04', 'X-12', 'X-13', 'X-14-b', 'X-15', 'X-22', 'X-24', 'X-25', 'X-26', 'X-27', 'X-29', 'X-30', 'X-31', 'X-33', 'X-35', 'X-36', 'X-40', 'X-41', 'X-42', 'X-43', 'X-44', 'X-45', 'X-46', 'X-48', 'X-49', 'X-50', 'X-51', 'X-52', 'X-53'];
  const SZINEK = ['háttérrel azonos, késleltetve', 'háttérrel azonos, késleltetve', 'sárga', 'fehér', 'piros', 'kék', 'zöld', 'lila', 'narancs'];
  const FEM = ['ezüst', 'arany', 'bronz'], is3D = n => /3D$/.test(n) || n === 'X-18' || n === 'X-19';
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const rnd = (a, b) => a + Math.random() * (b - a);

  const SEQ0 = ['mir', 'mir', 'orv', 'szov', 'szov', 'spir', 'spir'], SEQ_GY = ['mir', 'orv', 'szov', 'spir'],   /* a HOLDAS a SPIRÁLOS formái közé került */ OV = ['orv', 'spir', 'hold'];   // SEQ_GY: gyors kör (window.__altGyors), üzemmódonként egy minta, 10 mp, ÖRVÉNYES 2 × 10 mp   // VÁLTAKOZÓ (2026-11-09): TÜKRÖS (Cs + AD) → ÖRVÉNYES ×2 → SZÖVET ×2 → HOLDAS ×2 → SPIRÁLOS ×2
  const FORMS = ['pálcika', 'H-betű', 'szív', 'fánk', 'csavart', 'szalag', 'mérőszalag', 'holdak', 'holdkarok', 'szivárvány'];   // fánk, csavart: írásjeles tóruszok (torusz.js, torusz2.js)
  const SP1 = ['#3C78E6', '#C0392B', '#1B6B3A', '#FF2BD6', '#FF7A00', '#8E2DE2'];   // halvány (sárga, neonzöld, türkiz) színek kivéve: a fehér mellett alig látszottak
  const SP2 = ['#F5F5FA', '#F5F5FA', '#8E5BD6', '#8EE07A', '#E0C25A', '#00F0FF'];
  const SZIV = ['#FF2A2A', '#FF8A00', '#FFE600', '#39FF14', '#00E5FF', '#2F6BFF', '#9B30FF', '#FF2BD6'];   // szivárványkorong (HOLDAS-lap alatt)
  // SZIVÁRVÁNY-JELENETEK: egy jelenet = egy rendezett mintázat + egy 2–4 színű harmónia a 8 színből (SZIV: színkör-sorrend).
  // 8–10 mp-enként új jelenet jön, 1,5 mp-es áttűnéssel.
  // KÖZÉPSŐ LOGÓ: minden üzemmódban a kép közepén áll a BRILLIDEA-logó belseje (fekete agy, arany perem) – a képpel nem forog,
  // nem lüktet. Nem látszik: a térbeli spirálformáknál és a holdaknál, a nyitóképen, hirdetés, feliratos kép és nyitott ⚙ panel alatt.
  const LOGO_NELKUL = ['fánk', 'csavart', 'szalag', 'mérőszalag', 'holdak', 'holdkarok'];
  function kozepLogo(orv) {
    const cv = orv.cv, stage = cv.parentElement; if (!stage) return;
    const d = document.createElement('div'); d.className = 'k-kozep'; d._n = 0;
    d.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:50%;box-sizing:border-box;pointer-events:none;opacity:0;transition:opacity .6s ease,background-color 1.2s ease,border-color 1.2s ease;background:#D8D8D8 url(brand/kozep-logo.png?v=4) center/100% 100% no-repeat;border:1.5px solid #D8D8D8';
    const lathato = el => { for (let n = el; n && n !== document.body; n = n.parentElement) { const s = getComputedStyle(n); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.05) return false; } return true; };
    setInterval(() => {
      if (!d.isConnected) stage.appendChild(d);
      const M = Math.min(stage.clientWidth, stage.clientHeight), m = Math.round(M * 0.064) + 'px'; if (d.style.width !== m) { d.style.width = m; d.style.height = m; }
      const nyito = document.querySelector('img[src*="logo-nyitokep"]'), tb = stage.querySelector('div[style*="translateY("]');
      const takar = (nyito && lathato(nyito)) || !!document.querySelector('.fpad') || !!document.querySelector('div[style*="max-height:74%"],div[style*="max-height: 74%"]') || (tb && tb.parentElement && +getComputedStyle(tb.parentElement).opacity > 0.05);
      const spirOn = +getComputedStyle(cv).opacity > 0.5 && (orv.kind === 'spir' || orv.kind === 'hold');
      const tilt = spirOn && (orv.kind === 'hold' || LOGO_NELKUL.includes(orv.spir.curForm));
      const o = takar || tilt ? '0' : '1'; if (d.style.opacity !== o) d.style.opacity = o;
      // a korong színe a kép körülötte uralkodó színét veszi fel (így nem „bogár” a közepén); ha nem mérhető, halványszürke
      if (o === '1' && ++d._n % 3 === 0) {
        let szin = '#D8D8D8';
        try {
          // a legfelső olyan vászonról mérünk, amely tényleg rajzol (az üres, átlátszó vásznak feketét adnának)
          const vas = [...stage.querySelectorAll('canvas')].filter(c => c.width && c.height && c.offsetParent !== null && +getComputedStyle(c).opacity > 0.5).reverse();
          for (const c of vas) { try {
            const W = c.width, H = c.height, r = Math.min(W, H) * 0.06, x = c.getContext('2d'), db = {}; let fedett = 0; if (!x) continue;
            for (let i = 0; i < 48; i++) { const a = i / 48 * 2 * Math.PI, rr = r * (1.25 + (i % 3) * 0.35), p = x.getImageData(Math.round(W / 2 + rr * Math.cos(a)), Math.round(H / 2 + rr * Math.sin(a)), 1, 1).data;
              if (p[3] < 200) continue; fedett++; const k = (p[0] >> 5) + '-' + (p[1] >> 5) + '-' + (p[2] >> 5); (db[k] = db[k] || []).push(p); }
            if (fedett < 24) continue;
            const vil = p => 0.3 * p[0] + 0.59 * p[1] + 0.11 * p[2], cs = Object.values(db), fenyes = cs.filter(g => vil(g[0]) > 70);   // a sötét (fekete) részeket kerüljük, ha van világos szín
            const leg = (fenyes.length ? fenyes : cs).sort((a, b) => b.length - a.length)[0];
            const m = [0, 1, 2].map(j => Math.round(leg.reduce((s, p) => s + p[j], 0) / leg.length)); szin = `rgb(${m.join(',')})`; break;
          } catch (e) {} }
        } catch (e) {}
        if (d._sz !== szin) { d._sz = szin; d.style.backgroundColor = szin; d.style.borderColor = szin; }
      }
    }, 250);
  }
  const SZ_MINTAK = ['gyűrűk', 'váltott', 'csillag', 'lépcső', 'hullám'];
  const hsl2hex = (h, s, l) => { s /= 100; l /= 100; const f = n => { const k = (n + h / 30) % 12, c = l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(255 * c).toString(16).padStart(2, '0'); }; return '#' + f(0) + f(8) + f(4); };
  function szivHarmonia() {
    const k = Math.floor(Math.random() * 8), m = i => SZIV[((i % 8) + 8) % 8], h = Math.random() * 360;
    const fajta = pick(['szomszédos', 'kiegészítő', 'hármas', 'négyes', 'árnyalatok', 'árnyalatok', 'pasztell']);
    if (fajta === 'szomszédos') return [m(k), m(k + 1), m(k + 2)];
    if (fajta === 'kiegészítő') return [m(k), '#F5F5F0', m(k + 4)];
    if (fajta === 'hármas') return [m(k), m(k + 2), m(k + 5)];
    if (fajta === 'árnyalatok') return [hsl2hex(h, 70, 80), hsl2hex(h, 85, 38), hsl2hex(h, 80, 60), hsl2hex(h, 75, 24)];   // egy szín árnyalatai: világos – sötét – közép – legsötétebb (a szomszédok így jól elválnak)
    if (fajta === 'pasztell') { const d = pick([30, 120, 180]); return [hsl2hex(h, 65, 80), hsl2hex(h + d, 60, 74), hsl2hex(h + 2 * d, 55, 84)]; }
    return [m(k), m(k + 2), m(k + 4), m(k + 6)];
  }
  // gyűrűszélesség-sor: a gyűrűk szélessége ezt a sort ismétli (minden cikkelyben ugyanígy, így a minta megmarad)
  const SZ_SZEL = [[1], [1], [0.55, 1.45], [0.6, 0.6, 1.8], [1.5, 0.75, 0.75], [0.4, 1.6]];
  function szivJelenet(elozo) { return { minta: pick(SZ_MINTAK.filter(s => !elozo || s !== elozo.minta)), H: szivHarmonia(), w: pick(SZ_SZEL), ir: Math.random() < 0.5 ? -1 : 1, hossz: 8 + Math.random() * 2 }; }
  const szKever = (a, b, k) => { const A = hex(a), B = hex(b); return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',') + ')'; };
  function szivRajzol(x, J, cx, cy, Rx, t) {
    const H = J.H, m = H.length, mod = (a, b) => ((a % b) + b) % b, cella = (r0, r1, a0, a1, c) => { x.beginPath(); x.arc(cx, cy, r1, a0, a1); x.arc(cx, cy, Math.max(0, r0), a1, a0, true); x.closePath(); x.fillStyle = c; x.fill(); };
    const rot = t * 0.25 * J.ir, w = J.w || [1], L = w.length;
    const Fc = q => { const p = Math.floor(q / L), r = mod(q, L); let s = p * L; for (let i = 0; i < r; i++) s += w[i]; return s; };   // a q-adik gyűrű belső széle (átlagos gyűrűszélesség = 1)
    if (J.minta === 'hullám') {
      // keskeny, egyforma gyűrűk vándorolnak; a színek sávonként tiszták, csak a szélükön mennek át a következőbe
      const NR = 18, dr = Rx / NR, ph = t * 0.2 * J.ir, fr = mod(ph, 1), fl = Math.floor(ph);
      for (let k = NR; k >= -1; k--) {
        const r0 = (k + fr) * dr, r1 = r0 + dr + 0.5; if (r1 <= 0) continue;
        const u = (k - fl) / 3, a = Math.floor(u), q = Math.max(0, Math.min(1, (u - a - 0.65) / 0.35)), c = szKever(H[mod(a, m)], H[mod(a + 1, m)], q * q * (3 - 2 * q));
        x.beginPath(); x.arc(cx, cy, r1, 0, 2 * Math.PI); if (r0 > 0) x.arc(cx, cy, r0, 2 * Math.PI, 0, true); x.fillStyle = c; x.fill('evenodd');
      }
      return;
    }
    if (J.minta === 'gyűrűk') {
      // egyszínű gyűrűk (a szélesség-sor szerint), amelyek egyben vándorolnak kifelé vagy befelé
      const dr = Rx / 8, ph = t * 0.1 * J.ir;
      for (let q = Math.floor(-ph) - 2 * L - 1; ; q++) {
        const r0 = (Fc(q) + ph) * dr, r1 = (Fc(q + 1) + ph) * dr + 0.5; if (r0 > Rx) break; if (r1 <= 0) continue;
        x.beginPath(); x.arc(cx, cy, r1, 0, 2 * Math.PI); if (r0 > 0) x.arc(cx, cy, r0, 2 * Math.PI, 0, true); x.fillStyle = H[mod(q, m)]; x.fill('evenodd');
      }
      const NS = 12, sp = 2 * Math.PI / NS; for (let i = 0; i < NS; i++) cella(0, dr * 0.9, rot + sp * i, rot + sp * (i + 1.01), H[i % m]);   // a csúcsnál minden szín ott van
      return;
    }
    const NS = 12, sp = 2 * Math.PI / NS, dr = Rx / 8;
    for (let j = 0; ; j++) {
      const r0 = Fc(j) * dr, r1 = Fc(j + 1) * dr + 0.5; if (r0 > Rx) break;
      // váltott: a gyűrűk felváltva ellentétes irányba forognak (számzár); csillag, lépcső: az egész korong együtt forog
      const rj = J.minta === 'váltott' ? rot * (j % 2 ? -1 : 1) * (0.75 + 0.07 * j) : rot * 0.7;
      for (let i = 0; i < NS; i++) {
        const c = J.minta === 'váltott' ? H[mod((i + j) % 2 + 2 * Math.floor(j / 2), m)] : J.minta === 'csillag' ? H[i % m] : H[mod(i + j, m)];
        cella(r0, r1, rj + sp * i, rj + sp * (i + 1.01), c);
      }
    }
  }
  const HCYC = ['#00F0FF', '#F5E62A', '#FF2BD6', '#39FF14', '#FF7A00', '#F5F5F0'];
  const hex = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
  const mix = (A, B, u) => A.map((v, q) => v + (B[q] - v) * u);
  const ez = (o, k, v, dt) => { o[k] = o[k] == null ? v : o[k] + (v - o[k]) * (1 - Math.pow(0.97, dt * 60)); return o[k]; };
  function cycle(st, L, dt, per, fade, i0) {
    st.cT = (st.cT || 0) + dt; const n = Math.floor(st.cT / per), into = st.cT - n * per;
    let u = into > per - fade ? (into - (per - fade)) / fade : 0; u = u * u * (3 - 2 * u);
    return mix(hex(L[(i0 + n) % L.length]), hex(L[(i0 + n + 1) % L.length]), u);
  }
  const SCYC = ['#3C78E6', '#C0392B', '#1B6B3A', '#8E2DE2'];   // sárga helyett lila (a sárga karok alig látszottak)
  const num = (v, d) => { const n = +v; return v == null || v === '' || isNaN(n) ? d : n; };
  const sigOf = (P, ks) => ks.map(k => P[k]).join('|');
  class Spir {
    constructor() { this.t = 0; this.e = {}; this.rnd = null; this.form0 = pick(FORMS); }
    shuffle(P) {
      const base = Math.abs(num(P['spirálSebesség'], 9)) || 9;
      this.rnd = { karok: Math.floor(rnd(2, 9)), csav: rnd(-0.8, 0.8), sp: (Math.random() < 0.5 ? -1 : 1) * Math.min(9, base * rnd(0.7, 1.3)), c1: pick(SP1), forma: pick(FORMS) };
      this.fT = 0; this.trU = 0; this.nextForm = pick(FORMS.filter(f => f !== this.form));
    }
    draw(x, W, H, dt, F, P) {
      const sg = sigOf(P, ['spirálSebesség', 'spirálKarok', 'spirálCsavarás', 'spirálSzín1']); if (sg !== this.sg) { this.sg = sg; this.rnd = null; }
      const r = this.rnd || {}, sp = ez(this.e, 'sp', r.sp ?? num(P['spirálSebesség'], 9), dt);
      this.t += sp * dt; const t = this.t, ARMS = r.karok ?? num(P['spirálKarok'], 5), TW = ez(this.e, 'tw', r.csav ?? num(P['spirálCsavarás'], 0.35), dt);
      const SHARP = num(P['spirálÉlesség'], 3), TURN = num(P['spirálFordulás'], 1), LAZY = num(P['spirálLomhaság'], 0), CON = num(P['spirálKontraszt'], 1);
      const fk = LAZY > 0 ? 1 - Math.exp(-dt / LAZY) : 1;
      const pf = P['spirálForma'] ?? 'véletlen'; let FORM = pf, sc = 1;
      if (pf === 'véletlen') {
        if (!this.form) this.form = this.form0;
        this.fT = (this.fT || 0) + dt;
        if (this.fT > (['fánk', 'csavart', 'szalag', 'mérőszalag', 'holdak', 'holdkarok', 'szivárvány'].includes(this.form) ? 18 : (F ? 10 : 15)) && this.trU == null)   /* a térbeli formák tovább maradnak: 3 színük is látszódjon */ { this.fT = 0; this.trU = 0; this.nextForm = pick(FORMS.filter(f => f !== this.form)); }
        if (this.trU != null) { this.trU += dt / 1.2; if (this.trU >= 0.5 && this.nextForm) { this.form = this.nextForm; this.nextForm = null; } if (this.trU >= 1) this.trU = null; else sc = Math.abs(1 - 2 * this.trU); }
        FORM = this.form;
      }
      this.curForm = FORM;
      const base = P['spirálSzínváltás'] !== false ? cycle(this, SCYC, dt, Math.max(2, num(P['spirálSzínváltásMp'], 4)), num(P['spirálÁttűnésMp'], 1.2), 0) : hex(r.c1 ?? P['spirálSzín1'] ?? '#3C78E6');
      const wh = hex(P['spirálSzín2'] ?? '#F5F5FA');
      const M = Math.min(W, H), S = M / 600, cx = W / 2, cy = H / 2, RR = Math.hypot(cx, cy) / S;
      const GAP = 285 / num(P['spirálGyűrűk'], 17), RINGS = Math.ceil(RR / GAP) + 1, DGAP = num(P['spirálTáv'], 24), d = num(P['spirálHossz'], 16) / 2 * S * sc, DW = Math.max(0.01, num(P['spirálVastagság'], 4) * S * sc);
      const mk = W + 'x' + H + '/' + GAP + '/' + DGAP; if (this.mk !== mk) { this.mk = mk; this.mem = null; }
      x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
      // ÍRÁSJELES TÓRUSZOK: a FÁNK és a CSAVART saját rajzolóval készül (torusz.js / torusz2.js); ha nincs betöltve, pálcika lesz helyette
      // HOLDAK, HOLDKAROK: a korábbi HOLDAS üzemmód, rögzített beállításokkal (csak a sebesség és a világos szín állítható)
      if (FORM === 'holdak' || FORM === 'holdkarok' || FORM === 'szivárvány') {
        if (FORM === 'szivárvány') window.__nincsDobbanas = true;
        this.hd = this.hd || new Hold();
        const HP = Object.assign({ 'holdKarok': 7, 'holdCsavarás': 1.2, 'holdKarSzélesség': 0.5, 'holdSpirálkarok': 2, 'holdKorong': 0.35, 'holdHullámok': 1, 'holdSebesség': 4, 'holdLélegzés': 0.35, 'holdLyukakSzáma': 3000, 'holdLyukTáv': 24, 'holdLyukMéret': 32, 'holdLapSzín': '#2A3F78', 'holdVilágos': '#00F0FF', 'holdSötét': '#0A0A0A' }, P, { 'holdVáltozat': FORM === 'holdak' ? 'holdak' : FORM === 'szivárvány' ? 'szivarvany' : 'karok', 'holdSzínváltás': true, 'holdSzínváltásMp': 4, 'holdÁttűnésMp': 1.2 }, FORM === 'szivárvány' ? { 'holdLapSzín': '#0E0E12', 'holdLyukTáv': 14, 'holdLyukMéret': 24, 'holdLyukakSzáma': 6000 } : {}   /* szivárvány: sűrűbb, kisebb, egymáshoz közelebbi lyukak – kevesebb fekete, finomabb kép */);
        this.hd.draw(x, W, H, dt, F, HP);
        if (sc < 1) { x.globalAlpha = 1 - sc; x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; }
        return;
      }
      if (FORM === 'fánk' || FORM === 'csavart' || FORM === 'szalag' || FORM === 'mérőszalag') {
        const Cls = FORM === 'fánk' ? window.Torusz : FORM === 'csavart' ? window.Torusz2 : FORM === 'szalag' ? window.Szalag : window.Meroszalag;
        if (Cls) {
          this.tz = this.tz || {};
          const T = this.tz[FORM] || (this.tz[FORM] = new Cls({ width: W, height: H, getBoundingClientRect: () => ({ width: W, height: H }), getContext: () => x }));
          T.cv.width = W; T.cv.height = H; T.cv.getContext = () => x;
          x.save(); T.rajzol(); x.restore();
          if (sc < 1) { x.globalAlpha = 1 - sc; x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; }   // formaváltáskor elsötétül, majd kivilágosodik
          return;
        }
        FORM = 'pálcika';
      }
      this.curForm = FORM;
      const NB = 48, paths = Array.from({ length: NB }, () => new Path2D()), stroke = FORM === 'pálcika' || FORM === 'H-betű' || FORM === '8-as';
      const mem = [], old = this.mem; let idx = 0;
      for (let i = 1; i <= RINGS; i++) {
        const rr = i * GAP + 5, n = Math.max(3, Math.floor(2 * Math.PI * rr / DGAP));
        for (let j = 0; j < n; j++) {
          const th = 2 * Math.PI * j / n, s = 0.5 + 0.5 * Math.tanh(SHARP * Math.cos(ARMS * th - i * TW - t));
          let v = s; const m0 = old ? old[idx] : undefined; if (m0 != null) v = m0 + (s - m0) * fk; mem[idx++] = v;
          const X = cx + S * rr * Math.cos(th), Y = cy + S * rr * Math.sin(th);
          if (X < -20 || Y < -20 || X > W + 20 || Y > H + 20) continue;
          const rel = Math.PI / 2 * v * TURN, a = th + Math.PI / 2 + rel, k = Math.sin(Math.PI / 2 * v) * CON;
          const p = paths[Math.min(NB - 1, Math.max(0, Math.round(k * (NB - 1))))], ca = Math.cos(a), sa = Math.sin(a);
          const L = (u, w) => [X + u * ca - w * sa, Y + u * sa + w * ca];
          if (FORM === 'korong') { p.moveTo(X + d * 0.6, Y); p.arc(X, Y, d * 0.6, 0, 2 * Math.PI); }
          else if (FORM === 'H-betű') { const e = d * 0.6; for (const [a1, b1, a2, b2] of [[-e, -e, e, -e], [-e, e, e, e], [0, -e, 0, e]]) { p.moveTo(...L(a1, b1)); p.lineTo(...L(a2, b2)); } }
          else if (FORM === 'pálcika') { p.moveTo(...L(-d, 0)); p.lineTo(...L(d, 0)); }
          else if (FORM === '8-as') { const rr = d * 0.42; for (const cy0 of [-rr, rr]) { const [a1, b1] = L(cy0 + rr, 0); p.moveTo(a1, b1); for (let q = 1; q <= 16; q++) { const u = q / 16 * 2 * Math.PI; p.lineTo(...L(cy0 + rr * Math.cos(u), rr * Math.sin(u))); } } }
          else if (FORM === 'lóhere') { const s = d * 0.032; for (const th of [-Math.PI / 2, Math.PI / 6, 5 * Math.PI / 6]) { const c = Math.cos(th), sn = Math.sin(th); for (let q = 0; q <= 20; q++) { const u = q / 20 * 2 * Math.PI, a = 13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u) + 17, b = 16 * Math.pow(Math.sin(u), 3); p[q ? 'lineTo' : 'moveTo'](...L((a * c - b * sn) * s, (a * sn + b * c) * s)); } p.closePath(); } const w = d * 0.07; p.moveTo(...L(-w, 0)); p.lineTo(...L(w, 0)); p.lineTo(...L(w * 0.6, d * 0.9)); p.lineTo(...L(-w * 0.2, d * 0.95)); p.closePath(); }
          else if (FORM === 'szív') { const s = d * 0.06; for (let q = 0; q <= 24; q++) { const u = q / 24 * 2 * Math.PI, hx = 16 * Math.pow(Math.sin(u), 3), hy = 13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u); p[q ? 'lineTo' : 'moveTo'](...L(-(hy + 2.5) * s, hx * s)); } p.closePath(); }
          else {
            const pts = FORM === 'négyzet' ? [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, w]) => [u * d * 0.55, w * d * 0.55])
              : FORM === 'háromszög' ? [0, 1, 2].map(q => [d * 0.75 * Math.cos(q * 2.0944), d * 0.75 * Math.sin(q * 2.0944)])
              : Array.from({ length: 10 }, (_, q) => { const r2 = q % 2 ? d * 0.32 : d * 0.8; return [r2 * Math.cos(q * Math.PI / 5), r2 * Math.sin(q * Math.PI / 5)]; });
            pts.forEach(([u, w], q) => p[q ? 'lineTo' : 'moveTo'](...L(u, w))); p.closePath();
          }
        }
      }
      this.mem = LAZY > 0 ? mem : null;
      x.lineCap = 'round'; x.lineJoin = 'round'; x.lineWidth = FORM === 'H-betű' || FORM === '8-as' ? DW * 0.6 : DW;
      paths.forEach((p, q) => { const c = 'rgb(' + mix(base, wh, q / (NB - 1)).map(Math.round) + ')'; if (stroke) { x.strokeStyle = c; x.stroke(p); } else { x.fillStyle = c; x.fill(p); } });
    }
  }
  class Hold {
    constructor() { this.t = 0; this.e = {}; this.rnd = null; this.flip = false; this.v0 = Math.random() < 0.5 ? 'HOLDAK' : 'KAROK'; }
    shuffle(P) {
      const base = Math.abs(num(P['holdSebesség'], 4)) || 4;
      this.rnd = { karok: Math.floor(rnd(1, 7)), csav: rnd(-3, 3), wv: rnd(0.5, 3), spn: Math.floor(rnd(-4, 5)), sp: (Math.random() < 0.5 ? -1 : 1) * Math.min(6, base * rnd(0.7, 1.3)) };
      if (String(P['holdVáltozat'] ?? 'holdak').toLowerCase() === 'vegyes' && Math.random() < 0.3) this.flip = !this.flip;
    }
    build(W, H, P) {
      const SPu = num(P['holdLyukTáv'], 24) * 0.75, HSu = num(P['holdLyukMéret'], 32) * 0.75, N = num(P['holdLyukakSzáma'], 3000), PC = P['holdLapSzín'] ?? '#6E6E6A';
      const key = [W, H, SPu, HSu, N, PC].join('/'); if (this.key === key) return; this.key = key;
      const M = Math.min(W, H), S = M / 600, cx = W / 2, cy = H / 2, RR = Math.hypot(cx, cy), SP = SPu * S, hr = HSu / 2 * S, gold = Math.PI * (3 - Math.sqrt(5));
      this.holes = []; for (let n = 1; n <= N && SP * Math.sqrt(n) < RR + 2 * hr; n++) { const r = SP * Math.sqrt(n), a = n * gold; this.holes.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), r }); }
      this.R = Math.min(RR, SP * Math.sqrt(this.holes.length) + 2 * hr); this.hr = hr; this.SP = SP; this.S = S; this.M = M;
      const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
      const pl = mk(), p = pl.getContext('2d'); p.fillStyle = PC; p.fillRect(0, 0, W, H); p.globalCompositeOperation = 'destination-out';
      const all = new Path2D(); for (const h of this.holes) { all.moveTo(h.x + hr, h.y); all.arc(h.x, h.y, hr, 0, 2 * Math.PI); } p.fill(all);
      const s0c = mk(), s0 = s0c.getContext('2d'); s0.fillStyle = 'rgba(0,0,0,.55)'; s0.fill(all); s0.globalCompositeOperation = 'destination-out'; s0.translate(3 * S, 4 * S); s0.fill(all);
      const sh = mk(), s = sh.getContext('2d'); s.filter = 'blur(' + (1.5 * S) + 'px)'; s.drawImage(s0c, 0, 0);
      this.plate = pl; this.shade = sh;
    }
    draw(x, W, H, dt, F, P) {
      this.build(W, H, P);
      const sg = sigOf(P, ['holdSebesség', 'holdKarok', 'holdCsavarás', 'holdHullámok', 'holdSpirálkarok', 'holdVáltozat']); if (sg !== this.sg) { this.sg = sg; this.rnd = null; this.flip = false; }
      const r = this.rnd || {}, e = this.e, pv = String(P['holdVáltozat'] ?? 'holdak').toUpperCase(), b0 = pv === 'VEGYES' || pv === 'VÉLETLEN' ? this.v0 : pv;
      const V = this.flip ? (b0 === 'HOLDAK' ? 'KAROK' : 'HOLDAK') : b0;
      const sp = ez(e, 'sp', r.sp ?? num(P['holdSebesség'], 4), dt), tw = ez(e, 'tw', r.csav ?? num(P['holdCsavarás'], 1.2), dt);
      const wv = ez(e, 'wv', r.wv ?? num(P['holdHullámok'], 1), dt), spn = ez(e, 'spn', r.spn ?? num(P['holdSpirálkarok'], 0), dt), arms = Math.max(1, Math.round(r.karok ?? num(P['holdKarok'], 3)));
      this.t += sp * dt; const t = this.t, cx = W / 2, cy = H / 2, R = this.R, hr = this.hr;
      // SZIVÁRVÁNY: a lyukacsos lap alatt színes korong forog; rendezett mintázatok és színharmóniák váltják egymást (sebesség: holdSebesség)
      if (V === 'SZIVARVANY') {
        const Rx = Math.hypot(cx, cy) * 1.02;
        if (!this.szJ) { this.szJ = szivJelenet(); this.szT = 0; }
        this.szT += dt;
        if (!this.szUj && this.szT > this.szJ.hossz) { this.szUj = szivJelenet(this.szJ); this.szA = 0; }
        szivRajzol(x, this.szJ, cx, cy, Rx, t);
        if (this.szUj) {
          this.szA += dt / 1.5; x.globalAlpha = Math.min(1, this.szA); szivRajzol(x, this.szUj, cx, cy, Rx, t); x.globalAlpha = 1;
          if (this.szA >= 1) { this.szJ = this.szUj; this.szUj = null; this.szT = 0; }
        }
        x.drawImage(this.shade, 0, 0); x.drawImage(this.plate, 0, 0);   // középen a közös logó-agy áll (kozepLogo)
        return;
      }
      const vil = String(P['holdVilágos'] ?? '#00F0FF').toUpperCase();
      const L = P['holdSzínváltás'] !== false ? cycle(this, HCYC, dt, Math.max(2, num(P['holdSzínváltásMp'], 8)), num(P['holdÁttűnésMp'], 2), Math.max(0, HCYC.indexOf(vil))) : hex(vil);
      x.fillStyle = 'rgb(' + L.map(Math.round) + ')'; x.fillRect(0, 0, W, H);
      x.fillStyle = P['holdSötét'] ?? '#0A0A0A';
      if (V === 'KAROK') {
        const Rm = this.M / 2, w = Math.min(0.95, Math.max(0.05, num(P['holdKarSzélesség'], 0.5) + num(P['holdLélegzés'], 0.35) * Math.sin(t * 0.7))), span = 2 * Math.PI / arms * w, ST = 60, Rx = Math.hypot(cx, cy) * 1.05;
        for (let i = 0; i < arms; i++) {
          const a0 = 2 * Math.PI * i / arms + t * 0.5; x.beginPath();
          for (let s = 0; s <= ST; s++) { const rr = Rx * s / ST, a = a0 + tw * rr / Rm; x.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); }
          for (let s = ST; s >= 0; s--) { const rr = Rx * s / ST, a = a0 + span + tw * rr / Rm; x.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); }
          x.closePath(); x.fill();
        }
        x.beginPath(); x.arc(cx, cy, Rm * num(P['holdKorong'], 0.35) * 1.15 * (0.5 + 0.5 * Math.sin(t * 0.45)), 0, 2 * Math.PI); x.fill();
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
  // MOZGÓ TÁRGYAK: több kis örvénykorong, amelyek a tárgyon belül is forognak – a szomszédok ellentétes irányba (mint a fogaskerekek),
  // a középső korong (ha van) a képernyőhöz képest áll. Képfájl nem kell, a korongot a program rajzolja.
  const DYN = { 'X-49': { n: 4, cr: 0.42, dr: 0.53, mid: 0 }, 'X-50': { n: 6, cr: 0.565, dr: 0.405, mid: 0.40 }, 'X-51': { n: 6, cr: 0.6, dr: 0.38, mid: 0.36, img: 'X-02' }, 'X-52': { n: 6, cr: 0.64, dr: 0.335, mid: 0.33, img: 'X-30', nobg: true }, 'X-53': { n: 6, cr: 0.6, dr: 0.38, mid: 0.36, img: 'X-42' } };   // img: egy meglévő tárgy képéből (pl. X-02) készül a sokkorongos rendszer
  let KORONG = null;
  const korong = () => {   // egy csíkos örvénykorong vektoros rajzzal (élsimított, nem szemcsés), sötét peremmel
    if (KORONG) return KORONG; const N = 640, h = N / 2, c = document.createElement('canvas'); c.width = c.height = N;
    const x = c.getContext('2d'), R = h * 0.995, ARMS = 10, TW = 1.1 * 2 * Math.PI;
    x.beginPath(); x.arc(h, h, R, 0, Math.PI * 2); x.fillStyle = '#0f0f0f'; x.fill();   // sötét alap
    const g = x.createRadialGradient(h, h, 0, h, h, R); g.addColorStop(0, '#ffffff'); g.addColorStop(0.6, '#e0e0e0'); g.addColorStop(1, '#999999');
    const pt = (k, r) => { const t = (k * Math.PI - TW * r) / ARMS; return [h + Math.cos(t) * r * R, h + Math.sin(t) * r * R]; };
    x.fillStyle = g;
    for (let k = 0; k < 2 * ARMS; k += 2) {   // minden második sáv világos: két spirálív és a külső körív közti terület
      x.beginPath(); x.moveTo(h, h);
      for (let i = 1; i <= 60; i++) x.lineTo(...pt(k, i / 60));
      const t0 = (k * Math.PI - TW) / ARMS, t1 = ((k + 1) * Math.PI - TW) / ARMS; x.arc(h, h, R, t0, t1);
      for (let i = 60; i >= 1; i--) x.lineTo(...pt(k + 1, i / 60));
      x.closePath(); x.fill();
    }
    x.beginPath(); x.arc(h, h, R * 0.983, 0, Math.PI * 2); x.lineWidth = R * 0.034; x.strokeStyle = '#0f0f0f'; x.stroke();   // perem
    return KORONG = c;
  };
  class Orveny {
    constructor(canvas, host) {
      this.cv = canvas; this.host = host; window.__orv = this;
      this.grays = {}; this.t = 0; this.last = performance.now(); this.op = 0;
      TARGYAK.forEach(n => { if (DYN[n]) { this.grays[n] = document.createElement('canvas'); this.grays[n].width = this.grays[n].height = 1024; this.dyn(n, 0, 0); return; } const im = new Image(); im.onload = () => { this.grays[n] = this.prep(im); }; im.src = 'mintak/' + n + '.png?v=40'; });
      this.th = 0; this.th2 = 0; this.lt = 0;
      this.bg = this.newWave(0); this.ob = this.newWave(3); this.ob.el = 2;
      this.pairLeft = 0; this.bgToggle = false; this.ai = null; this.kind = null; this.spir = new Spir(); this.hold = new Hold();
      const tick = now => { try { this.frame(now); } catch (e) { console.error(e); } this.raf = requestAnimationFrame(tick); };
      this.raf = requestAnimationFrame(tick);
      kozepLogo(this);
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
      this.pairOne = Math.random() < 0.5;   // „véletlen” tárgyszám: páronként sorsolt, egy vagy két tárgy
      const ready = TARGYAK.filter(n => this.grays[n]), POOL = ready.length ? ready : TARGYAK;
      const n1 = t1 === 'véletlen' ? pick(POOL) : t1;
      const n2 = t2 === 'véletlen' ? (Math.random() < 0.5 ? n1 : pick(POOL)) : t2;
      const z1 = P['tárgy1Szín'] ?? 'véletlen', z2 = P['tárgy2Szín'] ?? 'másikkal azonos', hb = P['örvényHáttér'] ?? 'váltakozó';
      this.bgToggle = !this.bgToggle;
      // MOZGÓ (sokkorongos) TÁRGY a párban: alapból fekete háttér és véletlen, egymástól független tárgyszínek – így a legszebbek.
      // A háttér ilyenkor mindig fekete; a színeknél a kézi választást (fix szín) nem írjuk felül.
      const dynIn = !!(DYN[n1] || DYN[n2]);
      const zAuto = z => z === 'véletlen' || z === 'másikkal azonos';
      const dynSzin = dynIn && zAuto(z1) && zAuto(z2), dynHatter = dynIn;   // sokkorongos tárgy mögött mindig fekete a háttér
      this.cfg = {
        n1, n2, ...(() => { const one = (z, n) => z === 'véletlen' || z === 'másikkal azonos' ? (is3D(n) && Math.random() < 0.75 ? pick(FEM) : pick(SZINEK)) : z; let a = one(z1, n1), b = one(z2, n2); if (!dynSzin) { if (z2 === 'másikkal azonos') b = a; else if (z1 === 'másikkal azonos') a = b; } return { szin1: a, szin2: b }; })(),
        wave: !dynHatter && (hb === 'színhullám' || (hb === 'váltakozó' && this.bgToggle)),
        s1: P['méretVéletlen'] === false ? num(P['méret1'], 110) : rnd(100, 118), s2: P['méretVéletlen'] === false ? num(P['méret2'], 90) : rnd(60, 115), off: rnd(15, 45) * Math.PI / 180, ph: Math.random() * Math.PI * 2
      };
    }
    snapshot() {
      const c = this.cv; if (!c.width) return;
      if (!this.snap || this.snap.width !== c.width || this.snap.height !== c.height) { this.snap = document.createElement('canvas'); this.snap.width = c.width; this.snap.height = c.height; }
      const s = this.snap.getContext('2d'); s.clearRect(0, 0, c.width, c.height); s.drawImage(c, 0, 0); this.snapA = 1;
    }
    frame(now) {
      window.__nincsDobbanas = false;   // a szivárvány (SPIRÁLOS) alatt a zenei dobbanás ki van kapcsolva – lásd Spir.draw
      const st = this.host(); const P = st.P || {}; this.P = P;
      let dt = Math.min(0.1, (now - this.last) / 1000); this.last = now;
      if (st.paused) dt = 0;
      this.fast = P['tempó'] === 'pörgős';
      const pairSec = this.fast ? 3.5 : +(P['párosításMp'] ?? 10);
      if (!this.cfg) { this.newPair(P); this.pairLeft = pairSec; }
      const pk = ['tárgy1', 'tárgy2', 'tárgy1Szín', 'tárgy2Szín', 'örvényHáttér', 'örvényTárgyakSzáma', 'méretVéletlen', 'méret1', 'méret2'].map(k => P[k]).join('|');
      if (this.pk != null && pk !== this.pk) { if (this.kind === 'orv' && this.op > 0) this.snapshot(); this.newPair(P); this.pairLeft = pairSec; }
      this.pk = pk;
      this.pairLeft -= dt;
      let kind = null;
      const GY = !!window.__altGyors, SEQ = GY ? SEQ_GY : SEQ0;
      if (st.mode === 'alt') {
        if (this.ai == null) { this.ai = 0; this.segLeft = this.segDur(SEQ[0], pairSec); }
        this.segLeft -= dt;
        if (this.segLeft <= 0 || this.jump) { this.jump = false; const s0 = SEQ[this.ai]; this.ai = (this.ai + 1) % SEQ.length; const s = SEQ[this.ai]; this.segLeft = this.segDur(s, pairSec); if (GY) { if (s === 'spir' && this.spir) this.spir.fT = 0; if (s === 'orv') { this.newPair(P); this.pairLeft = 10; } } st.setSeg && st.setSeg(s);
          if (s === s0 && OV.includes(s) && this.op > 0.5) { this.snapshot(); if (s === 'spir') this.spir.shuffle(P); else this.hold.shuffle(P); }   // ugyanaz az üzemmód: második változat
          if (this.ai === 0 && st.onCycle) st.onCycle(); }   // egy teljes kör lement
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
      this.render(dt * (window.__zeneSeb || 1));   // zenére reagálás (ha be van töltve): a forgás a zene energiájával gyorsul-lassul
    }
    segDur(s, pairSec) { if (window.__altGyors) return s === 'orv' ? 20 : 10; const F = this.fast; return s === 'orv' ? pairSec * 2 : s === 'spir' || s === 'hold' ? (F ? 15 : 30) : (F ? 10 : 30); }
    variant() {
      const k = this.kind; if (!k || this.op < 0.5) return false;
      if (k === 'orv') { this.snapshot(); this.newPair(this.P || {}); this.pairLeft = this.fast ? 3.5 : +((this.P || {})['párosításMp'] ?? 10); }
      else if (k === 'spir') this.spir.shuffle(this.P || {}); else this.hold.shuffle(this.P || {});
      if (this.ai != null) this.segLeft = Math.max(this.segLeft, 8);
      return true;
    }
    next() {
      const st = this.host();
      if (st.mode === 'alt') { this.jump = true; return true; }
      if (st.mode === 'orv') { this.snapshot(); this.newPair(this.P || {}); this.pairLeft = this.fast ? 3.5 : +((this.P || {})['párosításMp'] ?? 10); return true; }
      if (st.mode === 'spir') { this.spir.shuffle(this.P || {}); return true; }
      if (st.mode === 'hold') { this.hold.shuffle(this.P || {}); return true; }
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
      const cv = this.cv, c = this.cfg, F = this.fast, PQ = this.P || {}, waveSec = F ? 1.5 : num(PQ['örvényHullámMp'], 3), soft = F ? 0.15 : num(PQ['örvényLágyság'], 30) / 100, late = num(PQ['késésMp'], 0.2);
      for (const key of ['bg', 'ob']) { const w = this[key]; w.el += dt; if (w.el >= waveSec) { const nw = this.newWave(0, w); nw.el = w.el - waveSec; if (key === 'bg') this.bgPrev = w; this[key] = nw; } }
      const kOf = (w, el) => Math.min(1, (el ?? w.el) / waveSec) * (1 + soft) - soft / 2;
      const x = cv.getContext('2d'), cx = W / 2, cy = H / 2, RR = Math.hypot(cx, cy);
      x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
      if (c.wave) this.paint(x, this.bg, cx, cy, RR, kOf(this.bg), soft); else { x.fillStyle = COL.fekete; x.fillRect(0, 0, W, H); }
      const g1 = this.grays[c.n1], g2 = this.grays[c.n2];
      if (g1 && g2) {
        this.th += dt * Math.PI * 2 / (F ? 6 : Math.max(1, num(PQ['fordulat1Mp'], 15))); this.th2 -= dt * Math.PI * 2 / (F ? 4 : Math.max(1, num(PQ['fordulat2Mp'], 10))); this.lt += dt;
        const colOf = sz => { if (COL[sz]) return { flat: COL[sz] }; if (c.wave) { const e = this.bg.el - late; return e >= 0 || !this.bgPrev ? { w: this.bg, k: kOf(this.bg, Math.max(0, e)) } : { w: this.bgPrev, k: kOf(this.bgPrev, waveSec + e) }; } return { w: this.ob, k: kOf(this.ob) }; };
        const col1 = colOf(c.szin1), col2 = colOf(c.szin2);
        const PP = this.P || {}, amp = (+(PP['lélegzés'] ?? 60)) / 100, per = Math.max(1, +(PP['lélegzésMp'] ?? 12));
        const br = ph => 1 - amp * (0.5 - 0.5 * Math.cos(this.lt * Math.PI * 2 / (F ? Math.min(5, per) : per) + ph));
        const M = PQ['örvényKitöltés'] === 'kitöltés' ? Math.max(W, H) : Math.min(W, H);
        this.obj(x, 'oc', Math.round(M * c.s1 / 100 * br(c.ph)), this.th, col1, g1, cx, cy, RR, soft);
        const tsz = String(PQ['örvényTárgyakSzáma'] ?? '2'); if (tsz === '2' || (tsz === 'véletlen' && !this.pairOne)) this.obj(x, 'oc2', Math.round(M * c.s2 / 100 * br(c.ph + Math.PI)), this.th2 + c.off, col2, g2, cx, cy, RR, soft);
      }
    }
    dyn(n, ang, t) {   // a mozgó tárgy pillanatnyi képe: a külső korongok felváltva jobbra-balra forognak, a közép áll
      const s = DYN[n], c = this.grays[n], S = c.width, h = S / 2, x = c.getContext('2d'), K = s.img ? this.grays[s.img] : korong(), sp = t * Math.PI * 2 / 6;
      x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, S, S); if (!K) return; x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';   // a képből készülő korong: megvárjuk, míg betöltődik
      for (let i = 0; i < s.n; i++) {
        const a = Math.PI / 2 + i * Math.PI * 2 / s.n, R = s.dr * h;
        x.save(); x.translate(h + Math.cos(a) * s.cr * h, h + Math.sin(a) * s.cr * h); x.rotate((i % 2 ? -1 : 1) * sp); if (s.img && !s.nobg) { x.beginPath(); x.arc(0, 0, R * 0.97, 0, Math.PI * 2); x.fillStyle = 'rgba(16,16,16,.92)'; x.fill(); } x.drawImage(this.mip(K, 2 * R), -R, -R, 2 * R, 2 * R); x.restore();
      }
      if (s.mid) { const R = s.mid * h; x.save(); x.translate(h, h); x.rotate(-ang); if (s.img && !s.nobg) { x.beginPath(); x.arc(0, 0, R * 0.97, 0, Math.PI * 2); x.fillStyle = 'rgba(16,16,16,.92)'; x.fill(); } x.drawImage(this.mip(K, 2 * R), -R, -R, 2 * R, 2 * R); x.restore(); }
    }
    mip(g, D) {   // a legkisebb olyan felezett változat, amely még legalább kétszer akkora, mint a rajzolt méret
      if (g._dyn) return g;
      if (!g._mip) { g._mip = [g]; let c = g; while (c.width > 96) { const n = document.createElement('canvas'); n.width = n.height = Math.round(c.width / 2); const q = n.getContext('2d'); q.imageSmoothingEnabled = true; q.imageSmoothingQuality = 'high'; q.drawImage(c, 0, 0, n.width, n.height); g._mip.push(n); c = n; } }
      let i = 0; while (i + 1 < g._mip.length && g._mip[i + 1].width >= D * 1.5) i++; return g._mip[i];
    }
    obj(x, key, D, ang, col, gray, cx, cy, RR, soft) {
      if (D < 2) return;
      for (const n in DYN) if (gray === this.grays[n]) { gray._dyn = true; this.dyn(n, ang, this.lt); }
      if (!this[key] || this[key].width !== D) { this[key] = document.createElement('canvas'); this[key].width = this[key].height = D; }
      const cvs = this[key], o = cvs.getContext('2d'), r = D / 2;
      o.globalCompositeOperation = 'source-over'; o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, D, D);
      if (col.flat) { o.fillStyle = col.flat; o.fillRect(0, 0, D, D); }
      else { o.save(); o.translate(r - cx, r - cy); this.paint(o, col.w, cx, cy, RR, col.k, soft); o.restore(); }
      // Kicsinyítéskor a sűrű középső csíkok „szőrszálasra” recésednek: lépcsőzetesen felezett (előre simított) változatból rajzolunk.
      const src = this.mip(gray, D); o.imageSmoothingEnabled = true; o.imageSmoothingQuality = 'high';
      o.save(); o.translate(r, r); o.rotate(ang);
      o.globalCompositeOperation = 'multiply'; o.drawImage(src, -r, -r, D, D);
      o.globalCompositeOperation = 'destination-in'; o.drawImage(src, -r, -r, D, D);
      o.restore(); o.globalCompositeOperation = 'source-over';
      x.save(); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = D * 0.03; x.shadowOffsetY = D * 0.012;
      x.drawImage(cvs, cx - r, cy - r); x.restore();
    }
  }
  Orveny.TARGYAK = TARGYAK;
  window.Orveny = Orveny;
})();
