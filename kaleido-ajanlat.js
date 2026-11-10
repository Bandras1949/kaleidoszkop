// Saját oldalaink között: kezdőképernyős appban ugyanabban az ablakban lépünk tovább (teljes képernyő marad), a ‹ gomb visszavisz; böngészőben új lapon nyílik.
window.BankyUt = window.BankyUt || (function () {
  const SA = navigator.standalone === true || matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches;
  const K = 'banky-ut', get = () => { try { return JSON.parse(sessionStorage.getItem(K) || '[]'); } catch (e) { return []; } }, put = s => { try { sessionStorage.setItem(K, JSON.stringify(s.slice(-12))); } catch (e) {} };
  if (!document.referrer) put([]);   // frissen indítva nincs visszaút
  const open = u => {
    if (SA) { const s = get(); s.push(location.href); put(s); location.href = u; return; }
    let w = null; try { w = window.open(u, '_blank'); } catch (x) {} if (w) { try { w.opener = null; } catch (x) {} } else location.href = u;
  };
  const back = () => {
    if (!SA || !get().length) return null;
    const ex = document.getElementById('banky-vissza'); if (ex) return ex;
    const b = document.createElement('button'); b.id = 'banky-vissza'; b.textContent = '‹'; b.setAttribute('aria-label', 'Vissza');
    b.style.cssText = 'position:fixed;left:calc(env(safe-area-inset-left) + 12px);top:calc(env(safe-area-inset-top) + 12px);z-index:9999;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:rgba(0,0,0,.45);color:#fff;font:32px/38px Georgia,serif;padding:0 0 6px;cursor:pointer;opacity:.8';
    ['pointerdown', 'pointerup'].forEach(ev => b.addEventListener(ev, e => e.stopPropagation()));
    b.addEventListener('click', e => { e.stopPropagation(); const s = get(), u = s.pop(); put(s); if (u) location.href = u; });
    document.body.appendChild(b); return b;
  };
  return { SA, open, back };
})();
(function () { let kb = null; const fix = () => { if (!kb || !document.body.contains(kb)) kb = window.BankyUt.back(); }; setInterval(fix, 400); })();   // ‹ vissza, ha másik lapunkról érkeztünk (a vászon újraépíti a DOM-ot)

// Kaleidoszkóp – licenckulcs, ajánlat és MANDALA-ízelítő (a React-felülettől független réteg). © Bánky András
(function () {
  if (window.KAjanlat) return;
  const HU = (navigator.language || 'hu').toLowerCase().startsWith('hu');
  const T = HU ? {
    splash: 'Teljes változat · Mindkettő együtt kedvezménnyel', banner: 'Tetszik? A teljes változat havonta új mintákat hoz →',
    free: 'Ez az ingyenes változat. A teljes változat minden beállítást megnyit, hirdetés nélkül, havonta új mintákkal.',
    key: 'Licenckulcs', open: 'Megnyitás', buy: 'Előfizetés', bad: 'Ez a kulcs nem érvényes.', full: 'Teljes változat', other: 'Másik kulcs megadása',
    mandala: 'Ízelítő: MANDALA →', close: 'Bezár' } : {
    splash: 'Full version · Both apps together, discounted', banner: 'Like it? The full version brings new patterns every month →',
    free: 'This is the free version. The full version unlocks every setting, ad-free, with new patterns every month.',
    key: 'Licence key', open: 'Unlock', buy: 'Subscribe', bad: 'This key is not valid.', full: 'Full version', other: 'Enter another key',
    mandala: 'A taste of MANDALA →', close: 'Close' };
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
  .ka-ban.on{opacity:1;pointer-events:auto}`;
  function build() {
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const el = (h) => { const d = document.createElement('div'); d.innerHTML = h.trim(); const n = d.firstChild; document.body.appendChild(n); return n; };
    const btn = el(`<div class="ka-btn">${premium ? '' : `<button type="button" class="ka-k">🔑 ${HU ? 'Kaleidoszkóp' : 'Kaleidoscope'}</button>`}<a href="${MANDALA}" target="_blank" rel="noopener">MANDALA</a></div>`);
    const pan = el(`<div class="ka-pan"><h3>${HU ? 'KALEIDOSZKÓP' : 'KALEIDOSCOPE'}</h3>` + (premium
      ? `<div>${T.full} · <a href="#" class="ka-del" style="color:#E0C25A">${T.other}</a></div>`
      : `<div>${T.free}</div><input class="ka-in" placeholder="${T.key}" autocomplete="off" spellcheck="false"><div class="hb"></div><div class="gs"><button type="button" class="fo ka-ok">${T.open}</button><a href="${BUY}" target="_blank" rel="noopener">${T.buy}</a></div>`)
      + `<div class="al"><a href="${MANDALA}" target="_blank" rel="noopener">${T.mandala}</a></div></div>`);
    const spl = premium ? null : el(`<a class="ka-spl" href="${BUY}" target="_blank" rel="noopener">${T.splash}</a>`);
    const ban = premium ? null : el(`<a class="ka-ban" href="${BUY}" target="_blank" rel="noopener">${T.banner}</a>`);
    const show = () => { btn.classList.add('hot'); clearTimeout(show.t); show.t = setTimeout(() => btn.classList.remove('hot'), 3000); };
    const stop = e => e.stopPropagation();
    [btn, pan, spl, ban].forEach(n => n && ['pointerdown', 'pointerup', 'click'].forEach(ev => n.addEventListener(ev, stop)));
    const kb = btn.querySelector('.ka-k'); if (kb) kb.addEventListener('click', () => { pan.classList.toggle('on'); show(); });
    const okB = pan.querySelector('.ka-ok');
    if (okB) okB.addEventListener('click', () => { const v = pan.querySelector('.ka-in').value; if (ok(v)) { try { localStorage.setItem('kaleido-kulcs', v.trim()); } catch (e) {} location.replace(location.pathname + '?r=' + Date.now()); } else pan.querySelector('.hb').textContent = T.bad; });
    const del = pan.querySelector('.ka-del');
    if (del) del.addEventListener('click', e => { e.preventDefault(); try { localStorage.removeItem('kaleido-kulcs'); } catch (x) {} location.replace(location.pathname + '?r=' + Date.now()); });
    window.addEventListener('pointerup', () => { if (splashOn()) return; if (pan.classList.contains('on')) { pan.classList.remove('on'); } show(); });
    const splashOn = () => { const im = document.querySelector('img[src*="logo-nyitokep"]'); if (!im) return false; let n = im; while (n && n !== document.body) { if (n.style && n.style.opacity === '0') return false; n = n.parentElement; } return true; };
    setInterval(() => {   // ha a környezet (pl. a fejlesztői vászon) újraépíti az oldalt, az elemek visszakerülnek
      if (!st.isConnected) document.head.appendChild(st);
      [btn, pan, spl, ban].forEach(n => { if (n && !n.isConnected) document.body.appendChild(n); });
      const ad = !!document.querySelector('.fpad');   // hirdetés közben semmi nem látszik és nem kattintható
      [btn, pan, spl, ban].forEach(n => { if (n) n.style.visibility = ad ? 'hidden' : ''; }); if (ad) pan.classList.remove('on');
      const so = splashOn(); if (spl) spl.style.display = so ? 'block' : 'none'; const gearPanel = !!document.querySelector('div[style*="max-height:74%"],div[style*="max-height: 74%"]'); btn.classList.toggle('on', !so && !gearPanel); if (gearPanel) pan.classList.remove('on');   // a gombok a nyitókép után mindig látszanak
    }, 400);
    window.KAjanlat = { premium, cycle() { if (!ban || splashOn()) return; ban.classList.add('on'); clearTimeout(ban.t); ban.t = setTimeout(() => ban.classList.remove('on'), 10000); } };
    // linkek: új lapon; ha a környezet nem enged új lapot, ugyanitt; a fejlesztői vásznon a projekt saját példányai
    document.addEventListener('click', e => {
      const a = e.target.closest('a[target="_blank"]'); if (!a) return; e.preventDefault(); if (document.querySelector('.fpad')) return; let u = a.href;
      window.dispatchEvent(new CustomEvent('kaleido-solo', { detail: 'kulso-lap' }));   // új lap nyílik: a Kaleidoszkóp elhallgat
      window.BankyUt.open(u);
    }, true);
  }
  try { const bc = new BroadcastChannel('banky-hang'); bc.onmessage = () => window.dispatchEvent(new CustomEvent('kaleido-solo', { detail: 'masik-lap' })); window.addEventListener('pointerup', () => { try { bc.postMessage(1); } catch (e) {} }, true); } catch (e) {}   // egyszerre csak egy lapunk szól
  window.KAjanlat = { premium, cycle() {} };
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
