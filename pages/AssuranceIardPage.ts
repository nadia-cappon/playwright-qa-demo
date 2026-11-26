import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Page « Logiciels de gestion pour l'assurance IARD ». */
export class AssuranceIardPage extends BasePage {
  readonly chemin = '/assurance-iard/';
  readonly titreAttendu = /assurance IARD/i;
  /** Titre H1 attendu (l'apostrophe du site est typographique : ’) */
  readonly titreH1Attendu = /Logiciels de gestion pour l.assurance IARD/i;

  readonly boutonDemanderDemo: Locator;

  constructor(page: Page) {
    super(page);
    // Locator proposé par Codegen. La page contient plusieurs boutons « Demander une démo »
    // menant à la même page : on prend celui du haut, dans le contenu principal.
    this.boutonDemanderDemo = page.getByRole('main').getByRole('link', { name: /demander une démo/i }).first();
  }

  async demanderUneDemo(): Promise<void> {
    await this.boutonDemanderDemo.click();
  }
}
