# LED Panel - Otopark Reklam Sistemi

55 inç TV için tasarlanmış **DİKEY (PORTRAIT)** LED panel reklam ve bilgilendirme sistemi.

## Özellikler

- **Üst Panel (1/3 Ekran)**: Plaka ve HGS ücret bilgisi gösterimi
- **Alt Panel (2/3 Ekran)**: Otomatik slayt geçişli reklam alanı
- **Çözünürlük**: 1080x1920 (Full HD Dikey/Portrait)
- **Otomatik Geçiş**: Her 5 saniyede bir reklam değişimi

## Kullanım

1. `demo.html` dosyasını bir tarayıcıda açın (örnek reklam içerikli)
2. `fullscreen.html` dosyasını açın ve tam ekran butonuna tıklayın
3. Reklam görsellerini `images/` klasörüne ekleyin:
   - ad1.jpg (1080x1344 önerilen - dikey)
   - ad2.jpg (1080x1344 önerilen - dikey)
   - ad3.jpg (1080x1344 önerilen - dikey)
   - ad4.jpg (1080x1344 önerilen - dikey)

## Özelleştirme

### Plaka ve HGS Güncelleme
```javascript
updatePlate('34 XYZ 789');
updateHGS('25.00');
```

### Slayt Geçiş Süresi
`script.js` dosyasında `slideInterval` değişkenini değiştirin (milisaniye cinsinden).

### Reklam Ekleme/Çıkarma
`index.html` dosyasında `.ad-slide` bölümlerine yeni slide'lar ekleyin ve `slider-dots` kısmına yeni nokta ekleyin.

## Görsel Önerileri

- Dikey (portrait) görseller kullanın
- Önerilen boyut: 1080x1344 piksel (3:4 oran)
- Parlak ve kontrast yüksek renkler kullanın
- Metin varsa büyük ve kalın fontlar tercih edin

## Tam Ekran Kullanımı

TV'de tam ekran görüntü için:
- **TV'yi 90 derece döndürün (portrait/dikey mod)**
- F11 tuşuna basın (Chrome/Firefox)
- Tarayıcıyı kiosk modunda başlatın
- Digital signage yazılımı kullanın

## Kontroller (Test)

- **Sağ Ok**: Sonraki reklam
- **Sol Ok**: Önceki reklam
- **Noktalar**: İlgili reklama geçiş

## Entegrasyon

Gerçek zamanlı plaka ve HGS verisi için `script.js` dosyasındaki fonksiyonları backend sisteminize entegre edin.

---

**Not**: images/ klasörüne kendi reklam görsellerinizi ekleyin.
