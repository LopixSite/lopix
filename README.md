# LopiX — Kişisel Site

MehPiX ekibinden LopiX'in kişisel sitesi: projeler, tanıtım, sık sorulan sorular, iletişim ve sosyal medya.

> Durum: **Faz 6 tamamlandı — yayına hazır.** 6 sayfa ve mini oyunlu 404 sayfası 17 dilin hepsinde hazır;
> SEO, paylaşım önizlemesi ve mobil/erişilebilirlik/hız kontrolleri yapıldı.
> Yayından önce tek eksik: site adresinin yazılması (aşağıda "Site adresini yazmak").
> Planın tamamı için [ROADMAP.md](ROADMAP.md), değişiklik geçmişi için [CHANGELOG.md](CHANGELOG.md).

## Kullanılan teknolojiler

- Düz **HTML, CSS ve JavaScript** (framework yok, derleme adımı yok)
- Yayın: **GitHub Pages** (`main` branch'indeki dosyalar olduğu gibi yayınlanır)
- İndirilebilir dosyalar (uygulamalar): **GitHub Releases**

## Bilgisayarda çalıştırma

Kurulum gerekmez. İki yol var:

1. **En basit:** `index.html` dosyasına çift tıklayıp tarayıcıda açın.
2. **Yerel sunucu ile** (sayfalar arası linkler gerçek sitedeki gibi çalışır):
   ```bash
   python -m http.server 8000
   ```
   Ardından tarayıcıda http://localhost:8000 adresini açın.

## Klasör yapısı

```
index.html               Ana sayfa (giriş, bölüm kartları, MehPiX kartı)
projelerim.html          Hazır ve üzerinde çalışılan projeler (şimdilik boş, "Yakında")
ben-kimim.html           Tanıtım metni ve ilgi alanları
sss.html                 Sık sorulan sorular (SmartScreen adımları çizimli)
iletisim.html            E-posta ve iletişim formu (form, Web3Forms anahtarı girilince açılır)
sosyal-medya.html        Sosyal medya hesapları (main.js içindeki SOCIALS listesinden çizilir)
404.html                 "Sayfa bulunamadı" + "Kayıp Sayfa Koşusu" mini oyunu (GitHub Pages olmayan adreslerde otomatik gösterir)
tasarim.html             Tasarım vitrini: bütün bileşenlerin önizlemesi (arama motorlarına kapalı)
favicon.ico              Sekme ikonu (16/32/48 px)
sitemap.xml              Arama motorları için sayfa listesi (yeni sayfa eklenince buraya da eklenir)
robots.txt               Arama motorlarına tarama izni ve sitemap adresi
assets/css/style.css     Ortak stil: renkler, yazı tipleri, düğmeler, kartlar, menü
assets/js/boot.js        Sayfa çizilmeden önce tema ve dili uygular; desteklenen diller listesi burada
assets/js/main.js        Menü ve alt bilgi, tema düğmesi, dil seçici ve çeviri, ikonlar, pixel LPX, parçacık efekti, polis bandı
assets/js/game404.js     404 sayfasındaki mini oyun (pixel çizimler, zorluk ayarları dosyanın başında)
assets/lang/             Çeviri dosyaları (en.js, de.js … 16 dil); Türkçe asıl metin HTML'dedir
assets/img/              Siteye giren (küçültülmüş) görseller: lopix-logo.jpg (640px), lopix-logo-sm.jpg (menü), favicon'lar, og-image.jpg (paylaşım önizlemesi, 1200×630)
kaynak-gorseller/        Logonun orijinali (git'e girmez, sadece bu bilgisayarda)
.nojekyll                GitHub Pages'in dosyaları Jekyll ile işlemeden olduğu gibi yayınlaması için
ROADMAP.md               Proje fazları
PROGRESS.md              Oturumlar arası ilerleme notları
CHANGELOG.md             Değişiklik geçmişi
```

## Site adresini yazmak (yayından önce, önemli)

Site adresi henüz belli olmadığı için SEO ve paylaşım etiketlerinde yer tutucu adres var:
`https://lopixsite.github.io/` (`.invalid` uzantısı hiçbir gerçek siteye ait olamaz, unutulsa bile başka bir
siteyi göstermez). Şu dosyalarda geçer: 6 sayfanın `<head>` bölümü (`index`, `projelerim`, `ben-kimim`, `sss`,
`iletisim`, `sosyal-medya`), `sitemap.xml` ve `robots.txt`.

Değiştirmek için VS Code'da **Ctrl+Shift+H** (bütün dosyalarda bul-değiştir):
- Aranan: `https://lopixsite.github.io/`
- Yerine: sitenin adresi, **sonunda `/` ile**. Örnek: `https://kullaniciadi.github.io/` ya da
  `https://kullaniciadi.github.io/repo-adi/`
- "Tümünü değiştir"e bas. Ardından `404.html` içindeki `var root` ayarını da kontrol et (aşağıdaki bölüm).

Site `kullaniciadi.github.io/repo-adi` gibi bir alt klasördeyse `robots.txt` okunmaz (arama motorları onu
yalnızca alan adının kökünde arar); o durumda sitemap'i Google Search Console'dan elle bildir.

**SEO notları**
- Sayfa açıklamaları (`<meta name="description">`) Türkçe yazılı, diğer dillerde `desc.*` anahtarlarıyla çevrilir.
  WhatsApp/Discord gibi uygulamalar JavaScript çalıştırmadığı için paylaşım önizlemesinde her zaman Türkçe
  başlık ve açıklama görünür.
- Bütün diller aynı adreste, JavaScript ile değişir. Google sayfaları genelde İngilizce tarayıcı diliyle açtığı
  için arama sonuçlarında İngilizce hâli görünebilir. Her dil için ayrı adres (örn. `/en/`) bu sitede bilerek yok.
- Paylaşım görseli `assets/img/og-image.jpg`; değiştirirsen 1200×630 boyutunda ve 300 KB'tan küçük tut.
- Ana sayfadaki yapılandırılmış veri (`application/ld+json`) LopiX'i ve YouTube kanalını tanıtır;
  yeni bir sosyal hesap eklenince `sameAs` listesine de ekle.
- Yeni sayfa eklenince: `<head>` bölümünü var olan bir sayfadan kopyala (canonical, og:* etiketleri) ve
  `sitemap.xml`'e bir `<url>` ekle.

## 404 sayfası ve site kökü ayarı (önemli)

GitHub Pages `404.html` dosyasını olmayan **her** adreste gösterir (örn. `/a/b/c`). Stil ve resimlerin
doğru yüklenmesi için `404.html` dosyasının başındaki küçük betikte site kökü yazılıdır:

- Site adresi `kullaniciadi.github.io` ise (repo adı da `kullaniciadi.github.io`): `var root='/'` (varsayılan)
- Site adresi `kullaniciadi.github.io/repo-adi` ise: `var root='/repo-adi/'` olarak değiştir

Dosyaya çift tıklayıp açınca kök otomatik olarak dosyanın klasörü olur. Not: `python -m http.server`
olmayan adreslerde 404.html göstermez; sayfayı denemek için doğrudan `404.html` adresini aç.

**Mini oyun "Kayıp Sayfa Koşusu":** Boşluk / ↑ / W veya dokunarak zıplanır, basılı tutunca daha yükseğe
zıplar. Hatalı piksellerin ve kırık blokların üstünden atlanır, uçan glitch'lerin altından geçilir, lime bitler
+25 puan verir. En yüksek skor tarayıcıda saklanır. Hız, yerçekimi gibi ayarlar `game404.js`'in başındadır.

## LopiX'in dolduracağı yerler

- **Proje eklemek:** `projelerim.html` içindeki yorum satırında hazır bir kart şablonu var. Kopyalayıp
  "Hazır Projeler" ya da "Üzerinde Çalıştığım Projeler" bölümündeki `project-grid` kutusunun içine yapıştır.
  Bir bölüme kart eklenince o bölümdeki "Yakında" kutusu kendiliğinden kaybolur. Logoyu `assets/img/`
  klasörüne 256×256 boyutunda koy; dosyalar GitHub Releases'e yüklenir.
  Proje açıklaması gibi yeni yazılar için `data-i18n` anahtarı verip İngilizcesini `assets/lang/en.js`'e eklemeyi unutma.
- **İletişim formunu açmak:** https://web3forms.com adresinden lopix037@gmail.com ile ücretsiz bir
  "Access Key" al, `iletisim.html` içindeki `access_key` alanının `value` kısmına yapıştır. Bu anahtar sayfa
  koduna konmak için tasarlanmıştır, gizli bir şifre değildir (yalnızca mesajların hangi e-postaya gideceğini
  belirtir). Boş kaldıkça form kapalı durur ve "yakında" mesajı görünür. Ücretsiz plan aylık 250 mesajla sınırlıdır.
- **Discord'u eklemek:** `assets/js/main.js` içindeki `SOCIALS` listesinde Discord satırının `url` kısmına
  davet linkini yaz. Sosyal Medya sayfasındaki kart ve alt bilgideki link kendiliğinden çıkar.

## Diller (17)

Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca, Portekizce, Rusça, Ukraynaca, Lehçe,
Hollandaca, Azerbaycanca, Arapça (sağdan sola), Japonca, Korece, Çince, Hintçe.

- İlk girişte tarayıcının dili algılanır (desteklenmiyorsa İngilizce açılır); seçilen dil tarayıcıda hatırlanır.
- **Bir yazıyı çevrilebilir yapmak:** HTML'de etikete `data-i18n="anahtar"` ekle (Türkçesi HTML'de kalır),
  diğer dilleri `assets/lang/<kod>.js` dosyalarına aynı anahtarla yaz.
  - İçinde `<b>`, `<a>` gibi etiket olan yazılar için `data-i18n-html="anahtar"`
  - Özellikler için (örn. `alt`, `aria-label`): `data-i18n-attr="alt:anahtar;title:anahtar2"`
  - Sekme başlığı için: `<html data-i18n-title="anahtar">`
- Bir yazının çevirisi bir dilde yoksa önce İngilizcesi, o da yoksa Türkçesi görünür; sayfa bozulmaz.
  Yani yeni bir yazı eklerken en azından İngilizcesini `en.js`'e yazmak yeterli; diğer diller sonradan eklenebilir.
- Çeviriler cinsiyetsiz yazıldı: bazı dillerde (Rusça, Lehçe, Arapça, Hintçe vb.) fiiller konuşanın cinsiyetine
  göre değiştiği için "yaptım" gibi kalıplar yerine geniş zaman ve isim cümleleri kullanıldı. Yeni metin
  eklerken bu kurala dikkat et.
- SSS'deki SmartScreen çizimindeki düğme adları ("Daha fazla bilgi", "Yine de çalıştır"), her dilde Windows'un
  o dildeki ifadelerine göre yazıldı; adım metnindeki kalın yazı ile çizimdeki yazı aynı olmalı.
- **Yeni sayfa:** `<head>` içinde `assets/js/boot.js` dosyası `defer` OLMADAN, `main.js` ise `defer` ile yüklenmeli
  (örnek: `tasarim.html`).

## Sık yapılan düzenlemeler

- **Renkleri değiştirmek:** `assets/css/style.css` dosyasının en üstündeki değişkenler (`--lime`, `--bg` vb.).
  Açık temanın renkleri hemen altındaki `[data-theme="light"]` bölümünde.
- **Menüye sayfa eklemek:** `assets/js/main.js` içindeki `NAV` listesine bir satır ekle.
- **Sosyal medya linkleri:** `assets/js/main.js` içindeki `SOCIALS` listesi. Linki boş bırakılan hesap
  (şu an Discord) sitede görünmez; linki `url` kısmına yazmak yeterli.
- **İkon kullanmak:** HTML'de `<span data-icon="youtube"></span>` yaz; ikon otomatik çizilir.
  Hazır ikonlar `main.js` içindeki `ICONS` listesinde.
- **Pixel yazı:** `<div class="pixel-text" data-pixel="LPX"></div>`. Kullanılabilen harfler
  `main.js` içindeki `GLYPHS` listesinde (L, P, X, 0, 4); yeni harf 5×7'lik bir desenle eklenir.
- **"STABİL DEĞİL" bandı:** Karta `card--taped` sınıfını ve içine
  `<div class="tape" aria-hidden="true">STABİL DEĞİL ⚠ …</div>` ekle; açısı otomatik ayarlanır.
- **Bileşenlerin nasıl göründüğünü görmek:** `tasarim.html` sayfasını aç.

## GitHub'a yükleme ve yayına alma

1. GitHub'da yeni bir repo açın. Adres `kullaniciadi.github.io` olsun istiyorsanız repo adı da tam olarak
   `kullaniciadi.github.io` olmalı.
2. Önce "Site adresini yazmak" bölümündeki bul-değiştiri yapın, sonra bu klasördeki dosyaları repoya
   yükleyin (`.git` klasörü hariç her şey).
3. Repo ayarlarında **Settings → Pages → Build and deployment** kısmında
   *Source: Deploy from a branch*, *Branch: main* ve */ (root)* seçin.
4. Birkaç dakika içinde site yayına girer. Sonraki her `main` güncellemesi otomatik yayınlanır.

Önerilen ek ayarlar:
- **Settings → Rules → Rulesets:** `main` için doğrudan push, force push ve branch silmeyi engelleyen bir kural;
  değişiklikler Pull Request ile girer.
- **Settings → Code security:** Dependabot uyarılarını açın.
