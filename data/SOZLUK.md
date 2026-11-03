# Veri sözlüğü: `data/oturumlar.csv`

Her satır **bir karardır**. Bir oturum (bir oyun) 3 satırdır: Sahne 1, 2, 3.

| Sütun | Tür | Birim / değerler | Anlamı |
|---|---|---|---|
| `oturum_id` | metin | 8 karakter | Oyun başında rastgele üretilen kimlik. Kişiye, cihaza ya da hesaba bağlı değildir. Sentetik oturumlar `s0000`, `s0001`… |
| `sahne_no` | tam sayı | 1, 2, 3 | Kararın verildiği sahne. 1 = Veri (Deniz), 2 = Doğrulama (Prof. Aydın), 3 = Sorumluluk (Dr. Elif) |
| `seviye` | tam sayı | 0, 1, 2 | Girişteki beyan. 0 = Yeni başladım, 1 = Biraz biliyorum, 2 = Deneyimliyim |
| `onceki_riskli_karar` | tam sayı | adet, 0–2 | Bu sahneden önceki sahnelerde seçilen B sayısı |
| `onceki_ort_karar_suresi_sn` | ondalık | saniye, 0.1 hassasiyet | Önceki sahnelerdeki `karar_suresi_sn` ortalaması. Sahne 1'de 0 |
| `onceki_ort_okuma_suresi_sn` | ondalık | saniye, 0.1 hassasiyet | Önceki sahnelerdeki `okuma_suresi_sn` ortalaması. Sahne 1'de 0 |
| `karar_suresi_sn` | ondalık | saniye | Sahne açılışından A/B düğmesine basılana kadar geçen süre. Deneyimliyim seviyesinde süre dolarsa 60 |
| `okuma_suresi_sn` | ondalık | saniye | "Ne oldu / Neden" panelinin açılışından "Devam"a basılana kadar geçen süre |
| `riskli_karar` | tam sayı | 0, 1 | **Hedef.** 1 = riskli seçenek (B) seçildi ya da süre doldu, 0 = A seçildi |
| `kaynak` | metin | `gercek`, `sentetik` | `gercek`: uygulamanın veri toplama modunda (`?veri=1`) bir insanın oynadığı oturum. `sentetik`: `data/sentetik.py` ile üretildi |

## Notlar

- `onceki_*` sütunları, aynı oturumun önceki satırlarından hesaplanır. Uygulama modeli çalıştırırken de aynı hesabı yapar (`src/model/veri.ts` → `ozellikler`).
- Model yalnızca `sahne_no ≥ 2` satırlarıyla eğitilir: Sahne 1'de geçmiş davranış yoktur.
- `karar_suresi_sn` ve `okuma_suresi_sn` modele girdi değildir. Bir sonraki satırın `onceki_*` değerlerini hesaplamak için tutulur.
- **KVKK:** Ad, e-posta, cihaz kimliği, IP, konum, tarayıcı bilgisi ya da zaman damgası toplanmaz.

## Nasıl üretilir

1. Uygulamayı `?veri=1` ile açıp oynatın. Son ekrandaki **CSV indir** ile inen dosyayı `data/gercek/` klasörüne koyun (birden çok dosya olabilir).
2. `python data/sentetik.py`: `data/gercek/*.csv` ile 200 sentetik oturumu (tohum 13) birleştirip `data/oturumlar.csv`'yi yazar.
