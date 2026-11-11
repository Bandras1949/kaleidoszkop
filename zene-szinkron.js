// ZENÉRE REAGÁLÓ KALEIDOSZKÓP – kísérlet. © Bánky András
// A saját zenéinkhez előre elkészített hangelemzésből (energia, hangsúlyok sűrűsége, ütések) hajtja a képet:
//  – forgás/áramlás sebessége: window.__zeneSeb (az ÖRVÉNYES, SPIRÁLOS, HOLDAS és SZÖVET motor szorozza vele az idejét)
//  – lüktetés: az ütésekre a kép egy pillanatra kitágul
//  – fényesség: a hangerővel együtt erősödik-halkul
(function () {
  if (window.__zeneSzinkron) return; window.__zeneSzinkron = true;
  window.__altGyors = true;   // KÍSÉRLET: a VÁLTAKOZÓ gyors köre (üzemmódonként egy minta, 10 mp; ÖRVÉNYES 2 × 10 mp)
  const KEY = 'zene-szinkron-2';
  const DEF = { be: true, seb: 90, lukt: 25, feny: 36 };
  let S = { ...DEF }; try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  // ---------- előre elkészített hangelemzés ----------
  // Minden zenénkhöz egyszer, előre kiszámoltuk (zene/XX.json): energia 10 Hz-en, a hangsúlyok sűrűsége, minden hangsúlyos ütés ideje és ereje.
  // Lejátszáskor csak a zene aktuális idejét olvassuk ki – nincs élő hangfeldolgozás, a telefont nem terheli.
  const els = new Set(), data = {}, pend = {};
  const op = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () { if (/\/zene\/[^/]+\.mp3/.test(this.currentSrc || this.src || '')) els.add(this); return op.apply(this, arguments); };
  const load = src => {
    const u = src.replace(/\.mp3(\?.*)?$/, '.json'); if (data[u] || pend[u]) return data[u]; pend[u] = true;
    fetch(u).then(r => r.json()).then(j => { data[u] = j; }).catch(() => {}).finally(() => { pend[u] = false; }); return null;
  };
  const Z = window.__zene = { energia: 0, suruseg: 0, utes: 0, tempo: 0, seb: 1, zene: '' };
  let seb = 1, cur = null;
  function analyse() {
    let el = null; els.forEach(a => { if (!a.paused && !a.ended && (!el || a.volume > el.volume)) el = a; });   // áttűnéskor a hangosabb zene vezet
    if (!el) { Z.energia = Z.utes = Z.suruseg = 0; Z.zene = ''; return; }
    const d = load(el.currentSrc || el.src); Z.zene = decodeURI((el.currentSrc || el.src).split('/').pop());
    if (!d) return;
    const t = el.currentTime, x = t * d.hz, i = Math.min(d.e.length - 2, Math.max(0, Math.floor(x))), f = x - i;
    Z.energia = ((d.e[i] * (1 - f) + d.e[i + 1] * f) / 100) || 0;
    Z.suruseg = ((d.r[i] * (1 - f) + d.r[i + 1] * f) / 10) || 0;
    Z.tempo = d.tk || d.bpm;   // a zene ismert tempója (ütés/perc)
    Z.t = t;
    let lo = 0, hi = d.b.length - 1, k = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (d.b[m] <= t) { k = m; lo = m + 1; } else hi = m - 1; }   // utolsó ütés
    Z.utes = k >= 0 && t - d.b[k] < 0.6 ? (d.s[k] / 9) * Math.exp(-(t - d.b[k]) / 0.12) : 0;
  }
  // ---------- hatás a képre ----------
  function apply(dt) {
    const on = S.be && !!Z.zene;
    // sebesség: halk, lassú zenénél lassabb (0,5×), erős, sűrű zenénél gyorsabb (akár 2,2×)
    // a zene tempója adja az alapot (lassú zene ~0,6×, gyors ~1,5×), az energia és a hangsúlyok sűrűsége ezen belül mozgat
    const tf = Z.tempo ? Math.max(0.45, Math.min(1.7, Z.tempo / 85)) : 1;
    const raw = on ? tf * (0.75 + 0.5 * Z.energia) * (0.9 + 0.2 * Math.min(1, Z.suruseg / 2.5)) : 1;
    const target = 1 + (S.seb / 100) * (raw - 1);
    seb += (target - seb) * Math.min(1, dt * 1.2); window.__zeneSeb = Z.seb = seb;
    const sc = on ? 1 + (S.lukt / 100) * 0.06 * Z.utes : 1;
    const br = on ? 1 + (S.feny / 100) * 0.5 * (Z.energia - 0.5) : 1;
    document.querySelectorAll('canvas').forEach(c => {
      if (c.closest('#zsz')) return;
      const tf = sc === 1 ? '' : `scale(${sc.toFixed(4)})`, fl = br === 1 ? '' : `brightness(${br.toFixed(3)})`;
      if ((c._tf ?? '') !== tf) { c.style.transform = tf; c._tf = tf; }   // csak a saját hatását írja/törli, más mód beállítását nem bántja
      if ((c._fl ?? '') !== fl) { c.style.filter = fl; c._fl = fl; }
    });
  }

  // ---------- panel ----------
  const css = `#zsz{position:fixed;left:calc(env(safe-area-inset-left) + 10px);top:calc(env(safe-area-inset-top) + 10px);z-index:99999;font:500 15px 'Cormorant Garamond',Georgia,serif;color:#F2EAD8}
  #zsz .g{width:42px;height:42px;border-radius:50%;border:1px solid rgba(212,175,55,.6);background:rgba(0,0,0,.5);color:#D4AF37;font-size:20px;cursor:pointer}
  #zsz .p{display:none;margin-top:8px;width:250px;padding:12px 14px;border-radius:12px;background:rgba(11,11,12,.88);border:1px solid rgba(212,175,55,.45)}
  #zsz.on .p{display:block}
  #zsz h4{margin:0 0 8px;font:600 13px Cinzel,Georgia,serif;letter-spacing:.14em;color:#D4AF37}
  #zsz label{display:flex;justify-content:space-between;margin-top:8px;font-style:italic;color:#C9B37A}
  #zsz input[type=range]{width:100%;accent-color:#D4AF37}
  #zsz .m{height:6px;border-radius:3px;background:rgba(255,255,255,.12);margin-top:4px;overflow:hidden}
  #zsz .m i{display:block;height:100%;width:0;background:#D4AF37}
  #zsz .row{display:flex;gap:10px;align-items:center;margin-top:8px;font-size:14px}
  #zsz .dot{width:12px;height:12px;border-radius:50%;background:#D4AF37;opacity:0}`;
  function build() {
    if (document.getElementById('zsz')) return;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const d = document.createElement('div'); d.id = 'zsz';
    d.innerHTML = `<button class="g" title="Zenére reagálás">♫</button><div class="p"><h4>ZENÉRE REAGÁLÁS</h4>
      <label>Bekapcsolva <input type="checkbox" data-k="be"></label>
      <label>Forgás a zenére <span data-o="seb"></span></label><input type="range" min="0" max="100" data-k="seb">
      <label>Lüktetés az ütésre <span data-o="lukt"></span></label><input type="range" min="0" max="100" data-k="lukt">
      <label>Fényesség a hangerőre <span data-o="feny"></span></label><input type="range" min="0" max="100" data-k="feny">
      <div class="row">Energia <div class="m" style="flex:1"><i data-m="e"></i></div></div>
      <div class="row">Ütés <span class="dot" data-m="b"></span> · sűrűség <span data-m="t"></span> · sebesség <span data-m="s"></span></div><div class="row" data-m="z" style="opacity:.7"></div></div>`;
    document.body.appendChild(d);
    const set = () => { d.querySelectorAll('[data-k]').forEach(i => { if (i.type === 'checkbox') i.checked = !!S[i.dataset.k]; else i.value = S[i.dataset.k]; }); d.querySelectorAll('[data-o]').forEach(o => o.textContent = S[o.dataset.o] + '%'); };
    set();
    d.addEventListener('input', e => { const i = e.target; if (!i.dataset.k) return; S[i.dataset.k] = i.type === 'checkbox' ? i.checked : +i.value; save(); set(); });
    ['pointerdown', 'pointerup', 'click', 'touchstart'].forEach(ev => d.addEventListener(ev, e => e.stopPropagation()));
    d.querySelector('.g').addEventListener('click', () => d.classList.toggle('on'));
  }
  let last = performance.now();
  (function loop(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    analyse(); apply(dt);
    if (!document.getElementById('zsz') && document.body) build();   // a vászon újraépítheti a DOM-ot
    const d = document.getElementById('zsz');
    if (d) { const sh = Z.zene ? '' : 'none'; if (d.style.display !== sh) d.style.display = sh; }   // a ♫ gomb csak akkor látszik, ha a Kaleidoszkóp saját zenéje szól
    if (d && d.classList.contains('on')) {
      d.querySelector('[data-m=e]').style.width = Math.round(Z.energia * 100) + '%';
      d.querySelector('[data-m=b]').style.opacity = Z.utes.toFixed(2);
      d.querySelector('[data-m=t]').textContent = Z.suruseg.toFixed(1) + '/mp';
      d.querySelector('[data-m=z]').textContent = Z.zene ? 'szól: ' + Z.zene : 'nincs zene';
      d.querySelector('[data-m=s]').textContent = Z.seb.toFixed(2) + '×';
    }
    requestAnimationFrame(loop);
  })(performance.now());
})();
