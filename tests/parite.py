"""Test kahini (oracle): uygulamanın kullandığı model.onnx'i Python'da çalıştırır, tests/parite.json'u yazar.

Çalıştırma:  python tests/parite.py

Model, src/model/risk.ts → MODEL_URL'deki commit'e sabit adresten indirilir: uygulama ile kahin
aynı dosyayı çalıştırır. Cypress (cypress/e2e/parite.cy.js) aynı 5 girdiyi tarayıcıda çalıştırıp
olasılıkların farkının < 1e-4 olduğunu kontrol eder.
"""
import hashlib
import json
import re
import urllib.request
from pathlib import Path

import numpy as np
import onnxruntime as ort

KOK = Path(__file__).resolve().parent.parent
TOLERANS = 1e-4

# Sıra: sahne_no, seviye, onceki_riskli_karar, onceki_ort_karar_suresi_sn, onceki_ort_okuma_suresi_sn
GIRDILER = [
    ("aceleci (spec örnek 6)", [2, 2, 1, 3.0, 1.0]),
    ("dikkatli (spec örnek 7)", [2, 2, 0, 25.0, 12.0]),
    ("süre doldu, tereddütlü", [2, 2, 1, 60.0, 0.3]),
    ("sahne 3, iki riskli karar", [3, 1, 2, 8.4, 2.7]),
    ("yeni başlayan, orta hız", [3, 0, 1, 14.6, 6.2]),
]


def main():
    url = re.search(r"'(https://huggingface\.co/[^']+)'", (KOK / "src/model/risk.ts").read_text(encoding="utf-8"))[1]
    with urllib.request.urlopen(url, timeout=30) as yanit:
        bayt = yanit.read()
    oturum = ort.InferenceSession(bayt)
    x = np.array([g for _, g in GIRDILER], dtype=np.float32)
    p = oturum.run(["probabilities"], {"input": x})[0][:, 1]

    sonuc = {
        "model_url": url,
        "model_sha256": hashlib.sha256(bayt).hexdigest(),
        "onnxruntime": ort.__version__,
        "tolerans": TOLERANS,
        "ornekler": [{"ad": ad, "girdi": g, "p": float(pi)} for (ad, g), pi in zip(GIRDILER, p)],
    }
    (KOK / "tests/parite.json").write_text(json.dumps(sonuc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    for o in sonuc["ornekler"]:
        print(f"  p={o['p']:.6f}  {o['ad']}")
    print(f"✓ tests/parite.json yazıldı (model {sonuc['model_sha256'][:12]}…)")


if __name__ == "__main__":
    main()
