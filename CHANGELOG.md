# Changelog

Bu projedeki önemli değişiklikler bu dosyada tutulur.
Format [Keep a Changelog](https://keepachangelog.com/tr-TR/1.1.0/) esas alınır, sürümler [Semantic Versioning](https://semver.org/lang/tr/) kurallarına uyar.

## [Unreleased]

### Eklendi
- Proje iskeleti kuruldu: README, yol haritası (ROADMAP), ilerleme notları (PROGRESS), `.gitignore` ve `.gitattributes`.
- Siyah ve neon lime renkli, pixel LPX logolu geçici "yapım aşamasında" sayfası eklendi (YouTube ve MehPiX linkleriyle).
- Tasarım sistemi kuruldu: logodan alınan lime renkler, açık/koyu tema, menü, alt bilgi, düğmeler, kartlar,
  rozetler, "STABİL DEĞİL" bandı, SSS, form ve arka plan parçacıkları; hepsi `tasarim.html` vitrininde görülebilir.
- LopiX logosu siteye eklendi: menüde, alt bilgide ve sekme ikonu (favicon) olarak.
- 17 dil altyapısı eklendi: menüde dil seçici, tarayıcı dilinin otomatik algılanması, seçimin hatırlanması
  ve Arapça için sağdan sola yerleşim. Menü ve alt bilgi şimdiden 17 dilde.
- Sitenin 6 sayfası Türkçe ve İngilizce olarak eklendi: Ana Sayfa, Projelerim, Ben Kimim, SSS (SmartScreen
  adımları çizimli), Bana Ulaşın ve Sosyal Medya. Geçici "yapım aşamasında" sayfası kaldırıldı.
- Projelerim'de proje yokken "Yakında" kutusu görünür; iletişim formu Web3Forms anahtarı girilene kadar kapalı
  durur, Discord kartı linki eklenince kendiliğinden çıkar.
- Pixel art 404 sayfası eklendi: neon titreşen "404" yazısı ve "Kayıp Sayfa Koşusu" mini oyunu (LopiX karakteri
  hatalı piksellerin üstünden zıplar, lime bitler toplar; klavye ve dokunmatik destekli, en yüksek skor saklanır).
- Bütün sayfalar ve 404 oyunu 15 dile daha çevrildi; site artık 17 dilin hepsinde tam olarak okunabiliyor.
  SSS'deki SmartScreen adım etiketleri daha okunaklı yazı tipine geçirildi.
- Arama motorları ve paylaşım için hazırlık yapıldı: `sitemap.xml`, `robots.txt`, link paylaşılınca görünen
  önizleme görseli (og-image) ve kartı; sayfa açıklamaları artık seçilen dilde. Site adresi belli olunca
  `SITE-ADRESI.invalid` yazan yerler değiştirilecek (README'de anlatıldı).

### Düzeltildi
- Sayfa açılırken menünün ve yazı tipinin geç gelmesinden kaynaklanan içerik kayması giderildi.
