/* =========================================================
   LopiX — Ortak JavaScript
   1) Ayarlar: menü sayfaları ve sosyal medya linkleri
   2) İkonlar (SVG)
   3) Menü (header) ve alt bilgi (footer): tek yerden bütün sayfalara eklenir
   4) Açık/koyu tema düğmesi
   5) Pixel yazı (LPX) çizimi
   6) Sitenin arka planında dolaşan neon lime parçacık ağı
   7) "STABİL DEĞİL" polis bandının açısı
   8) Dil sistemi (17 dil): dil seçici, çeviri dosyalarının yüklenmesi,
      sağdan sola (Arapça) yerleşim

   Çeviri nasıl çalışır?
   - HTML'deki Türkçe metin asıl metindir: <h1 data-i18n="home.title">Merhaba</h1>
   - Diğer dillerin metinleri assets/lang/<kod>.js dosyalarında aynı anahtarla durur
   - Bir anahtarın çevirisi yoksa önce İngilizcesi, o da yoksa Türkçesi görünür
   - Özellik çevirisi: data-i18n-attr="aria-label:nav.label;title:nav.label"
   - İçinde etiket (<b>, <a>) olan metinler için: data-i18n-html="anahtar"
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1) Ayarlar ---------- */

  // Menüde görünecek sayfalar. Yeni sayfa eklenince buraya bir satır eklenir.
  var NAV = [
    { key: 'nav.home', label: 'Ana Sayfa', href: 'index.html', page: 'home' },
    { key: 'nav.projects', label: 'Projelerim', href: 'projelerim.html', page: 'projects' },
    { key: 'nav.about', label: 'Ben Kimim', href: 'ben-kimim.html', page: 'about' },
    { key: 'nav.faq', label: 'SSS', href: 'sss.html', page: 'faq' },
    { key: 'nav.contact', label: 'Bana Ulaşın', href: 'iletisim.html', page: 'contact' },
    { key: 'nav.social', label: 'Sosyal Medya', href: 'sosyal-medya.html', page: 'social' }
  ];

  // Sosyal medya hesapları. Linki boş olan hesap sitede hiç görünmez
  // (Discord linki gelince url kısmına yazmak yeterli; kart ve alt bilgi linki kendiliğinden çıkar).
  // handle: kartta görünen kullanıcı adı, desc: açıklama (descKey ile çevrilir)
  var SOCIALS = [
    { name: 'YouTube', icon: 'youtube', url: 'https://www.youtube.com/@Lopixlondrus', handle: '@Lopixlondrus', descKey: 'social.youtube', desc: 'YouTube kanalım' },
    { name: 'Discord', icon: 'discord', url: '', handle: 'Discord', descKey: 'social.discord', desc: 'Discord sunucum' }
  ];

  var MEHPIX_URL = 'https://mehpix.github.io';

  // boot.js'in belirlediği dil ve dil listesi (boot.js yüklenmediyse Türkçe)
  var BOOT = window.LPX || { LANGS: [{ code: 'tr', name: 'Türkçe', html: 'tr' }], lang: 'tr', STORE_LANG: 'lpx-lang', STORE_THEME: 'lpx-theme' };
  var LANGS = BOOT.LANGS;
  var STORE_THEME = BOOT.STORE_THEME;
  var STORE_LANG = BOOT.STORE_LANG;
  var root = document.documentElement;

  // Dil dosyalarının klasörü, main.js'in kendi adresinden bulunur.
  // Böylece site hangi klasörde açılırsa açılsın (404 sayfası dahil) doğru yer bulunur.
  var SCRIPT_SRC = (document.currentScript && document.currentScript.src) || '';
  var LANG_DIR = SCRIPT_SRC ? SCRIPT_SRC.replace(/js\/main\.js(\?.*)?$/, 'lang/') : 'assets/lang/';

  // Yüklenen çeviriler: window.LPX_I18N.en = { 'nav.home': 'Home', ... }
  var DICT = window.LPX_I18N = window.LPX_I18N || {};
  var currentLang = BOOT.lang;

  // Tarayıcı hafızası (localStorage) bazı gizli modlarda çalışmaz; hata vermesin
  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  function findLang(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i];
    return null;
  }

  // Çeviri: önce seçili dil, sonra İngilizce. Bulunamazsa null döner;
  // o zaman sayfadaki orijinal (Türkçe) metin kalır.
  function t(key) {
    if (currentLang === 'tr') return null;
    var value = DICT[currentLang] && DICT[currentLang][key];
    if (value == null && DICT.en) value = DICT.en[key];
    return value == null ? null : value;
  }

  /* ---------- 2) İkonlar ---------- */

  // Marka ikonları: Simple Icons (CC0 lisanslı). Diğerleri sade çizgi ikonlar.
  var ICONS = {
    sun: '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 6-6 6 6 6M16 6l6 6-6 6"/></svg>',
    notes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 3 6v6c0 5 3.8 9.3 9 10 5.2-.7 9-5 9-10V6z"/><path d="M12 11v5M12 8h.01"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    discord: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>'
  };

  // HTML'de <span data-icon="youtube"></span> yazılan yere ikon çizilir.
  // span'deki class (örn. boyut veren "card__arrow") SVG'ye aktarılır.
  function renderIcons(scope) {
    (scope || document).querySelectorAll('[data-icon]').forEach(function (el) {
      var markup = ICONS[el.getAttribute('data-icon')];
      if (!markup) return;
      var tmp = document.createElement('div');
      tmp.innerHTML = markup;
      var svg = tmp.firstElementChild;
      if (el.className) svg.setAttribute('class', ((svg.getAttribute('class') || '') + ' ' + el.className).trim());
      el.replaceWith(svg);
    });
  }

  /* ---------- 3) Header ve footer ---------- */

  function brandHTML(lazy) {
    return '<a class="brand" href="index.html" aria-label="LopiX">' +
      '<img src="assets/img/lopix-logo-sm.jpg" alt="" width="40" height="40"' + (lazy ? ' loading="lazy"' : '') + '>' +
      '<span>Lopi<b>X</b></span>' +
    '</a>';
  }

  function buildHeader(el) {
    var current = document.body.getAttribute('data-page');
    var links = NAV.map(function (item) {
      var active = item.page === current ? ' aria-current="page"' : '';
      return '<li><a href="' + item.href + '"' + active + ' data-i18n="' + item.key + '">' + item.label + '</a></li>';
    }).join('');

    el.innerHTML =
      '<a class="skip-link" href="#main" data-i18n="skip">İçeriğe geç</a>' +
      '<div class="container header-inner">' +
        brandHTML(false) +
        '<nav class="site-nav" id="site-nav" aria-label="Ana menü" data-i18n-attr="aria-label:nav.label">' +
          '<ul>' + links + '</ul>' +
        '</nav>' +
        '<div class="header-controls">' +
          langSwitchHTML() +
          '<button type="button" class="icon-btn theme-toggle">' + ICONS.sun + ICONS.moon + '</button>' +
          '<button type="button" class="icon-btn nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Menüyü aç/kapat" data-i18n-attr="aria-label:nav.menu">' + ICONS.menu + '</button>' +
        '</div>' +
      '</div>';

    // Mobil menü aç/kapat
    var toggle = el.querySelector('.nav-toggle');
    var nav = el.querySelector('.site-nav');
    function closeMenu() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });
    // Menü dışına tıklanınca kapansın
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !el.contains(e.target)) closeMenu();
    });

    el.querySelector('.theme-toggle').addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });

    setupLangSwitch(el.querySelector('.lang-switch'));
  }

  function buildFooter(el) {
    var pages = NAV.map(function (item) {
      return '<li><a href="' + item.href + '" data-i18n="' + item.key + '">' + item.label + '</a></li>';
    }).join('');

    var socials = SOCIALS.filter(function (s) { return s.url; }).map(function (s) {
      return '<li><a href="' + s.url + '" target="_blank" rel="noopener">' + ICONS[s.icon] + s.name + '</a></li>';
    }).join('');

    el.innerHTML =
      '<div class="container footer-inner">' +
        '<div class="footer-brand">' +
          brandHTML(true) +
          '<p data-i18n="footer.tagline">Oyun ve yazılım projeleri. MehPiX ekibinin bir parçası.</p>' +
        '</div>' +
        '<div>' +
          '<p class="footer-title" data-i18n="footer.pages">Sayfalar</p>' +
          '<ul class="footer-links">' + pages + '</ul>' +
        '</div>' +
        '<div>' +
          '<p class="footer-title" data-i18n="footer.links">Bağlantılar</p>' +
          '<ul class="footer-links">' +
            socials +
            '<li><a href="' + MEHPIX_URL + '" target="_blank" rel="noopener">' + ICONS.external + '<span data-i18n="footer.mehpix">MehPiX sitesi</span></a></li>' +
          '</ul>' +
        '</div>' +
        '<p class="footer-copy">© ' + new Date().getFullYear() + ' LopiX. <span data-i18n="footer.rights">Tüm hakları saklıdır.</span></p>' +
      '</div>';
  }

  /* ---------- 4) Tema ---------- */

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    store(STORE_THEME, theme);
    updateThemeButton();
  }

  function updateThemeButton() {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    var light = root.getAttribute('data-theme') === 'light';
    var label = t(light ? 'theme.toDark' : 'theme.toLight') || (light ? 'Koyu temaya geç' : 'Açık temaya geç');
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  }

  /* ---------- 5) Pixel yazı ---------- */

  // Her harf 5 sütun x 7 satır; "1" dolu blok, "." boşluk
  var GLYPHS = {
    'L': ['1....', '1....', '1....', '1....', '1....', '1....', '11111'],
    'P': ['1111.', '1...1', '1...1', '1111.', '1....', '1....', '1....'],
    'X': ['1...1', '1...1', '.1.1.', '..1..', '.1.1.', '1...1', '1...1'],
    '0': ['.111.', '1...1', '1..11', '1.1.1', '11..1', '1...1', '.111.'],
    '4': ['...1.', '..11.', '.1.1.', '1..1.', '11111', '...1.', '...1.']   // 404 sayfası için
  };

  function buildPixelText(el) {
    var text = (el.getAttribute('data-pixel') || '').toUpperCase();
    var cell = 10;   // bir bloğun boyutu
    var gap = 1.4;   // bloklar arası boşluk
    var rects = [];
    var col = 0;
    var i = 0;

    text.split('').forEach(function (ch, index) {
      var glyph = GLYPHS[ch];
      if (!glyph) return;
      if (index > 0) col += 1; // harfler arası 1 blok boşluk
      glyph.forEach(function (row, y) {
        row.split('').forEach(function (bit, x) {
          if (bit !== '1') return;
          rects.push('<rect x="' + ((col + x) * cell) + '" y="' + (y * cell) + '" width="' + (cell - gap) +
            '" height="' + (cell - gap) + '" rx="1" style="--i:' + (i++) + '"/>');
        });
      });
      col += 5;
    });

    var w = col * cell - gap;
    var h = 7 * cell - gap;
    el.setAttribute('role', 'img');
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', text);
    el.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' + rects.join('') + '</svg>';
  }

  /* ---------- 6) Parçacık ağı ---------- */

  // Bütün sayfalarda içeriğin arkasında ve ekrana sabit duran lime parçacıklar.
  // Yakın noktalar ince çizgilerle bağlanır. "Hareketi azalt" açıksa noktalar sabit durur.
  function startParticles(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var w = 0, h = 0, pts = [], raf = 0, running = false;
    var LINK = 120; // bu mesafeden yakın noktalar çizgiyle bağlanır

    // Renkler temaya göre seçilir: açık temada açık zeminde görünsün diye koyu yeşil
    var DARK = { main: '196,245,58', alt: '232,251,140', line: .16, dot: .7 };
    var LIGHT = { main: '92,143,0', alt: '63,106,0', line: .22, dot: .55 };

    function resize() {
      var r = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(55, (w * h) / 16000));
      pts = [];
      for (var i = 0; i < count; i++) {
        pts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          s: Math.random() < 0.25 ? 3 : 2,   // kare (pixel) noktaların boyu
          alt: Math.random() >= 0.7
        });
      }
      draw();
    }

    function draw() {
      var col = root.getAttribute('data-theme') === 'light' ? LIGHT : DARK;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < pts.length; i++) {
        for (var j = i + 1; j < pts.length; j++) {
          var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = 'rgba(' + col.main + ',' + ((1 - d / LINK) * col.line).toFixed(3) + ')';
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      pts.forEach(function (p) {
        ctx.fillStyle = 'rgba(' + (p.alt ? col.alt : col.main) + ',' + col.dot + ')';
        ctx.fillRect(Math.round(p.x - p.s / 2), Math.round(p.y - p.s / 2), p.s, p.s);
      });
    }

    function step() {
      pts.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;
      });
      draw();
      if (running) raf = requestAnimationFrame(step);
    }

    function play() { if (!running && !reduce) { running = true; raf = requestAnimationFrame(step); } }
    function pause() { running = false; cancelAnimationFrame(raf); }

    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
    // Tema değişince renkler hemen güncellensin (hareket kapalıyken de)
    if ('MutationObserver' in window) {
      new MutationObserver(draw).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    }
    // Sekme arka plandayken animasyonu durdur (pil ve işlemci tasarrufu)
    document.addEventListener('visibilitychange', function () {
      document.hidden ? pause() : play();
    });
    play();
  }

  function startAmbientParticles() {
    var canvas = document.createElement('canvas');
    canvas.className = 'ambient-particles';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(canvas, document.body.firstChild);
    startParticles(canvas);
  }

  /* ---------- 7) Polis bandı ---------- */

  // Bant, kartın sol üst köşesinden sağ alt köşesine tam çapraz uzansın diye
  // açısı ve uzunluğu kartın boyutuna göre hesaplanır. Sağdan sola dillerde ters yöne yatar.
  var tapeFits = [];
  function fitTape(tape) {
    var card = tape.parentElement;
    function fit() {
      var w = card.offsetWidth, h = card.offsetHeight;
      if (!w || !h) return;
      var angle = Math.atan2(h, w) * 180 / Math.PI;
      if (root.dir === 'rtl') angle = -angle;
      tape.style.width = Math.ceil(Math.sqrt(w * w + h * h) + 80) + 'px';
      tape.style.transform = 'translate(-50%, -50%) rotate(' + angle.toFixed(2) + 'deg)';
    }
    fit();
    tapeFits.push(fit);
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(card);
  }

  /* ---------- 8) Dil sistemi ---------- */

  // Dil seçici: dünya ikonu + dil kodu olan bir düğme; tıklanınca 17 dilin listesi açılır
  function langSwitchHTML() {
    var items = LANGS.map(function (l) {
      return '<li><button type="button" class="lang-option" data-lang="' + l.code + '">' +
        '<span class="lang-option__code" lang="en" dir="ltr">' + l.code.toUpperCase() + '</span>' +
        // Arapça ad, tarayıcının yazı yönü kuralıyla kendiliğinden sağdan sola okunur
        '<span class="lang-option__name" lang="' + l.html + '">' + l.name + '</span>' +
        ICONS.check +
      '</button></li>';
    }).join('');

    return '<div class="lang-switch">' +
      '<button type="button" class="icon-btn lang-toggle" aria-expanded="false" aria-controls="lang-menu" aria-haspopup="true"' +
        ' aria-label="Dil seç" data-i18n-attr="aria-label:lang.label;title:lang.label" title="Dil seç">' +
        ICONS.globe + '<span class="lang-toggle__code" lang="en" dir="ltr"></span>' +
      '</button>' +
      '<div class="lang-menu" id="lang-menu" hidden>' +
        '<p class="lang-menu__title" data-i18n="lang.label">Dil seç</p>' +
        '<ul>' + items + '</ul>' +
      '</div>' +
    '</div>';
  }

  function setupLangSwitch(box) {
    if (!box) return;
    var toggle = box.querySelector('.lang-toggle');
    var menu = box.querySelector('.lang-menu');

    function open() {
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      var current = menu.querySelector('[aria-current="true"]') || menu.querySelector('button');
      if (current) current.focus();
    }
    function close(focusToggle) {
      if (menu.hidden) return;
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (focusToggle) toggle.focus();
    }

    toggle.addEventListener('click', function () { menu.hidden ? open() : close(false); });
    document.addEventListener('click', function (e) { if (!box.contains(e.target)) close(false); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(true); return; }
      // Yukarı/aşağı ok tuşlarıyla diller arasında gezinme
      if (menu.hidden || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
      e.preventDefault();
      var buttons = Array.prototype.slice.call(menu.querySelectorAll('button'));
      var i = buttons.indexOf(document.activeElement);
      i = e.key === 'ArrowDown' ? (i + 1) % buttons.length : (i - 1 + buttons.length) % buttons.length;
      buttons[i].focus();
    });
    menu.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        close(true);
        setLang(btn.getAttribute('data-lang'));
      });
    });
  }

  // Dil dosyasını <script> etiketiyle yükler (dosyaya çift tıklayıp açınca da çalışır)
  var loading = {};
  function loadDict(code, done) {
    if (code === 'tr' || DICT[code]) { done(); return; }
    if (loading[code]) { loading[code].push(done); return; }
    loading[code] = [done];
    var s = document.createElement('script');
    s.src = LANG_DIR + code + '.js';
    s.async = true;
    s.onload = s.onerror = function () {
      var list = loading[code];
      delete loading[code];
      list.forEach(function (fn) { fn(); });
    };
    document.head.appendChild(s);
  }

  // Seçili dil ve yedek dil (İngilizce) birlikte yüklenir
  function loadLang(code, done) {
    var need = code === 'tr' ? [] : (code === 'en' ? ['en'] : [code, 'en']);
    var left = need.length;
    if (!left) { done(); return; }
    need.forEach(function (c) { loadDict(c, function () { if (--left === 0) done(); }); });
  }

  function setLang(code) {
    var info = findLang(code);
    if (!info) return;
    store(STORE_LANG, code);
    loadLang(code, function () {
      currentLang = code;
      root.lang = info.html;
      root.dir = info.dir || 'ltr';
      root.setAttribute('data-lang', code);
      applyTranslations();
      tapeFits.forEach(function (fit) { fit(); });
      // Diğer parçalar (örn. 404 oyunu) dil değişince kendini güncelleyebilsin
      document.dispatchEvent(new CustomEvent('lpx:langchange', { detail: { lang: code } }));
    });
  }

  // Sayfadaki orijinal Türkçe metinler (dil TR'ye dönünce geri yazmak için)
  var originals = new WeakMap();
  var originalAttrs = new WeakMap();

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (!originals.has(el)) originals.set(el, el.textContent);
      var value = t(el.getAttribute('data-i18n'));
      el.textContent = value == null ? originals.get(el) : value;
    });
    // Çeviri dosyaları bizim yazdığımız dosyalar olduğu için HTML olarak eklenmesi güvenlidir
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      if (!originals.has(el)) originals.set(el, el.innerHTML);
      var value = t(el.getAttribute('data-i18n-html'));
      el.innerHTML = value == null ? originals.get(el) : value;
    });
    // Örnek: data-i18n-attr="aria-label:nav.label;title:nav.label"
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length !== 2) return;
        var attr = parts[0].trim();
        if (!originalAttrs.has(el)) originalAttrs.set(el, {});
        var saved = originalAttrs.get(el);
        if (!(attr in saved)) saved[attr] = el.getAttribute(attr) || '';
        var value = t(parts[1].trim());
        el.setAttribute(attr, value == null ? saved[attr] : value);
      });
    });
    // Sayfa başlığı (sekmede görünen): <title data-i18n-title="anahtar">
    var titleKey = document.documentElement.getAttribute('data-i18n-title');
    if (titleKey) {
      if (!originals.has(document)) originals.set(document, document.title);
      document.title = t(titleKey) || originals.get(document);
    }
    // Polis bandı yazısı: <div class="tape" data-tape> içine çevrilmiş metin tekrar tekrar yazılır
    document.querySelectorAll('.tape[data-tape]').forEach(function (el) {
      var word = t('tape.unstable') || 'STABİL DEĞİL';
      el.textContent = new Array(7).join(word + ' ⚠ ') + word;
    });
    // Dil seçicide seçili dili işaretle
    document.querySelectorAll('.lang-option').forEach(function (btn) {
      if (btn.getAttribute('data-lang') === currentLang) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    });
    document.querySelectorAll('.lang-toggle__code').forEach(function (el) {
      el.textContent = currentLang.toUpperCase();
    });
    updateThemeButton();
  }

  /* ---------- 9) Sayfa parçaları ---------- */

  // Sosyal medya sayfasındaki kartlar SOCIALS listesinden çizilir: <div data-socials></div>
  function renderSocials(el) {
    el.innerHTML = SOCIALS.filter(function (s) { return s.url; }).map(function (s) {
      return '<a class="card social-card" href="' + s.url + '" target="_blank" rel="noopener">' +
        '<span class="social-card__icon">' + ICONS[s.icon] + '</span>' +
        '<span class="social-card__text"><strong>' + s.name + '</strong>' +
          '<span data-i18n="' + s.descKey + '">' + s.desc + '</span>' +
          '<span class="social-card__handle" dir="ltr">' + s.handle + '</span></span>' +
        ICONS.arrow.replace('<svg ', '<svg class="card__arrow" ') +
      '</a>';
    }).join('');
  }

  // "Kopyala" düğmesi: <button data-copy="metin">. Kopyalanınca kısa süre "Kopyalandı!" yazar.
  function setupCopy(btn) {
    var label = btn.querySelector('[data-copy-label]');
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      function done() {
        if (!label) return;
        label.setAttribute('data-i18n', 'contact.copied');
        label.textContent = t('contact.copied') || 'Kopyalandı!';
        clearTimeout(btn._timer);
        btn._timer = setTimeout(function () {
          label.setAttribute('data-i18n', 'contact.copy');
          label.textContent = t('contact.copy') || 'Adresi kopyala';
        }, 2000);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
      // Eski tarayıcılar ve dosyadan açılan sayfalar için yedek yöntem
      function fallback() {
        var area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        try { document.execCommand('copy'); done(); } catch (e) { /* kopyalanamadı */ }
        area.remove();
      }
    });
  }

  // İletişim formu (Web3Forms). Form sayfayı yenilemeden gönderilir, sonuç formun altında yazar.
  // Erişim anahtarı (access_key) boşsa form kapalı durur ve "yakında" mesajı görünür.
  function setupContactForm(form) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    var keyInput = form.querySelector('input[name="access_key"]');

    // Durum mesajı data-i18n ile yazılır; dil değişince kendiliğinden çevrilir
    function show(key, fallbackText, state) {
      status.setAttribute('data-i18n', key);
      originals.set(status, fallbackText);
      status.textContent = t(key) || fallbackText;
      if (state) status.setAttribute('data-state', state);
      else status.removeAttribute('data-state');
      status.hidden = false;
    }

    if (!keyInput || !keyInput.value.trim()) {
      form.querySelectorAll('input, textarea, button').forEach(function (el) { el.disabled = true; });
      form.classList.add('is-disabled');
      show('form.notReady', 'Form yakında açılacak. Şimdilik yukarıdaki e-posta adresinden ulaşabilirsiniz.', 'info');
      return;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (button.disabled) return;   // çift tıklamada iki kez gönderme

      var data = {};
      new FormData(form).forEach(function (value, name) { data[name] = value; });

      button.disabled = true;
      show('form.sending', 'Gönderiliyor…');

      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (json) {
            if (res.ok && json.success) {
              show('form.success', 'Mesajınız gönderildi, teşekkürler!', 'success');
              form.reset();
            } else {
              show('form.error', 'Mesaj gönderilemedi. Lütfen e-posta ile ulaşın.', 'error');
            }
          });
        })
        .catch(function () { show('form.network', 'Bağlantı hatası. İnternetinizi kontrol edip tekrar deneyin.', 'error'); })
        .then(function () { button.disabled = false; });
    });
  }

  // SSS: adresin sonunda #smartscreen gibi bir soru adı varsa o soru açık gelir
  function openFaqFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var target = document.getElementById(id);
    if (target && target.tagName === 'DETAILS') target.open = true;
  }

  /* ---------- Başlat ---------- */

  var header = document.querySelector('[data-layout="header"]');
  var footer = document.querySelector('[data-layout="footer"]');
  if (header) buildHeader(header);
  if (footer) buildFooter(footer);

  if (!root.getAttribute('data-theme')) root.setAttribute('data-theme', 'dark');

  document.querySelectorAll('[data-socials]').forEach(renderSocials);
  document.querySelectorAll('[data-copy]').forEach(setupCopy);
  document.querySelectorAll('[data-contact-form]').forEach(setupContactForm);
  openFaqFromHash();
  window.addEventListener('hashchange', openFaqFromHash);

  renderIcons();
  document.querySelectorAll('[data-pixel]').forEach(buildPixelText);
  startAmbientParticles();

  // Çeviriler yüklenince yazılar değişir ve gizlenen sayfa görünür olur
  loadLang(currentLang, function () {
    applyTranslations();
    root.classList.remove('i18n-pending');
    document.querySelectorAll('.tape').forEach(fitTape);
  });
})();
