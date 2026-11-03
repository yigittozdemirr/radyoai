# Sürüm notları

## İzleme bulgusu ve v2.1 (reddedildi)

3 kişiden 5'er oturum, toplam 15 gerçek oturum toplandı (`data/gercek/`). Yayındaki v2.0 bu veriyi hiç görmemişti, bu yüzden 30 gerçek satır (Sahne 2–3) v2.0 için bir dış test kümesidir:

| v2.0, gerçek oyuncularda | |
|---|---|
| ROC-AUC | 0,64 |
| Destek moduna giren oyuncu oranı | **%93** |

**Veri kayması:** Gerçek oyuncular sentetik varsayımdan çok daha hızlı oynuyor. Karar süresi ortancası gerçekte 4,4 sn, sentetikte 15,8 sn. Okuma süresi ortancası gerçekte 0,6 sn, sentetikte 8,0 sn. Bu yüzden v2.0 neredeyse herkesi "aceleci" sayıyor. Aşağıdaki geri alma tetiği ("destek modunun neredeyse herkese açılması") bu durumda tetiklenir.

**v2.1:** Gerçek veri olduğu gibi eklenip yeniden eğitildi. Hold-out ROC-AUC 0,686 < 0,70 çıktı ve `train.py` yayını durdurdu. **Yayınlanmadı.**

## v2.2 planı (eğitimden önce yazıldı)

Kayma, sentetik süre dağılımlarının gerçeğe uymamasından kaynaklanıyor. Tek değişiklik: sentetik üreticinin süre parametreleri, 45 gerçek satırın ölçülen yüzdeliklerinden alınır. "Dikkatli" uç (a = 0) gerçek oyuncuların en yavaş %10'una (p90), "aceleci" uç (a = 1) en hızlı %10'una (p10) denk gelir.

| | v2.0 | v2.2 | Kaynak (gerçek p10 / p90) |
|---|---|---|---|
| `karar_suresi_sn` | N(25 − 18a, 5), [2, 90] | N(16 − 14,8a, 2,5), [0,5; 90] | 1,2 / 15,9 sn |
| `okuma_suresi_sn` | N(12 − 9a, 3), [0,5; 40] | N(3,7 − 3,2a, 0,8), [0,3; 40] | 0,5 / 3,7 sn |

Seçim modeli (P(B) formülü), özellikler, model türü, tohum ve **kabul eşiği (ROC-AUC ≥ 0,70)** değişmez. **Tek deneme yapılır.** Kapıdan geçemezse v2.0 yayında kalır ve sonuç buraya yazılır.

## v2.2.0: yayında

| | |
|---|---|
| Sabitlenen commit | [`fddc655de8537e0c9980a8ca01cdbe4da2eeb545`](https://huggingface.co/Dreemurr0/radyoai-risk-onnx/commit/fddc655de8537e0c9980a8ca01cdbe4da2eeb545) |
| Model | https://huggingface.co/Dreemurr0/radyoai-risk-onnx/resolve/fddc655de8537e0c9980a8ca01cdbe4da2eeb545/model.onnx |
| `model.onnx` sha256 | `88556831f78595d5e7031e8afee6a1de6f732a410f9ec3589c4aef351e9a3a78` |
| Veri | 645 satır: 45 gerçek (15 oturum, 3 kişi × 5) + 600 kalibre sentetik |
| Eval (tek deneme) | Hold-out ROC-AUC **0,723** ≥ 0,70: kapıdan geçti. Kabul örnekleri: aceleci p = 0,64, dikkatli p = 0,004 |

**Gerçek oyuncularda v2.0 → v2.2** (Sahne 2–3, 30 satır):

| | v2.0 | v2.2 |
|---|---|---|
| Destek moduna giren oyuncu oranı | %93 | **%63** |
| Doğruluk (p ≥ 0,5) | 0,37 | 0,47 |
| ROC-AUC | 0,64 | 0,64 |

v2.2, destek modunu herkese açma sorununu büyük ölçüde azalttı. Ama sıralama gücü (AUC) gerçek oyuncularda değişmedi ve destek modu oranı kanarya ölçütümüzün (%10–60) hâlâ biraz üstünde. **Dürüst sınır:** Bu 30 satırın yaklaşık %70'i v2.2'nin eğitim kümesindeydi; yani bu karşılaştırma v2.2 için kısmen eğitim verisi üzerinde yapıldı. Temiz bir ölçüm için yeni oyunculardan toplanacak yeni oturumlar gerekir. Gerçek veride en güçlü sinyal süreler değil, **önceki seçim**: Sahne 1'de B seçenlerin %67'si sonra yine B seçiyor, A seçenlerin %17'si. Bir sonraki sürüm (v2.3) için ilk aday değişiklik bu.

Not: HF commit `3f7d84e` aynı `model.onnx`'i içerir, ama `config.json`'da sürüm yanlışlıkla 2.0.0 yazıyordu. `fddc655` bunu düzeltti; uygulama `fddc655`'e sabitlidir.

**Geri alma:** `src/model/risk.ts` → `MODEL_URL`, v2.0.0 commit'ine (`203d40d…`) ya da boş değere (v1 davranışı) çevrilir.

## v2.0.0: riskli karar modeli (ilk sürüm, geri alma hedefi)

| | |
|---|---|
| Hugging Face reposu | https://huggingface.co/Dreemurr0/radyoai-risk-onnx |
| Sabitlenen commit | [`203d40dbdc20ef0d45a840625ad9dfcf1a17e030`](https://huggingface.co/Dreemurr0/radyoai-risk-onnx/commit/203d40dbdc20ef0d45a840625ad9dfcf1a17e030) |
| Model | https://huggingface.co/Dreemurr0/radyoai-risk-onnx/resolve/203d40dbdc20ef0d45a840625ad9dfcf1a17e030/model.onnx |
| Sözleşme | https://huggingface.co/Dreemurr0/radyoai-risk-onnx/resolve/203d40dbdc20ef0d45a840625ad9dfcf1a17e030/config.json |
| `model.onnx` sha256 | `6708765a73879548012d0b9d208fa4b2ff08b4dc3bb84f15d4039c5e343d205a` |
| Eval | Hold-out ROC-AUC **0,726** (kabul eşiği 0,70), ONNX ↔ sklearn maks fark 7e-8 |

### Ne değişti

- **v1:** Uyum yalnızca girişteki 3 soruya dayanıyordu. "Deneyimliyim" diyen her oyuncu her sahnede 60 sn sayaçla oynuyordu.
- **v2:** Sahne 2 ve 3 açılırken model, oyuncunun önceki sahnelerdeki davranışından (karar süresi, sonuç panelini okuma süresi, önceki riskli seçimler) bu sahnede riskli seçimi yapma olasılığını hesaplar. `p ≥ 0,5` ise sahne destek modunda açılır: ipucu açık, sayaç yok, mentor notu var (spec.md §10).
- Uygulamaya veri toplama modu (`?veri=1`) eklendi.

### Neden `main` değil, commit?

`main` dalı hareketlidir: modele yeni bir yükleme yapıldığında `resolve/main/model.onnx` sessizce değişir. Uygulama da test edilmemiş bir modelle çalışmaya başlar. Commit hash'i ise değişmez; uygulamanın hangi modelle çalıştığı koddan okunur (Sommerville, Bl. 25: konfigürasyon yönetiminde her sürümün tekrar üretilebilir biçimde tanımlanması). Modelin URL'si yalnızca bir yerde tanımlıdır: `src/model/risk.ts` → `MODEL_URL`.

### Yayınlama (yeni sürüm)

```bash
python train.py
hf upload Dreemurr0/radyoai-risk-onnx model . --commit-message "v2.x.y: ..."
```

`train.py` eşiği geçmezse `model/` klasörünü yazmaz, yani yüklenecek yeni bir şey oluşmaz. Yükleme sonrası verilen commit hash'i `MODEL_URL`'ye yazılır, `tests/parite.json` yeniden üretilir ve Cypress parite testi geçmeden sürüm yayınlanmaz.

### Geri alma (rollback)

1. `src/model/risk.ts` içindeki `MODEL_URL`'de commit hash'ini bir önceki sürümün hash'iyle değiştir (sürüm geçmişi bu dosyanın altında).
2. O sürümün referans çıktılarını geri al ve testleri çalıştır: `git checkout <o sürümün git commit'i> -- tests/parite.json`, ardından `npm run test:e2e`.
3. Yeniden yayınla.

Hugging Face'teki eski commit silinmediği için eski model her zaman indirilebilir; geri dönmek yeniden eğitim gerektirmez.

**v2.0.0'ın öncesi yoktur.** Bu sürümde sorun çıkarsa geri dönülecek yer **v1 davranışıdır**: `MODEL_URL` boş bırakılır, uygulama modeli yüklemez ve kurallarla (v1) çalışır. Model indirilemediğinde ya da hata verdiğinde de aynı yedek devreye girer; oyun hiçbir zaman modeli beklerken kilitlenmez.

## Yeni sürümü güvenle devreye alma

Senaryo: gerçek oturumlarla yeniden eğitilen **v2.1** modeli, yayındaki **v2.0**'ın yerini alacak.

| Aşama | Ne olur | Ne ölçülür | Geçiş koşulu |
|---|---|---|---|
| **1. Gölge (shadow)** | Her oyuncuda iki model de çalışır. Oyunu yalnızca v2.0 etkiler; v2.1'in `p` değeri yalnızca veri toplama kaydına yazılır. | İki modelin aynı karara (destek modu açık/kapalı) varma oranı; oyuncunun gerçek seçimine göre iki modelin AUC'si | En az 30 oturumda v2.1'in AUC'si v2.0'dan düşük değil; kararların ≥ %80'i aynı |
| **2. Kanarya (%5)** | Oturumların %5'inde v2.1 oyunu etkiler. Seçim `oturum_id`'den belirlenir; aynı oyun boyunca model değişmez. | Model yükleme hatası, destek moduna girme oranı, oyunu bitirme oranı, iyi son oranı | Hata oranı v2.0'dan yüksek değil; destek modu oranı makul aralıkta (%10–60) |
| **3. Aşamalı geçiş** | %25 → %50 → %100 | Aynı ölçütler | Her basamakta en az 1 gün ve 20 oturum; kötüleşme yoksa sonraki basamak |
| **Geri alma tetiği** | Herhangi bir aşamada | Model yükleme hatası > %2, oyunu bitirme oranında belirgin düşüş ya da destek modunun neredeyse herkese/hiç kimseye açılması | `MODEL_URL` önceki commit'e döner |

Gölge dağıtımın bu oyundaki değeri şu: yeni modeli oyunculara hiç göstermeden gerçek davranışa karşı ölçebiliyoruz. Kanaryada kötü bir model yalnızca 20 oyuncudan birini etkiler.

**Dürüst sınır:** Uygulama tamamen tarayıcıda çalıştığı için şu an bu ölçümleri toplayan bir sunucu yok. Tek gözlem kanalı veri toplama modunun CSV'si. Gerçekte yukarıdaki planı uygulamak için anonim olay kaydı tutan küçük bir uç nokta gerekir. ML yaşam döngüsünün izleme (monitoring) ayağı (Amershi vd., 2019) bu projede en zayıf halka.

## Mimari karar: model nerede çalışıyor?

**Karar: tarayıcıda (`onnxruntime-web`).** Model, commit'e sabit URL'den Hugging Face'ten indirilir ve oyuncunun cihazında çalışır.

| | **Tarayıcı (`onnxruntime-web`)** ✅ | Mobil cihaz içi (Expo, gömülü ONNX) | Kendi sunucumuz (Render / Rails, FastAPI) |
|---|---|---|---|
| **1. İnternet ve gecikme** | İlk açılışta model (532 bayt) ve ONNX Runtime'ın wasm dosyası (birkaç MB) indirilir; sonrası tarayıcı önbelleğinden gelir. Tahmin yerel, 1 ms'nin altında. Oyun görselleri ve tutor için zaten internet gerekiyor. | Model uygulamanın içinde, internetsiz çalışır, gecikme en düşük. | Her tahminde bir ağ isteği (yüzlerce ms). Ücretsiz Render uykudan uyanırken ilk istek 30 sn'yi bulabilir; sahne açılışı bunu bekleyemez. |
| **2. Veri cihazdan çıkar mı?** | **Hayır.** Karar ve okuma süreleri cihazda kalır (KVKK açısından en temiz yol). | Hayır. | **Evet.** Her sahnede davranış verisi sunucuya gider: aydınlatma metni, saklama süresi ve güvenlik gerekir. |
| **3. Model gizli kalır mı?** | Hayır: `model.onnx` herkesin indirebildiği bir dosyadır. | Hayır: uygulama paketinden çıkarılabilir. | Evet, dosya sunucuda kalır. Ama istek-yanıt çiftleriyle davranışı taklit edilebilir (tersine mühendislik, model çıkarma). |
| Güncelleme | `MODEL_URL` değişir ve sayfa yeniden yayınlanır. | Yeni uygulama sürümü ya da uzaktan indirme gerekir. | Sunucuda dosya değişir; istemciye dokunulmaz. En hızlısı. |
| Maliyet | Ücretsiz (statik hosting + HF). | Ücretsiz, ama mağaza/APK dağıtımı zahmetli. | Ücretsiz katman uyuyor; sürekli açık tutmak ücretli. |

**Gerekçe:** Bu projede model gizliliği bir değer taşımıyor. Model zaten herkese açık bir Hugging Face reposunda duruyor, 5 katsayıdan ibaret ve eğitim amaçlı. Buna karşılık oyuncunun davranış verisi kişiye ait ve cihazdan çıkmaması tercih edilir. Sunucu seçeneği hem gecikme (uyuyan ücretsiz sunucu) hem veri akışı açısından kötü bir takas olurdu. Mobil, en iyi gecikmeyi verirdi ama oyun zaten web'de yaşıyor ve telefondan tarayıcıyla açılıyor. Ayrı bir uygulama dağıtmak, kazancına değmeyecek kadar iş çıkarırdı.

## Kaynaklar

- Sommerville, I. *Software Engineering*, 10. baskı: Bl. 8 (doğrulama ve geçerleme), Bl. 17–18 (dağıtık ve servis odaklı mimariler: istemci-sunucu ödünleşimleri), Bl. 25 (konfigürasyon yönetimi ve sürümleme).
- Amershi, S. vd. (2019). *Software Engineering for Machine Learning: A Case Study.* ICSE-SEIP.
- Shankar, S. vd. (2022). *Operationalizing Machine Learning: An Interview Study.* (Velocity, Validation, Versioning)
- Breck, E. vd. (2017). *The ML Test Score: A Rubric for ML Production Readiness and Technical Debt Reduction.*
- Mitchell, M. vd. (2019). *Model Cards for Model Reporting.* FAT*.
- Hugging Face Hub belgeleri: `revision` ve `resolve/<commit>` URL'leri.
