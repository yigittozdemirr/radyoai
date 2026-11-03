import { Seviye } from '../data/gameData.ts';

// Model girdileri. Sıra model/config.json'daki "features" ile aynı olmalı (spec.md §10).
export const OZELLIKLER = [
  'sahne_no',
  'seviye',
  'onceki_riskli_karar',
  'onceki_ort_karar_suresi_sn',
  'onceki_ort_okuma_suresi_sn',
] as const;

export const SEVIYE_KODU: Record<Seviye, number> = {
  'Yeni başladım': 0,
  'Biraz biliyorum': 1,
  'Deneyimliyim': 2,
};

export interface Karar {
  sahne_no: number;
  karar_suresi_sn: number;
  okuma_suresi_sn: number;
  riskli_karar: 0 | 1;
}

const ortalama = (xs: number[]) =>
  xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : 0;

// Veri toplama ve çıkarım aynı fonksiyonu kullanır: eğitim/sunum farkı (training-serving skew) olmaz.
export function ozellikler(sahneNo: number, seviye: Seviye, onceki: Karar[]): number[] {
  return [
    sahneNo,
    SEVIYE_KODU[seviye],
    onceki.filter((k) => k.riskli_karar).length,
    ortalama(onceki.map((k) => k.karar_suresi_sn)),
    ortalama(onceki.map((k) => k.okuma_suresi_sn)),
  ];
}

// ---------------------------------------------------------------- veri toplama (?veri=1)

export const SUTUNLAR = [
  'oturum_id',
  ...OZELLIKLER,
  'karar_suresi_sn',
  'okuma_suresi_sn',
  'riskli_karar',
  'kaynak',
];

const ANAHTAR = 'radyoai-veri';

// Kişisel veri yok: kimlik oyun başında rastgele üretilir, cihaza ya da kişiye bağlanmaz.
export const yeniOturumId = () => Math.random().toString(36).slice(2, 10);

function satirlariOku(): string[] {
  try {
    return JSON.parse(localStorage.getItem(ANAHTAR) || '[]');
  } catch {
    return [];
  }
}

export function oturumuKaydet(oturumId: string, seviye: Seviye, kararlar: Karar[]) {
  const yeni = kararlar.map((k, i) =>
    [
      oturumId,
      ...ozellikler(k.sahne_no, seviye, kararlar.slice(0, i)),
      k.karar_suresi_sn,
      k.okuma_suresi_sn,
      k.riskli_karar,
      'gercek',
    ].join(',')
  );
  try {
    localStorage.setItem(ANAHTAR, JSON.stringify([...satirlariOku(), ...yeni]));
  } catch {
    // depolama kapalıysa (gizli pencere) kayıt yapılamaz; oyun etkilenmez
  }
}

export const kayitliOturumSayisi = () =>
  new Set(satirlariOku().map((s) => s.split(',')[0])).size;

export function csvIndir() {
  const metin = [SUTUNLAR.join(','), ...satirlariOku()].join('\n') + '\n';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([metin], { type: 'text/csv' }));
  a.download = 'oturumlar.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

export function veriyiTemizle() {
  try {
    localStorage.removeItem(ANAHTAR);
  } catch {}
}
