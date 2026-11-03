"""data/oturumlar.csv'yi üretir: data/gercek/*.csv (uygulamadan indirilen) + sentetik oturumlar.

Çalıştırma:  python data/sentetik.py

Üretici kural (tohum 13, README.md'de de yazılı):
  Her sentetik oyuncunun gizli bir "acele" eğilimi vardır: a ~ U(0, 1).
  Seviye ~ {0, 1, 2} eşit olasılıkla.
  Her sahnede:
    karar_suresi_sn ~ N(25 - 18a, 5), [2, 90] aralığına kırpılır
    okuma_suresi_sn ~ N(12 - 9a, 3),  [0.5, 40] aralığına kırpılır
    P(B) = sigmoid(-2.2 + 3.0a + 0.4·[seviye=2] + 0.5·önceki_B + 0.3·[sahne=2])
  Deneyimliyim (seviye 2) için karar süresi 60 sn'yi geçerse uygulamadaki gibi süre dolar: süre 60, seçim B.
Model "a"yı görmez; yalnızca önceki sahnelerdeki süreleri ve seçimleri görür.
"""
import csv
import math
from pathlib import Path

import numpy as np

SEED = 13
SENTETIK_OTURUM = 200
BURASI = Path(__file__).resolve().parent

# Sıra src/model/veri.ts → SUTUNLAR ile aynı
SUTUNLAR = ["oturum_id", "sahne_no", "seviye", "onceki_riskli_karar", "onceki_ort_karar_suresi_sn",
            "onceki_ort_okuma_suresi_sn", "karar_suresi_sn", "okuma_suresi_sn", "riskli_karar", "kaynak"]


def ortalama(xs):
    return round(sum(xs) / len(xs), 1) if xs else 0


def sentetik_oturumlar(rng):
    for n in range(SENTETIK_OTURUM):
        a, seviye = rng.uniform(), int(rng.integers(3))
        kararlar = []
        for sahne in (1, 2, 3):
            karar = float(np.clip(rng.normal(25 - 18 * a, 5), 2, 90))
            okuma = round(float(np.clip(rng.normal(12 - 9 * a, 3), 0.5, 40)), 1)
            onceki_b = sum(k[2] for k in kararlar)
            z = -2.2 + 3.0 * a + 0.4 * (seviye == 2) + 0.5 * onceki_b + 0.3 * (sahne == 2)
            riskli = int(rng.uniform() < 1 / (1 + math.exp(-z)))
            if seviye == 2 and karar >= 60:
                karar, riskli = 60, 1
            kararlar.append((round(karar, 1), okuma, riskli))
            yield {
                "oturum_id": f"s{n:04d}", "sahne_no": sahne, "seviye": seviye,
                "onceki_riskli_karar": onceki_b,
                "onceki_ort_karar_suresi_sn": ortalama([k[0] for k in kararlar[:-1]]),
                "onceki_ort_okuma_suresi_sn": ortalama([k[1] for k in kararlar[:-1]]),
                "karar_suresi_sn": round(karar, 1), "okuma_suresi_sn": okuma,
                "riskli_karar": riskli, "kaynak": "sentetik",
            }


def gercek_satirlar():
    for dosya in sorted((BURASI / "gercek").glob("*.csv")):
        with dosya.open(encoding="utf-8") as f:
            for satir in csv.DictReader(f):
                if list(satir) != SUTUNLAR:
                    raise SystemExit(f"✗ {dosya.name}: sütunlar beklenenden farklı: {list(satir)}")
                if satir["kaynak"] != "gercek":
                    raise SystemExit(f"✗ {dosya.name}: kaynak 'gercek' olmalı")
                yield satir


def main():
    gercek = list(gercek_satirlar())
    satirlar = gercek + list(sentetik_oturumlar(np.random.default_rng(SEED)))
    with (BURASI / "oturumlar.csv").open("w", encoding="utf-8", newline="") as f:
        yazici = csv.DictWriter(f, fieldnames=SUTUNLAR, lineterminator="\n")
        yazici.writeheader()
        yazici.writerows(satirlar)
    oturum = len({s["oturum_id"] for s in gercek})
    print(f"✓ data/oturumlar.csv: {len(gercek)} gerçek satır ({oturum} oturum) + "
          f"{len(satirlar) - len(gercek)} sentetik satır ({SENTETIK_OTURUM} oturum)")


if __name__ == "__main__":
    main()
