// MAX-TAXI – 20 mp-es kinetikus tipográfiai hirdetés a Kaleidoszkóp ingyenes részéhez.
// Használat: window.FutapestReklam.play(hostElem, { sound: true|false, onEnd: fn })
// A hirdetés nem szakítható meg: a teljes felületet lefedi, minden érintést és kattintást elnyel.
(function () {
  if (window.FutapestReklam) return;
  const DUR = 20.3, AUDIO = 'reklam/futapest-zene.mp3';
  // iPhone: hang csak érintésre indulhat – az első koppintáskor „feloldunk” egy lejátszót, a hirdetés később ezt használja
  let AUD = null;
  const unlock = () => { if (AUD) return; try { const a = new Audio(AUDIO); a.muted = true; a.setAttribute('playsinline', ''); AUD = a; const p = a.play(); const done = () => { try { a.pause(); a.currentTime = 0; } catch (e) {} a.muted = false; }; if (p && p.then) p.then(done).catch(() => { AUD = null; }); else done(); } catch (e) { AUD = null; } };
  window.addEventListener('pointerup', unlock, true);
  const CSS = `
.fpad{position:absolute;inset:0;background:#0E0E10;overflow:hidden;pointer-events:auto;touch-action:none;user-select:none;-webkit-user-select:none;opacity:0;transition:opacity .35s ease;cursor:default;
  --ink:#0E0E10;--cab:#FFC72C;--paper:#F7F5EF;--display:"Barlow Condensed","Arial Narrow",Arial,sans-serif}
.fpad *{box-sizing:border-box}
.fpad .stage{position:absolute;left:0;top:0;transform-origin:0 0;overflow:hidden;background:var(--ink);font-family:var(--display)}
.fpad .layer,.fpad .wipe{position:absolute;inset:0}
.fpad .group{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0}
.fpad .fit{display:flex;flex-direction:column;align-items:center;transform-origin:50% 50%}
.fpad .ln{display:block;line-height:.9;text-transform:uppercase;white-space:nowrap;opacity:0}
.fpad .streak{position:absolute;height:6px;border-radius:3px;background:rgba(255,255,255,.07)}
.fpad .checker{background:repeating-conic-gradient(var(--ink) 0 25%,var(--cab) 0 50%) 0 0/48px 48px}
.fpad .checker.inv{background:repeating-conic-gradient(var(--ink) 0 25%,var(--paper) 0 50%) 0 0/40px 40px}
.fpad .lt{display:inline-block;opacity:0}
.fpad .l6 .lt,.fpad .l13 .lt{background:repeating-conic-gradient(var(--ink) 0 25%,var(--cab) 0 50%) 0 0/36px 36px;-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:5px var(--ink)}   /* taxi-kockás betűk */
.fpad .route{display:flex;align-items:center;gap:40px}
.fpad .stop{display:flex;align-items:baseline;gap:6px;opacity:0;white-space:nowrap;flex:none}
.fpad .dot{width:190px;height:190px;border-radius:50%;background:var(--cab);color:var(--ink);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:150px;line-height:1}
.fpad .suf{font-weight:700;font-size:110px;color:var(--paper);white-space:nowrap}
.fpad .road{position:relative;width:640px;height:24px}
.fpad .track{position:absolute;inset:0;transform-origin:0 50%;transform:scaleX(0);border-radius:4px}
.fpad .car{position:absolute;top:-58px;left:0;width:150px;height:70px;border-radius:18px 34px 12px 12px;background:var(--cab);color:var(--ink);font-weight:900;font-size:40px;letter-spacing:4px;display:flex;align-items:center;justify-content:center;opacity:0;box-shadow:0 10px 0 -2px #000}
.fpad .tag{display:flex;flex-direction:column;align-items:center;gap:14px;opacity:1}
.fpad .tagt{font-weight:700;font-size:96px;color:var(--ink);letter-spacing:1px;white-space:nowrap}
.fpad .ul{height:12px;width:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(0)}
.fpad .icon{width:230px;height:230px;border-radius:52px;background:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;opacity:0;margin-bottom:46px;box-shadow:0 24px 0 -8px rgba(0,0,0,.25)}
.fpad .icon b{font-weight:900;font-size:92px;color:var(--cab);letter-spacing:6px;line-height:.8}
.fpad .icon i{display:block;width:150px;height:28px}
.fpad .pill{margin-top:40px;padding:18px 54px 24px;border-radius:999px;background:var(--ink);color:var(--cab);font-weight:700;font-size:96px;white-space:nowrap;opacity:0}
.fpad .badge{position:absolute;left:calc(env(safe-area-inset-left,0px) + 12px);top:calc(env(safe-area-inset-top,0px) + 12px);padding:5px 10px;border-radius:6px;background:rgba(0,0,0,.55);color:#F7F5EF;font:600 12px/1 system-ui,sans-serif;letter-spacing:.06em;font-variant-numeric:tabular-nums;z-index:2}
`;
  const HTML = `
<div class="stage">
  <div class="layer s1"></div>
  <div class="wipe w1" style="background:var(--cab)"></div>
  <div class="wipe w2" style="background:var(--ink)"></div>
  <div class="layer s2"></div>
  <div class="wipe w3" style="background:var(--cab)"></div>
  <div class="group g1"><div class="fit">
    <span class="ln l1" style="font-weight:900;font-style:italic;font-size:260px;color:var(--paper)">Gyorsan</span>
    <span class="ln l2" style="font-weight:900;font-size:120px;color:var(--cab);margin:10px 0 18px">és</span>
    <span class="ln l3" style="font-weight:900;font-size:210px;color:var(--paper)">kényelmesen</span>
  </div></div>
  <div class="group g2"><div class="fit">
    <span class="ln l4" style="font-weight:700;font-size:150px;color:var(--cab);letter-spacing:24px;margin-bottom:12px">el akarsz</span>
    <span class="ln l5" style="font-weight:900;font-style:italic;font-size:300px;color:var(--paper)">jutni</span>
  </div></div>
  <div class="group g3"><div class="fit"><div class="route">
    <div class="stop sa"><div class="dot">A</div><span class="suf">-ból</span></div>
    <div class="road"><div class="track checker inv"></div><div class="car">TAXI</div></div>
    <div class="stop sb"><div class="dot">B</div><span class="suf">-be?</span></div>
  </div></div></div>
  <div class="group g4"><div class="fit">
    <span class="ln l6" style="font-weight:900;font-size:300px;color:var(--ink);letter-spacing:8px;opacity:1"></span>
    <span class="ln l7" style="display:none"></span>
    <div class="tag" style="margin-top:40px;padding:18px 54px 24px;border-radius:999px;background:var(--ink)"><span class="tagt" style="color:var(--cab)"></span><span class="ul" style="display:none"></span></div>
  </div></div>
  <div class="group g5"><div class="fit">
    <span class="ln l9" style="font-weight:700;font-size:160px;color:var(--paper);letter-spacing:16px">a legjobb</span>
    <span class="ln l10" style="font-weight:900;font-style:italic;font-size:290px;color:var(--cab);margin-top:6px">választás</span>
    <span class="ln checker chk" style="opacity:1;width:1300px;height:48px;margin-top:34px;transform:scaleX(0);transform-origin:0 50%"></span>
  </div></div>
  <div class="group g6"><div class="fit">
    <span class="ln l11" style="font-weight:900;font-size:250px;color:var(--paper)">Töltsd le</span>
    <span class="ln l12" style="font-weight:700;font-size:170px;color:var(--cab);letter-spacing:14px;margin-top:10px">az appot:</span>
  </div></div>
  <div class="group g7"><div class="fit">
    <div class="icon" style="display:none"><b>TAXI</b><i class="checker"></i></div>
    <span class="ln l13" style="font-weight:900;font-size:300px;color:var(--ink);letter-spacing:8px;opacity:1"></span>
    <span class="pill">Biztos pont a városi rohanásban</span>
  </div></div>
  <div class="wipe fo" style="background:#000;opacity:0"></div>
</div>
<div class="badge">HIRDETÉS · 20</div>`;

  function assets() {
    if (!document.getElementById('fpad-css')) {
      const st = document.createElement('style'); st.id = 'fpad-css'; st.textContent = CSS; document.head.appendChild(st);
      const ln = document.createElement('link'); ln.rel = 'stylesheet';
      ln.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,900&display=swap';
      document.head.appendChild(ln);
    }
  }
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (t, a, d) => clamp((t - a) / d);
  const eOut = p => 1 - Math.pow(1 - p, 3), eIn = p => p * p * p;
  const eBack = p => { const c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };

  function play(host, opt) {
    opt = opt || {};
    assets();
    const root = document.createElement('div'); root.className = 'fpad'; root.innerHTML = HTML; host.appendChild(root);
    const q = s => root.querySelector(s), stage = q('.stage'), badge = q('.badge');
    const stop = ev => { ev.stopPropagation(); if (ev.cancelable) ev.preventDefault(); };
    ['pointerdown', 'pointerup', 'pointermove', 'click', 'dblclick', 'touchstart', 'touchend', 'touchmove', 'wheel', 'contextmenu'].forEach(n => root.addEventListener(n, stop, { passive: false }));
    const keyBlock = ev => { ev.stopImmediatePropagation(); if (ev.key !== 'F5') ev.preventDefault(); };
    window.addEventListener('keydown', keyBlock, true);

    const letters = (el, text) => [...text].map(ch => { const s = document.createElement('span'); s.className = 'lt'; s.textContent = ch === ' ' ? ' ' : ch; el.appendChild(s); return s; });
    const L6 = letters(q('.l6'), 'MAX-TAXI'), L13 = letters(q('.l13'), 'MAX-TAXI'), TAG = 'Amikor a percek is számítanak';

    // méret: a színpad mindig kitölti a felületet (a rövidebb oldal 1080 egység); a túl széles sorok kicsinyítve férnek el
    let SW = 1920, SH = 1080, scale = 1, offX = 0, offY = 0, fitDirty = true;
    const streaks = [];
    for (const host2 of ['.s1', '.s2']) for (let i = 0; i < 12; i++) { const d = document.createElement('div'); d.className = 'streak'; q(host2).appendChild(d); streaks.push({ d, first: host2 === '.s1', y: (i * 487) % 1000 / 1000, len: 180 + ((i * 131) % 420), sp: 1400 + ((i * 233) % 1600), off: (i * 617) % 2400 }); }
    function layout() {
      const r = root.getBoundingClientRect(); if (!r.width || !r.height) return;
      const portrait = r.height > r.width, w = portrait ? 1080 : Math.round(1080 * r.width / r.height), h = portrait ? Math.round(1080 * r.height / r.width) : 1080;
      if (w !== SW || h !== SH) { SW = w; SH = h; fitDirty = true; }
      stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
      scale = r.width / SW; offX = 0; offY = 0;
      if (fitDirty) { fitDirty = false; root.querySelectorAll('.fit').forEach(f => { f.style.transform = 'none'; const nw = f.scrollWidth, nh = f.scrollHeight; const s = Math.min(1, (SW - 140) / nw, (SH - 120) / nh); f.style.transform = `scale(${s})`; }); }
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fitDirty = true; });

    const G = [
      { c: '.g1', a: 0.45, b: 3.35, out: 'up', lines: [['.l1', 0.45, 'slam'], ['.l2', 1.44, 'pop'], ['.l3', 1.80, 'slide']] },
      { c: '.g2', a: 3.83, b: 5.70, out: 'zoom', lines: [['.l4', 3.83, 'pop'], ['.l5', 4.31, 'slam']] },
      { c: '.g3', a: 5.97, b: 7.75, out: 'fade', lines: [] },
      { c: '.g4', a: 8.05, b: 11.45, out: 'left', lines: [['.l7', 8.48, 'slam']] },
      { c: '.g5', a: 11.92, b: 15.25, out: 'up', lines: [['.l9', 11.92, 'slide'], ['.l10', 12.63, 'slam']] },
      { c: '.g6', a: 15.73, b: 16.95, out: 'zoom', lines: [['.l11', 15.73, 'slam'], ['.l12', 16.44, 'slide']] },
      { c: '.g7', a: 17.39, b: 99, out: 'none', lines: [] },
    ];
    G.forEach(g => { g.el = q(g.c); g.lines.forEach(l => { l[0] = q(l[0]); }); });
    const SLAMS = []; G.forEach(g => g.lines.forEach(l => { if (l[2] === 'slam') SLAMS.push(l[1]); })); SLAMS.push(17.39);
    const E = { w1: q('.w1'), w2: q('.w2'), w3: q('.w3'), sa: q('.sa'), sb: q('.sb'), track: q('.track'), car: q('.car'), tagt: q('.tagt'), ul: q('.ul'), chk: q('.chk'), icon: q('.icon'), pill: q('.pill'), iconI: q('.icon i'), fo: q('.fo') };

    function anim(el, t, s, type) {
      if (t < s) { el.style.opacity = 0; return; }
      let p;
      if (type === 'slam') { p = seg(t, s, .32); const e = eOut(p); el.style.opacity = clamp(p * 3); el.style.transform = `scale(${1.9 - 0.9 * e})`; el.style.filter = `blur(${(1 - e) * 14}px)`; }
      else if (type === 'pop') { p = seg(t, s, .42); el.style.opacity = clamp(p * 4); el.style.transform = `scale(${Math.max(0, eBack(p))})`; }
      else if (type === 'slide') { p = eOut(seg(t, s, .42)); el.style.opacity = 1; el.style.transform = `translateX(${(1 - p) * 360}px)`; el.style.clipPath = `inset(0 0 0 ${(1 - p) * 100}%)`; }
    }
    function gout(g, t) {
      const el = g.el, p = g.out === 'none' ? 0 : eIn(seg(t, g.b, .3));
      el.style.opacity = (t < g.a || (g.out !== 'none' && t > g.b + .3)) ? 0 : (1 - p);
      let tr = '';
      if (g.out === 'up') tr = `translateY(${-220 * p}px)`;
      if (g.out === 'zoom') { tr = `scale(${1 + 0.4 * p})`; el.style.filter = `blur(${p * 10}px)`; }
      if (g.out === 'left') tr = `translateX(${-520 * p}px)`;
      el.style.transform = tr;
    }
    const wipe = (el, t, s) => { const x = eOut(seg(t, s, .3)) * 120; el.style.clipPath = `polygon(0 0, ${x}% 0, ${x - 20}% 100%, 0 100%)`; };

    function render(t) {
      layout();
      wipe(E.w1, t, 7.80); wipe(E.w2, t, 11.70); wipe(E.w3, t, 17.12);
      streaks.forEach(s => { const W = SW + s.len * 2, x = W - ((t * s.sp + s.off) % W) - s.len;
        s.d.style.left = x + 'px'; s.d.style.top = (40 + s.y * (SH - 80)) + 'px'; s.d.style.width = s.len + 'px';
        s.d.style.display = (s.first ? t < 8.0 : (t >= 11.9 && t < 17.3)) ? 'block' : 'none'; });
      G.forEach(g => { gout(g, t); g.lines.forEach(([el, s, type]) => anim(el, t, s, type)); });
      anim(E.sa, t, 5.97, 'pop'); anim(E.sb, t, 6.92, 'pop');
      const rp = eOut(seg(t, 6.20, .72)); E.track.style.transform = `scaleX(${rp})`; E.track.style.backgroundPosition = `${-t * 120}px 0`;
      E.car.style.opacity = t < 6.2 ? 0 : 1; E.car.style.left = (rp * 490) + 'px'; E.car.style.transform = `translateY(${Math.sin(t * 28) * 2}px)`;
      L6.forEach((s, i) => { const p = eOut(seg(t, 8.05 + i * .045, .28)); s.style.opacity = p; s.style.transform = `translateY(${(1 - p) * 110}px)`; });
      E.tagt.textContent = TAG.slice(0, Math.round(seg(t, 9.42, .75) * TAG.length)) || ' ';
      E.ul.style.transform = `scaleX(${eOut(seg(t, 9.42, .9))})`;
      E.chk.style.transform = `scaleX(${eOut(seg(t, 13.24, .5))})`; E.chk.style.backgroundPosition = `${-t * 160}px 0`;
      anim(E.icon, t, 17.39, 'pop');
      L13.forEach((s, i) => { const p = eOut(seg(t, 17.64 + i * .035, .26)); s.style.opacity = p; s.style.transform = `translateY(${(1 - p) * 90}px)`; });
      anim(E.pill, t, 18.34, 'pop'); E.iconI.style.backgroundPosition = `${-t * 90}px 0`;
      E.fo.style.opacity = seg(t, 19.7, .6);
      let sx = 0, sy = 0; SLAMS.forEach(s => { const d = t - s; if (d >= .12 && d < .6) { const k = Math.exp(-(d - .12) * 9) * 14; sx += Math.sin(d * 90) * k; sy += Math.cos(d * 70) * k * .6; } });
      stage.style.transform = `translate(${offX + sx * scale}px,${offY + sy * scale}px) scale(${scale})`;
      badge.textContent = 'HIRDETÉS · ' + Math.max(0, Math.ceil(20 - t));
    }

    // óra: ha szól a hang, a zene vezeti; különben saját óra
    let aud = null, useAud = false, t0 = performance.now(), done = false, raf = 0;
    if (opt.sound) {
      try { aud = AUD || new Audio(AUDIO); aud.muted = false; try { aud.currentTime = 0; } catch (e) {} aud.volume = 0.9; const p = aud.play(); useAud = true; if (p && p.catch) p.catch(() => { useAud = false; t0 = performance.now(); }); } catch (e) { aud = null; }
    }
    const now = () => (useAud && aud && !aud.paused && aud.currentTime > 0) ? aud.currentTime : (performance.now() - t0) / 1000;
    let last = 0;
    function finish() {
      if (done) return; done = true; cancelAnimationFrame(raf);
      root.style.opacity = '0';
      setTimeout(() => {
        try { if (aud) { aud.pause(); if (aud === AUD) aud.currentTime = 0; else aud.src = ''; } } catch (e) {}   // a feloldott lejátszó a következő hirdetésre megmarad
        window.removeEventListener('keydown', keyBlock, true);
        root.remove();
        try { opt.onEnd && opt.onEnd(); } catch (e) {}
      }, 380);
    }
    function loop() {
      let t = now();
      if (t < last) t = last; // a zene akadása ne ugráltassa vissza
      if (useAud && aud && aud.paused && t > 0.2) { t0 = performance.now() - t * 1000; useAud = false; }
      last = t;
      if (t >= DUR) { render(DUR); finish(); return; }
      render(t); raf = requestAnimationFrame(loop);
    }
    render(0);
    requestAnimationFrame(() => { root.style.opacity = '1'; });
    raf = requestAnimationFrame(loop);
    return { finish };
  }
  window.FutapestReklam = { DUR, play };
})();
