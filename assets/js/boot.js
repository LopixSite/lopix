/* =========================================================
   LopiX — Açılış ayarları (sayfa çizilmeden önce çalışır)
   <head> içinde, defer OLMADAN yüklenir. Görevi:
   1) Kayıtlı temayı uygulamak (açık/koyu yanıp sönmesin)
   2) Dili belirlemek: önce kayıtlı seçim, yoksa tarayıcının dili,
      o da desteklenmiyorsa İngilizce
   3) html etiketine lang ve dir (Arapça için sağdan sola) yazmak
   4) Dil Türkçe değilse, çeviriler yüklenene kadar sayfayı gizlemek
      (önce Türkçe görünüp sonra değişmesin diye)
   ========================================================= */
(function () {
  'use strict';

  // Desteklenen diller. name: dilin kendi dilindeki adı (seçicide görünür)
  // html: <html lang="..."> değeri, dir: yazı yönü
  var LANGS = [
    { code: 'tr', name: 'Türkçe', html: 'tr' },
    { code: 'en', name: 'English', html: 'en' },
    { code: 'de', name: 'Deutsch', html: 'de' },
    { code: 'fr', name: 'Français', html: 'fr' },
    { code: 'es', name: 'Español', html: 'es' },
    { code: 'it', name: 'Italiano', html: 'it' },
    { code: 'pt', name: 'Português', html: 'pt' },
    { code: 'ru', name: 'Русский', html: 'ru' },
    { code: 'uk', name: 'Українська', html: 'uk' },
    { code: 'pl', name: 'Polski', html: 'pl' },
    { code: 'nl', name: 'Nederlands', html: 'nl' },
    { code: 'az', name: 'Azərbaycanca', html: 'az' },
    { code: 'ar', name: 'العربية', html: 'ar', dir: 'rtl' },
    { code: 'ja', name: '日本語', html: 'ja' },
    { code: 'ko', name: '한국어', html: 'ko' },
    { code: 'zh', name: '中文', html: 'zh-Hans' },
    { code: 'hi', name: 'हिन्दी', html: 'hi' }
  ];

  var STORE_THEME = 'lpx-theme';
  var STORE_LANG = 'lpx-lang';
  var root = document.documentElement;

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function find(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i];
    return null;
  }

  // Tarayıcının dil listesinden desteklenen ilk dili bul (örn. "de-AT" → "de")
  function detect() {
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < list.length; i++) {
      var base = String(list[i] || '').toLowerCase().split('-')[0];
      if (find(base)) return base;
    }
    return 'en';
  }

  // 1) Tema
  var theme = read(STORE_THEME);
  if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);

  // 2-3) Dil
  var lang = find(read(STORE_LANG)) ? read(STORE_LANG) : detect();
  var info = find(lang);
  root.lang = info.html;
  root.dir = info.dir || 'ltr';
  root.setAttribute('data-lang', info.code);

  // 4) Türkçe dışındaki dillerde çeviri gelene kadar gizle (CSS: .i18n-pending)
  if (info.code !== 'tr') root.classList.add('i18n-pending');

  // main.js bu bilgileri kullanır
  window.LPX = { LANGS: LANGS, lang: info.code, STORE_LANG: STORE_LANG, STORE_THEME: STORE_THEME };
})();
