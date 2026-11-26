import { test, expect } from './fixtures';
import type { AccueilPage } from '../pages/AccueilPage';

/**
 * Hooks partagés : déclarés une seule fois, réutilisés dans les 3 parcours.
 * À appeler en tête d'un test.describe().
 *
 * Schéma : précondition (beforeEach) → test → postcondition + retour à l'accueil (afterEach).
 * Remarque : chaque test Playwright démarre déjà dans un navigateur neuf ; le retour à l'accueil
 * sert ici à vérifier, après chaque test, que le logo ramène bien à l'accueil depuis n'importe quelle page.
 */

/** Retour à l'accueil par le logo, comme un visiteur, puis vérification de la page. */
async function revenirAlAccueil(accueilPage: AccueilPage): Promise<void> {
  await test.step('Retour à l’accueil par le logo', async () => {
    await accueilPage.revenirAlAccueilParLeLogo();
    await expect(accueilPage).toEtreAffichee();
  });
}

/** Précondition : la page d'accueil est ouverte et affichée. Après chaque test : retour à l'accueil. */
export function depuisLaPageAccueil(): void {
  test.beforeEach(async ({ accueilPage }) => {
    await accueilPage.ouvrir();
    await expect(accueilPage).toEtreAffichee();
  });

  test.afterEach(async ({ accueilPage }) => {
    await revenirAlAccueil(accueilPage);
  });
}

/**
 * Précondition : la page Contact est ouverte et affichée.
 * Après chaque test : 1) postcondition — toujours sur la page Contact, donc aucun envoi ni redirection ;
 *                     2) retour à l'accueil par le logo.
 */
export function depuisLaPageContact(): void {
  test.beforeEach(async ({ contactPage }) => {
    await contactPage.ouvrir();
    await expect(contactPage).toEtreAffichee();
  });

  test.afterEach(async ({ contactPage, accueilPage }) => {
    await expect(contactPage, 'postcondition : toujours sur la page Contact (rien n’a été envoyé)').toEtreAffichee();
    await revenirAlAccueil(accueilPage);
  });
}
