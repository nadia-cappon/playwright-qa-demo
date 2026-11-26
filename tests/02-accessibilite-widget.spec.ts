import { test, expect } from '../fixtures/fixtures';
import { depuisLaPageAccueil } from '../fixtures/hooks';
import { anomalie, anomalieConnue, capturerPreuve, joindreCapture, joindreCaptureEcran } from '../utils/preuves';

/** Couleurs et filtres calculés par le navigateur (getComputedStyle) */
const FOND_NORMAL = 'rgb(255, 255, 255)';
const FOND_CONTRASTE_ELEVE = 'rgb(0, 0, 0)';
const FILTRE_GRIS = 'grayscale(1)';
const SANS_FILTRE = 'none';

/**
 * PARCOURS 2 — Accessibilité (EX-A11Y-04, EX-A11Y-05 ; fiches CT-A11Y-05 et CT-A11Y-08).
 * Le widget « Accessibilité » (bouton rond en bas à droite) adapte l'affichage de la page.
 * On vérifie l'EFFET réel (styles calculés) ; les captures sont des preuves jointes au rapport.
 * Enregistré avec Codegen (codegen/brut/widget-accessibilite.spec.ts).
 */
test.describe('Parcours 2 – Widget d’accessibilité', { tag: '@a11y' }, () => {
  depuisLaPageAccueil(); // hook : accueil ouverte et vérifiée ; navigateur neuf = aucun réglage

  // Hook commun aux 2 tests = étapes 1 à 3 de la fiche (écrites une seule fois)
  test.beforeEach(async ({ accueilPage }) => {
    const widget = accueilPage.widgetAccessibilite;

    await test.step('1. Affichage normal et bouton « Accessibilité » visible', async () => {
      await expect(accueilPage.corps).toHaveCSS('background-color', FOND_NORMAL);
      await expect(widget.boutonOuvrir).toBeVisible();
    });

    await test.step('2. Ouvrir le panneau « Accessibilité »', async () => {
      await widget.ouvrir();
      await joindreCapture(widget.panneau, '1-panneau-accessibilite');
    });

    await test.step('3. « Contraste élevé » : le fond devient noir', async () => {
      await widget.activerContrasteEleve();
      await expect(accueilPage.corps).toHaveCSS('background-color', FOND_CONTRASTE_ELEVE);
      // Preuve d'ANO-07 (constat exploratoire) : le titre reste bleu nuit sur fond noir
      await capturerPreuve(accueilPage.titrePrincipal.first(), 'ANO-07');
    });
  });

  test('CT-A11Y-05 adapter l’affichage, retrouver ses réglages puis les réinitialiser', async ({ page, accueilPage }) => {
    const widget = accueilPage.widgetAccessibilite;
    await joindreCaptureEcran(page, '2-contraste-eleve');

    await test.step('4. « Niveaux de gris » : la page passe en noir et blanc', async () => {
      await widget.activerNiveauxDeGris();
      await expect(widget.niveauxDeGris).toHaveAttribute('aria-checked', 'true');
      await expect(accueilPage.racineHtml).toHaveCSS('filter', FILTRE_GRIS);
      await joindreCaptureEcran(page, '3-niveaux-de-gris');
    });

    await test.step('5. Fermer et recharger : les réglages sont conservés', async () => {
      await widget.fermer();
      await accueilPage.recharger();
      await expect(accueilPage.corps).toHaveCSS('background-color', FOND_CONTRASTE_ELEVE);
      await expect(accueilPage.racineHtml).toHaveCSS('filter', FILTRE_GRIS);
      await expect(widget.boutonOuvrir).toHaveAccessibleName(/Certains outils sont activés/);
    });

    await test.step('6. « Réinitialiser » : retour à l’affichage normal', async () => {
      await widget.ouvrir();
      await widget.reinitialiser();
      await expect(accueilPage.corps).toHaveCSS('background-color', FOND_NORMAL);
      await expect(accueilPage.racineHtml).toHaveCSS('filter', SANS_FILTRE);
      // Le bouton rond est masqué tant que le panneau est ouvert : on ferme d'abord
      await widget.fermer();
      await expect(widget.boutonOuvrir).toHaveAccessibleName("Options d'accessibilité");
      await joindreCaptureEcran(page, '4-reinitialise');
    });
  });

  /**
   * Test SÉPARÉ du parcours : test.fail() concerne tout le test ; s'il était dans le parcours,
   * une vraie régression des étapes 4 à 6 serait masquée par l'anomalie connue.
   * Le hook a déjà activé le contraste élevé : il ne reste que la vérification.
   */
  test('CT-A11Y-08 l’option de contraste active est annoncée aux lecteurs d’écran', { annotation: anomalie('ANO-06') }, async ({ accueilPage }) => {
    anomalieConnue('ANO-06');
    const widget = accueilPage.widgetAccessibilite;
    await capturerPreuve(widget.panneau, 'ANO-06');
    // RGAA 7.1 / WCAG 4.1.2 : l'état d'une option doit être restitué aux technologies d'assistance
    await expect(widget.contrasteEleve).toHaveAttribute('aria-checked', 'true', { timeout: 3_000 });
  });
});
