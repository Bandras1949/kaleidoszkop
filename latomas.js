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

// LÁTOMÁSOK – közös keret: nyitókép, HU/EN, ajánló (Kaleidoszkóp, Mandala, mindkettő), kör végi sáv, zárókép, szigorú hangkezelés. © Bánky András
(function () {
  const G = 'https://bandras1949.github.io/', K = G + 'kaleidoszkop/', M = G + 'mandala/', A = G + 'appok/';
  const S = {
    hu: { tap: 'Koppints az indításhoz', load: 'Betöltés…', fekvo: 'Fordítsd el a telefont – fekve a legszebb.', on: 'Hang be', off: 'Hang ki · koppintás: vissza',
      cont: 'Koppints a folytatáshoz', again: 'Koppints az újrakezdéshez', head: 'Bánky András alkalmazásai',
      k: 'KALEIDOSZKÓP', kk: 'ingyen kipróbálható', m: 'MANDALA', mm: 'próbaváltozat', b: 'Mindkettő együtt, kedvezménnyel →',
      ban: 'Tetszik? Próbáld ki a Kaleidoszkópot és a Mandalát is →', gift: 'Ajándék a LÁTOMÁSOK sorozatból' },
    en: { tap: 'Tap to start', load: 'Loading…', fekvo: 'Turn your phone sideways – it looks best in landscape.', on: 'Sound on', off: 'Sound off · tap to restore',
      cont: 'Tap to continue', again: 'Tap to watch again', head: 'Apps by András Bánky',
      k: 'KALEIDOSCOPE', kk: 'free to try', m: 'MANDALA', mm: 'trial version', b: 'Both together, discounted →',
      ban: 'Enjoying this? Try the Kaleidoscope and the Mandala too →', gift: 'A gift from the VISIONS series' }
  };
  const pickLang = () => {
    const q = new URLSearchParams(location.search).get('lang'); if (q === 'hu' || q === 'en') return q;
    let l = null; try { l = localStorage.getItem('appok-nyelv'); } catch (e) {}
    return l === 'hu' || l === 'en' ? l : ((navigator.language || 'hu').toLowerCase().startsWith('hu') ? 'hu' : 'en');
  };

  window.Latomas = function (p) {
    let lang = pickLang(), started = false, on = false, ended = false, paused = false;
    const bg = p.bg || '#0B0B0C', fg = p.fg || '#F4ECDC', gold = p.gold || '#E0C25A';
    const css = `
    .lt-spl{position:fixed;inset:0;z-index:50;background:${bg};color:${fg};display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;padding:calc(env(safe-area-inset-top) + 3vh) 6vw calc(env(safe-area-inset-bottom) + 2vh);box-sizing:border-box;text-align:center;cursor:pointer;transition:opacity 2.2s ease;-webkit-user-select:none;user-select:none}
    .lt-spl h1{margin:0;font:600 clamp(38px,min(10vw,15vh),130px) Cinzel,Georgia,serif;letter-spacing:.12em;padding-left:.12em;line-height:1.05}
    .lt-sub{margin-top:.5em;font:italic clamp(17px,min(2.6vw,4vh),30px) 'Cormorant Garamond',Georgia,serif;opacity:.85}
    .lt-gift{margin-top:.4em;font:clamp(13px,min(1.6vw,2.6vh),17px) 'Cormorant Garamond',Georgia,serif;letter-spacing:.18em;text-transform:uppercase;opacity:.6}
    .lt-ind{font:italic clamp(21px,min(3vw,5vh),40px) 'Cormorant Garamond',Georgia,serif}
    .lt-fek{margin-top:.4em;font:italic clamp(15px,min(2vw,3.2vh),24px)/1.3 'Cormorant Garamond',Georgia,serif;opacity:.75;display:none}
    @media (orientation:portrait) and (max-width:820px){.lt-fek.kell{display:block}}
    .lt-aj{display:flex;flex-direction:column;align-items:center;gap:8px;cursor:default}
    .lt-aj .h{font:600 clamp(12px,min(1.5vw,2.4vh),15px) 'Cormorant Garamond',Georgia,serif;letter-spacing:.22em;text-transform:uppercase;opacity:.7}
    .lt-aj .s{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
    .lt-aj a{display:inline-flex;align-items:baseline;gap:7px;padding:7px 14px;border-radius:20px;border:1px solid ${gold};background:rgba(0,0,0,.28);color:${gold};text-decoration:none;font:600 clamp(14px,min(1.7vw,2.8vh),17px) 'Cormorant Garamond',Georgia,serif;letter-spacing:.06em}
    .lt-aj a i{font-weight:500;opacity:.8;letter-spacing:0}
    .lt-aj a.b{background:${gold};color:#141210;font-style:italic;letter-spacing:.02em}
    .lt-nev{font:clamp(16px,min(2.2vw,3.4vh),34px) 'Cormorant Garamond',Georgia,serif}
    .lt-ny{position:fixed;left:calc(env(safe-area-inset-left) + 14px);top:calc(env(safe-area-inset-top) + 14px);z-index:51;display:flex;gap:6px}
    .lt-ny button{background:transparent;border:1px solid ${fg}66;color:${fg};border-radius:8px;padding:6px 12px;font:600 13px Cinzel,Georgia,serif;cursor:pointer;opacity:.8}
    .lt-ny button.on{background:${fg};color:${bg};opacity:1}
    .lt-pill{position:fixed;right:calc(env(safe-area-inset-right) + 14px);top:calc(env(safe-area-inset-top) + 14px);z-index:40;padding:10px 18px;border-radius:24px;background:rgba(0,0,0,.45);border:1px solid rgba(244,236,220,.45);color:#F4ECDC;font:italic 18px 'Cormorant Garamond',Georgia,serif;transition:opacity .8s;opacity:0;pointer-events:none;white-space:nowrap}
    .lt-ban{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom) + 15vh);transform:translateX(-50%);z-index:45;width:max-content;max-width:calc(100vw - 32px);box-sizing:border-box;padding:10px 20px;border-radius:24px;background:rgba(15,15,15,.72);border:1px solid ${gold};color:#FBFAF7;font:italic 500 clamp(16px,2vw,20px)/1.3 'Cormorant Garamond',Georgia,serif;text-align:center;text-decoration:none;opacity:0;pointer-events:none;transition:opacity 1.6s ease}
    .lt-ban.on{opacity:1;pointer-events:auto}`;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const mk = h => { const d = document.createElement('div'); d.innerHTML = h.trim(); return document.body.appendChild(d.firstChild); };
    const spl = mk(`<div class="lt-spl"><div><h1></h1><div class="lt-sub"></div><div class="lt-gift"></div></div><div><div class="lt-ind"></div><div class="lt-fek${p.fekvo ? ' kell' : ''}"></div></div>
      <div class="lt-aj"><div class="h"></div><div class="s"><a class="k" href="${K}" target="_blank" rel="noopener"></a><a class="m" href="${M}" target="_blank" rel="noopener"></a></div><a class="b" href="${A}" target="_blank" rel="noopener"></a></div>
      <div class="lt-nev">© Bánky András</div></div>`);
    const ny = mk(`<div class="lt-ny"><button data-l="hu">HU</button><button data-l="en">EN</button></div>`);
    const pill = mk(`<div class="lt-pill"></div>`);
    const ban = mk(`<a class="lt-ban" href="${A}" target="_blank" rel="noopener"></a>`);
    const q = s => spl.querySelector(s);
    const ready = () => !p.ready || p.ready();
    const indText = () => { const t = S[lang]; return !ready() ? t.load : ended ? t.again : paused ? t.cont : t.tap; };
    const texts = () => {
      const t = S[lang]; document.documentElement.lang = lang; document.title = p.title[lang] + ' – ' + (lang === 'hu' ? 'Látomások' : 'Visions') + ' · © Bánky András';
      q('h1').textContent = p.title[lang]; q('.lt-sub').textContent = p.sub[lang]; q('.lt-gift').textContent = t.gift; q('.lt-ind').textContent = indText(); q('.lt-fek').textContent = t.fekvo;
      q('.lt-aj .h').textContent = t.head; q('a.k').innerHTML = `${t.k} <i>· ${t.kk}</i>`; q('a.m').innerHTML = `${t.m} <i>· ${t.mm}</i>`; q('a.b').textContent = t.b;
      ban.textContent = t.ban; ny.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
      if (p.lang) p.lang(lang);
    };
    texts();
    const iv = setInterval(() => { if (spl.style.display !== 'none') q('.lt-ind').textContent = indText(); }, 300);
    ny.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { lang = b.dataset.l; try { localStorage.setItem('appok-nyelv', lang); } catch (e) {} texts(); }));
    const stop = e => e.stopPropagation();
    [ny, ban, q('.lt-aj')].forEach(n => ['pointerdown', 'pointerup', 'click'].forEach(ev => n.addEventListener(ev, stop)));

    const msg = t => { pill.textContent = t; pill.style.opacity = '1'; clearTimeout(msg.t); msg.t = setTimeout(() => pill.style.opacity = '0', 2500); };
    const showSpl = () => { spl.style.display = 'flex'; spl.style.pointerEvents = 'auto'; ny.style.display = 'flex'; requestAnimationFrame(() => spl.style.opacity = '1'); };
    const hideSpl = () => { spl.style.opacity = '0'; spl.style.pointerEvents = 'none'; ny.style.display = 'none'; setTimeout(() => { if (spl.style.opacity === '0') spl.style.display = 'none'; }, 2300); };
    const silence = () => { if (on) { on = false; p.sound(false); } };

    const tap = () => {
      if (!ready()) return;
      if (!started || ended) { const re = ended; started = true; ended = false; paused = false; on = true; hideSpl(); if (re && p.restart) p.restart(); else p.start(lang); return; }
      if (paused) { paused = false; on = true; hideSpl(); p.resume ? p.resume() : p.sound(true); return; }
      on = !on; p.sound(on); msg(on ? S[lang].on : S[lang].off);
    };
    spl.addEventListener('pointerup', e => { e.stopPropagation(); tap(); });
    window.addEventListener('pointerup', tap);

    // szigorú hang: háttérbe kerülve elhallgat, visszatérve csak koppintásra szól; egyszerre csak egy lapunk szól
    document.addEventListener('visibilitychange', () => {
      if (!started || ended) return;
      if (document.hidden) { on = false; p.hide(); if (p.pauseOnHide) paused = true; }
      else { if (p.show) p.show(); if (paused) { showSpl(); } else msg(S[lang].off); }
    });
    let bc = null; try { bc = new BroadcastChannel('banky-hang'); bc.onmessage = () => silence(); } catch (e) {}
    window.addEventListener('pointerup', () => { try { bc && bc.postMessage(1); } catch (e) {} }, true);
    document.addEventListener('click', e => {   // linkek új lapon (ha nem lehet, ugyanitt); a Látomás elhallgat
      const a = e.target.closest('a[target="_blank"]'); if (!a) return; e.preventDefault(); silence();
      window.BankyUt.open(a.href);
    }, true);
    window.addEventListener('pageshow', e => { if (e.persisted) location.reload(); });
    const vb = window.BankyUt.back(); if (vb) ny.style.left = 'calc(env(safe-area-inset-left) + 66px)';   // a ‹ mellé csúszik a HU/EN

    return {
      get lang() { return lang; }, get on() { return on; }, msg,
      cycle() { if (!started || ended || spl.style.display !== 'none') return; ban.classList.add('on'); clearTimeout(ban.t); ban.t = setTimeout(() => ban.classList.remove('on'), 10000); },
      end() { if (ended) return; ended = true; on = false; ban.classList.remove('on'); texts(); showSpl(); }
    };
  };
})();
