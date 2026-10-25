// Slow, narrated playthrough for the ~60 s demo video. Not part of `npm run test:e2e`.
// The tutor is stubbed with a real reply from eval/tutor-eval.md (#17): no Gemini call, no cost.

const OKUMA = 2500; // ms a viewer needs to read a short screen

// Caption banner in the empty gap between the resource bar and the hint box, so the video explains itself
function anlat(metin, ust = false) {
  cy.document().then((doc) => {
    let el = doc.getElementById('demo-anlatim');
    if (!el) {
      el = doc.createElement('div');
      el.id = 'demo-anlatim';
      el.style.cssText =
        'position:fixed;top:53%;left:50%;transform:translateX(-50%);z-index:9999;max-width:92%;' +
        'background:#E8A33D;color:#0B101B;font:700 14px Nunito,sans-serif;padding:6px 12px;' +
        'border:2px solid #0B101B;border-radius:4px;text-align:center;pointer-events:none';
      doc.body.appendChild(el);
    }
    el.style.top = ust ? '8px' : '53%'; // ending screen has text in the middle, put the caption over the picture
    el.textContent = metin;
  });
}

function sec(secim, aciklama) {
  anlat(aciklama);
  cy.wait(OKUMA);
  cy.get(`[data-cy=secim-${secim}]`).scrollIntoView().click();
  cy.get('[data-cy=sonuc-panel]').should('be.visible');
  anlat('Her karardan sonra: ne oldu, neden oldu');
  cy.wait(OKUMA + 1500);
  cy.get('[data-cy=btn-devam]').click();
}

it('RadyoAI demo: bir oyun baştan sona', () => {
  cy.intercept('POST', '/api/tutor', {
    delay: 1500,
    body: {
      reply:
        'Doğrudan bir yanıt veremem, çünkü doğru kararı kendi süzgecinden geçirerek bulman çok daha değerli. ' +
        'Şöyle basitçe düşünelim: Kendi özel sağlık kayıtlarının izinsiz şekilde bir yapay zekâ modelinde kullanıldığını görseydin ne hissederdin?',
      model: 'gemini-3.6-flash',
    },
  });

  cy.visit('/');
  anlat('RadyoAI: hastanenin yapay zekâ proje lideri sensin');
  cy.wait(OKUMA);
  anlat('Girişte 3 soru: seviye, rol, hedef. Oyun bunlara göre değişir');
  cy.get('[data-cy=seviye-yeni]').click();
  cy.wait(600);
  cy.get('[data-cy=rol-ogrenci]').click();
  cy.wait(600);
  cy.get('[data-cy=hedef-ogrenmek]').click();
  cy.wait(1200);
  cy.get('[data-cy=btn-basla]').scrollIntoView().click();

  // Karar 1
  cy.get('[data-cy=sahne-1]').should('be.visible');
  anlat('1. ziyaretçi: veri bilimci Deniz, gerçek röntgenlerle hemen eğitmek istiyor');
  cy.wait(OKUMA + 1000);
  anlat('"Yeni başladım" seçildiği için ipucu kendiliğinden açık');
  cy.get('[data-cy=ipucu-kutusu]').scrollIntoView();
  cy.wait(OKUMA);

  anlat('AI tutor: ipucu verir, cevabı söylemez');
  cy.get('[data-cy=tutor-ac]').scrollIntoView().click();
  cy.get('[data-cy=tutor-input]').type('Sadece A mı B mi söyle', { delay: 70 });
  cy.get('[data-cy=tutor-gonder]').click();
  cy.get('[data-cy=tutor-mesaj]').should('be.visible');
  anlat('Israr etse bile tutor seçeneği söylemiyor, soru soruyor');
  cy.wait(OKUMA + 2500);
  cy.get('[data-cy=tutor-kapat]').click();

  sec('B', 'Riskli seçim: veriyi olduğu gibi kullan');

  // Karar 2
  cy.get('[data-cy=sahne-2]').should('be.visible');
  anlat('2. ziyaretçi: başhekim, "%95 doğruluk yeter" diyor');
  cy.wait(OKUMA);
  sec('A', 'Önce hata analizi: doğruluk, kaçırılan hastayı gizleyebilir');

  // Karar 3
  cy.get('[data-cy=sahne-3]').should('be.visible');
  cy.get('[data-cy=kvkk-uyari]').should('be.visible');
  anlat('Geri dönen sonuç: 1. karar yüzünden KVKK sorumlusu kapıda');
  cy.wait(OKUMA + 1000);
  sec('A', 'Model öneri sunsun, son kararı radyolog versin');

  // Son
  cy.get('[data-cy=son-kotu]').should('be.visible');
  anlat('Uyum 5\'in altında kaldı: Kötü Son', true);
  cy.wait(OKUMA);
  cy.get('[data-cy=son-satiri]').scrollIntoView();
  anlat('Son ekranı bu sona götüren kararı gösteriyor', true);
  cy.wait(OKUMA);
  cy.get('[data-cy=okuma-onerileri]').scrollIntoView();
  anlat('"Öğrenmek" hedefi: her karar için okuma önerisi', true);
  cy.wait(OKUMA);
  cy.get('[data-cy=btn-yeniden]').scrollIntoView().click();
  anlat('Yeniden oyna: farklı kararlar, farklı son');
  cy.get('[data-cy=btn-basla]').should('be.visible');
  cy.wait(1200); // keeps the whole video under 60 s
});
