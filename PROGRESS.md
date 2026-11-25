# İlerleme Notları

### [2026-11-23 - Mehbur07] (Faz 6)
- **Yapılanlar & Kararlar:**
  - Faz 6 tamamlandı: 6 sayfaya canonical + Open Graph + Twitter kartı etiketleri; `sitemap.xml` (6 sayfa, tasarim/404 hariç), `robots.txt`; ana sayfada JSON-LD (WebSite + Person, sameAs YouTube, memberOf MehPiX)
  - Site adresi bilinmediği için yer tutucu `https://lopixsite.github.io/` (`.invalid` hiçbir gerçek siteye ait olamaz); README'de "Site adresini yazmak" bölümü (VS Code Ctrl+Shift+H)
  - Meta açıklamaları `data-i18n-attr="content:desc.*"` ile 16 dile çevrildi (6 anahtar; her dil dosyası artık 138, en.js 139 anahtar). og:* etiketleri Türkçe kalır (paylaşım uygulamaları JS çalıştırmaz)
  - `assets/img/og-image.jpg` (1200×630, 114 KB): pixel LPX, "LopiX", "Oyun ve yazılım projeleri", neon çerçeveli logo; geçici klasördeki HTML'den Chrome ile çizildi
  - Kayma düzeltmeleri: `.site-header` için baştan yer ayrıldı (JS menüsü gelince içerik ~69 px kayıyordu, CLS 0,087 → 0); Arial'dan ölçüye uydurulmuş "Inter Fallback" yazı tipi (yazı tipi değişim kayması 0,076 → 0,001)
  - Test: Lighthouse indirme izni otomatik güvenlik kontrolüne takıldı; yerine kurulu Chrome + DevTools Protocol ile kendi denetim scripti (geçici klasörde). 7 sayfa × 6 kombinasyon (mobil TR koyu/açık, AR, DE; masaüstü EN, JA açık) = 42 test sorunsuz: yatay taşma, konsol hatası, eksik alt/isim, başlık sırası, 24 px dokunma hedefi, form etiketi yok. Kontrast uyarıları ölçüm hatasıydı (çerçeveli düğmenin içi `::before` ile boyanıyor); gerçek oranlar 6,0–15,9
  - Hız (yavaş 4G + 4x yavaş işlemci, mobil): FCP 0,7–1,0 sn, LCP 0,7–1,1 sn, CLS ≤ 0,009, sayfa 285–387 KB (bunun ~259 KB'ı Google Fonts)
- **Son Commit:** ilk yükleme, commit yok
- **Aktif Branch:** main (henüz commit yok)
- **Sıradaki İlk İş (Next Action):** Yol haritası bitti. LopiX'in GitHub kullanıcı adı/repo adı öğrenilince: `lopixsite.github.io` bul-değiştir + `404.html` `var root` ayarı, ardından LopiX'in hesabında ilk yükleme ve `v1.0.0` etiketi
- **Bilinen Sorunlar / Dikkat Edilmesi Gerekenler:**
  - Site adresi yazılmadan yayınlanırsa canonical/og/sitemap geçersiz adresi gösterir (önizleme görseli çıkmaz)
  - Bütün diller tek adreste (JS ile); Google arama sonucunda İngilizce hâli görebilir, paylaşım önizlemeleri her zaman Türkçe
  - Lighthouse puanı alınamadı (izin); yayından sonra PageSpeed Insights (pagespeed.web.dev) ile bakılabilir
  - Çevirilerin anadili konuşanlarca kontrolü hâlâ önerilir (az, hi, ar)

### [2026-11-23 - Mehbur07] (Faz 5)
- **Yapılanlar & Kararlar:**
  - Faz 5 tamamlandı: 15 dile (de, fr, es, it, pt, ru, uk, pl, nl, az, ar, ja, ko, zh, hi) 115 sayfa + oyun metni çevrildi; her dil dosyası 132 anahtar (en.js 133: + `demo.fallback`, vitrinde yedek dil örneği için bilerek sadece EN)
  - Cinsiyetsiz dil: ru/uk/pl'de geçmiş zaman yerine şimdiki zaman/isim cümlesi; ar'da ziyaretçiye çoğul hitap, LopiX için cinsiyetli fiil yok; hi'de emir kipi ve isim cümleleri; es/it/pt'de cinsiyetli sıfat ("encantado", "obrigado") kullanılmadı
  - SmartScreen çizimindeki düğme adları o dildeki Windows ifadelerine göre; adım metnindeki kalın yazı ile birebir aynı (scriptle denetlendi)
  - Fransızcada ? ! : ; öncesi bölünmez boşluk
  - Hitap: de/es/it/pl/nl "du/tú/tu/ty/je" (samimi), fr/ru/uk/az/pt "vous/вы/siz/você"
  - Düzeltmeler: SSS adım etiketi pixel yazı tipinden başlık yazı tipine ("2" rakamı "8"e benziyordu); ja/ko/zh/hi/ar'da oyun başlığı ve skor tablosu da okunaklı yazı tipine geçer; SSS adım kartları üstten hizalı
  - Denetim: anahtar seti ve HTML yapısı (linkler, kalın yazılar) 15 dilde EN ile aynı, kontrol karakteri yok, `node --check` temiz
  - Test: de/fr/ar/ja/hi/ru/ko masaüstü ve de/ar mobil ekran görüntüleri; konsol hatası yok
- **Son Commit:** ilk yükleme, commit yok
- **Aktif Branch:** main (henüz commit yok)
- **Sıradaki İlk İş (Next Action):** Faz 6 — `chore/polish` (SEO, sitemap/robots, og-image, mobil/erişilebilirlik/hız testi)
- **Bilinen Sorunlar / Dikkat Edilmesi Gerekenler:**
  - Çeviriler Claude tarafından yapıldı; anadili konuşanların kontrolü önerilir (özellikle az, hi, ar)
  - Çevirileri üreten yardımcı scriptler geçici klasördeydi; artık çeviriler doğrudan `assets/lang/*.js` dosyalarında düzenlenir
  - Meta açıklamaları (description) hâlâ sadece Türkçe (Faz 6'da ele alınacak)

### [2026-11-23 - Mehbur07] (Faz 4)
- **Yapılanlar & Kararlar:**
  - Faz 4 tamamlandı: `404.html` + `assets/js/game404.js` ("Kayıp Sayfa Koşusu") + CSS bölüm 20 + EN çeviriler (13 anahtar)
  - Oyun: 320x120 canvas, `image-rendering: pixelated`; sprite'lar koddaki harf haritaları (bize özgü çizimler: kapüşonlu LopiX, bug, uçan glitch, lime bit)
  - Engeller: bug, çift bug (skor > 120), kırık blok (12/16 px), uçan glitch (skor > 250, altından geçilir); bit +25 puan; hız 2.2 → 4.6
  - Kontroller: Boşluk/↑/W, dokunma; basılı tutunca yüksek zıplama; zıplama tamponu; bitişten sonra 450 ms yeniden başlama koruması; düğme/link odaktayken veya oyun ekranda değilken Boşluk'a karışmaz
  - Rekor `lpx-404-best` anahtarıyla localStorage'da; renkler CSS değişkenlerinden (açık tema destekli); sekme gizlenince döngü durur; "hareketi azalt"ta bekleme animasyonu, sarsıntı ve yanıp sönme yok
  - 404 `<base>` kökü: varsayılan '/', dosyadan açınca dosyanın klasörü (README'de repo adına göre değiştirme talimatı)
  - Test: Node'da sahte DOM ile mantık testi (çarpma, rekor kaydı, yeniden başlama koruması), TR/EN/AR ve açık tema ekran görüntüleri, sprite önizlemesi
- **Son Commit:** ilk yükleme, commit yok
- **Aktif Branch:** main (henüz commit yok)
- **Sıradaki İlk İş (Next Action):** Faz 5 — `feature/translations` (15 dile bütün sayfa ve oyun metinlerinin çevirisi)
- **Bilinen Sorunlar / Dikkat Edilmesi Gerekenler:**
  - LopiX'in repo adı `kullaniciadi.github.io` değilse `404.html` içindeki `var root='/'` değiştirilmeli
  - Headless tarayıcının sanal zaman modu animasyon karelerini seyrek çalıştırıyor; oyunu ekran görüntüsüyle test ederken bu yanıltıcı olabilir (mantık testi Node'da yapıldı)

### [2026-11-23 - Mehbur07] (Faz 3)
- **Yapılanlar & Kararlar:**
  - Faz 3 (sayfalar) tamamlandı: `index.html` (geçici sayfanın yerine), `projelerim.html`, `ben-kimim.html`, `sss.html`, `iletisim.html`, `sosyal-medya.html`; hepsi TR (HTML) + EN (`en.js`, 120 anahtar)
  - Projelerim: kart yoksa "Yakında" kutusu (CSS `:has()`); yorum satırında kart şablonu ve ekleme rehberi
  - SSS: SmartScreen sorusu `#smartscreen` ile açılır (adres sonundaki #id o soruyu açar); 2 adımlı şematik çizim (gerçek pencerenin kopyası değil)
  - Bana Ulaşın: mailto + "Adresi kopyala"; Web3Forms formu `access_key` boşken kapalı ("yakında" mesajı); spam tuzağı (botcheck)
  - Sosyal Medya: kartlar `SOCIALS` listesinden çizilir; Discord linki boş → görünmez
  - Polis bandı yazısı `data-tape` ile çevrilir (EN: "NOT STABLE")
  - Ana sayfa üst etiketi "Oyun · Yazılım" yapıldı ("MehPiX ekibi" Türkçe büyük harfte "MEHPİX" çıkıyordu)
  - Ben Kimim'de LopiX hakkında uydurma bilgi yok: sadece onaylı metin, ilgi alanları (oyun, yazılım, açık kaynak) ve MehPiX bağlantısı
  - Test: 6 sayfa TR masaüstü, EN ana sayfa, EN mobil SSS; kart eklenince boş durumun kalkması, bant çevirisi, #hata ile soru açılması; konsol hatası yok
- **Son Commit:** ilk yükleme, commit yok
- **Aktif Branch:** main (henüz commit yok)
- **Sıradaki İlk İş (Next Action):** Faz 4 — `feature/404-game` (pixel art zıplama mini oyunu)
- **Bilinen Sorunlar / Dikkat Edilmesi Gerekenler:**
  - TR/EN dışındaki 15 dilde sayfa içerikleri İngilizce görünüyor (Faz 5)
  - Meta açıklamaları (description) sadece Türkçe; SEO/paylaşım önizlemesi Faz 6'da
  - Projeler, Web3Forms anahtarı ve Discord linki LopiX'ten gelecek (README'de "LopiX'in dolduracağı yerler")

### [2026-11-23 - Mehbur07] (Faz 2)
- **Yapılanlar & Kararlar:**
  - Faz 2 (dil altyapısı) tamamlandı: `assets/js/boot.js` (dil/tema ön ayarı, dil listesi), `main.js` içinde dil seçici + çeviri motoru, `assets/lang/` altında 16 dil dosyası
  - Dil sırası: kayıtlı seçim (`lpx-lang`) → tarayıcı dili → İngilizce. Yedek dil: seçili dil → EN → HTML'deki TR
  - Dil dosyaları `<script>` ile yüklenir (çift tıklayıp açınca da çalışır); klasör yolu `main.js`'in adresinden bulunur (404 sayfası için)
  - Türkçe dışı dilde çeviri gelene kadar sayfa gizli (`.i18n-pending`); JS çalışmazsa 1,5 sn sonra kendiliğinden görünür
  - Arapça: `dir="rtl"`, harf aralığı sıfır; ja/ko/zh/hi/ar'da pixel etiketler sistem yazı tipine geçer
  - Alt bilgi cümlesi cinsiyetsiz yapıldı ("Oyun ve yazılım projeleri. MehPiX ekibinin bir parçası.") — bazı dillerde fiil/sıfat cinsiyete göre değişiyor
  - Hamburger menü sınırı 960px → 1080px (Almanca/Hintçe gibi uzun menü yazıları için)
  - Test: tr/de/ar/ja/ru/hi tarayıcı diliyle otomatik algılama, dil menüsüne tıklama (uk), mobil Arapça; konsol hatası yok
- **Son Commit:** ilk yükleme, commit yok
- **Aktif Branch:** main (henüz commit yok)
- **Sıradaki İlk İş (Next Action):** Faz 3 — `feature/pages` (6 sayfa, TR + EN içerik)
- **Bilinen Sorunlar / Dikkat Edilmesi Gerekenler:**
  - Sayfa içerikleri henüz sadece Türkçe; Arapça seçiliyken çevrilmemiş Türkçe cümlelerde noktalama ters yerde görünür (Faz 5'te çeviriyle düzelir)
  - Çeviriler (TR/EN dışı) Claude tarafından yapıldı; anadili konuşan biri kontrol ederse daha doğal olur
  - `index.html` hâlâ geçici sayfa (boot.js/main.js kullanmıyor)

### [2026-11-23 - Mehbur07] (Faz 1)
- **Yapılanlar & Kararlar:**
  - Faz 1 (tasarım temeli) tamamlandı: `assets/css/style.css`, `assets/js/main.js`, `tasarim.html`
  - LopiX logosu: orijinal `kaynak-gorseller/` içinde (git'e girmez); kırpılmış 640px ve 96px kopyalar, favicon.ico, favicon-32, apple-touch-icon üretildi
  - Renkler logodan ölçüldü: `--lime #c4f53a`, `--lime-bright #e8fb8c`; açık temada yazı vurgusu `#3f6a00`
  - Yazı tipleri: Exo 2, Inter, Pixelify Sans, JetBrains Mono. Press Start 2P denendi ama Türkçe İ/Ş/Ğ harfleri olmadığı için Pixelify Sans'a geçildi
  - Stiller sağdan sola dillere hazır (`inline-start/end`); dil seçici için menüde `.lang-slot` yeri ayrıldı; çevrilecek yazılarda `data-i18n` anahtarları hazır
  - Discord `SOCIALS` listesinde boş linkle duruyor (sitede görünmüyor)
  - Masaüstü/dar ekran ve koyu/açık temada ekran görüntüsüyle kontrol edildi
- **Son Commit:** ilk yükleme, commit yok
- **Aktif Branch:** main (henüz commit yok)
- **Sıradaki İlk İş (Next Action):** Faz 2 — `feature/i18n` (17 dilli seçici, dil dosyaları, tarayıcı dilini algılama, Arapça RTL)
- **Bilinen Sorunlar / Dikkat Edilmesi Gerekenler:**
  - `index.html` hâlâ geçici sayfa (yeni stil dosyasını kullanmıyor); gerçek ana sayfa Faz 3'te
  - Repo adı ve site adresi LopiX'in GitHub hesabına göre netleşecek; canonical/sitemap adresleri Faz 6'da yazılacak
  - Projeler, Web3Forms anahtarı ve Discord linki LopiX'ten gelecek
  - Pixelify Sans Arapça/Japonca/Çince/Hintçe harf içermez; bu dillerde etiketler sistem yazı tipiyle görünür (Faz 5'te kontrol)

### [2026-11-23 - Mehbur07] (Faz 0)
- **Yapılanlar & Kararlar:**
  - Faz 0: `git init` (branch `main`), `.gitignore`, `.gitattributes`, `.nojekyll`, README, CHANGELOG, ROADMAP, PROGRESS
  - Geçici `index.html`: siyah + neon lime, SVG ile çizilen pixel LPX logosu, TR/EN "yapım aşamasında" yazısı, YouTube ve MehPiX düğmeleri, `noindex`
  - Kararlar: düz HTML/CSS/JS, çok sayfalı yapı, 17 dil (Arapça sağdan sola), açık + koyu tema, 404 = pixel zıplama mini oyunu, e-posta lopix037@gmail.com, sadece YouTube linki (Discord sonra)
  - Siteyi LopiX kendi GitHub hesabında yayınlayacak; kod bu klasöre yazılıyor, GitHub'a yükleme LopiX'te
- **Son Commit:** ilk yükleme, commit yok
- **Aktif Branch:** main
- **Sıradaki İlk İş (Next Action):** Faz 1 — `feature/design-system`
- **Bilinen Sorunlar / Dikkat Edilmesi Gerekenler:**
  - Geçici sayfadaki `noindex` Faz 3'te gerçek ana sayfayla birlikte kalkacak
