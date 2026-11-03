---
library_name: sklearn
tags:
- onnx
- tabular-classification
- education
pipeline_tag: tabular-classification
---

# RadyoAI v2: riskli karar modeli (v2.0.0)

## Amaç
RadyoAI, yapay zekâ proje kararlarını öğreten bir seçimli hikâye oyunudur. Bu model, Sahne 2 ve 3 açılırken
oyuncunun o sahnede **riskli seçeneği (B)** seçme olasılığını, önceki sahnelerdeki davranışından tahmin eder.
`p ≥ 0.5` ise oyun sahneyi **destek modunda** açar: ipucu açılır, süre baskısı kalkar,
bir mentor notu görünür.

## Girdiler (sıra sabittir)
| # | Özellik | Anlamı | Birim |
|---|---|---|---|
| 1 | `sahne_no` | Açılan sahne | 2 veya 3 |
| 2 | `seviye` | Girişteki beyan: 0 Yeni başladım, 1 Biraz biliyorum, 2 Deneyimliyim | kod |
| 3 | `onceki_riskli_karar` | Önceki sahnelerde seçilen B sayısı | adet |
| 4 | `onceki_ort_karar_suresi_sn` | Önceki sahnelerde sahne açılışından seçime ortalama süre | saniye |
| 5 | `onceki_ort_okuma_suresi_sn` | Önceki sahnelerde sonuç panelinde geçen ortalama süre | saniye |

ONNX: girdi `input` float32 `[n, 5]`, çıktı `probabilities` float32 `[n, 2]` (indeks 1 = riskli).
Sözleşme ve JSON şeması: `config.json`.

## Model
`StandardScaler → LogisticRegression`, `random_state=13`, Python 3.12,
scikit-learn 1.9.1, skl2onnx 1.20.0. ONNX ↔ sklearn maks fark: 7.12e-08.

## Veri
`data/oturumlar.csv`, yalnızca Sahne 2–3 satırları: 400 satır (0 gerçek, 400 sentetik).
Gerçek satırlar uygulamanın veri toplama modundan gelir; kişisel veri yoktur. Sentetik satırların üretici
kuralı ve tohumu `data/sentetik.py` ve README'dedir. Veri özeti (sha256): `d1458f0122d1d44c…`

## Metrikler (%30 tabakalı hold-out, 120 satır)
| Metrik | Değer |
|---|---|
| **ROC-AUC (kabul eşiği ≥ 0.7)** | **0.726** |
| Doğruluk (p ≥ 0.5) | 0.675 |
| Hep çoğunluk sınıfını söyleyen modelin doğruluğu | 0.5667 |
| Yalnızca gerçek satırlarda ROC-AUC (0 satır) | hesaplanamadı (test kümesinde iki sınıf yok) |

## Sınırlar
- Verinin büyük çoğunluğu sentetiktir. Sentetik veride "acele eden oyuncu riskli seçer" ilişkisini biz kurduk;
  model bu varsayımı öğrenir. Gerçek oyuncularda ilişki daha zayıf olabilir.
- Gerçek oturum sayısı azdır; gerçek satırlardaki metrik güvenilir değildir.
- Süre özellikleri cihaza ve okuma hızına bağlıdır; yavaş okuyan oyuncu "dikkatli" görünebilir.
- Sahne 1'de çalışmaz (soğuk başlangıç).

## Kullanılmaması gereken durumlar
- Öğrenciyi notlandırmak, sıralamak ya da hakkında karar vermek.
- RadyoAI dışındaki oyunlar, sınavlar ya da gerçek klinik/iş kararları.
- Bir kişinin "dikkatsiz" olduğunu iddia etmek: model yalnızca oyundaki birkaç saniyelik davranışa bakar.
