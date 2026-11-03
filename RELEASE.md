# Sürüm notları

## v2.0.0: riskli karar modeli

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
