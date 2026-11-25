/* =========================================================
   LopiX — 404 mini oyunu: "Kayıp Sayfa Koşusu"
   LopiX'in pixel karakteri bozuk bir sayfada koşar:
   - Hatalı piksellerin (bug) ve kırık blokların üstünden zıplar
   - Uçan glitch'lerin altından geçer (zıplarsa çarpar)
   - Lime bitleri toplayarak ekstra puan kazanır
   Kontroller: Boşluk / ↑ / W veya ekrana dokunma. Basılı tutunca daha yükseğe zıplar.

   Oyun 320x120 piksellik küçük bir tuvale (canvas) çizilir ve CSS ile büyütülür;
   böylece pikseller keskin kalır. Yazılar (skor, mesajlar) HTML'dedir ve çevrilebilir.
   ========================================================= */
(function () {
  'use strict';

  var canvas = document.getElementById('game');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var box = canvas.closest('.game');
  var scoreEl = box.querySelector('[data-game-score]');
  var bestEl = box.querySelector('[data-game-best]');

  /* ---------- Ayarlar ---------- */

  var W = 320, H = 120;
  var GROUND = 104;             // zeminin y koordinatı
  var PLAYER_X = 30;
  var GRAVITY = 0.34;           // normal yerçekimi
  var GRAVITY_HOLD = 0.2;       // tuş basılıyken (yükselirken) daha hafif → daha yüksek zıplama
  var JUMP_V = -4.6;            // zıplama hızı
  var SPEED_START = 2.2;        // başlangıç koşu hızı (piksel / kare)
  var SPEED_MAX = 4.6;
  var SPEED_ACC = 0.0009;       // her karede hız artışı
  var BIT_BONUS = 25;
  var STORE_BEST = 'lpx-404-best';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  canvas.width = W;
  canvas.height = H;
  ctx.imageSmoothingEnabled = false;

  /* ---------- Pixel çizimler ---------- */

  // Her harf bir renk: l = lime, b = açık lime, d = koyu lime, k = koyu (vizör/ayak),
  // r = hata kırmızısı, w = beyazımsı, . = boş
  var HEAD = [
    '....llll....',
    '...lbbbbl...',
    '..lbbbbbbl..',
    '..lkkkkkkl..',
    '..lkbkkbkl..',
    '..lkkkkkkl..',
    '...llllll...'
  ];
  var BODY_A = ['..d.llll.d..', '.d..llll..d.', '....llll....'];
  var BODY_B = ['.d..llll..d.', '..d.llll.d..', '....llll....'];
  var LEGS_A = ['...ll..ll...', '..ll....ll..', '..k......k..'];
  var LEGS_B = ['....l..l....', '....l..l....', '...kk..kk...'];
  var LEGS_JUMP = ['...ll..ll...', '...l....l...', '..kk....kk..'];
  var HEAD_BLINK = HEAD.slice(0, 4).concat(['..lkkkkkkl..', '..lkbbbbkl..', '...llllll...']);
  var HEAD_DEAD = HEAD.slice(0, 3).concat(['..lkkkkkkl..', '..lkwkkwkl..', '..lkkwwkkl..', '...llllll...']);

  var PLAYER = {
    runA: HEAD.concat(BODY_A, LEGS_A),
    runB: HEAD.concat(BODY_B, LEGS_B),
    jump: HEAD.concat(BODY_A, LEGS_JUMP),
    blink: HEAD_BLINK.concat(BODY_A, LEGS_B),
    dead: HEAD_DEAD.concat(BODY_B, LEGS_JUMP)
  };
  var PLAYER_H = PLAYER.runA.length;   // 13

  var BUG = [
    '.k.....k.',
    '..k...k..',
    '.rrrrrrr.',
    'rrwrrrwrr',
    'rrrrrrrrr',
    '.rrrrrrr.',
    'r.r...r.r'
  ];
  var FLYER = [
    ['r........r', '.r.rrrr.r.', '..rrwwrr..', '..rrrrrr..', '...r..r...'],
    ['..........', '...rrrr...', 'rrrrwwrrrr', '..rrrrrr..', '...r..r...']
  ];
  var BIT = ['..b..', '.bbb.', 'bbbbb', '.bbb.', '..b..'];

  /* ---------- Renkler (sitenin temasından okunur) ---------- */

  var C = {};
  function readColors() {
    var cs = getComputedStyle(document.documentElement);
    function v(name) { return cs.getPropertyValue(name).trim(); }
    var light = document.documentElement.getAttribute('data-theme') === 'light';
    C.bg = v('--surface');
    C.far = v('--border');
    C.ground = v('--lime-deep');
    C.dash = v('--border');
    C.star = v('--text-muted');
    C.l = v('--lime');
    C.b = v('--lime-bright');
    C.d = v('--lime-deep');
    C.k = light ? '#1b2410' : '#0a0f02';
    C.r = v('--danger');
    C.w = light ? '#ffffff' : v('--text');
    C.block = light ? '#e3ecd2' : '#141a1b';
    if (light) { C.l = '#9ad81e'; C.b = '#c4f53a'; }   // açık zeminde daha görünür lime
  }

  function sprite(map, x, y, colorOverride) {
    x = Math.round(x); y = Math.round(y);
    for (var row = 0; row < map.length; row++) {
      var line = map[row];
      for (var col = 0; col < line.length; col++) {
        var ch = line.charAt(col);
        if (ch === '.') continue;
        ctx.fillStyle = colorOverride || C[ch];
        ctx.fillRect(x + col, y + row, 1, 1);
      }
    }
  }

  /* ---------- Oyun durumu ---------- */

  var state = 'ready';          // ready | running | over
  var speed, distance, bonus, score, best;
  var py, vy, onGround, holding, jumpBuffer;
  var obstacles, bits, particles;
  var nextObstacle, runTimer, groundOffset, farOffset, idleTimer, shake, overAt, newBest;
  var stars = [], skyline = [];

  function readBest() { try { return parseInt(localStorage.getItem(STORE_BEST), 10) || 0; } catch (e) { return 0; } }
  function saveBest(v) { try { localStorage.setItem(STORE_BEST, String(v)); } catch (e) { /* gizli mod */ } }
  function pad(n) { return ('00000' + n).slice(-5); }

  // Arka plan: uzakta yavaş kayan bloklar (bozuk sayfanın siluetleri) ve yıldızlar
  for (var i = 0; i < 22; i++) stars.push({ x: Math.random() * W, y: 6 + Math.random() * 60 });
  for (var x = 0; x < W * 2;) {
    var bw = 10 + Math.floor(Math.random() * 22);
    skyline.push({ x: x, w: bw, h: 8 + Math.floor(Math.random() * 30) });
    x += bw + 4 + Math.floor(Math.random() * 14);
  }
  var SKY_W = skyline[skyline.length - 1].x + skyline[skyline.length - 1].w + 10;

  function reset() {
    speed = SPEED_START;
    distance = 0; bonus = 0; score = 0;
    py = GROUND; vy = 0; onGround = true; holding = false; jumpBuffer = 0;
    obstacles = []; bits = []; particles = [];
    nextObstacle = 140;
    runTimer = 0; groundOffset = 0; farOffset = 0; idleTimer = 0; shake = 0;
    newBest = false;
    box.removeAttribute('data-newbest');
    updateHud();
  }

  function updateHud() {
    scoreEl.textContent = pad(score);
    bestEl.textContent = pad(best);
  }

  function setState(s) {
    state = s;
    box.setAttribute('data-state', s);
  }

  /* ---------- Engeller ---------- */

  function spawnObstacle() {
    var r = Math.random();
    var o;
    if (score > 250 && r < 0.18) {
      // Uçan glitch: altından geçilir
      o = { type: 'flyer', x: W + 4, y: GROUND - 22, w: 10, h: 5 };
    } else if (r < 0.45) {
      var bh = Math.random() < 0.5 ? 12 : 16;
      o = { type: 'block', x: W + 4, y: GROUND - bh, w: 8, h: bh };
    } else if (r < 0.62 && score > 120) {
      o = { type: 'bug2', x: W + 4, y: GROUND - 7, w: 19, h: 7 };
    } else {
      o = { type: 'bug', x: W + 4, y: GROUND - 7, w: 9, h: 7 };
    }
    obstacles.push(o);

    // Sonraki engele kadar mesafe: hız arttıkça aralık da açılır
    var minGap = 70 + speed * 22;
    var gap = minGap + Math.random() * 110;
    nextObstacle = gap;

    // Arada bazen toplanacak bir lime bit
    if (Math.random() < 0.35) {
      bits.push({ x: o.x + o.w + gap / 2, y: GROUND - 30 - Math.floor(Math.random() * 10), w: 5, h: 5 });
    }
  }

  function hitbox(o) {
    if (o.type === 'flyer') return { x: o.x + 1, y: o.y + 1, w: o.w - 2, h: o.h - 2 };
    return { x: o.x + 1, y: o.y + 1, w: o.w - 2, h: o.h - 1 };
  }

  function overlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function burst(x, y, color, count) {
    for (var n = 0; n < count; n++) {
      particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2.5 - 0.5,
        life: 30 + Math.random() * 20,
        color: color
      });
    }
  }

  /* ---------- Güncelleme ---------- */

  function update(dt) {
    // Parçacıklar her durumda hareket eder (patlama efekti)
    for (var p = particles.length - 1; p >= 0; p--) {
      var pt = particles[p];
      pt.vy += 0.15 * dt;
      pt.x += pt.vx * dt; pt.y += pt.vy * dt;
      pt.life -= dt;
      if (pt.life <= 0 || pt.y > GROUND) particles.splice(p, 1);
    }
    if (shake > 0) shake -= dt;

    if (state === 'ready') { idleTimer += dt; return; }
    if (state !== 'running') return;

    speed = Math.min(SPEED_MAX, speed + SPEED_ACC * dt);
    distance += speed * dt;
    groundOffset += speed * dt;
    farOffset += speed * 0.3 * dt;
    runTimer += speed * dt;

    // Zıplama (tuşa yere inmeden hemen önce basıldıysa da çalışır)
    if (jumpBuffer > 0) {
      if (onGround) { vy = JUMP_V; onGround = false; jumpBuffer = 0; }
      else jumpBuffer -= dt;
    }
    vy += (holding && vy < 0 ? GRAVITY_HOLD : GRAVITY) * dt;
    py += vy * dt;
    if (py >= GROUND) { py = GROUND; vy = 0; onGround = true; }

    // Engeller
    nextObstacle -= speed * dt;
    if (nextObstacle <= 0) spawnObstacle();

    var me = { x: PLAYER_X + 3, y: py - PLAYER_H + 1, w: 6, h: PLAYER_H - 2 };
    for (var o = obstacles.length - 1; o >= 0; o--) {
      var ob = obstacles[o];
      ob.x -= speed * dt;
      if (ob.x + ob.w < -4) { obstacles.splice(o, 1); continue; }
      if (overlap(me, hitbox(ob))) { gameOver(); return; }
    }

    for (var b = bits.length - 1; b >= 0; b--) {
      var bit = bits[b];
      bit.x -= speed * dt;
      if (bit.x + bit.w < -4) { bits.splice(b, 1); continue; }
      if (overlap(me, bit)) {
        bonus += BIT_BONUS;
        burst(bit.x + 2, bit.y + 2, C.b, 8);
        bits.splice(b, 1);
      }
    }

    var newScore = Math.floor(distance / 8) + bonus;
    if (newScore !== score) { score = newScore; updateHud(); }
  }

  function gameOver() {
    setState('over');
    overAt = Date.now();
    holding = false;
    burst(PLAYER_X + 6, py - 7, C.l, 14);
    burst(PLAYER_X + 6, py - 7, C.r, 6);
    if (!reduce) shake = 12;
    if (score > best) {
      best = score;
      saveBest(best);
      newBest = true;
      box.setAttribute('data-newbest', '');
    }
    updateHud();
  }

  /* ---------- Çizim ---------- */

  function render() {
    ctx.save();
    if (shake > 0) ctx.translate(Math.round((Math.random() - 0.5) * 3), Math.round((Math.random() - 0.5) * 3));

    ctx.fillStyle = C.bg;
    ctx.fillRect(-4, -4, W + 8, H + 8);

    // Yıldızlar (çok yavaş)
    ctx.fillStyle = C.star;
    ctx.globalAlpha = 0.5;
    stars.forEach(function (s) {
      var sx = ((s.x - farOffset * 0.3) % W + W) % W;
      ctx.fillRect(Math.round(sx), s.y, 1, 1);
    });
    ctx.globalAlpha = 1;

    // Uzaktaki bloklar (soluk, oyunun önüne geçmesin)
    ctx.fillStyle = C.far;
    ctx.globalAlpha = 0.55;
    skyline.forEach(function (k) {
      var kx = ((k.x - farOffset) % SKY_W + SKY_W) % SKY_W - 20;
      if (kx > W) return;
      ctx.fillRect(Math.round(kx), GROUND - k.h, k.w, k.h);
    });
    ctx.globalAlpha = 1;

    // Zemin çizgisi ve kayan zemin desenleri
    ctx.fillStyle = C.ground;
    ctx.fillRect(0, GROUND, W, 1);
    ctx.fillStyle = C.dash;
    for (var d = 0; d < W / 12 + 2; d++) {
      var dx = Math.round(((d * 12 - groundOffset) % (W + 24) + W + 24) % (W + 24) - 12);
      ctx.fillRect(dx, GROUND + 4 + (d % 3) * 3, d % 2 ? 4 : 2, 1);
    }

    // Lime bitler (hafif yukarı aşağı süzülür)
    bits.forEach(function (bit) {
      var bob = reduce ? 0 : Math.round(Math.sin((bit.x + distance) / 10));
      sprite(BIT, bit.x, bit.y + bob);
    });

    // Engeller
    obstacles.forEach(function (o) {
      if (o.type === 'bug') sprite(BUG, o.x, o.y);
      else if (o.type === 'bug2') { sprite(BUG, o.x, o.y); sprite(BUG, o.x + 10, o.y); }
      else if (o.type === 'flyer') sprite(FLYER[Math.floor(runTimer / 8) % 2], o.x, o.y);
      else {
        // Kırık blok: koyu dolgu, lime kenar, rastgele titreyen hata çizgisi
        var bx = Math.round(o.x);
        ctx.fillStyle = C.d; ctx.fillRect(bx, o.y, o.w, o.h);
        ctx.fillStyle = C.block; ctx.fillRect(bx + 1, o.y + 1, o.w - 2, o.h - 1);
        ctx.fillStyle = C.r; ctx.fillRect(bx + 2, o.y + 3 + (Math.floor(runTimer / 6) % (o.h - 6)), o.w - 4, 1);
        ctx.fillStyle = C.l; ctx.fillRect(bx + 2, o.y + 2, 2, 1);
      }
    });

    // Oyuncu
    var frame;
    if (state === 'over') frame = PLAYER.dead;
    else if (state === 'ready') frame = (!reduce && idleTimer % 180 > 170) ? PLAYER.blink : PLAYER.runA;
    else if (!onGround) frame = PLAYER.jump;
    else frame = Math.floor(runTimer / 9) % 2 ? PLAYER.runB : PLAYER.runA;
    var idleBob = (state === 'ready' && !reduce) ? Math.round(Math.sin(idleTimer / 12)) : 0;
    // Oyun bitince karakter kısa bir süre kırmızı yanıp söner, sonra normal rengine döner
    var sinceOver = Date.now() - overAt;
    var flash = state === 'over' && !reduce && sinceOver < 800 && Math.floor(sinceOver / 120) % 2 === 1;
    sprite(frame, PLAYER_X, py - PLAYER_H + idleBob, flash ? C.r : null);

    // Parçacıklar
    particles.forEach(function (pt) {
      ctx.fillStyle = pt.color;
      ctx.fillRect(Math.round(pt.x), Math.round(pt.y), 2, 2);
    });

    ctx.restore();
  }

  /* ---------- Döngü ---------- */

  var raf = 0, last = 0, looping = false;

  function shouldLoop() {
    if (document.hidden) return false;
    if (state === 'running') return true;
    if (state === 'ready') return !reduce;
    return particles.length > 0 || shake > 0 || (Date.now() - overAt < 900 && !reduce);
  }

  function frame(ts) {
    if (!last) last = ts;
    var dt = Math.min(50, ts - last) / (1000 / 60);   // 60 FPS'e göre geçen kare sayısı
    last = ts;
    update(dt);
    render();
    if (shouldLoop()) raf = requestAnimationFrame(frame);
    else { looping = false; last = 0; }
  }

  function startLoop() {
    if (looping || document.hidden) return;
    looping = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  /* ---------- Kontroller ---------- */

  function press() {
    if (state === 'ready') { reset(); setState('running'); startLoop(); return; }
    if (state === 'over') {
      if (Date.now() - overAt < 450) return;   // yanlışlıkla hemen yeniden başlamasın
      reset(); setState('running'); startLoop(); return;
    }
    holding = true;
    jumpBuffer = 8;
  }

  function release() { holding = false; }

  function isJumpKey(e) {
    return e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W';
  }

  // Oyun ekranda görünüyor mu? (Görünmüyorsa Boşluk tuşu sayfayı kaydırmaya devam etsin)
  function gameVisible() {
    var r = box.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }

  // Düğme, link, form alanı veya dil menüsü odaktayken tuşlar onların olsun
  function typingTarget(el) {
    return el && el !== box && el.closest && el.closest('a, button, input, textarea, select, [contenteditable], .lang-menu');
  }

  document.addEventListener('keydown', function (e) {
    if (!isJumpKey(e) || e.altKey || e.ctrlKey || e.metaKey) return;
    if (typingTarget(e.target) || !gameVisible()) return;
    e.preventDefault();
    if (!e.repeat) press();
  });
  document.addEventListener('keyup', function (e) { if (isJumpKey(e)) release(); });

  box.addEventListener('pointerdown', function (e) {
    if (e.button !== undefined && e.button > 0) return;
    e.preventDefault();
    box.focus({ preventScroll: true });
    press();
  });
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  box.addEventListener('contextmenu', function (e) { e.preventDefault(); });   // uzun dokunmada menü açılmasın

  // Sekme gizlenince oyun durur, geri gelince kaldığı yerden devam eder
  document.addEventListener('visibilitychange', function () { if (!document.hidden && shouldLoop()) startLoop(); });

  // Tema değişince renkleri yeniden oku ve çiz
  new MutationObserver(function () { readColors(); render(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* ---------- Başlat ---------- */

  best = readBest();
  readColors();
  reset();
  setState('ready');
  render();
  startLoop();   // "hareketi azalt" açıksa bekleme animasyonu çalışmaz, ilk tuşa kadar sabit durur
})();
