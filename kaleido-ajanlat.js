// Kaleidoszkóp – licenckulcs, ajánlat és MANDALA-ízelítő (a React-felülettől független réteg). © Bánky András
(function () {
  if (window.KAjanlat) return;
  // nyelv: közös a Mandalával, a Látomásokkal és az ajánlóoldallal (appok-nyelv); a K oldala már a fejlécben kiszámolja (window.__kLang)
  const LANG = window.__kLang || (() => { try { const l = localStorage.getItem('appok-nyelv'); if (l === 'hu' || l === 'en') return l; } catch (e) {} return (navigator.language || 'hu').toLowerCase().startsWith('hu') ? 'hu' : 'en'; })();
  const HU = LANG === 'hu';
  const T = HU ? {
    splash: 'Teljes változat · Mindkettő együtt kedvezménnyel', banner: 'Tetszik? A teljes változat havonta új mintákat hoz →',
    free: 'Ez az ingyenes változat. A teljes változat minden beállítást megnyit, hirdetés nélkül, havonta új mintákkal.',
    key: 'Licenckulcs', open: 'Megnyitás', buy: 'Előfizetés', bad: 'Ez a kulcs nem érvényes.', full: 'Teljes változat', other: 'Másik kulcs megadása',
    mandala: 'Ízelítő: MANDALA →', close: 'Bezár', zene: 'Koppints: zene be ♪' } : {
    splash: 'Full version · Both apps together, discounted', banner: 'Like it? The full version brings new patterns every month →',
    free: 'This is the free version. The full version unlocks every setting, ad-free, with new patterns every month.',
    key: 'License key', open: 'Unlock', buy: 'Subscribe', bad: 'This key is not valid.', full: 'Full version', other: 'Enter another key',
    mandala: 'A taste of MANDALA →', close: 'Close', zene: 'Tap for music ♪' };
  const G = 'https://bandras1949.github.io/', BUY = G + 'appok/', MANDALA = G + 'mandala/';   // közvetlenül a Mandala próbaváltozatába
  const ok = k => /^BANKY-TESZT(-\w+)?$/i.test((k || '').trim());   // próbaüzem: a fizetési szolgáltató bekötéséig
  const get = () => { try { return localStorage.getItem('kaleido-kulcs'); } catch (e) { return null; } };
  const premium = ok(get());
  const css = `
  .ka-btn{position:fixed;left:calc(env(safe-area-inset-left) + 14px);bottom:calc(env(safe-area-inset-bottom) + 14px);display:flex;gap:8px;z-index:2147483000;opacity:0;pointer-events:none;transition:opacity .8s}
  .ka-btn.on{opacity:.6;pointer-events:auto}
  .ka-btn.on:hover,.ka-btn.on.hot{opacity:1}
  .ka-btn a,.ka-btn button{height:40px;padding:0 14px;border-radius:20px;border:1px solid rgba(224,194,90,.6);background:rgba(15,15,15,.6);color:#E0C25A;font:600 14px 'Cormorant Garamond',Georgia,serif;letter-spacing:.06em;display:flex;align-items:center;text-decoration:none;cursor:pointer}
  .ka-pan{position:fixed;left:calc(env(safe-area-inset-left) + 12px);bottom:calc(env(safe-area-inset-bottom) + 64px);width:min(330px,calc(100vw - 24px));box-sizing:border-box;padding:16px;border-radius:16px;background:rgba(15,15,15,.88);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1px solid rgba(224,194,90,.4);color:#FBFAF7;font:500 16px/1.4 'Cormorant Garamond',Georgia,serif;z-index:2147483001;display:none}
  .ka-pan.on{display:block}
  .ka-pan h3{margin:0 0 8px;font:600 14px 'Cormorant Garamond',Georgia,serif;letter-spacing:.2em;color:#E0C25A}
  .ka-pan input{width:100%;box-sizing:border-box;margin:10px 0 4px;padding:8px 10px;border-radius:8px;border:1px solid rgba(224,194,90,.45);background:rgba(0,0,0,.4);color:#FBFAF7;font:500 16px 'Cormorant Garamond',Georgia,serif}
  .ka-pan .hb{color:#E8A0A0;font-style:italic;min-height:1.2em;font-size:15px}
  .ka-pan .gs{display:flex;gap:8px;margin-top:4px}
  .ka-pan .gs a,.ka-pan .gs button{flex:1;text-align:center;padding:8px;border-radius:9px;border:1px solid #E0C25A;background:transparent;color:#E0C25A;font:600 15px 'Cormorant Garamond',Georgia,serif;text-decoration:none;cursor:pointer}
  .ka-pan .gs .fo{background:#E0C25A;color:#0f0f0f}
  .ka-pan .al{margin-top:12px;padding-top:10px;border-top:1px solid rgba(224,194,90,.25);text-align:center;font-size:15px}
  .ka-pan .al a{color:#E0C25A}
  .ka-spl{position:fixed;left:8vw;right:8vw;bottom:calc(env(safe-area-inset-bottom) + 14px);text-align:center;font:italic 500 clamp(15px,2vw,20px) 'Cormorant Garamond',Georgia,serif;color:#E0C25A;text-decoration:underline;text-underline-offset:4px;z-index:2147483000;display:none}
  .ka-ban{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom) + 70px);transform:translateX(-50%);max-width:calc(100vw - 220px);min-width:min(260px,calc(100vw - 40px));padding:10px 18px;border-radius:24px;background:rgba(15,15,15,.72);border:1px solid #E0C25A;color:#FBFAF7;font:italic 500 clamp(16px,2vw,20px)/1.3 'Cormorant Garamond',Georgia,serif;text-align:center;text-decoration:none;opacity:0;pointer-events:none;transition:opacity 1.6s ease;z-index:2147483000}
  .ka-ban.on{opacity:1;pointer-events:auto}
  .ka-zn{position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 16px);transform:translateX(-50%);padding:6px 14px;border-radius:16px;background:rgba(15,15,15,.6);color:#FBFAF7;font:italic 500 15px 'Cormorant Garamond',Georgia,serif;white-space:nowrap;pointer-events:none;z-index:2147483000;opacity:0;transition:opacity .8s}
  .ka-zn.on{opacity:.85}
  .ka-ver{position:fixed;right:calc(env(safe-area-inset-right) + 14px);top:calc(env(safe-area-inset-top) + 20px);z-index:2147483000;display:none;font:12px system-ui,sans-serif;color:rgba(251,250,247,.5);pointer-events:none}
  .ka-ny{position:fixed;left:calc(env(safe-area-inset-left) + 14px);top:calc(env(safe-area-inset-top) + 14px);z-index:2147483000;display:none;gap:6px}
  .ka-ny button{background:transparent;border:1px solid rgba(224,194,90,.4);color:#E0C25A;border-radius:8px;padding:6px 12px;font:600 13px Cinzel,Georgia,serif;cursor:pointer;opacity:.8}
  .ka-ny button.on{background:#E0C25A;color:#0f0f0f;opacity:1}
  .ka-gear{position:fixed;top:calc(env(safe-area-inset-top) + 14px);right:calc(env(safe-area-inset-right) + 14px);width:44px;height:44px;border-radius:22px;display:none;align-items:center;justify-content:center;background:rgba(15,15,15,.55);box-shadow:inset 0 0 0 1px rgba(251,250,247,.35);cursor:pointer;z-index:2147483000;opacity:.6}
  .ka-gear img{width:24px;height:24px}
  .ka-gear b{position:absolute;right:-3px;bottom:-3px;width:18px;height:18px;border-radius:9px;background:#E0C25A;display:flex;align-items:center;justify-content:center;font-size:10px;line-height:1}
  .ka-gear.pul{animation:kaPul 1.6s ease-out 3}
  @keyframes kaPul{0%{box-shadow:inset 0 0 0 1px rgba(251,250,247,.35),0 0 0 0 rgba(224,194,90,.8)}100%{box-shadow:inset 0 0 0 1px rgba(251,250,247,.35),0 0 0 14px rgba(224,194,90,0)}}
  .ka-tur{position:fixed;left:0;right:0;bottom:0;z-index:2147483001;display:none;padding:18px 22px calc(22px + env(safe-area-inset-bottom));box-sizing:border-box;background:rgba(18,17,15,.92);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border-radius:22px 22px 0 0;color:#FBFAF7;font:500 17px 'Cormorant Garamond',Georgia,serif;box-shadow:0 -10px 30px rgba(0,0,0,.4)}
  .ka-tur.on{display:block}
  .ka-tur h3{margin:0 26px 4px 0;font:600 12px/1.4 Cinzel,Georgia,serif;letter-spacing:.1em;color:#E0C25A}
  .ka-tur .ti{font:600 22px 'Cormorant Garamond',Georgia,serif;margin:2px 0 6px}
  .ka-tur .tx{min-height:2.6em;font-style:italic;color:rgba(251,250,247,.85)}
  .ka-tur .vz{height:46px;margin:10px 0 6px;display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap}
  .ka-tur .ch{padding:4px 9px;border-radius:12px;border:1px solid rgba(224,194,90,.45);font:600 11px Cinzel,Georgia,serif;letter-spacing:.08em;color:#E0C25A;transition:all .4s}
  .ka-tur .ch.on{background:#E0C25A;color:#0f0f0f}
  .ka-tur .sw{width:26px;height:26px;border-radius:13px;transition:background 1s}
  .ka-tur .sl{position:relative;width:78%;height:4px;border-radius:2px;background:rgba(251,250,247,.25)}
  .ka-tur .sl i{position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:#E0C25A}
  .ka-tur .sl u{position:absolute;top:50%;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:11px;background:#FBFAF7;box-shadow:0 1px 6px rgba(0,0,0,.5)}
  .ka-tur .eq{width:7px;border-radius:2px;background:#E0C25A;transition:height .18s}
  .ka-tur .pt{display:flex;justify-content:center;gap:7px;margin:8px 0 12px}
  .ka-tur .pt i{width:7px;height:7px;border-radius:4px;background:rgba(224,194,90,.3)}
  .ka-tur .pt i.on{background:#E0C25A}
  .ka-tur .gs{display:flex;gap:8px}
  .ka-tur .gs a,.ka-tur .gs button{flex:1;text-align:center;padding:9px 6px;border-radius:10px;border:1px solid #E0C25A;background:transparent;color:#E0C25A;font:600 15px 'Cormorant Garamond',Georgia,serif;text-decoration:none;cursor:pointer}
  .ka-tur .gs .fo{background:#E0C25A;color:#0f0f0f}
  .ka-tur .x{position:absolute;right:14px;top:10px;background:none;border:0;color:rgba(251,250,247,.6);font-size:22px;cursor:pointer}`;
  // a felület állandó feliratai [angol, magyar] – a sablon angolul van, magyar nyelven ezeket cseréljük
  const UI = [['KALEIDOSCOPE', 'KALEIDOSZKÓP'], ['Tap to begin ♪', 'Koppints az indításhoz ♪'], ['© 2026 Andras Banky', '© 2026 Bánky András'], ['Try me!', 'Próbálj ki!'], ['Beállítások', 'Beállítások'], ['Kész', 'Kész']];
  const EN = { 'Beállítások': 'Settings', 'Kész': 'Done', '© 2026 Andras Banky': '© 2026 András Bánky' };
  function relabel() {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const v = n.nodeValue; if (!v || v.length > 40) continue;
      for (const [en, hu] of UI) { const want = HU ? hu : (EN[en] || en); if ((v === en || v === hu || v === EN[en]) && v !== want) { n.nodeValue = want; break; } }
    }
    const tt = HU ? 'Kaleidoszkóp – Brillidea' : 'Kaleidoscope – Brillidea'; if (document.title !== tt && /Brillidea/.test(document.title)) document.title = tt;
    document.documentElement.lang = LANG;
  }
  function build() {
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const el = (h) => { const d = document.createElement('div'); d.innerHTML = h.trim(); const n = d.firstChild; document.body.appendChild(n); return n; };
    const btn = el(`<div class="ka-btn">${premium ? '' : `<button type="button" class="ka-k">🔑 ${HU ? 'Kaleidoszkóp' : 'Kaleidoscope'}</button>`}<a href="${MANDALA}" target="_blank" rel="noopener">MANDALA</a></div>`);
    const pan = el(`<div class="ka-pan"><h3>${HU ? 'KALEIDOSZKÓP' : 'KALEIDOSCOPE'}</h3>` + (premium
      ? `<div>${T.full} · <a href="#" class="ka-del" style="color:#E0C25A">${T.other}</a></div>`
      : `<div>${T.free}</div><input class="ka-in" placeholder="${T.key}" autocomplete="off" spellcheck="false"><div class="hb"></div><div class="gs"><button type="button" class="fo ka-ok">${T.open}</button><a href="${BUY}" target="_blank" rel="noopener">${T.buy}</a></div>`)
      + `<div class="al"><a href="${MANDALA}" target="_blank" rel="noopener">${T.mandala}</a></div></div>`);
    const ny = el(`<div class="ka-ny"><button type="button" data-l="hu" class="${HU ? 'on' : ''}">HU</button><button type="button" data-l="en" class="${HU ? '' : 'on'}">EN</button></div>`);
    ny.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { if (b.dataset.l === LANG) return; try { localStorage.setItem('appok-nyelv', b.dataset.l); } catch (e) {} location.replace(location.pathname + '?r=' + Date.now()); }));
    const vr = el(`<div class="ka-ver">${window.__kVer || ''}</div>`);   // verziószám a nyitóképen, jobb felül
    const zn = el(`<div class="ka-zn">${T.zene}</div>`);   // visszatéréskor (és ha elhallgat) apró felirat: koppintásra szól
    let znS = null, znT = 0; const znShow = () => { znT = performance.now() + 6000; };
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') znShow(); });
    const spl = premium ? null : el(`<a class="ka-spl" href="${BUY}" target="_blank" rel="noopener">${T.splash}</a>`);
    const ban = premium ? null : el(`<a class="ka-ban" href="${BUY}" target="_blank" rel="noopener">${T.banner}</a>`);
    const show = () => { btn.classList.add('hot'); clearTimeout(show.t); show.t = setTimeout(() => btn.classList.remove('hot'), 3000); };
    const stop = e => e.stopPropagation();

    // ⚙ BEMUTATÓ (csak az ingyenes változatban): lakatos fogaskerék; koppintásra kártyák mutatják, mit lehet a teljes változatban állítani.
    // A sebesség-kártya alatt a háttérkép tényleg gyorsul-lassul (window.__kTourSeb) – így látszik, hogy a csúszka élőben hat.
    let gear = null, tur = null;
    if (!premium) {
      const K = HU ? [
        ['Te irányítasz', 'A teljes változatban több mint 50 beállítással alakíthatod a képet.', 'gear'],
        ['Üzemmódok', 'Válaszd ki az üzemmódot – vagy hagyd, hogy váltakozzanak.', 'mod'],
        ['Formák és tárgyak', '10 spirálforma, 31 tárgy, rengeteg minta – te döntöd el, mi forogjon.', 'form'],
        ['Színek', 'Színek, színharmóniák, hátterek – ahogy neked tetszik.', 'szin'],
        ['Sebesség', 'Húzd a csúszkát, és a kép azonnal követi. Nézd a hátteret!', 'seb'],
        ['Zene', 'Saját zenék – a kép a zene ütemére forog és lélegzik.', 'zene']
      ] : [
        ['You are in control', 'In the full version, 50+ settings let you shape every image.', 'gear'],
        ['Modes', 'Pick a mode – or let them alternate.', 'mod'],
        ['Shapes and objects', '10 spiral shapes, 31 objects, countless patterns – you decide what turns.', 'form'],
        ['Colours', 'Colours, harmonies, backgrounds – just the way you like.', 'szin'],
        ['Speed', 'Drag the slider and the image follows at once. Watch the background!', 'seb'],
        ['Music', 'Our own music – the image turns and breathes with the beat.', 'zene']
      ];
      const MOD = HU ? ['TÜKRÖS', 'ÖRVÉNYES', 'SPIRÁLOS', 'SZÖVET', 'VÁLTAKOZÓ'] : ['MIRROR', 'VORTEX', 'SPIRAL', 'WEAVE', 'ALTERNATING'];
      const FRM = HU ? ['szivárvány', 'szív', 'fánk', 'mérőszalag', 'holdak', 'tárgyak'] : ['rainbow', 'heart', 'torus', 'tape', 'moons', 'objects'];
      const SZN = ['#FF2A2A', '#FF8A00', '#FFE600', '#39FF14', '#00E5FF', '#2F6BFF', '#9B30FF', '#FF2BD6', '#a8ccf0', '#0f61b3', '#4799eb', '#0f3d6b'];
      gear = el(`<div class="ka-gear" title="${HU ? 'Beállítások – teljes változat' : 'Settings – full version'}"><img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23FBFAF7%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%226.6%22%2F%3E%3Cpath%20d%3D%22M12%202.4v2.8M12%2018.8v2.8M2.4%2012h2.8M18.8%2012h2.8M5.2%205.2l2%202M16.8%2016.8l2%202M5.2%2018.8l2-2M16.8%207.2l2-2%22%2F%3E%3C%2Fsvg%3E" alt=""><b><svg viewBox="0 0 24 24" width="11" height="11" fill="#0f0f0f"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="#0f0f0f" stroke-width="2.4"/></svg></b></div>`);
      tur = el(`<div class="ka-tur"><button type="button" class="x" aria-label="${T.close}">×</button><h3>${HU ? 'TELJES VÁLTOZAT: MINDEN MINTÁT TE IRÁNYÍTHATSZ' : 'FULL VERSION: YOU CAN CONTROL EVERY PATTERN'}</h3>
        <div class="ti"></div><div class="tx"></div><div class="vz"></div><div class="pt">${K.map(() => '<i></i>').join('')}</div>
        <div class="gs"><a class="fo" href="${BUY}" target="_blank" rel="noopener">${T.full} →</a><button type="button" class="ka-kk">🔑 ${T.key}</button></div></div>`);
      let ki = 0, kt = 0, anim = 0, t0 = 0;
      const vz = tur.querySelector('.vz');
      const kartya = i => {
        ki = (i + K.length) % K.length; t0 = performance.now(); const [ti, tx, v] = K[ki];
        tur.querySelector('.ti').textContent = ti; tur.querySelector('.tx').textContent = tx;
        tur.querySelectorAll('.pt i').forEach((d, j) => d.classList.toggle('on', j === ki));
        vz.innerHTML = v === 'mod' ? MOD.map(m => `<span class="ch">${m}</span>`).join('') : v === 'form' ? FRM.map(m => `<span class="ch">${m}</span>`).join('')
          : v === 'szin' ? Array.from({ length: 6 }, () => '<span class="sw"></span>').join('') : v === 'seb' ? '<div class="sl"><i></i><u></u></div>'
          : v === 'zene' ? Array.from({ length: 14 }, () => '<span class="eq"></span>').join('') : `<img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23FBFAF7%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%226.6%22%2F%3E%3Cpath%20d%3D%22M12%202.4v2.8M12%2018.8v2.8M2.4%2012h2.8M18.8%2012h2.8M5.2%205.2l2%202M16.8%2016.8l2%202M5.2%2018.8l2-2M16.8%207.2l2-2%22%2F%3E%3C%2Fsvg%3E" style="width:40px;height:40px;animation:kaFor 6s linear infinite">`;
        clearTimeout(kt); kt = setTimeout(() => kartya(ki + 1), v === 'seb' ? 7000 : 4200);
      };
      const st2 = document.createElement('style'); st2.textContent = '@keyframes kaFor{to{transform:rotate(360deg)}}'; document.head.appendChild(st2);
      const lep = now => {   // a kártyák kis animációi
        if (!tur.classList.contains('on')) { window.__kTourSeb = 1; anim = 0; return; }
        const s = (now - t0) / 1000, v = K[ki][2];
        if (v === 'mod' || v === 'form') { const c = vz.querySelectorAll('.ch'), n = Math.floor(s / 0.7) % c.length; c.forEach((e, j) => e.classList.toggle('on', j === n)); }
        if (v === 'szin') vz.querySelectorAll('.sw').forEach((e, j) => { const c = SZN[(j + Math.floor(s / 1.1) * 2) % SZN.length]; if (e._c !== c) { e.style.background = c; e._c = c; } });
        if (v === 'seb') { const q = 0.5 - 0.5 * Math.cos(s * 1.1), u = vz.querySelector('u'), i2 = vz.querySelector('i'); if (u) { u.style.left = (8 + q * 84) + '%'; i2.style.width = (8 + q * 84) + '%'; } window.__kTourSeb = 0.35 + q * 3.2; }
        else window.__kTourSeb = 1;
        if (v === 'zene') vz.querySelectorAll('.eq').forEach((e, j) => { e.style.height = (8 + 30 * Math.abs(Math.sin(s * (2.1 + j * 0.37) + j))) + 'px'; });
        anim = requestAnimationFrame(lep);
      };
      const nyit = () => { tur.classList.add('on'); pan.classList.remove('on'); kartya(0); if (!anim) anim = requestAnimationFrame(lep); try { localStorage.setItem('kaleido-tura', '1'); } catch (e) {} gear.classList.remove('pul'); };
      const zar = () => { tur.classList.remove('on'); clearTimeout(kt); window.__kTourSeb = 1; };
      gear.addEventListener('click', () => tur.classList.contains('on') ? zar() : nyit());
      tur.querySelector('.x').addEventListener('click', zar);
      tur.querySelector('.ka-kk').addEventListener('click', () => { zar(); pan.classList.add('on'); show(); });
      tur.addEventListener('click', e => { if (!e.target.closest('a,button')) { clearTimeout(kt); kartya(ki + 1); } });
      [gear, tur].forEach(n => ['pointerdown', 'pointerup', 'click'].forEach(ev => n.addEventListener(ev, e => e.stopPropagation())));
      try { if (!localStorage.getItem('kaleido-tura')) gear.classList.add('pul'); } catch (e) {}
    }
    [btn, pan, spl, ban, ny].forEach(n => n && ['pointerdown', 'pointerup', 'click'].forEach(ev => n.addEventListener(ev, stop)));
    const kb = btn.querySelector('.ka-k'); if (kb) kb.addEventListener('click', () => { pan.classList.toggle('on'); show(); });
    const okB = pan.querySelector('.ka-ok');
    if (okB) okB.addEventListener('click', () => { const v = pan.querySelector('.ka-in').value; if (ok(v)) { try { localStorage.setItem('kaleido-kulcs', v.trim()); } catch (e) {} location.replace(location.pathname + '?r=' + Date.now()); } else pan.querySelector('.hb').textContent = T.bad; });
    const del = pan.querySelector('.ka-del');
    if (del) del.addEventListener('click', e => { e.preventDefault(); try { localStorage.removeItem('kaleido-kulcs'); } catch (x) {} location.replace(location.pathname + '?r=' + Date.now()); });
    window.addEventListener('pointerup', () => { if (splashOn()) return; if (pan.classList.contains('on')) { pan.classList.remove('on'); } show(); });
    const splashOn = () => { const im = document.querySelector('img[src*="logo-nyitokep"]'); if (!im) return false; let n = im; while (n && n !== document.body) { if (n.style && n.style.opacity === '0') return false; n = n.parentElement; } return true; };
    relabel(); let rq = 0; new MutationObserver(() => { if (!rq) rq = requestAnimationFrame(() => { rq = 0; relabel(); }); }).observe(document.body, { childList: true, subtree: true, characterData: true });   // a felület újrarajzolásakor azonnal
    setInterval(() => {   // ha a környezet (pl. a fejlesztői vászon) újraépíti az oldalt, az elemek visszakerülnek
      if (!st.isConnected) document.head.appendChild(st);
      [btn, pan, spl, ban, ny].forEach(n => { if (n && !n.isConnected) document.body.appendChild(n); });
      ny.style.display = splashOn() ? 'flex' : 'none';
      if (!vr.isConnected) document.body.appendChild(vr); vr.style.display = splashOn() && window.__kVer ? 'block' : 'none';
      if (!zn.isConnected) document.body.appendChild(zn);
      const ks = window.__kSound; if (ks === false && znS !== false) znShow(); znS = ks;
      zn.classList.toggle('on', ks === false && performance.now() < znT && !splashOn() && !document.querySelector('.fpad'));
      const ad = !!document.querySelector('.fpad');   // hirdetés közben semmi nem látszik és nem kattintható
      [btn, pan, spl, ban].forEach(n => { if (n) n.style.visibility = ad ? 'hidden' : ''; }); if (ad) pan.classList.remove('on');
      if (gear) { if (!gear.isConnected) document.body.appendChild(gear); if (!tur.isConnected) document.body.appendChild(tur); gear.style.display = splashOn() || ad || document.querySelector('div[title="Beállítások"]') ? 'none' : 'flex';   /* ha a valódi ⚙ látszik (pl. ?beallitas), a lakatos nem kell */ if (ad && tur.classList.contains('on')) tur.classList.remove('on'); }
      const so = splashOn(); if (spl) spl.style.display = so ? 'block' : 'none'; const gearPanel = !!document.querySelector('div[style*="max-height:74%"],div[style*="max-height: 74%"]'); btn.classList.toggle('on', !so && !gearPanel && !(tur && tur.classList.contains('on'))); if (gearPanel) pan.classList.remove('on');   // a gombok a nyitókép után mindig látszanak
    }, 400);
    window.KAjanlat = { premium, cycle() { if (!ban || splashOn()) return; ban.classList.add('on'); clearTimeout(ban.t); ban.t = setTimeout(() => ban.classList.remove('on'), 10000); } };
    // linkek: új lapon; ha a környezet nem enged új lapot, ugyanitt; a fejlesztői vásznon a projekt saját példányai
    document.addEventListener('click', e => {
      const a = e.target.closest('a[target="_blank"]'); if (!a) return; e.preventDefault(); if (document.querySelector('.fpad')) return; let u = a.href;
      window.dispatchEvent(new CustomEvent('kaleido-solo', { detail: 'kulso-lap' }));   // új lap nyílik: a Kaleidoszkóp elhallgat
      let w = null; try { w = window.open(u, '_blank'); } catch (x) {} if (w) { try { w.opener = null; } catch (x) {} } else location.href = u;
    }, true);
  }
  try { const bc = new BroadcastChannel('banky-hang'); bc.onmessage = () => window.dispatchEvent(new CustomEvent('kaleido-solo', { detail: 'masik-lap' })); window.addEventListener('pointerup', () => { try { bc.postMessage(1); } catch (e) {} }, true); } catch (e) {}   // egyszerre csak egy lapunk szól
  window.KAjanlat = { premium, cycle() {} };
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
