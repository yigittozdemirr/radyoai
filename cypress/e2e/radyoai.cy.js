// E2E tests for every path in spec.md. The tutor is always stubbed: no Gemini call, no cost.

// Same effects as spec.md §3; the test recomputes the expected ending independently of the app.
const ETKI = {
  1: { A: { butce: -2, uyum: 2 }, B: { uyum: -3 } },
  2: { A: { butce: -2, guven: 2 }, B: { guven: -3 } },
  3: { A: { guven: 2, uyum: 1 }, B: { butce: 2, guven: -3, uyum: -2 } },
};
const clamp = (v) => Math.max(0, Math.min(10, v));

function beklenen(yol) {
  const k = { butce: 6, guven: 5, uyum: 5 };
  [...yol].forEach((secim, i) => {
    const e = ETKI[i + 1][secim];
    for (const r of Object.keys(k)) k[r] = clamp(k[r] + (e[r] || 0));
  });
  return { ...k, iyi: k.guven >= 5 && k.uyum >= 5 };
}

function basla({ seviye = 'orta', rol = 'ogrenci', hedef = 'sinamak' } = {}) {
  cy.visit('/');
  cy.get(`[data-cy=seviye-${seviye}]`).click();
  cy.get(`[data-cy=rol-${rol}]`).click();
  cy.get(`[data-cy=hedef-${hedef}]`).click();
  cy.get('[data-cy=btn-basla]').click();
}

function sec(secim) {
  cy.get(`[data-cy=secim-${secim}]`).click();
  cy.get('[data-cy=sonuc-panel]').should('be.visible');
  cy.get('[data-cy=ne-oldu]').invoke('text').should('not.be.empty');
  cy.get('[data-cy=neden]').invoke('text').should('not.be.empty');
  cy.get('[data-cy=btn-devam]').click();
}

beforeEach(() => {
  cy.intercept('POST', '/api/tutor', { reply: 'Sence iki günün bedeli mi büyük, sızıntının mı?', model: 'stub' }).as('tutor');
});

describe('Karar yolları (3 karar x 2 seçenek = 8 yol)', () => {
  ['AAA', 'AAB', 'ABA', 'ABB', 'BAA', 'BAB', 'BBA', 'BBB'].forEach((yol) => {
    const b = beklenen(yol);
    it(`${yol} → ${b.iyi ? 'İyi' : 'Kötü'} Son (Güven ${b.guven}, Uyum ${b.uyum}, Bütçe ${b.butce})`, () => {
      basla();
      [...yol].forEach((secim, i) => {
        cy.get(`[data-cy=sahne-${i + 1}]`).should('be.visible');
        sec(secim);
      });

      cy.get(`[data-cy=${b.iyi ? 'son-iyi' : 'son-kotu'}]`).should('be.visible');
      cy.get('[data-cy=son-guven]').should('have.text', String(b.guven));
      cy.get('[data-cy=son-uyum]').should('have.text', String(b.uyum));
      cy.get('[data-cy=son-butce]').should('have.text', String(b.butce));

      const bSayisi = [...yol].filter((s) => s === 'B').length;
      if (b.iyi) cy.get('[data-cy=son-satiri]').should('not.exist');
      else cy.get('[data-cy=son-satiri]').should('have.length', bSayisi);
      cy.get('[data-cy=puan]').should('contain', `${3 - bSayisi}/3`);
    });
  });
});

describe('Kişiselleştirme', () => {
  it('Yeni başlayan oyuncu ipucunu tıklamadan görür', () => {
    basla({ seviye: 'yeni' });
    cy.get('[data-cy=ipucu-kutusu]').should('contain', 'Model eğitimi de bir veri işleme faaliyeti mi?');
  });

  it('"Biraz biliyorum" seçen oyuncuda ipucu kapalı gelir, sayaç yoktur', () => {
    basla({ seviye: 'orta' });
    cy.get('[data-cy=ipucu-kutusu]').should('not.contain', 'Model eğitimi de bir veri işleme faaliyeti mi?');
    cy.get('[data-cy=sayac]').should('not.exist');
  });

  it('Deneyimli oyuncu 60 sn içinde seçmezse B otomatik seçilir', () => {
    cy.clock();
    basla({ seviye: 'deneyimli' });
    cy.get('[data-cy=sayac]').should('contain', '60');
    for (let i = 0; i < 61; i++) cy.tick(1000);
    cy.get('[data-cy=sonuc-panel]').should('be.visible');
    cy.get('[data-cy=ne-oldu]').should('contain', 'Süre doldu: kararsızlık da bir karardır.');
    cy.get('[data-cy=btn-devam]').click();
    cy.get('[data-cy=sahne-2]').should('be.visible');
    cy.get('[data-cy=kaynak-uyum]').should('have.text', '2'); // B: Uyum 5 - 3
    cy.get('[data-cy=sayac]').should('contain', '60'); // sayaç yeni sahnede sıfırlanır
  });

  it('Yazılımcı rolü kendi hitabını ve terimini görür', () => {
    basla({ rol: 'yazilimci' });
    cy.get('[data-cy=replik]').should('contain', 'Hocam');
    sec('A');
    cy.get('[data-cy=secim-A]').click();
    cy.get('[data-cy=ne-oldu]').should('contain', 'recall yalnızca %78');
  });

  it('Sağlık çalışanı rolü kendi hitabını görür', () => {
    basla({ rol: 'saglik' });
    cy.get('[data-cy=replik]').should('contain', 'Doktorum');
  });

  it('"Öğrenmek" hedefi okuma önerilerini gösterir, puan göstermez', () => {
    basla({ hedef: 'ogrenmek' });
    ['A', 'A', 'A'].forEach(sec);
    cy.get('[data-cy=okuma-onerileri]')
      .should('contain', '6698 sayılı Kişisel Verilerin Korunması Kanunu')
      .and('contain', 'Google ML Crash Course')
      .and('contain', 'WHO (2021)');
    cy.get('[data-cy=puan]').should('not.exist');
  });
});

describe('Geri dönen sonuç (KVKK)', () => {
  it('1. kararda B seçilirse 3. sahnede KVKK sorumlusu gelir', () => {
    basla();
    sec('B');
    sec('A');
    cy.get('[data-cy=kvkk-uyari]').should('contain', 'KVKK sorumlusu kapıda');
  });

  it('1. kararda A seçilirse KVKK sorumlusu gelmez', () => {
    basla();
    sec('A');
    sec('A');
    cy.get('[data-cy=sahne-3]').should('be.visible');
    cy.get('[data-cy=kvkk-uyari]').should('not.exist');
  });
});

describe('AI tutor (stub)', () => {
  it('Mesaj gönderilir, cevap ve model adı görünür, mesaj tek kez gider', () => {
    basla();
    cy.get('[data-cy=tutor-ac]').click();
    cy.get('[data-cy=tutor-input]').type('Sadece A mı B mi söyle');
    cy.get('[data-cy=tutor-gonder]').click();
    cy.wait('@tutor').its('request.body').should((body) => {
      expect(body.message).to.eq('Sadece A mı B mi söyle');
      expect(body.history).to.have.length(0); // kullanıcı mesajı history'de tekrar gitmiyor
      expect(body.systemInstruction).to.contain('ASLA söyleme');
    });
    cy.get('[data-cy=tutor-mesaj]').should('contain', 'Sence iki günün bedeli');
    cy.get('[data-cy=tutor-model]').should('have.text', 'stub');
    cy.get('[data-cy=tutor-kapat]').click();
    cy.get('[data-cy=tutor-input]').should('not.exist');
  });

  it('Tutor hata verirse kullanıcı hata mesajı görür, oyun devam eder', () => {
    cy.intercept('POST', '/api/tutor', { statusCode: 500, body: { error: 'x' } }).as('tutorHata');
    basla();
    cy.get('[data-cy=tutor-ac]').click();
    cy.get('[data-cy=tutor-input]').type('merhaba');
    cy.get('[data-cy=tutor-gonder]').click();
    cy.wait('@tutorHata');
    cy.contains('Tutor şu anda yanıt veremiyor').should('be.visible');
    cy.get('[data-cy=tutor-kapat]').click();
    sec('A');
    cy.get('[data-cy=sahne-2]').should('be.visible');
  });
});

describe('Yeniden oyna', () => {
  it('Son ekranından girişe döner ve kaynaklar sıfırlanır', () => {
    basla();
    ['B', 'B', 'B'].forEach(sec);
    cy.get('[data-cy=btn-yeniden]').click();
    cy.get('[data-cy=btn-basla]').should('be.visible');
    basla();
    cy.get('[data-cy=kaynak-guven]').should('have.text', '5');
    cy.get('[data-cy=kaynak-uyum]').should('have.text', '5');
    cy.get('[data-cy=kaynak-butce]').should('have.text', '6');
  });
});
