# Yol Haritası

LopiX'in (MehPiX ekibi) kişisel sitesi. Düz HTML/CSS/JS ile yapılır, GitHub Pages'te yayınlanır.
Tasarım referansı: **m07-site** (yerleşim, kart yapısı, dil altyapısı mantığı). Renkler, logo ve 404 sayfası bu siteye özgüdür.

Her faz ayrı bir branch'te yapılır ve Pull Request ile `main`'e girer.

## Sabit kararlar

- **Renkler:** siyah zemin + neon lime vurgu. Açık temada da lime'ın okunaklı, koyu bir tonu kullanılır.
- **Sayfalar (çok sayfalı):** Ana Sayfa, Projelerim, Ben Kimim, SSS, Bana Ulaşın, Sosyal Medya, 404
- **Diller (17):** Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca, Portekizce, Rusça,
  Ukraynaca, Lehçe, Hollandaca, Azerbaycanca, Arapça (sağdan sola), Japonca, Korece, Çince, Hintçe
- **İletişim e-postası:** lopix037@gmail.com
- **Sosyal medya:** YouTube (https://www.youtube.com/@Lopixlondrus); Discord linki gelince eklenecek
- **Yayın:** siteyi arkadaşım (LopiX) kendi GitHub hesabında yayınlayacak

## Faz 0 — Hazırlık ve ilk yükleme ✅
- `git init`, `.gitignore`, `.gitattributes`, README, CHANGELOG, PROGRESS, bu ROADMAP
- Geçici "yapım aşamasında" sayfası
- GitHub reposu LopiX'in hesabında açılır: `main` koruma kuralı, Dependabot uyarıları, GitHub Pages
  (repo adı/adres LopiX'in hesabına göre netleşecek; yükleme LopiX'te)

## Faz 1 — Tasarım temeli (`feature/design-system`) ✅
- Renk değişkenleri (koyu + açık tema; lime tonları LopiX logosundan alındı)
- Yazı tipleri: Exo 2 (başlık), Inter (gövde), Pixelify Sans (pixel etiketler), JetBrains Mono (sürüm/hash)
- LopiX logosu: menü, alt bilgi, favicon ve neon çerçeveli büyük görsel
- Menü, alt bilgi (footer), açık/koyu tema düğmesi
- Kodla çizilen, neon lime parlayan pixel **LPX** yazısı
- Arka plan parçacık efekti ("hareketi azalt" ayarına uyar)
- Kart, düğme, rozet ve "STABİL DEĞİL" polis bandı bileşenleri
- `tasarim.html`: bütün bileşenlerin vitrini (arama motorlarına kapalı)

## Faz 2 — Dil altyapısı (`feature/i18n`) ✅
- Her dil ayrı bir dosyada (`assets/lang/en.js`, `de.js` …); sadece seçilen dil (ve yedek dil İngilizce) yüklenir.
  Türkçe asıl metin HTML'de durur, ayrı dosyası yoktur
- Menü, alt bilgi, tema ve dil seçici yazıları şimdiden 17 dilde
- Menüde 17 dilli seçici; her dil kendi adıyla görünür (Deutsch, Español, 日本語 …)
- İlk girişte tarayıcı dili algılanır, seçim tarayıcıda hatırlanır
- Arapça için sağdan sola (RTL) yerleşim: menü ve kartlar aynalanır
- Bir metnin çevirisi eksikse önce İngilizcesi, o da yoksa Türkçesi görünür; sayfa bozulmaz

## Faz 3 — Sayfalar ve içerik (`feature/pages`) — TR + EN ✅
- **Ana Sayfa:** giriş, bölüm kartları, "MehPiX sitesine git" kartı (https://mehpix.github.io)
- **Ben Kimim:** tanıtım metni (onaylanan hâli)
- **Projelerim:** şimdilik "Yakında" boş durumu; "Hazır" ve "Üzerinde çalıştığım" bölümleri hazır.
  Kart şablonunda indirme, sürüm notları, kaynak kodu ve SHA-256 alanları var, README'de kart ekleme anlatılır
- **SSS:** açılır-kapanır sorular: SmartScreen (resimli "Daha fazla bilgi → Yine de çalıştır" adımları),
  uygulamalar ücretsiz mi, kaynak kodu nerede, hata bulursam ne yapayım, hangi işletim sistemleri,
  MehPiX ile bağlantı
- **Bana Ulaşın:** e-posta düğmesi; form alanı hazır ama kapalı (Web3Forms anahtarı gelince açılır)
- **Sosyal Medya:** YouTube kartı; Discord kartı link gelene kadar gizli
- Footer'da MehPiX linki

## Faz 4 — 404 mini oyunu (`feature/404-game`) ✅
- Pixel art LopiX karakteri, neon titreşimli "404" yazısı
- Basit bir zıplama oyunu: engellerin üstünden atla, skor ve en yüksek skor (tarayıcıda saklanır)
- Klavye (Boşluk/↑) ve dokunmatik ekran desteği, mobilde de oynanır
- "Ana sayfaya dön" düğmesi her zaman görünür; "hareketi azalt" açıksa oyun kendiliğinden başlamaz
- 17 dil desteği

## Faz 5 — 15 dilin çevirisi (`feature/translations`) ✅
- Kalan 15 dile bütün metinlerin çevirisi
- Her dilde sayfa sayfa kontrol: taşan yazı, Arapça yerleşim, Asya dillerinin yazı tipleri

## Faz 6 — Cilalama (`chore/polish`) ✅
- SEO: başlıklar, 17 dile çevrilen açıklamalar, canonical adresler, `sitemap.xml`, `robots.txt`,
  ana sayfada yapılandırılmış veri (site + LopiX + YouTube)
- Paylaşım önizlemesi (`assets/img/og-image.jpg`, 1200×630) ve Open Graph / Twitter kartı etiketleri
- Mobil, erişilebilirlik ve hız testi: 7 sayfa × 6 kombinasyon (TR/AR/DE mobil, EN/JA masaüstü, koyu/açık tema)
- Sayfa açılırken içerik kayması (menü ve yazı tipi) giderildi
- Site adresi yer tutucu: `https://lopixsite.github.io/` (LopiX'in adresi belli olunca değiştirilir)
- Sürüm etiketi önerisi: `v1.0.0` (ilk yüklemeden sonra)

## Sonraya kalanlar (LopiX ekleyecek)
- Projeler: logo, açıklama, sürüm, GitHub Releases indirme linkleri
- İletişim formu: lopix037@gmail.com ile Web3Forms anahtarı alınıp bağlanacak
- Discord linki
- (Ayrı repo) mpx-site'taki ekip bölümüne LopiX'in eklenmesi
