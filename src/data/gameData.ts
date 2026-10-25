/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameState = 'GIRIS' | 'SAHNE_1' | 'SAHNE_2' | 'SAHNE_3' | 'SON';

export type Seviye = 'Yeni başladım' | 'Biraz biliyorum' | 'Deneyimliyim';
export type Rol = 'Öğrenci' | 'Yazılımcı' | 'Sağlık çalışanı';
export type Hedef = 'Öğrenmek' | 'Kendimi sınamak';

export interface RolInfo {
  hitap: string;
  terim: string;
}

export const rolMap: Record<Rol, RolInfo> = {
  'Öğrenci':         { hitap: 'Selam',    terim: 'duyarlılık (recall)' },
  'Yazılımcı':       { hitap: 'Hocam',    terim: 'recall' },
  'Sağlık çalışanı': { hitap: 'Doktorum', terim: 'duyarlılık (kaçırılan vaka oranı)' }
};

export interface ChoiceImpact {
  butce?: number;
  guven?: number;
  uyum?: number;
}

export interface ChoiceOption {
  etiket: string;
  etki: ChoiceImpact;
  neOldu: string;
  neden: string;
  sonSatiri?: string;
}

export interface SceneData {
  id: 1 | 2 | 3;
  kisi: string;
  unvan: string;
  isim: string;
  replik: string;
  ipucu: string;
  A: ChoiceOption;
  B: ChoiceOption;
}

export const scenes: SceneData[] = [
  {
    id: 1,
    kisi: 'Veri bilimci Deniz',
    unvan: 'VERİ BİLİMCİ',
    isim: 'DENİZ',
    replik: '{hitap}, arşivde 5.000 gerçek hasta röntgeni var. Bugün eğitime başlayalım, anonimleştirmeyle uğraşırsak iki gün kaybederiz.',
    ipucu: 'Model eğitimi de bir veri işleme faaliyeti mi?',
    A: {
      etiket: 'Önce anonimleştir',
      etki: { butce: -2, uyum: +2 },
      neOldu: 'Eğitim iki gün gecikti, veri seti yasal.',
      neden: "DICOM başlıklarında ad, TC no ve doğum tarihi bulunur. Bunlar silinmeden yapılan işleme KVKK'ya aykırıdır."
    },
    B: {
      etiket: 'Olduğu gibi kullan',
      etki: { uyum: -3 },
      neOldu: 'Eğitim hemen başladı.',
      neden: 'Model eğitimi de kişisel veri işlemedir. Hasta adları başlıklarda kaldı.',
      sonSatiri: 'Karar 1: Anonimleştirilmemiş veri → KVKK soruşturması'
    }
  },
  {
    id: 2,
    kisi: 'Başhekim Prof. Aydın',
    unvan: 'BAŞHEKİM',
    isim: 'PROF. AYDIN',
    replik: 'Model test setinde %95 doğruluk verdi. Bu yeterli, yarın tüm servislerde yayına alalım.',
    ipucu: "Hastaların yalnızca %10'u gerçekten hastaysa, herkese 'sağlam' diyen bir model kaç doğruluk alır?",
    A: {
      etiket: 'Önce hata analizi yap',
      etki: { butce: -2, guven: +2 },
      neOldu: '{terim} yalnızca %78 çıktı. Eşik ayarlandı, kaçırılan vaka sayısı düştü.',
      neden: "Röntgenlerin yalnızca %10'u hasta. Model herkese 'sağlam' dese bile %90 doğruluk alır. Doğruluk, kaçırılan hastayı gizler."
    },
    B: {
      etiket: 'Hemen yayına al',
      etki: { guven: -3 },
      neOldu: 'İlk hafta 4 zatürre vakası gözden kaçtı.',
      neden: 'Dengesiz veride tek metrik yanıltıcıdır. {terim} ayrıca ölçülmedi.',
      sonSatiri: 'Karar 2: Yalnızca doğruluğa bakıldı → kaçırılan vakalar'
    }
  },
  {
    id: 3,
    kisi: 'Radyolog Dr. Elif',
    unvan: 'RADYOLOG',
    isim: 'DR. ELİF',
    replik: 'Model rapor mu yazsın, yoksa bize öneri mi sunsun? İş yükümüz çok fazla.',
    ipucu: 'Model yanılırsa, hatayı hastaya ulaşmadan kim yakalar?',
    A: {
      etiket: 'Öneri sunsun, radyolog onaylasın',
      etki: { guven: +2, uyum: +1 },
      neOldu: 'Model emin olmadığı görüntüleri işaretliyor, son kararı radyolog veriyor.',
      neden: 'İnsan döngüde kalınca modelin hataları hastaya ulaşmadan yakalanır, sorumluluk da nettir.'
    },
    B: {
      etiket: 'Raporu kendisi yazsın',
      etki: { butce: +2, guven: -3, uyum: -2 },
      neOldu: 'Radyologların yükü azaldı ama hatalı raporlar doğrudan hastaya gitti.',
      neden: 'Klinik kararı tek başına veren bir model için kimin sorumlu olduğu belirsizdir.',
      sonSatiri: 'Karar 3: İnsan onayı kaldırıldı → sorumluluk belirsiz'
    }
  }
];

export const sonlar = {
  iyi: {
    baslik: 'İyi Son: Güvenilen Model',
    metin: 'RadyoAI servislerde kullanılıyor, radyologlar ona güveniyor, denetimden temiz çıktınız.'
  },
  kotu: {
    baslik: 'Kötü Son: Model Askıya Alındı',
    metin: 'Hastane modeli durdurdu. Bu sona şu kararlar götürdü:'
  }
};

export const okumaOnerileri = [
  '6698 sayılı Kişisel Verilerin Korunması Kanunu (kvkk.gov.tr)',
  'Google ML Crash Course: Accuracy, recall, precision',
  'WHO (2021). Ethics and Governance of Artificial Intelligence for Health'
];

export const IMAGES = {
  startHeader:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD8LYiChMkK_vJkcr3l1Wt4RVvvdNZdF8rDrj4_CEQTjjcsGjw3RBGqReRMM404WYm540ZpOwFJQXcxA-J5ba40Icsq_0ocLD_o_JVieir5G8MmKsE0KRkdIXz5cK5WdFH8g7rjSAYhRtqJnr1bJyKzWiLxjM9EkUrqbrHk6C-5fE48kNzuB0WOrYi5-rm_bnFviBfbkJvZ_2wMZh4ApXJzzx5Q34uAu1GvF_yHjnMRdIGbJwGlUEeaoQ',
  sceneBg:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBRaB5PjQ_0FIsELzkhl_4AItYwGvhrWNK3a_Y_gl4ry_UdsqY9McgarTXdy21b3LGYwg12g9d4wC4hjMlydG8HJ2iFNDGyaz_kh1hnJ-RORxjeN0GHBYJb_9jhcaGtWT13bAPI599bwvx9Au2YIZdDUynwMmvZcjnzheG9GBLW1JAG49DerUxLMsd2zR0FKwJDZEkx6R4tLEPmo6MLR0g7-nHOtLzCcJeWG7cLGQq4QG7W_185_OQybQ',
  goodEnding:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBeRhi3PhjAzmsKzWiNQEbUSvVMZoI0lNM__w5TRkb7kcMe9Wkf1Jq4fyPcdySgNCPQsP__lw9YatwUmOTLdopzARiDiFQ1BdUZ6PKx93jjG2XqRXc0jmgYIVcUh0IUkipZeblWwYq4ABbasXkvS5uOKtW151X5eaQa66-yw9V3nDjgPTYHkzWWJ1d2uNT2o_V0T7C5wWdJJF6xsE3uJX-QiAnOt9y45XCB5mFl0ulW5Xjza7vDC-OlCQ',
  badEnding:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBG8vk5REMrZbX3W7oafqkiCq_kKG4Lk_rYVJIlqAMfMmoKFCtGExDbrWoNSfawYv5XPScLNv_1H1PDgyD_G9DvwDQEYKzGoT2Dyu2oYdAxRlX7lFKdXTn7k8vFPlB6eRXW_3Ug97qUCbb8mNa_fu4fCAh8gf0TTPQ5t__pmzGPQwaQ84rM3Mh4pgcA1549Srd5MEo3nCK9gcoRPAgbYIA7WQ5KPyHKD4yLpKv4F5efqVVdiTw2uFZFTQ'
};

export function formatReplacements(text: string, rol: Rol): string {
  const mapping = rolMap[rol] || rolMap['Öğrenci'];
  return text
    .replace(/{hitap}/g, mapping.hitap)
    .replace(/{terim}/g, mapping.terim);
}
