import type { Locator } from '@playwright/test';
import { test, expect } from '../fixtures/fixtures';
import { depuisLaPageAccueil } from '../fixtures/hooks';
import { RUBRIQUE_SOLUTIONS, solutionsAttendues, SOLUTION_CHOISIE } from '../data/parcours';
import { joindreCapture } from '../utils/preuves';

/**
 * PARCOURS 1 — Parcours utilisateur (EX-PAR-01, fiche CT-PAR-01).
 * Un prospect assureur IARD va de l'accueil au formulaire de demande de démonstration,
 * puis revient à l'accueil. Enregistré avec Codegen (codegen/brut/parcours-demo-iard.spec.ts).
 * Le même test tourne en desktop ET en mobile (menu hamburger géré par le composant MenuPrincipal).
 */
test.describe('Parcours 1 – Prospect assureur IARD', { tag: '@parcours' }, () => {
  depuisLaPageAccueil(); // beforeEach : accueil ouverte et vérifiée (URL, titre, H1)

  test('CT-PAR-01 de l’accueil au formulaire de demande de démonstration', { tag: '@smoke' }, async ({ accueilPage, assuranceIardPage, demoPage }) => {
    let sousMenu!: Locator;

    await test.step('1. L’accueil affiche le logo Antenia', async () => {
      await expect(accueilPage.logo).toBeVisible();
    });

    await test.step(`2. Le sous-menu « ${RUBRIQUE_SOLUTIONS} » présente les solutions`, async () => {
      sousMenu = await accueilPage.menu.ouvrirSousMenu(RUBRIQUE_SOLUTIONS);
      for (const solution of solutionsAttendues) {
        await expect(accueilPage.menu.lienDuSousMenu(sousMenu, solution), `solution « ${solution} »`).toBeVisible();
      }
      // Preuve visuelle : en exécution rapide, on ne voit pas le sous-menu avant le clic
      await joindreCapture(sousMenu, 'sous-menu-nos-solutions');
    });

    await test.step(`3. « ${SOLUTION_CHOISIE} » ouvre la page de l’offre`, async () => {
      await accueilPage.menu.lienDuSousMenu(sousMenu, SOLUTION_CHOISIE).click();
      await expect(assuranceIardPage).toEtreAffichee();
      await expect(assuranceIardPage.titrePrincipal).toHaveText(assuranceIardPage.titreH1Attendu);
      await expect(assuranceIardPage.boutonDemanderDemo).toBeVisible();
    });

    await test.step('4. « Demander une démo » ouvre le formulaire (sans l’envoyer)', async () => {
      await assuranceIardPage.demanderUneDemo();
      await expect(demoPage).toEtreAffichee();
      await expect(demoPage.formulaire).toBeVisible();
      await expect(demoPage.boutonEnvoyer).toBeVisible();
    });

    await test.step('5. Le logo ramène à l’accueil', async () => {
      await demoPage.revenirAlAccueilParLeLogo();
      await expect(accueilPage).toEtreAffichee();
    });

    await test.step('6. « Découvrir nos logiciels » mène à la présentation des logiciels', async () => {
      await expect(accueilPage.boutonDecouvrirLogiciels).toBeVisible();
      await accueilPage.decouvrirNosLogiciels();
      await expect(accueilPage.sectionLogiciels).toBeInViewport();
    });
  });
});
