import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Composant « Widget d'accessibilité » (Ally by Elementor), bouton rond en bas à droite.
 * Il est rendu dans un Shadow DOM ouvert : les locators Playwright le traversent automatiquement.
 * Tous les locators sont sémantiques (getByRole) : le widget n'a pas d'id stable.
 */
export class WidgetAccessibilite {
  /** Son nom devient « Options d'accessibilité. Certains outils sont activés » quand un réglage est actif. */
  readonly boutonOuvrir: Locator;
  readonly panneau: Locator;
  readonly boutonReinitialiser: Locator;
  readonly boutonFermer: Locator;
  /** Carte « Contraste » (groupe de choix) : son nom suit le niveau actif (« Contraste », « Contraste sombre »…) */
  readonly carteContraste: Locator;
  readonly contrasteEleve: Locator;
  readonly niveauxDeGris: Locator;

  constructor(page: Page) {
    this.boutonOuvrir = page.getByRole('button', { name: /^Options d'accessibilité/ });
    this.panneau = page.getByRole('dialog', { name: "Widget d'accessibilité" });
    this.boutonReinitialiser = this.panneau.getByRole('button', { name: 'Réinitialiser les paramètres' });
    this.boutonFermer = this.panneau.getByRole('button', { name: 'Fermer le widget' });
    this.carteContraste = this.panneau.getByRole('radiogroup', { name: /^Contraste/ });
    // Locators identiques à ceux proposés par Codegen (codegen/brut/widget-accessibilite.spec.ts)
    this.contrasteEleve = this.panneau.getByRole('radio', { name: 'Contraste élevé' });
    this.niveauxDeGris = this.panneau.getByRole('checkbox', { name: 'Niveaux de gris' });
  }

  async ouvrir(): Promise<this> {
    await this.boutonOuvrir.click();
    await expect(this.panneau).toBeVisible();
    return this;
  }

  /**
   * Les choix de contraste sont MASQUÉS tant que la carte n'a pas été activée :
   * un 1er clic sur la carte (→ « Contraste sombre ») les fait apparaître,
   * puis on choisit directement « Contraste élevé ».
   */
  async activerContrasteEleve(): Promise<this> {
    await this.carteContraste.click();
    await this.contrasteEleve.click();
    return this;
  }

  async activerNiveauxDeGris(): Promise<this> {
    await this.niveauxDeGris.click();
    return this;
  }

  async reinitialiser(): Promise<this> {
    await this.boutonReinitialiser.click();
    return this;
  }

  async fermer(): Promise<void> {
    await this.boutonFermer.click();
  }
}
