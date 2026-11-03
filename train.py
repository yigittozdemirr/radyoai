"""RadyoAI v2 risk modeli: data/oturumlar.csv → model/ (model.onnx + config.json + README.md).

Çalıştırma:  python train.py

Eval kapısı (spec.md §10, eğitimden önce yazıldı): hold-out ROC-AUC < 0.70 ise ya da spec'teki
kabul örnekleri 6 ve 7 tutmazsa betik hata koduyla durur ve model/ klasörüne hiçbir şey yazılmaz.
onnx_aktar, seyyah/huggingface-hello-web reposundaki hf_cli.py'den uyarlandı.
"""
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
import pandas as pd
import skl2onnx
import sklearn
from skl2onnx import to_onnx
from skl2onnx.common.data_types import FloatTensorType
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

SEED = 13
ESIK_AUC = 0.70  # kabul eşiği: spec.md §10
KARAR_ESIGI = 0.5  # p ≥ 0.5 → sahne destek modunda açılır
SURUM = "2.0.0"

BURASI = Path(__file__).resolve().parent
VERI = BURASI / "data" / "oturumlar.csv"
MODEL_DIR = BURASI / "model"
HEDEF = "riskli_karar"

# Sıra src/model/veri.ts → OZELLIKLER ile aynı olmalı (sözleşme)
OZELLIKLER = [
    ("sahne_no", "Açılan sahne", "2 veya 3", 2, 3),
    ("seviye", "Girişteki beyan: 0 Yeni başladım, 1 Biraz biliyorum, 2 Deneyimliyim", "kod", 0, 2),
    ("onceki_riskli_karar", "Önceki sahnelerde seçilen B sayısı", "adet", 0, 2),
    ("onceki_ort_karar_suresi_sn", "Önceki sahnelerde sahne açılışından seçime ortalama süre", "saniye", 0, None),
    ("onceki_ort_okuma_suresi_sn", "Önceki sahnelerde sonuç panelinde geçen ortalama süre", "saniye", 0, None),
]
ADLAR = [o[0] for o in OZELLIKLER]

# spec.md §10 kabul örnekleri 6 ve 7 (davranış testi)
ACELECI = [2, 2, 1, 3.0, 1.0]
DIKKATLI = [2, 2, 0, 25.0, 12.0]


def dur(mesaj):
    sys.exit(f"✗ {mesaj}\n  Model YAYINLANMADI: model/ klasörü değiştirilmedi.")


def onnx_aktar(model, X_ornek):
    """Girdi 'input' float32 [n, 5]; çıktı 'probabilities' [n, 2] (zipmap kapalı)."""
    onx = to_onnx(model, initial_types=[("input", FloatTensorType([None, X_ornek.shape[1]]))],
                  options={id(model): {"zipmap": False}}, target_opset=17)
    bayt = onx.SerializeToString()
    p_onnx = ort.InferenceSession(bayt).run(["probabilities"], {"input": X_ornek.astype(np.float32)})[0]
    fark = float(np.abs(p_onnx - model.predict_proba(X_ornek)).max())
    if fark > 1e-4:
        dur(f"ONNX çıktısı sklearn'den sapıyor (maks fark {fark:.2e})")
    return bayt, fark


def main():
    veri = pd.read_csv(VERI)
    veri = veri[veri["sahne_no"] >= 2]  # Sahne 1'de geçmiş davranış yok (soğuk başlangıç)
    X, y = veri[ADLAR].to_numpy(np.float64), veri[HEDEF].to_numpy()
    X_tr, X_te, y_tr, y_te, k_tr, k_te = train_test_split(
        X, y, veri["kaynak"].to_numpy(), test_size=0.3, stratify=y, random_state=SEED)

    model = Pipeline([("scaler", StandardScaler()), ("lr", LogisticRegression(random_state=SEED))])
    model.fit(X_tr, y_tr)
    p_te = model.predict_proba(X_te)[:, 1]

    gercek = k_te == "gercek"
    metrikler = {
        "roc_auc": round(roc_auc_score(y_te, p_te), 4),
        "accuracy": round(accuracy_score(y_te, p_te >= KARAR_ESIGI), 4),
        "cogunluk_sinifi_accuracy": round(float(max(y_te.mean(), 1 - y_te.mean())), 4),
        "gercek_roc_auc": (round(roc_auc_score(y_te[gercek], p_te[gercek]), 4)
                           if len(set(y_te[gercek])) == 2 else None),
        "test_satir": int(len(y_te)),
        "test_gercek_satir": int(gercek.sum()),
    }
    print(f"• test metrikleri: {metrikler}")

    # ---- eval kapısı: buradan önce model/ klasörüne hiçbir şey yazılmadı
    if metrikler["roc_auc"] < ESIK_AUC:
        dur(f"ROC-AUC {metrikler['roc_auc']} < kabul eşiği {ESIK_AUC}")
    p_aceleci, p_dikkatli = model.predict_proba(np.array([ACELECI, DIKKATLI]))[:, 1]
    if not (p_aceleci >= KARAR_ESIGI > p_dikkatli):
        dur(f"Kabul örnekleri tutmadı: aceleci p={p_aceleci:.3f} (≥0.5 olmalı), "
            f"dikkatli p={p_dikkatli:.3f} (<0.5 olmalı)")
    print(f"✓ eval kapısı geçti: AUC {metrikler['roc_auc']} ≥ {ESIK_AUC}; "
          f"aceleci p={p_aceleci:.3f}, dikkatli p={p_dikkatli:.3f}")

    onnx_bayt, fark = onnx_aktar(model, X_te)
    config = {
        "title": "RadyoAI v2: riskli karar modeli",
        "version": SURUM,
        "description": "Oyuncunun bir sonraki sahnede riskli seçeneği (B) seçme olasılığı. "
                       "Yalnızca RadyoAI eğitim oyunu içindir.",
        "input": {"name": "input", "dtype": "float32", "shape": [None, len(ADLAR)]},
        "output": {"name": "probabilities", "dtype": "float32", "shape": [None, 2], "positive_class_index": 1},
        "features": [{"name": ad, "description": acik, "unit": birim, "min": mn, "max": mx}
                     for ad, acik, birim, mn, mx in OZELLIKLER],
        "input_schema": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "required": ADLAR,
            "additionalProperties": False,
            "properties": {ad: {"type": "number", "minimum": mn, **({"maximum": mx} if mx is not None else {})}
                           for ad, _, _, mn, mx in OZELLIKLER},
        },
        "classes": ["0", "1"],
        "class_labels": {"0": "güvenli seçim (A)", "1": "riskli seçim (B)"},
        "decision_threshold": KARAR_ESIGI,
        "acceptance": {"metric": "roc_auc", "threshold": ESIK_AUC, "split": "30% stratified hold-out"},
        "metrics": metrikler,
        "onnx_sklearn_max_diff": float(f"{fark:.2e}"),
        "data": {
            "file": "data/oturumlar.csv",
            "sha256": hashlib.sha256(VERI.read_bytes()).hexdigest(),
            "rows_used": int(len(veri)),
            "gercek_rows": int((veri["kaynak"] == "gercek").sum()),
            "sentetik_rows": int((veri["kaynak"] == "sentetik").sum()),
        },
        "seed": SEED,
        "python_version": f"{sys.version_info.major}.{sys.version_info.minor}",
        "sklearn_version": sklearn.__version__,
        "skl2onnx_version": skl2onnx.__version__,
    }

    MODEL_DIR.mkdir(exist_ok=True)
    (MODEL_DIR / "model.onnx").write_bytes(onnx_bayt)
    (MODEL_DIR / "config.json").write_text(json.dumps(config, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (MODEL_DIR / "README.md").write_text(model_karti(config), encoding="utf-8")
    print(f"✓ model/ yazıldı (ONNX ↔ sklearn maks fark {fark:.1e})")


def model_karti(c):
    m, d = c["metrics"], c["data"]
    gercek_auc = m["gercek_roc_auc"] if m["gercek_roc_auc"] is not None else "hesaplanamadı (test kümesinde iki sınıf yok)"
    ozellik_tablosu = "\n".join(f"| {i + 1} | `{o['name']}` | {o['description']} | {o['unit']} |"
                                for i, o in enumerate(c["features"]))
    return f"""---
library_name: sklearn
tags:
- onnx
- tabular-classification
- education
pipeline_tag: tabular-classification
---

# {c["title"]} (v{c["version"]})

## Amaç
RadyoAI, yapay zekâ proje kararlarını öğreten bir seçimli hikâye oyunudur. Bu model, Sahne 2 ve 3 açılırken
oyuncunun o sahnede **riskli seçeneği (B)** seçme olasılığını, önceki sahnelerdeki davranışından tahmin eder.
`p ≥ {c["decision_threshold"]}` ise oyun sahneyi **destek modunda** açar: ipucu açılır, süre baskısı kalkar,
bir mentor notu görünür.

## Girdiler (sıra sabittir)
| # | Özellik | Anlamı | Birim |
|---|---|---|---|
{ozellik_tablosu}

ONNX: girdi `input` float32 `[n, {len(c["features"])}]`, çıktı `probabilities` float32 `[n, 2]` (indeks 1 = riskli).
Sözleşme ve JSON şeması: `config.json`.

## Model
`StandardScaler → LogisticRegression`, `random_state={c["seed"]}`, Python {c["python_version"]},
scikit-learn {c["sklearn_version"]}, skl2onnx {c["skl2onnx_version"]}. ONNX ↔ sklearn maks fark: {c["onnx_sklearn_max_diff"]}.

## Veri
`{d["file"]}`, yalnızca Sahne 2–3 satırları: {d["rows_used"]} satır ({d["gercek_rows"]} gerçek, {d["sentetik_rows"]} sentetik).
Gerçek satırlar uygulamanın veri toplama modundan gelir; kişisel veri yoktur. Sentetik satırların üretici
kuralı ve tohumu `data/sentetik.py` ve README'dedir. Veri özeti (sha256): `{d["sha256"][:16]}…`

## Metrikler (%30 tabakalı hold-out, {m["test_satir"]} satır)
| Metrik | Değer |
|---|---|
| **ROC-AUC (kabul eşiği ≥ {c["acceptance"]["threshold"]})** | **{m["roc_auc"]}** |
| Doğruluk (p ≥ 0.5) | {m["accuracy"]} |
| Hep çoğunluk sınıfını söyleyen modelin doğruluğu | {m["cogunluk_sinifi_accuracy"]} |
| Yalnızca gerçek satırlarda ROC-AUC ({m["test_gercek_satir"]} satır) | {gercek_auc} |

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
"""


if __name__ == "__main__":
    main()
