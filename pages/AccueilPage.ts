import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccueilPage extends BasePage {
  readonly chemin = '/';
  readonly titreAttendu = /suite logicielle assurance/i;

  /** Bouton du bandeau d'accueil : il fait défiler la page jusqu'à la présentation des logiciels. */
  readonly boutonDecouvrirLogiciels: Locator;
  /** Section cible du bouton (ancre #suiteneo, id stable choisi par l'éditeur du site) */
  readonly sectionLogiciels: Locator;

  constructor(page: Page) {
    super(page);
    this.boutonDecouvrirLogiciels = page.getByRole('link', { name: 'Découvrir nos logiciels' });
    this.sectionLogiciels = page.getByTestId('suiteneo');
  }

  async decouvrirNosLogiciels(): Promise<void> {
    await this.boutonDecouvrirLogiciels.click();
  }
}
