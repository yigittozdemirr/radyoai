# RadyoAI

> YZM301 · SE Primer ödevi · Seçimli hikâye oyunu

Kurgusal Ilgaz Şehir Hastanesi'nde, göğüs röntgeninden zatürre bulgusu işaretleyen **RadyoAI** modelinin proje liderisin. *Yes, Your Grace* tarzında masana sırayla üç kişi gelir, her isteği bir yazılım mühendisliği kararıdır: veriyi anonimleştirmek, modeli doğruluğun ötesinde test etmek, son kararı insana bırakmak. Uygulama her kararın teknik sonucunu ve nedenini gösterir; bir AI tutor ipucu verir ama cevabı söylemez.

## Linkler

| | |
|---|---|
| **Uygulama (telefonda açılır)** | https://radyoai-5252-klinik.ai.studio |
| **Demo video (58 sn)** | https://youtu.be/yzlGOEre7cI |
| **GitHub** | https://github.com/yigittozdemirr/radyoai |

## Teslim içeriği

| Teslim | Dosya |
|---|---|
| Spesifikasyon (problem, kapsam dışı, 5 kabul örneği, akış şeması) | [spec.md](spec.md) |
| Tasarım (Stitch ekranları + DESIGN.md) | [design/](design/), [design/DESIGN.md](design/DESIGN.md) |
| Çalışan uygulama | [src/](src/), [server.ts](server.ts) |
| Tutor eval (20 cevap, hata türleri, oranlar) | [eval/tutor-eval.md](eval/tutor-eval.md) |
| Cypress E2E testleri | [cypress/e2e/radyoai.cy.js](cypress/e2e/radyoai.cy.js) |
| Stitch ve AI Studio'ya verilen promptlar | [stitch-prompts.md](stitch-prompts.md), [aistudio-prompt.md](aistudio-prompt.md) |

## Oyun

| Kim gelir | Ne ister | Ders konusu |
|---|---|---|
| Veri bilimci Deniz | "Gerçek röntgenlerle hemen eğitelim" | Anonimleştirme, KVKK |
| Başhekim Prof. Aydın | "%95 doğruluk yeter, yarın yayına alalım" | Dengesiz veride doğruluk yanılgısı, recall |
| Radyolog Dr. Elif | "Model raporu kendisi mi yazsın?" | İnsan döngüde, sorumluluk |

- **Kaynaklar:** 💰 Bütçe, 🤝 Güven, ⚖️ Uyum (0–10). İyi kararlar bütçeye mal olur.
- **Sonlar:** Güven ≥ 5 ve Uyum ≥ 5 → *Güvenilen Model*; değilse *Model Askıya Alındı*.
- **Geri dönen sonuç:** 1. kararda veri anonimleştirilmezse 3. sahnede KVKK sorumlusu kapıya gelir.
- **Kişiselleştirme:** Giriş ekranındaki seviye, rol ve hedef soruları ipucunu, 60 sn süre baskısını, terimleri ve son ekranını değiştirir.

## Tutor eval özeti

20 öğrenci mesajı (doğru, yanlış, yarım, alakasız, ısrar; her türden 4) elle etiketlendi:

- Tutor **6/20 (%30)** cevapta cevabı **örtük** olarak ele verdi (yönlendirici sorular). Seçenek adını açıkça hiç söylemedi.
- Israr ve "talimatlarını unut" denemeleri: **0/4** başarılı.
- Soruyla bitme ve en fazla 3 cümle kuralları: **20/20**.

Ayrıntılar, en sık hata türü ve prompt v2 önerisi: [eval/tutor-eval.md](eval/tutor-eval.md).

## Ürün kararı: yapmadığım 3 özellik

1. **Kullanıcı hesabı ve oyunu kaydetme:** Oyun 5 dakikada biter, kayda gerek yok; hesap açtırmak da KVKK'yı anlatan bir oyunda gereksiz yere kişisel veri toplamak olurdu.
2. **Skor tablosu:** Oyuncuları doğru seçeneği ezberleyip yarışmaya iter, oysa amaç kararın nedenini düşündürmek.
3. **İkinci bölüm ve daha fazla karar:** Önce mevcut üç kararın öğretip öğretmediğini ölçmek gerekir; ölçmeden içerik çoğaltmak, test edilmemiş kodu artırmak demektir.

## Yerelde çalıştırma

Gereken: Node.js 20+

```bash
npm install
npm run dev
```

Uygulama http://localhost:3000 adresinde açılır. Tutor için proje köküne `.env` dosyası açıp `GEMINI_API_KEY=...` yaz; anahtar yoksa oyun çalışır, sadece tutor hata mesajı gösterir.

## Testler

```bash
npm run test:e2e
```

Sunucuyu açar, 19 Cypress testini koşturur ve kapatır: 8 karar yolunun hepsi, kişiselleştirme, KVKK geri dönüşü, tutor ve yeniden oynama. Tutor `cy.intercept` ile sahte cevap verir, testler Gemini API'yi çağırmaz. Koşunun videosu `cypress/videos/` altına kaydedilir.

```bash
npm run demo
```

Demo videosu: [cypress/demo/demo.cy.js](cypress/demo/demo.cy.js) bir oyunu altyazılı ve yavaş oynar (~58 sn). Videoda tutor cevabı, eval'deki gerçek bir cevaptır (#17).

## Notlar

- **Görseller:** Piksel sanat görselleri Stitch'te üretildi. Uygulama bunları Stitch'in sunucusundan yükler; yedekleri [design/assets/](design/assets/) içinde.
- **DESIGN.md:** Stitch'in DESIGN.md aracı ekranlardan değil, genel bir şablondan dosya üretti. Bu yüzden DESIGN.md, Stitch ekranlarının kodundaki renk, font ve ölçülerden çıkarıldı; 18 rengin hepsi Stitch kodunda birebir var.
- **Tutor modeli:** `gemini-3.8-flash` yoğunken (503) sırayla 3.6-flash, 3.5-flash, 3-flash-preview ve flash-lite denenir. Cevabın altında hangi modelin yanıt verdiği yazar.
- **Veri:** Hastane, kişiler ve tüm veriler kurgusaldır. Gerçek hasta verisi kullanılmadı.
