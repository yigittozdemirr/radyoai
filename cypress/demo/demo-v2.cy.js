// v2 demo videosu (~70 sn): aynı Sahne 2'de model iki oyuncu için iki farklı karar verir.
// Süreler gerçektir: karar ve okuma süreleri modele girdi olduğu için bekleme ve tıklamalar gerçek zamanda yapılır.
// Çalıştırma: npm run demo:v2

// Altyazı: v1 demosundaki (demo.cy.js) ile aynı
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
    el.style.top = ust ? '8px' : '53%';
    el.textContent = metin;
  });
}

function baslaDeneyimli() {
  cy.visit('/');
  cy.get('[data-cy=seviye-deneyimli]').click();
  cy.wait(500);
  cy.get('[data-cy=btn-basla]').scrollIntoView().click();
  cy.get('[data-cy=sahne-1]').should('be.visible');
}

// Sahne 2'de modelin kararı gelince p'yi altyazıya yazar
function modelKarari(sonuc) {
  cy.get('[data-cy=sahne-2]', { timeout: 60000 })
    .should('have.attr', 'data-p')
    .and('not.be.empty')
    .then((p) => anlat(`Model (tarayıcıda, ONNX): p = ${Number(p).toFixed(2)} → ${sonuc}`));
}

it('RadyoAI v2 demo: aynı sahne, iki oyuncu, iki karar', () => {
  // ---- Oyuncu 1: aceleci
  cy.visit('/');
  anlat('v2: oyun, oyuncunun davranışından öğrenen küçük bir modelle uyum sağlıyor');
  cy.wait(3500);
  anlat('Oyuncu 1: "Deneyimliyim" diyor ve hızlı oynuyor');
  cy.wait(1500);
  baslaDeneyimli();
  anlat('Oyuncu 1: 2 saniyede B\'yi seçiyor...');
  cy.wait(2000);
  cy.get('[data-cy=secim-B]').scrollIntoView().click();
  anlat('...ve açıklamayı okumadan geçiyor');
  cy.wait(900);
  cy.get('[data-cy=btn-devam]').click();

  modelKarari('≥ 0.5, destek modu');
  cy.wait(3500);
  cy.get('[data-cy=mentor-notu]').scrollIntoView().should('be.visible');
  anlat('Destek modu: mentor notu, ipucu açık, süre baskısı yok');
  cy.get('[data-cy=sayac]').should('not.exist');
  cy.wait(4000);

  // ---- Oyuncu 2: dikkatli (25 sn düşünür, 12 sn okur: spec kabul örneği 7)
  baslaDeneyimli();
  anlat('Oyuncu 2: o da "Deneyimliyim" diyor, ama acele etmiyor');
  cy.wait(6000);
  anlat('Sayaç işliyor: deneyimli seviyede 60 sn süre baskısı var');
  cy.get('[data-cy=sayac]').should('be.visible');
  cy.wait(6000);
  anlat('İpucunu açıp okuyor, düşünüyor');
  cy.get('[data-cy=ipucu-kutusu] button').scrollIntoView().click();
  cy.wait(7000);
  anlat('25 saniye sonra A\'yı seçiyor');
  cy.wait(6000);
  cy.get('[data-cy=secim-A]').scrollIntoView().click();
  anlat('Açıklamayı okuyor: okuma süresi de modele giren bir sinyal');
  cy.wait(12000);
  cy.get('[data-cy=btn-devam]').click();

  modelKarari('< 0.5, normal akış');
  cy.get('[data-cy=mentor-notu]').should('not.exist');
  cy.get('[data-cy=sayac]').should('be.visible');
  cy.wait(4000);
  anlat('Aynı Sahne 2: Oyuncu 1 destek aldı, Oyuncu 2 süre baskısıyla devam ediyor');
  cy.wait(4500);
});
