import { test, expect } from '../fixtures/fixtures';
import { depuisLaPageContact } from '../fixtures/hooks';
import { emailsAControler, telephonesInvalides, champsTexte, chargesXss, LIMITE_TEXTE, SAISIE_EXCESSIVE } from '../data/formulaire';
import { anomalie, anomalieConnue, capturerPreuve } from '../utils/preuves';

/**
 * PARCOURS 3 — Formulaire de contact : validation et sécurité CÔTÉ NAVIGATEUR uniquement.
 * Hooks : beforeEach ouvre la page Contact ; afterEach vérifie qu'on y est toujours.
 * Garde réseau : toute soumission est bloquée et ferait échouer le test.
 */
test.describe('Parcours 3 – Formulaire de contact', { tag: '@formulaire' }, () => {
  depuisLaPageContact();

  test('CT-FRM-02 un formulaire vide n’est pas envoyé', { tag: '@smoke' }, async ({ formulaireContact, gardeReseau }) => {
    await formulaireContact.cliquerEnvoyer();

    expect(await formulaireContact.estValide()).toBe(false);
    const message = await formulaireContact.messageDeValidation('nom');
    test.info().annotations.push({ type: 'message du navigateur', description: message });
    expect(message).not.toBe('');
    expect(gardeReseau, 'aucune requête de soumission').toEqual([]);
  });

  test('CT-FRM-04 le format de l’email est contrôlé', async ({ formulaireContact }) => {
    for (const { valeur, valide } of emailsAControler) {
      await test.step(`« ${valeur} » → ${valide ? 'accepté' : 'refusé'}`, async () => {
        await formulaireContact.saisir('email', valeur);
        expect(await formulaireContact.champEstValide('email')).toBe(valide);
      });
    }
  });

  test('CT-FRM-08 le téléphone refuse les lettres et les symboles', { annotation: anomalie('ANO-01') }, async ({ formulaireContact }) => {
    anomalieConnue('ANO-01');
    for (const [index, valeur] of telephonesInvalides.entries()) {
      await test.step(`« ${valeur} » → refusé`, async () => {
        await formulaireContact.saisir('telephone', valeur);
        if (index === 0) await capturerPreuve(formulaireContact.champs.telephone, 'ANO-01');
        expect.soft(await formulaireContact.champEstValide('telephone')).toBe(false);
      });
    }
  });

  test('CT-SEC-03 une saisie de code (XSS) n’est jamais exécutée', { tag: '@securite' }, async ({ page, formulaireContact }) => {
    const dialogues: string[] = [];
    page.on('dialog', async (d) => {
      dialogues.push(d.message());
      await d.dismiss();
    });

    for (const charge of chargesXss) {
      await test.step(`Saisie de ${charge}`, async () => {
        for (const champ of champsTexte) {
          await formulaireContact.saisir(champ, charge);
          expect(await formulaireContact.valeur(champ), `${champ} conserve la saisie comme du texte`).toBe(charge);
        }
      });
    }

    expect(dialogues, 'aucune boîte de dialogue ne doit s’ouvrir').toEqual([]);
    await expect(page.locator('img[src="x"]'), 'aucune image injectée dans la page').toHaveCount(0);
  });

  test(`CT-SEC-01 le champ Nom limite la saisie à ${LIMITE_TEXTE} caractères`, { tag: '@securite', annotation: anomalie('ANO-02') }, async ({ formulaireContact }) => {
    anomalieConnue('ANO-02');
    await formulaireContact.saisir('nom', 'a'.repeat(SAISIE_EXCESSIVE));
    await capturerPreuve(formulaireContact.champs.nom, 'ANO-02');
    expect(await formulaireContact.longueur('nom')).toBeLessThanOrEqual(LIMITE_TEXTE);
  });
});
