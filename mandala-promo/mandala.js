// MANDALA élmény – Art Deco minták lassan forgó, lélegző tükörképe, hangtálzenével. © Bánky András – Kaleidoszkóp
// Homokmandala-szertartás (mandalaSöprés): a minta kimerevedik → hangtálütés, elsöprés középre → üresség → újraépülés középről kifelé.
// Használat: new window.Mandala(canvas, () => ({ want, paused, P, pats: [{ src, tile, name }] }))
(function () {
  if (window.Mandala) return;
  const PAIRS = {   // [rajzolat színe, háttér színe]
    'arany–fekete': ['#D4AF37', '#0B0B0C'],
    'arany–éjkék': ['#D4AF37', '#0E1A3A'],
    'ezüst–fekete': ['#C9CED6', '#0B0B0C'],
    'elefántcsont–bordó': ['#F2EAD8', '#5A1022'],
  };
  const TRACKS = { 'Silent Sanctuary': 'mandala/silent-sanctuary.mp3', 'Handpan': 'mandala/handpan.mp3' };
  const XF = 5;   // zenei áttűnés (mp)
  const HOLD = 3.5, SWEEP = 16.5, EMPTY = 2, BUILD = 21;   // a szertartás szakaszai (mp)
  const eio = p => p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  const mix = (a, b, k) => { const A = hex(a), B = hex(b); return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',') + ')'; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const num = (v, d) => { const n = +v; return Number.isFinite(n) ? n : d; };
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));

  class Mandala {
    constructor(cv, host) {
      this.cv = cv; this.host = host; this.op = 0; this.t = 0; this.last = performance.now(); this.want = true;
      this.imgs = {}; this.tiles = {}; this.src = document.createElement('canvas'); this.snap = null; this.snapA = 0; this.cur = null;
      this.left = 0; this.drawnOnce = false; this.run = false;
      const tick = now => { try { this.frame(now); } catch (e) { console.error(e); } this.raf = requestAnimationFrame(tick); };
      this.raf = requestAnimationFrame(tick);
    }
    // ---------- élmény-felület (mint MEDITÁCIÓ / ÁLOM) ----------
    start() { if (this.run) return; this.run = true; if (this.want) this.audio(); }
    stop() { if (!this.run) return; this.run = false; this.mute(); }
    setWant(on) { if (on === this.want) return; this.want = on; if (!this.run) return; if (on) this.audio(); else this.mute(); }
    locked() { return !!(this.run && this.want && this.ac && this.ac.state !== 'running'); }
    destroy() { this.stop(); cancelAnimationFrame(this.raf); if (this.ac) this.ac.close(); }

    // ---------- kép ----------
    load(p) {
      if (this.imgs[p.src]) return this.imgs[p.src].ok ? this.imgs[p.src].im : null;
      const o = this.imgs[p.src] = { im: new Image(), ok: false }; o.im.onload = () => { o.ok = true; this.key = null; }; o.im.src = p.src; return null;
    }
    choose(P, pats, keep) {
      const sel = String(P['mandalaMinta'] ?? 'véletlen');
      const hist = this.hist || (this.hist = []);   // az utolsó néhány mintát nem ismétli
      let list = pats.filter(p => p.name === sel); if (!list.length) list = pats.filter(p => !hist.includes(p.src)); if (!list.length) list = pats.filter(p => !this.cur || p.src !== this.cur.pat.src); if (!list.length) list = pats;
      const pat = keep || pick(list);
      const sz = String(P['mandalaSzín'] ?? 'arany–fekete'), pair = PAIRS[sz] ? sz : pick(Object.keys(PAIRS));
      const tm = String(P['mandalaTükör'] ?? '8'), mir = tm === 'nincs' ? 0 : ['6', '8', '12'].includes(tm) ? +tm : pick([6, 8, 8, 12]);
      this.cur = { pat, pair, mir, dir: Math.random() < .5 ? 1 : -1 }; hist.push(pat.src); if (hist.length > Math.min(4, pats.length - 1)) hist.shift(); this.key = null; this.load(pat);
    }
    next() {
      if (!this.run || this.op < 0.5) return false;
      if (this.rit) return true;   // szertartás közben a koppintás nem vált
      const st = this.host() || {}; this.snapshot(); this.choose(st.P || {}, st.pats || []); this.t += 20 + Math.random() * 60;
      this.left = Math.max(0.25, num((st.P || {})['mandalaVáltásPerc'], 1)) * 60; return true;
    }
    tile(dpr) {   // átszínezett csempe a kiválasztott színpárral
      const c = this.cur, im = this.load(c.pat); if (!im) return null;
      const T = Math.max(64, Math.round((c.pat.tile || 420) * dpr)), k = c.pat.src + '|' + c.pair + '|' + T;
      if (this.tiles[k]) return this.tiles[k];
      const [ink, bg] = PAIRS[c.pair].map(hex), t = document.createElement('canvas'); t.width = t.height = T;
      const x = t.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, T, T);
      const id = x.getImageData(0, 0, T, T), d = id.data;
      for (let i = 0; i < d.length; i += 4) { const l = (d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11) / 255; for (let j = 0; j < 3; j++) d[i + j] = Math.round(ink[j] * (1 - l) + bg[j] * l); d[i + 3] = 255; }
      x.putImageData(id, 0, 0);
      this.tiles = { [k]: t }; return t;   // csak az aktuálisat tartjuk meg
    }
    snapshot() { const cv = this.cv; if (!cv.width || !this.drawnOnce) return; if (!this.snap) this.snap = document.createElement('canvas'); this.snap.width = cv.width; this.snap.height = cv.height; this.snap.getContext('2d').drawImage(cv, 0, 0); this.snapA = 1; }
    frame(now) {
      const st = this.host() || {}, P = st.P || {}, pats = st.pats || [];
      let dt = Math.min(0.1, (now - this.last) / 1000); this.last = now;
      if (st.paused) dt = 0;
      const want = st.want && pats.length ? 1 : 0;
      if (!this._pre && pats.length) { this._pre = true; pats.forEach(p => this.load(p)); }   // minden minta előre betöltve
      if (want && !this.cur) { this.choose(P, pats); this.left = Math.max(0.25, num(P['mandalaVáltásPerc'], 1)) * 60; }
      if (!want) { if (this.rit) this.duck(1, 0.5); this.rit = null; this.grains = []; }
      this.op += (want - this.op) * Math.min(1, dt * 0.8 + (st.paused ? 0 : 0.002)); if (want === 0 && this.op < 0.01) this.op = 0; if (want === 1 && this.op > 0.995) this.op = 1;
      if (this.cv._op !== this.op) { this.cv.style.opacity = this.op.toFixed(3); this.cv._op = this.op; }
      if (this.ac && this.run) this.music(P);
      if (this.op <= 0) { this.drawnOnce = false; return; }
      const pk = ['mandalaMinta', 'mandalaSzín', 'mandalaTükör'].map(q => P[q]).join('|');
      if (this.pk != null && pk !== this.pk && this.drawnOnce) { this.snapshot(); const keep = this.pkMinta === P['mandalaMinta'] ? this.cur.pat : null; this.choose(P, pats, keep); } this.pk = pk; this.pkMinta = P['mandalaMinta'];
      const per = Math.max(0.25, num(P['mandalaSöprésPerc'], 3)) * 60, vPer = Math.max(0.25, num(P['mandalaVáltásPerc'], 1)) * 60;
      const swOn = P['mandalaSöprés'] !== false && P['mandalaVáltás'] !== false;
      if (this.sweepLeft == null || this.pkS !== per) { this.sweepLeft = this.sweepLeft == null ? per : Math.min(this.sweepLeft, per); this.pkS = per; }
      if (want && !this.rit) {
        if (swOn) { this.sweepLeft -= dt; if (this.sweepLeft <= 0) this.ritual(); }
        if (!this.rit && P['mandalaVáltás'] !== false) { this.left -= dt; if (this.left <= 0) { if (swOn && this.sweepLeft < 25) this.left = vPer; else this.next(); } }   // söprés előtt nincs áttűnés
      }
      let ts = 1;
      if (this.rit && dt > 0) ts = this.ritStep(dt, P, pats, per, vPer); else if (this.rit) ts = this.rit.ph === 'build' ? 1 : 0;
      if (st.paused && this.drawnOnce) return;
      this.t += dt * ts; this.render(dt, P);
    }
    render(dt, P) {
      const cv = this.cv, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr); if (!W || !H) return;
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; this.key = null; }
      const R0 = this.rit; if (R0 && (R0.ph === 'sweep' || R0.ph === 'empty')) { this.renderSweep(dt, W, H, dpr); this.drawnOnce = true; return; }
      const tl = this.tile(dpr), c = this.cur, x = cv.getContext('2d');
      x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.fillStyle = PAIRS[c.pair][1]; x.fillRect(0, 0, W, H);
      if (!tl) { if (this.snap && this.snapA > 0) x.drawImage(this.snap, 0, 0, W, H); return; }   // amíg az új minta töltődik, a régi kép marad (nincs fekete villanás)
      const breath = P['mandalaLélegzés'] !== false ? 1 + 0.07 * Math.sin(this.t * Math.PI * 2 / 11) : 1;
      const zoom = breath, spin = num(P['mandalaForgás'], 0.6), Rr = Math.hypot(W, H) / 2;
      const need = Math.min(3600, Math.ceil(2 * (Rr / 0.9 + 40)));
      const key = tl.width + '|' + need + '|' + c.pat.src + c.pair;
      if (this.key !== key) { this.key = key; const S = this.src; S.width = S.height = need; const s = S.getContext('2d'); s.fillStyle = s.createPattern(tl, 'repeat'); s.fillRect(0, 0, need, need); }
      const S = this.src, n = c.mir, a = Math.PI * 2 / (n || 1), cx = W / 2, cy = H / 2, ang = this.t * spin * 0.025 * c.dir;
      if (!n) { x.save(); x.translate(cx, cy); x.scale(zoom, zoom); x.rotate(ang); x.drawImage(S, -S.width / 2, -S.height / 2); x.restore(); }
      for (let i = 0; n && i < n; i++) {
        x.save(); x.translate(cx, cy);
        if (i % 2) { x.rotate((i + 1) * a); x.scale(1, -1); } else x.rotate(i * a);
        x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, Rr + 4, -0.002, a + 0.002); x.closePath(); x.clip();
        x.scale(zoom, zoom); x.rotate(ang); x.drawImage(S, -S.width / 2, -S.height / 2); x.restore();
      }
      if (this.snapA > 0 && this.snap) { x.globalAlpha = this.snapA; x.drawImage(this.snap, 0, 0, W, H); x.globalAlpha = 1; this.snapA = Math.max(0, this.snapA - dt / 4); }
      if (R0 && R0.ph === 'build') this.buildMask(dt, W, H, dpr);
      this.drawnOnce = true;
    }

    // ---------- homokmandala-szertartás ----------
    ritual() { this.rit = { ph: 'hold', t: 0 }; this.snapA = 0; this.grains = []; this.duck(0, 3); }   // a jelek alatt a zene elhallgat
    duck(v, sec) { this.duckTo = v; const ac = this.ac, g = this.mg; if (!ac || !g) return; const t = ac.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(v, t + sec); }
    ritStep(dt, P, pats, per, vPer) {
      const r = this.rit; r.t += dt;
      if (r.ph === 'hold') {   // lassan megáll, majd kimerevedik
        if (r.t >= HOLD) { this.freeze(); r.ph = 'sweep'; r.t = 0; this.bowl(true); }
        return Math.max(0, 1 - r.t / 1.6);
      }
      if (r.ph === 'sweep') { if (r.t >= SWEEP) { r.ph = 'empty'; r.t = 0; this.choose(P, pats); this.t += 20 + Math.random() * 60; r.bg1 = PAIRS[this.cur.pair][1]; } return 0; }
      if (r.ph === 'empty') { if (r.t >= EMPTY) { r.ph = 'build'; r.t = 0; this.grains = []; this.bowl(false); } return 0; }
      if (r.t >= 9 && !r.up) { r.up = true; this.duck(1, 9); }   // a halk jel lecsengése után a zene lassan visszajön
      if (r.t >= BUILD) { this.rit = null; this.grains = []; this.left = vPer; this.sweepLeft = per; }
      return 1;
    }
    freeze() {
      const cv = this.cv, r = this.rit; if (!this.frz) this.frz = document.createElement('canvas');
      this.frz.width = cv.width; this.frz.height = cv.height; this.frz.getContext('2d').drawImage(cv, 0, 0);
      r.ink = PAIRS[this.cur.pair][0]; r.bg0 = r.bg1 = PAIRS[this.cur.pair][1]; r.dir = this.cur.dir; r.pile = 0;
    }
    renderSweep(dt, W, H, dpr) {
      const cv = this.cv, x = cv.getContext('2d'), r = this.rit, R = Math.hypot(W, H) / 2, cx = W / 2, cy = H / 2, m = Math.min(W, H);
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1;
      const bg = r.ph === 'empty' ? mix(r.bg0, r.bg1, eio(Math.min(1, r.t / EMPTY))) : r.bg0;
      x.fillStyle = bg; x.fillRect(0, 0, W, H);
      const G = this.grains || (this.grains = []);
      if (r.ph === 'sweep') {
        const e = eio(Math.min(1, r.t / SWEEP)), rad = R * (1 - e);
        if (rad > 1 && this.frz) {   // a megmaradt rész összefelé csavarodik
          x.save(); x.beginPath(); x.arc(cx, cy, rad, 0, Math.PI * 2); x.clip();
          x.translate(cx, cy); x.rotate(e * 0.8 * (r.dir || 1)); const k = 1 - 0.2 * e; x.scale(k, k); x.drawImage(this.frz, -W / 2, -H / 2, W, H); x.restore();
          const g = x.createRadialGradient(cx, cy, Math.max(0, rad - R * 0.06), cx, cy, rad), [a, b, c] = hex(r.bg0);
          g.addColorStop(0, `rgba(${a},${b},${c},0)`); g.addColorStop(1, `rgba(${a},${b},${c},1)`);
          x.fillStyle = g; x.beginPath(); x.arc(cx, cy, rad + 1, 0, Math.PI * 2); x.fill();
        }
        const n = Math.min(500, Math.round(dt * 1000 * (0.4 + rad / R)));   // homokszemek a söprés peremén
        for (let i = 0; i < n && G.length < 5000; i++) G.push({ r: rad * (0.94 + Math.random() * 0.1), a: Math.random() * Math.PI * 2, v: 0.1 + Math.random() * 0.22, w: (0.3 + Math.random() * 0.6) * (r.dir || 1), s: (0.8 + Math.random() * 1.4) * dpr });
        r.pile = e;
      } else r.pile = Math.max(0, 1 - r.t / (EMPTY * 0.6));   // a kupac elfogy, utána csend
      const pr = m * 0.055 * Math.sqrt(Math.max(0, r.pile));
      x.fillStyle = r.ink; x.globalAlpha = 0.85;
      for (let i = G.length - 1; i >= 0; i--) {
        const g = G[i]; g.r -= g.v * R * dt; g.a += g.w * dt;
        if (g.r < pr * 0.6 || r.ph === 'empty' && Math.random() < dt * 3) { G.splice(i, 1); continue; }
        x.fillRect(cx + Math.cos(g.a) * g.r, cy + Math.sin(g.a) * g.r, g.s, g.s);
      }
      x.globalAlpha = 1;
      if (pr > 0.5) {   // a középre gyűlt homok
        const [a, b, c] = hex(r.ink), g = x.createRadialGradient(cx, cy, 0, cx, cy, pr);
        g.addColorStop(0, `rgba(${a},${b},${c},0.95)`); g.addColorStop(0.55, `rgba(${a},${b},${c},0.6)`); g.addColorStop(1, `rgba(${a},${b},${c},0)`);
        x.fillStyle = g; x.beginPath(); x.arc(cx, cy, pr, 0, Math.PI * 2); x.fill();
      }
    }
    buildMask(dt, W, H, dpr) {   // az új minta középről kifelé épül fel, a peremén homokszórással
      const x = this.cv.getContext('2d'), r = this.rit, R = Math.hypot(W, H) / 2, cx = W / 2, cy = H / 2;
      const e = eio(Math.min(1, r.t / BUILD)), rad = R * 1.08 * e, bg = PAIRS[this.cur.pair][1], ink = PAIRS[this.cur.pair][0], [a, b, c] = hex(bg);
      x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1;
      x.fillStyle = bg; x.beginPath(); x.rect(0, 0, W, H); x.arc(cx, cy, rad, 0, Math.PI * 2, true); x.fill('evenodd');
      if (rad > 1) { const g = x.createRadialGradient(cx, cy, Math.max(0, rad - R * 0.07), cx, cy, rad); g.addColorStop(0, `rgba(${a},${b},${c},0)`); g.addColorStop(1, `rgba(${a},${b},${c},1)`); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, rad + 1, 0, Math.PI * 2); x.fill(); }
      const G = this.grains || (this.grains = []), n = Math.min(300, Math.round(dt * 1000 * (1 - e * 0.5)));
      for (let i = 0; i < n && G.length < 3000 && e < 0.97; i++) G.push({ r: rad * (0.9 + Math.random() * 0.12), a: Math.random() * Math.PI * 2, v: 0.008 + Math.random() * 0.02, l: 0.9 + Math.random() * 1.1, s: (0.8 + Math.random() * 1.3) * dpr });
      x.fillStyle = ink;
      for (let i = G.length - 1; i >= 0; i--) { const g = G[i]; g.l -= dt; if (g.l <= 0) { G.splice(i, 1); continue; } g.r += g.v * R * dt; x.globalAlpha = Math.min(1, g.l * 1.6) * 0.8; x.fillRect(cx + Math.cos(g.a) * g.r, cy + Math.sin(g.a) * g.r, g.s, g.s); }
      x.globalAlpha = 1;
    }
    bowl(strong) {   // jel: erős = két mély, dobbanásszerű ütés a söprés indításához; halk = szolid tál az újraépülés előtt
      const ac = this.ac; if (!ac || ac.state !== 'running' || !this.want || !this.vg) return;
      const t0 = ac.currentTime + 0.02;
      if (strong) { this.strike(t0, true, 1); this.strike(t0 + 6.5, true, 0.8); } else this.strike(t0, false, 1);
    }
    strike(t0, strong, k) {
      const ac = this.ac, out = ac.createGain(); out.gain.value = (strong ? 0.38 : 0.24) * k; out.connect(this.vg);
      const f0 = strong ? 98 + Math.random() * 14 : 250 + Math.random() * 40, att = strong ? 0.004 : 0.03;
      const parts = strong ? [[1, 1, 24], [2.76, 0.42, 13], [5.4, 0.16, 6], [8.93, 0.06, 2.5]] : [[1, 1, 16], [2.76, 0.35, 8], [5.4, 0.12, 4]];
      for (const [mm, amp, dec] of parts)
        for (const det of [0, 0.4 + Math.random() * 1]) {
          const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f0 * mm + det * mm;
          g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(amp * 0.5, t0 + att); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dec);
          o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + dec + 0.1);
        }
      if (strong) {   // dobbanás: lefelé csúszó mély szinusz, mint egy nagydob a tál alatt
        const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine';
        o.frequency.setValueAtTime(130, t0); o.frequency.exponentialRampToValueAtTime(46, t0 + 0.22);
        g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(1.6, t0 + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.6);
        o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + 1.7);
      }
      const L = Math.round(ac.sampleRate * (strong ? 0.06 : 0.03)), nb = ac.createBuffer(1, L, ac.sampleRate), d = nb.getChannelData(0);
      for (let i = 0; i < L; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / L, 3);
      const s = ac.createBufferSource(), bp = ac.createBiquadFilter(), ng = ac.createGain(); s.buffer = nb; bp.type = 'bandpass'; bp.frequency.value = strong ? 260 : f0 * 5; bp.Q.value = 1.2; ng.gain.value = strong ? 0.6 : 0.12;
      s.connect(bp); bp.connect(ng); ng.connect(out); s.start(t0);
    }

    // ---------- hang: hangtálzene, hézagmentes áttűnéssel ismételve ----------
    audio() {
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
      if (!this.ac) {
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        this.ac = new AC(); this.master = this.ac.createGain(); this.master.gain.value = 0; this.master.connect(this.ac.destination);
        this.bufs = {}; for (const [k, u] of Object.entries(TRACKS)) fetch(u).then(r => r.arrayBuffer()).then(b => this.ac.decodeAudioData(b)).then(buf => { this.bufs[k] = buf; }).catch(() => {});
      }
      if (this.run && this.want) { this.ac.resume(); this.master.gain.cancelScheduledValues(this.ac.currentTime); this.master.gain.setTargetAtTime(1, this.ac.currentTime, 1.2); }
    }
    mute() { if (!this.ac) return; const t = this.ac.currentTime; this.master.gain.cancelScheduledValues(t); this.master.gain.setTargetAtTime(0, t, 0.4); clearTimeout(this._sus); this._sus = setTimeout(() => { if (!this.run || !this.want) this.ac.suspend(); }, 1500); }
    music(P) {
      const ac = this.ac; if (ac.state !== 'running' || !this.want) return;
      const z = String(P['mandalaZene'] ?? 'Silent Sanctuary'), vol = Math.max(0, Math.min(100, num(P['mandalaHangerő'], 70))) / 100;
      if (this._vol !== vol) { this._vol = vol; if (this.vg) this.vg.gain.setTargetAtTime(vol, ac.currentTime, 0.3); }
      if (!this.vg) { this.vg = ac.createGain(); this.vg.gain.value = vol; this.vg.connect(this.master); }
      if (!this.mg) { this.mg = ac.createGain(); this.mg.gain.value = this.duckTo ?? 1; this.mg.connect(this.vg); }   // csak a zene útja (a hangtáljelek nem ezen mennek)
      if (z === 'ki') { if (this.voice) { this.endVoice(this.voice, ac.currentTime, 2); this.voice = null; } return; }
      const want = z === 'váltakozó' ? null : z;
      if (this.voice && want && this.voice.name !== want) { this.endVoice(this.voice, ac.currentTime, XF); this.voice = null; }
      const now = ac.currentTime;
      if (!this.voice || now >= this.voice.end - XF) {
        let name = want || (this.voice ? (this.voice.name === 'Silent Sanctuary' ? 'Handpan' : 'Silent Sanctuary') : 'Silent Sanctuary');
        const buf = this.bufs[name]; if (!buf) return;
        const t0 = this.voice ? Math.max(now, this.voice.end - XF) : now + 0.05;
        const s = ac.createBufferSource(), g = ac.createGain(); s.buffer = buf; s.connect(g); g.connect(this.mg);
        g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(1, t0 + XF);
        s.start(t0); if (this.voice) this.endVoice(this.voice, t0, XF);
        this.voice = { s, g, name, end: t0 + buf.duration };
      }
    }
    endVoice(v, t, d) { try { v.g.gain.cancelScheduledValues(t); v.g.gain.setValueAtTime(v.g.gain.value, t); v.g.gain.linearRampToValueAtTime(0, t + d); v.s.stop(t + d + 0.1); } catch (e) {} }
  }
  window.Mandala = Mandala;
})();
