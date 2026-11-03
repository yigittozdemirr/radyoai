// Diferansiyel test: aynı model.onnx, aynı 5 girdi. Python kahini (tests/parite.py → tests/parite.json)
// ile tarayıcıdaki onnxruntime-web aynı olasılığı tolerans içinde vermeli.

describe('Parite: Python kahini ve tarayıcı', () => {
  it('5 referans girdide fark < 1e-4', () => {
    cy.readFile('tests/parite.json').then((ref) => {
      cy.visit('/?parite=1');
      cy.get('[data-cy=parite-hazir]', { timeout: 60000 }).should('be.visible');
      cy.get('[data-cy=parite-hata]').should('not.exist');
      cy.get('[data-cy=p]')
        .should('have.length', ref.ornekler.length)
        .each(($p, i) => {
          const fark = Math.abs(Number($p.text()) - ref.ornekler[i].p);
          cy.log(`${ref.ornekler[i].ad}: fark ${fark.toExponential(2)}`);
          expect(fark, ref.ornekler[i].ad).to.be.lessThan(ref.tolerans);
        });
    });
  });
});
