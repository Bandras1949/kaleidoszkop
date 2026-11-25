// Kaleidoszkóp – licenckulcs, vásárlás (Creem a brillidea.hu-s közvetítőn át), ajánlat és MANDALA-ízelítő (a React-felülettől független réteg). © Bánky András
// 2026-11-25: valódi fizetés – vásárlás az appból, automatikus átvétel visszatéréskor, kézi kulcs, leválasztás, heti ellenőrzés
(function () {
  if (window.KAjanlat) return;
  // nyelv: közös a Mandalával, a Látomásokkal és az ajánlóoldallal (appok-nyelv); a K oldala már a fejlécben kiszámolja (window.__kLang)
  const LANG = window.__kLang || (() => { try { const l = localStorage.getItem('appok-nyelv'); if (l === 'hu' || l === 'en') return l; } catch (e) {} return (navigator.language || 'hu').toLowerCase().startsWith('hu') ? 'hu' : 'en'; })();
  const HU = LANG === 'hu';
  const T = HU ? {
    splash: 'Teljes változat · Mindkettő együtt kedvezménnyel', banner: 'Tetszik? Nézd meg a teljes változatot →',
    free: 'Ez az ingyenes változat. A teljes változatban minden beállítás a tiéd, és rendszeres időközönként új minták jelennek meg, külön díj nélkül.',
    key: 'Licenckulcs', full: 'Teljes változat', close: 'Bezár', zene: 'Koppints: zene be ♪', mandala: 'Ízelítő: MANDALA →',
    hamarosan: 'A teljes változat hamarosan megvásárolható.', vk: 'Kaleidoszkóp – 5 $', vcs: 'Mindkét app – 7 $', egysz: 'Egyszeri vásárlás, legfeljebb 3 eszközön. A „Mindkét app” a Mandalát is feloldja. A bankod forintban terheli, a kivonaton CREEM.IO néven jelenik meg.',
    mi: 'Mi van a teljes változatban?', van: '🔑 Már van kulcsod? Ide írd be →', akt: 'Aktiválás ezen a telefonon', masold: 'Másold be az e-mailből, vagy gépeld be a 25 karaktert – a kötőjeleket a mező magától beteszi. Figyelj: az O betű és a 0 szám könnyen összekeverhető.',
    akteszk: 'aktív eszközök', csomag: 'Kaleidoszkóp + Mandala csomag', masol: 'Kulcs másolása', masolva: 'Kimásolva ✓',
    lev: 'Kulcs leválasztása erről a telefonról', mIs: 'Mandala is? – 5 $ →', mFel: 'Mandala feloldása is →', levBiztos: 'Biztosan? Koppints újra', levMeg: 'Új telefonra: itt válaszd le, az újon másold be a kulcsot.',
    folyamat: 'Feloldás folyamatban…', koszi: 'Köszönjük a vásárlást!', feloldva: 'Feloldva ezen a telefonon.', email: 'A kulcsot e-mailben is elküldtük. Ha nem látod, nézd meg a spam mappát.', rendben: 'Rendben', ikon: 'Az ikonról indított app külön tárolja a feloldást. Ha onnan is használnád:', ikonL: ['Koppints a „Kulcs másolása” gombra.', 'Nyisd meg az appot az ikonról.', 'Koppints a 🔑 gombra → „Már van kulcsod?” → illeszd be a kulcsot → „Aktiválás”.'],
    leveve: 'A kulcsot leválasztottad erről a telefonról. Most egy másik eszközön aktiválhatod.', lezarva: 'A kulcs ezen a telefonon már nem aktív, ezért visszaállt az ingyenes változat.',
    atvHiba: 'A feloldás most nem sikerült. A kulcsot e-mailben is megkaptad (nézd meg a spam mappát is) – másold be ide:',
    u: { limit_elerve: 'Ez a kulcs már 3 eszközön aktív. Egy régi eszközön előbb válaszd le, vagy írj nekünk: info@brillidea.hu', ismeretlen_kulcs: 'Ilyen kulcs nincs. Másold be pontosan az e-mailből.',
      hibas_kulcs_formatum: 'A kulcs 25 karakterből áll (5 × 5). Nézd meg, hiányzik-e belőle valami.', masik_termek: 'Ez a kulcs nem a Kaleidoszkóphoz tartozik.', visszavont_vagy_lejart: 'Ezt a kulcsot visszavonták.',
      halozat: 'Nincs internetkapcsolat. Próbáld újra később.', tul_sok_keres: 'Túl sok próbálkozás. Várj néhány percet.', _: 'Valami nem sikerült. Írj nekünk: info@brillidea.hu' },
    tabla: { cim: 'Ingyenes vagy teljes?', fej: ['', 'Ingyenes', 'Teljes'], sor: [
      ['Üzemmódok', 'váltakozó bemutató', 'mind az 5, szabadon választva'], ['Beállítások', '–', 'több mint 50'], ['Formák és tárgyak', 'véletlenszerűen', '10 spirálforma, 31 tárgy – te választod'],
      ['Színek és sebesség', 'rögzített', 'te állítod'], ['Zene', '1 beépített dal', '10 dal közül választható, kikapcsolható'], ['Kép mentése, megosztása', '–', 'bármelyik minta, egy koppintással'], ['Új minták', '–', 'rendszeres időközönként, külön díj nélkül'], ['Ár', 'ingyenes', '5 $ egyszer · mindkét app: 7 $']] },
    vesz: 'Megveszem →', osszeh: 'Összehasonlítás' } : {
    splash: 'Full version · Both apps together, discounted', banner: 'Like it? See the full version →',
    free: 'This is the free version. The full version unlocks every setting, and new patterns arrive at regular intervals, at no extra cost.',
    key: 'License key', full: 'Full version', close: 'Close', zene: 'Tap for music ♪', mandala: 'A taste of MANDALA →',
    hamarosan: 'The full version will be available to buy soon.', vk: 'Kaleidoscope – $5', vcs: 'Both apps – $7', egysz: 'One-time purchase, up to 3 devices. "Both apps" also unlocks Mandala. Shown as CREEM.IO on your statement.',
    mi: 'What do I get in the full version?', van: '🔑 Already have a key? Enter it here →', akt: 'Activate on this device', masold: 'Paste it from the e-mail, or type the 25 characters – the dashes are added for you. Careful: the letter O and the number 0 are easy to mix up.',
    akteszk: 'active devices', csomag: 'Kaleidoscope + Mandala bundle', masol: 'Copy key', masolva: 'Copied ✓',
    lev: 'Release the key from this device', mIs: 'Mandala too? – $5 →', mFel: 'Unlock Mandala too →', levBiztos: 'Sure? Tap again', levMeg: 'New phone? Release it here, then paste the key on the new one.',
    folyamat: 'Unlocking…', koszi: 'Thank you for your purchase!', feloldva: 'Unlocked on this device.', email: 'We have also e-mailed you the key. If you can’t see it, check your spam folder.', rendben: 'OK', ikon: 'The app opened from its home-screen icon keeps its own unlock. To use it there too:', ikonL: ['Tap “Copy key”.', 'Open the app from its icon.', 'Tap 🔑 → “Already have a key?” → paste the key → “Activate”.'],
    leveve: 'The key has been released from this device. You can now activate it on another one.', lezarva: 'The key is no longer active on this device, so the free version is back.',
    atvHiba: 'Unlocking didn’t work this time. You have also received the key by e-mail (check spam too) – paste it here:',
    u: { limit_elerve: 'This key is already active on 3 devices. Release it on an old one first, or write to us: info@brillidea.hu', ismeretlen_kulcs: 'No such key. Paste it exactly from the e-mail.',
      hibas_kulcs_formatum: 'The key has 25 characters (5 × 5). Check whether something is missing.', masik_termek: 'This key does not belong to Kaleidoscope.', visszavont_vagy_lejart: 'This key has been revoked.',
      halozat: 'No internet connection. Please try again later.', tul_sok_keres: 'Too many attempts. Please wait a few minutes.', _: 'Something went wrong. Write to us: info@brillidea.hu' },
    tabla: { cim: 'Free or full?', fej: ['', 'Free', 'Full'], sor: [
      ['Modes', 'alternating demo', 'all 5, your choice'], ['Settings', '–', '50+'], ['Shapes and objects', 'at random', '10 spiral shapes, 31 objects – you choose'],
      ['Colours and speed', 'fixed', 'yours to set'], ['Music', '1 built-in track', 'choose from 10 tracks, can be switched off'], ['Save and share images', '–', 'any pattern, with one tap'], ['New patterns', '–', 'at regular intervals, at no extra cost'], ['Price', 'free', '$5 once · both apps: $7']] },
    vesz: 'Buy now →', osszeh: 'Compare' };
  const MANDALA = 'https://mandala.brillidea.hu/';   // közvetlenül a Mandala próbaváltozatába
  // ---- FIZETÉS: Creem, a brillidea.hu-s közvetítőn át (a Creem titkos kulcsa csak a közvetítőben van) ----
  const KOZV = 'https://www.brillidea.hu/wp-json/brillidea/v2/licenc', APP = 'kaleidoszkop', TAR = 'kaleido-licenc';
  const CREEM_MOD = 'teszt';   // élesítéskor: 'eles' – és az éles termékazonosítók ide
  const TERMEK = { teszt: { k: 'prod_13WlWpu637CYusW5EIF3e5', m: 'prod_1HZPeZI5XoCxWGPDj0fhPs', cs: 'prod_k5WHVYq5PA4yIJXaMQmZK' }, eles: { k: '', m: '', cs: '' } }[CREEM_MOD];
  const MANDALA_KULCSSAL = k => MANDALA + '#kulcs=' + encodeURIComponent(k);   // csomagkulcs átadása a Mandalának (a # utáni rész nem megy fel a szerverre)
  // TESZTMÓDBAN a vásárlásgombokat csak az látja, aki egyszer ?teszt-tel nyitotta meg az appot (a nyilvánosság „hamarosan”-t lát)
  const VESZ_LATHATO = CREEM_MOD !== 'teszt' || (() => { try { if (/[?&]teszt\b/.test(location.search)) localStorage.setItem('brl-teszt', '1'); return localStorage.getItem('brl-teszt') === '1'; } catch (e) { return false; } })();
  const VASAR = id => 'https://www.creem.io/' + (CREEM_MOD === 'teszt' ? 'test/' : '') + 'payment/' + id;
  const lget = () => { try { const L = JSON.parse(localStorage.getItem(TAR) || 'null'); return L && L.kulcs && L.peldany ? L : null; } catch (e) { return null; } };
  const lset = L => { try { localStorage.setItem(TAR, JSON.stringify(L)); } catch (e) {} };
  const ldel = () => { try { localStorage.removeItem(TAR); localStorage.removeItem('kaleido-kulcs'); } catch (e) {} };
  const sget = k => { try { const v = sessionStorage.getItem(k); sessionStorage.removeItem(k); return v; } catch (e) { return null; } };
  const sset = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} };
  const ESZKOZ = (() => { try { let e = localStorage.getItem('kaleido-eszkoz'); if (!e) { e = 'eszkoz-' + Math.random().toString(36).slice(2, 8); localStorage.setItem('kaleido-eszkoz', e); } return e; } catch (x) { return 'eszkoz'; } })();
  const hiv = async (muvelet, adat) => {
    try { const r = await fetch(KOZV, { method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ muvelet, app: APP, eszkoz: ESZKOZ }, adat)) });
      let j = null; try { j = await r.json(); } catch (e) {} return j || { ok: false, uzenet: 'halozat' }; } catch (e) { return { ok: false, uzenet: 'halozat' }; }
  };
  const hibaSz = j => T.u[j && j.uzenet] || T.u._;
  const ujra = () => location.replace(location.pathname + '?r=' + Date.now());
  const LIC = lget();
  const premium = !!LIC;
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
  .ka-pan .ka-meg{font-size:14px;color:rgba(251,250,247,.7);margin-top:8px;line-height:1.35}
  .ka-pan .ka-vesz{margin-top:12px}
  .ka-pan .ka-mi{margin-top:8px;font-size:15px}.ka-pan .ka-mi a{color:#E0C25A}
  .ka-pan details{margin-top:8px}
  .ka-pan summary{cursor:pointer;list-style:none;display:block;text-align:center;padding:9px 8px;border-radius:9px;border:1px solid #E0C25A;background:rgba(224,194,90,.1);color:#E0C25A;font:600 15px 'Cormorant Garamond',Georgia,serif}
  .ka-pan summary::-webkit-details-marker{display:none}
  .ka-pan details[open] summary{margin-bottom:4px}
  .ka-pan .ka-kulcs{margin:10px 0 6px;padding:8px;border-radius:8px;background:rgba(0,0,0,.4);font:600 14px/1.4 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.04em;word-break:break-all;user-select:all;-webkit-user-select:all;text-align:center}
  .ka-pan .ka-lev{border-color:#C98A8A !important;color:#E8A0A0 !important}
  .ka-pan .ka-ok2{color:#9BE0A8}
  .ka-kosz{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(340px,calc(100vw - 40px));box-sizing:border-box;padding:22px 20px 18px;border-radius:18px;background:rgba(15,15,15,.94);border:1px solid #E0C25A;color:#FBFAF7;font:500 17px/1.4 'Cormorant Garamond',Georgia,serif;text-align:center;z-index:2147483002;display:none;box-shadow:0 10px 40px rgba(0,0,0,.6)}
  .ka-kosz.on{display:block}
  .ka-kosz b{display:block;font:600 15px Cinzel,Georgia,serif;letter-spacing:.08em;color:#E0C25A;margin-bottom:8px}
  .ka-kosz p{margin:6px 0}
  .ka-kosz ol.kol{text-align:left;margin:8px 0 0;padding-left:22px;font-size:14px;line-height:1.35;color:rgba(251,250,247,.85)}.ka-kosz ol.kol li{margin:3px 0}.ka-kosz small{display:block;font-size:14px;color:rgba(251,250,247,.7);margin-top:8px}
  .ka-kosz button{margin-top:14px;padding:8px 26px;border-radius:10px;border:1px solid #E0C25A;background:#E0C25A;color:#0f0f0f;font:600 15px 'Cormorant Garamond',Georgia,serif;cursor:pointer}
  .ka-tur table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.25}
  .ka-tur th{font:600 11px Cinzel,Georgia,serif;letter-spacing:.08em;color:#E0C25A;text-align:left;padding:2px 4px 6px}
  .ka-tur td{padding:4px;border-top:1px solid rgba(224,194,90,.18);vertical-align:top}
  .ka-tur td:first-child{color:rgba(251,250,247,.65);font-style:italic}
  .ka-tur td:last-child{color:#E0C25A}
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
  const UI = [['KALEIDOSCOPE', 'KALEIDOSZKÓP'], ['Tap to begin ♪', 'Koppints az indításhoz ♪'], ['© 2026 Andras Banky', '© 2026 Bánky András'], ['Try me!', 'Próbálj ki!'], ['Beállítások', 'Beállítások'], ['Kész', 'Kész'], ['LOG', 'NAPLÓ'], ['No errors logged.', 'Nincs hiba feljegyezve.'], ['Clear log', 'Napló törlése'], ['Reset to defaults', 'Alapértékek visszaállítása'], ['Full version ✓ · Key', 'Teljes változat ✓ · Kulcs']];
  const EN = { 'Teljes változat ✓ · Kulcs': 'Full version ✓ · Key', 'Beállítások': 'Settings', 'Kész': 'Done', '© 2026 Andras Banky': '© 2026 András Bánky' };
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
    const btn = el(`<div class="ka-btn"><button type="button" class="ka-k">🔑 ${HU ? 'Kaleidoszkóp' : 'Kaleidoscope'}${premium ? ' ✓' : ''}</button><a href="${MANDALA}" target="_blank" rel="noopener">MANDALA</a></div>`);
    const csomagE = premium && LIC.termek && LIC.termek === TERMEK.cs;
    const pan = el(`<div class="ka-pan"><h3>${HU ? 'KALEIDOSZKÓP' : 'KALEIDOSCOPE'}</h3>` + (premium
      ? `<div class="ka-ok2">✓ ${T.full}${csomagE ? ' · ' + T.csomag : ` · ${T.akteszk}: <span class="ka-akt">${LIC.aktivalt != null && LIC.limit ? LIC.aktivalt + '/' + LIC.limit : '…'}</span>`}</div>
         ${csomagE ? `<div class="gs" style="margin-top:10px"><a class="fo" href="${MANDALA_KULCSSAL(LIC.kulcs)}" target="_blank" rel="noopener">${T.mFel}</a></div>` : LIC.termek === TERMEK.k ? `<div class="gs" style="margin-top:10px"><a class="fo" href="${VASAR(TERMEK.m)}">${T.mIs}</a></div>` : ''}
         <div class="ka-kulcs">${LIC.kulcs}</div><div class="gs"><button type="button" class="ka-masol">${T.masol}</button></div>
         <div class="gs" style="margin-top:8px"><button type="button" class="ka-lev">${T.lev}</button></div><div class="ka-meg">${T.levMeg}</div>
<div class="hb"></div>`
      : !VESZ_LATHATO ? `<div>${T.free}</div><div class="ka-meg" style="color:#E0C25A;font-size:16px">${T.hamarosan}</div><div class="ka-mi"><a href="#" class="ka-tura">${T.mi}</a></div><div class="hb"></div>`
      : `<div>${T.free}</div><div class="gs ka-vesz"><a class="fo" href="${VASAR(TERMEK.k)}">${T.vk}</a><a href="${VASAR(TERMEK.cs)}">${T.vcs}</a></div><details class="ka-van"><summary>${T.van}</summary><div class="ka-meg ka-atv" style="display:none"></div><input class="ka-in" placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" autocomplete="off" autocapitalize="characters" spellcheck="false"><div class="gs"><button type="button" class="fo ka-ok">${T.akt}</button></div><div class="ka-meg">${T.masold}</div></details><div class="ka-meg">${T.egysz}</div>
         <div class="ka-mi"><a href="#" class="ka-tura">${T.mi}</a></div><div class="hb"></div>`)
      + `<div class="al"><a href="${MANDALA}" target="_blank" rel="noopener">${T.mandala}</a></div></div>`);
    const kosz = el(`<div class="ka-kosz"><b></b><div class="kt"></div><div class="ki" style="display:none"><small>${T.ikon}</small><ol class="kol">${T.ikonL.map(x => `<li>${x}</li>`).join('')}</ol><button type="button" class="km" style="background:transparent;color:#E0C25A">${T.masol}</button></div><div class="kmf" style="display:none"><a class="kml" href="#" target="_blank" rel="noopener" style="display:inline-block;margin-top:12px;color:#E0C25A">${T.mFel}</a></div><button type="button" class="kr">${T.rendben}</button></div>`);
    // iPhone/iPad: a kezdőképernyőről indított app külön tárolót kap – ott a kulcsot be kell illeszteni
    const IOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const IKONROL = !!(navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches));
    const koszMutat = (cim, szoveg, kicsi, gomb, ikon) => { kosz.querySelector('b').textContent = cim || ''; kosz.querySelector('.kt').innerHTML = (szoveg ? `<p>${szoveg}</p>` : '') + (kicsi ? `<small>${kicsi}</small>` : ''); kosz.querySelector('.kr').style.display = gomb === false ? 'none' : ''; kosz.querySelector('.ki').style.display = ikon && IOS && !IKONROL ? '' : 'none';
      const L2 = lget(), cs2 = L2 && L2.termek === TERMEK.cs && gomb !== false; kosz.querySelector('.kmf').style.display = cs2 ? '' : 'none'; if (cs2) kosz.querySelector('.kml').href = MANDALA_KULCSSAL(L2.kulcs);   // csomag: a Mandala is egy koppintással
      kosz.classList.add('on'); };
    kosz.querySelector('.kr').addEventListener('click', () => kosz.classList.remove('on'));
    kosz.querySelector('.km').addEventListener('click', async e => { const b = e.currentTarget, L = lget(); if (!L) return; try { await navigator.clipboard.writeText(L.kulcs); b.textContent = T.masolva; } catch (x) { b.textContent = L.kulcs; } });
    const hb = msg => { const h = pan.querySelector('.hb'); if (h) h.textContent = msg || ''; };
    const ny = el(`<div class="ka-ny"><button type="button" data-l="hu" class="${HU ? 'on' : ''}">HU</button><button type="button" data-l="en" class="${HU ? '' : 'on'}">EN</button></div>`);
    ny.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { if (b.dataset.l === LANG) return; try { localStorage.setItem('appok-nyelv', b.dataset.l); } catch (e) {} location.replace(location.pathname + '?r=' + Date.now()); }));
    const vr = el(`<div class="ka-ver">${window.__kVer || ''}</div>`);   // verziószám a nyitóképen, jobb felül
    const zn = el(`<div class="ka-zn">${T.zene}</div>`);   // visszatéréskor (és ha elhallgat) apró felirat: koppintásra szól
    let znS = null, znT = 0; const znShow = () => { znT = performance.now() + 6000; };
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') znShow(); });
    const spl = premium ? null : el(`<a class="ka-spl" href="#">${T.splash}</a>`);
    const ban = premium ? null : el(`<a class="ka-ban" href="#">${T.banner}</a>`);
    const panNyit = e => { if (e) e.preventDefault(); pan.classList.add('on'); show(); };
    [spl, ban].forEach(n => n && n.addEventListener('click', panNyit));
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
        ['Zene', 'Saját zenék – a kép a zene ütemére forog és lélegzik.', 'zene'],
        [T.tabla.cim, '', 'tabla']
      ] : [
        ['You are in control', 'In the full version, 50+ settings let you shape every image.', 'gear'],
        ['Modes', 'Pick a mode – or let them alternate.', 'mod'],
        ['Shapes and objects', '10 spiral shapes, 31 objects, countless patterns – you decide what turns.', 'form'],
        ['Colours', 'Colours, harmonies, backgrounds – just the way you like.', 'szin'],
        ['Speed', 'Drag the slider and the image follows at once. Watch the background!', 'seb'],
        ['Music', 'Our own music – the image turns and breathes with the beat.', 'zene'],
        [T.tabla.cim, '', 'tabla']
      ];
      const MOD = HU ? ['TÜKRÖS', 'ÖRVÉNYES', 'SPIRÁLOS', 'SZÖVET', 'VÁLTAKOZÓ'] : ['MIRROR', 'VORTEX', 'SPIRAL', 'WEAVE', 'ALTERNATING'];
      const FRM = HU ? ['szivárvány', 'szív', 'fánk', 'mérőszalag', 'holdak', 'tárgyak'] : ['rainbow', 'heart', 'torus', 'tape', 'moons', 'objects'];
      const SZN = ['#FF2A2A', '#FF8A00', '#FFE600', '#39FF14', '#00E5FF', '#2F6BFF', '#9B30FF', '#FF2BD6', '#a8ccf0', '#0f61b3', '#4799eb', '#0f3d6b'];
      gear = el(`<div class="ka-gear" title="${HU ? 'Beállítások – teljes változat' : 'Settings – full version'}"><img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23FBFAF7%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%226.6%22%2F%3E%3Cpath%20d%3D%22M12%202.4v2.8M12%2018.8v2.8M2.4%2012h2.8M18.8%2012h2.8M5.2%205.2l2%202M16.8%2016.8l2%202M5.2%2018.8l2-2M16.8%207.2l2-2%22%2F%3E%3C%2Fsvg%3E" alt=""><b><svg viewBox="0 0 24 24" width="11" height="11" fill="#0f0f0f"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="#0f0f0f" stroke-width="2.4"/></svg></b></div>`);
      tur = el(`<div class="ka-tur"><button type="button" class="x" aria-label="${T.close}">×</button><h3>${HU ? 'TELJES VÁLTOZAT: MINDEN MINTÁT TE IRÁNYÍTHATSZ' : 'FULL VERSION: YOU CAN CONTROL EVERY PATTERN'}</h3>
        <div class="ti"></div><div class="tx"></div><div class="vz"></div><div class="pt">${K.map(() => '<i></i>').join('')}</div>
        <div class="gs"><button type="button" class="fo ka-kk">${T.vesz}</button><button type="button" class="ka-oh">${T.osszeh}</button></div></div>`);
      let ki = 0, kt = 0, anim = 0, t0 = 0;
      const vz = tur.querySelector('.vz');
      const kartya = i => {
        ki = (i + K.length) % K.length; t0 = performance.now(); const [ti, tx, v] = K[ki];
        tur.querySelector('.ti').textContent = ti; tur.querySelector('.tx').textContent = tx;
        tur.querySelectorAll('.pt i').forEach((d, j) => d.classList.toggle('on', j === ki));
        vz.style.height = v === 'tabla' ? 'auto' : ''; tur.querySelector('.tx').style.display = v === 'tabla' ? 'none' : '';
        vz.innerHTML = v === 'tabla' ? `<table><tr>${T.tabla.fej.map(h => `<th>${h}</th>`).join('')}</tr>${T.tabla.sor.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>` : v === 'mod' ? MOD.map(m => `<span class="ch">${m}</span>`).join('') : v === 'form' ? FRM.map(m => `<span class="ch">${m}</span>`).join('')
          : v === 'szin' ? Array.from({ length: 6 }, () => '<span class="sw"></span>').join('') : v === 'seb' ? '<div class="sl"><i></i><u></u></div>'
          : v === 'zene' ? Array.from({ length: 14 }, () => '<span class="eq"></span>').join('') : `<img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23FBFAF7%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%226.6%22%2F%3E%3Cpath%20d%3D%22M12%202.4v2.8M12%2018.8v2.8M2.4%2012h2.8M18.8%2012h2.8M5.2%205.2l2%202M16.8%2016.8l2%202M5.2%2018.8l2-2M16.8%207.2l2-2%22%2F%3E%3C%2Fsvg%3E" style="width:40px;height:40px;animation:kaFor 6s linear infinite">`;
        clearTimeout(kt); if (v !== 'tabla') kt = setTimeout(() => kartya(ki + 1), v === 'seb' ? 7000 : 4200);   // a táblázatnál megáll
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
      tur.querySelector('.ka-oh').addEventListener('click', () => { clearTimeout(kt); kartya(K.length - 1); });
      const tl = pan.querySelector('.ka-tura'); if (tl) tl.addEventListener('click', e => { e.preventDefault(); nyit(); clearTimeout(kt); kartya(K.length - 1); });
      tur.addEventListener('click', e => { if (!e.target.closest('a,button')) { clearTimeout(kt); kartya(ki + 1); } });
      [gear, tur].forEach(n => ['pointerdown', 'pointerup', 'click'].forEach(ev => n.addEventListener(ev, e => e.stopPropagation())));
      try { if (!localStorage.getItem('kaleido-tura')) gear.classList.add('pul'); } catch (e) {}
    }
    [btn, pan, spl, ban, ny, kosz].forEach(n => n && ['pointerdown', 'pointerup', 'click'].forEach(ev => n.addEventListener(ev, stop)));
    const kb = btn.querySelector('.ka-k'); if (kb) kb.addEventListener('click', () => { pan.classList.toggle('on'); show(); });
    const ment = (j, kulcs) => lset({ kulcs: j.kulcs || kulcs, peldany: j.peldany, app: APP, termek: j.termek || '', aktivalt: j.aktivalt, limit: j.limit, ell: Date.now() });
    // kézi aktiválás (kulcs az e-mailből)
    // a kulcsmező gépelés közben formáz: nagybetű, csak betű és szám, 5-ösével kötőjel (XXXXX-XXXXX-…)
    const kForm = v => (v || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 25).replace(/(.{5})(?=.)/g, '$1-');
    const kIn = pan.querySelector('.ka-in');
    if (kIn) { kIn.maxLength = 29; kIn.addEventListener('input', () => { const u = kForm(kIn.value); if (u !== kIn.value) { kIn.value = u; try { kIn.setSelectionRange(u.length, u.length); } catch (e) {} } }); }
    const okB = pan.querySelector('.ka-ok');
    if (okB) okB.addEventListener('click', async () => {
      const v = kForm(pan.querySelector('.ka-in').value);
      if (!/^[A-Z0-9]{5}(-[A-Z0-9]{5}){4}$/.test(v)) { hb(T.u.hibas_kulcs_formatum); return; }
      okB.disabled = true; hb(T.folyamat);
      const j = await hiv('aktival', { kulcs: v }); okB.disabled = false;
      if (j.ok && j.peldany) { ment(j, v); sset('kaleido-uzenet', 'kezi'); ujra(); } else hb(hibaSz(j));
    });
    // leválasztás erről az eszközről (két koppintással)
    const levB = pan.querySelector('.ka-lev');
    if (levB) levB.addEventListener('click', async () => {
      if (!levB.dataset.biztos) { levB.dataset.biztos = '1'; levB.textContent = T.levBiztos; setTimeout(() => { delete levB.dataset.biztos; levB.textContent = T.lev; }, 4000); return; }
      levB.disabled = true; hb('…');
      const j = await hiv('levalaszt', { kulcs: LIC.kulcs, peldany: LIC.peldany }); levB.disabled = false;
      if (j.ok || j.uzenet === 'mar_levalasztva' || j.uzenet === 'ismeretlen_kulcs') { ldel(); sset('kaleido-uzenet', 'leveve'); ujra(); } else hb(hibaSz(j));
    });
    const masB = pan.querySelector('.ka-masol');
    if (masB) masB.addEventListener('click', async () => { try { await navigator.clipboard.writeText(LIC.kulcs); masB.textContent = T.masolva; setTimeout(() => masB.textContent = T.masol, 2500); } catch (e) { const r = document.createRange(); r.selectNodeContents(pan.querySelector('.ka-kulcs')); const s2 = getSelection(); s2.removeAllRanges(); s2.addRange(r); } });
    // a panel megnyitásakor (teljes változatban) friss eszközszám
    let frissT = 0;
    const friss = async () => { if (!premium || Date.now() - frissT < 60000) return; frissT = Date.now(); const j = await hiv('ellenoriz', { kulcs: LIC.kulcs, peldany: LIC.peldany }); kezelEll(j); };
    const kezelEll = j => {
      if (j.ok) { const L = Object.assign({}, LIC, { aktivalt: j.aktivalt, limit: j.limit, termek: j.termek || LIC.termek, ell: Date.now() }); lset(L); const a = pan.querySelector('.ka-akt'); if (a && j.aktivalt != null && j.limit) a.textContent = j.aktivalt + '/' + j.limit; }
      else if (['nem_aktiv', 'ismeretlen_kulcs', 'visszavont_vagy_lejart', 'masik_termek'].includes(j.uzenet)) { ldel(); sset('kaleido-uzenet', 'lezarva'); ujra(); }   // hálózati vagy szerverhiba: nem zárunk le senkit
    };
    if (kb) kb.addEventListener('click', friss);
    // heti csendes ellenőrzés
    if (premium && navigator.onLine !== false && Date.now() - (+LIC.ell || 0) > 7 * 864e5) setTimeout(() => hiv('ellenoriz', { kulcs: LIC.kulcs, peldany: LIC.peldany }).then(kezelEll), 4000);
    // visszatérés a Creem pénztárából: automatikus átvétel
    const qs = new URLSearchParams(location.search);
    if (!premium && qs.get('checkout_id') && qs.get('signature')) {
      const nyers = location.search;
      koszMutat(T.koszi, T.folyamat, '', false);
      hiv('atvesz', { visszateres: nyers }).then(j => {
        if (j.ok && j.peldany && j.kulcs) { ment(j); sset('kaleido-uzenet', 'vasarlas'); ujra(); return; }
        kosz.classList.remove('on'); try { history.replaceState(null, '', location.pathname); } catch (e) {}
        pan.classList.add('on'); show(); const d = pan.querySelector('.ka-van'); if (d) d.open = true;
        const at = pan.querySelector('.ka-atv'); if (at) { at.textContent = T.atvHiba; at.style.display = ''; }
        hb(j.uzenet === 'limit_elerve' ? hibaSz(j) : '');
      });
    }
    // üzenet az újratöltés után
    const uz = sget('kaleido-uzenet');
    if (uz === 'vasarlas') koszMutat(T.koszi, T.feloldva, T.email, true, true);
    else if (uz === 'kezi') koszMutat(T.full + ' ✓', T.feloldva);
    else if (uz === 'leveve') koszMutat(T.key, T.leveve);
    else if (uz === 'lezarva') koszMutat(T.key, T.lezarva);
    window.addEventListener('pointerup', () => { if (splashOn()) return; if (pan.classList.contains('on')) { pan.classList.remove('on'); delete pan.dataset.kenyszer; } show(); });
    const splashOn = () => { const im = document.querySelector('img[src*="logo-nyitokep"]'); if (!im) return false; let n = im; while (n && n !== document.body) { if (n.style && n.style.opacity === '0') return false; n = n.parentElement; } return true; };
    relabel(); let rq = 0; new MutationObserver(() => { if (!rq) rq = requestAnimationFrame(() => { rq = 0; relabel(); }); }).observe(document.body, { childList: true, subtree: true, characterData: true });   // a felület újrarajzolásakor azonnal
    setInterval(() => {   // ha a környezet (pl. a fejlesztői vászon) újraépíti az oldalt, az elemek visszakerülnek
      if (!st.isConnected) document.head.appendChild(st);
      [btn, pan, spl, ban, ny, kosz].forEach(n => { if (n && !n.isConnected) document.body.appendChild(n); });
      ny.style.display = splashOn() ? 'flex' : 'none';
      if (!vr.isConnected) document.body.appendChild(vr); vr.style.display = splashOn() && window.__kVer ? 'block' : 'none';
      if (!zn.isConnected) document.body.appendChild(zn);
      const ks = window.__kSound; if (ks === false && znS !== false) znShow(); znS = ks;
      zn.classList.toggle('on', ks === false && performance.now() < znT && !splashOn() && !document.querySelector('.fpad'));
      const ad = !!document.querySelector('.fpad');   // hirdetés közben semmi nem látszik és nem kattintható
      [btn, pan, spl, ban].forEach(n => { if (n) n.style.visibility = ad ? 'hidden' : ''; }); if (ad) pan.classList.remove('on');
      if (gear) { if (!gear.isConnected) document.body.appendChild(gear); if (!tur.isConnected) document.body.appendChild(tur); gear.style.display = splashOn() || ad || document.querySelector('div[title="Beállítások"]') ? 'none' : 'flex';   /* ha a valódi ⚙ látszik (pl. ?beallitas), a lakatos nem kell */ if (ad && tur.classList.contains('on')) tur.classList.remove('on'); }
      const so = splashOn(); if (spl) spl.style.display = so ? 'block' : 'none'; const gearPanel = !!document.querySelector('div[style*="max-height:74%"],div[style*="max-height: 74%"]'); btn.classList.toggle('on', !so && !gearPanel && !(tur && tur.classList.contains('on'))); if (gearPanel && !pan.dataset.kenyszer) pan.classList.remove('on');   // a gombok a nyitókép után mindig látszanak
    }, 400);
    window.KAjanlat = { premium, nyit: () => { pan.dataset.kenyszer = '1'; pan.classList.add('on'); show(); friss(); }, cycle() { if (!ban || splashOn()) return; ban.classList.add('on'); clearTimeout(ban.t); ban.t = setTimeout(() => ban.classList.remove('on'), 10000); } };
    // linkek: új lapon; ha a környezet nem enged új lapot, ugyanitt; a fejlesztői vásznon a projekt saját példányai
    document.addEventListener('click', e => {
      const a = e.target.closest('a[target="_blank"]'); if (!a) return; e.preventDefault(); if (document.querySelector('.fpad')) return; let u = a.href;
      window.dispatchEvent(new CustomEvent('kaleido-solo', { detail: 'kulso-lap' }));   // új lap nyílik: a Kaleidoszkóp elhallgat
      let w = null; try { w = window.open(u, '_blank'); } catch (x) {} if (w) { try { w.opener = null; } catch (x) {} } else location.href = u;
    }, true);
  }
  try { const bc = new BroadcastChannel('banky-hang'); bc.onmessage = () => window.dispatchEvent(new CustomEvent('kaleido-solo', { detail: 'masik-lap' })); window.addEventListener('pointerup', () => { try { bc.postMessage(1); } catch (e) {} }, true); } catch (e) {}   // egyszerre csak egy lapunk szól
  window.KAjanlat = { premium, nyit() {}, cycle() {} };
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
