import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Page « Réservez votre démonstration personnalisée ». Le formulaire n'est JAMAIS envoyé. */
export class DemoPage extends BasePage {
  readonly chemin = '/demande-de-demonstration/';
  readonly titreAttendu = /Démonstration/i;

  readonly formulaire: Locator;
  readonly boutonEnvoyer: Locator;

  constructor(page: Page) {
    super(page);
    // Nom technique du formulaire sur le site : « demande formation » (observation documentée)
    this.formulaire = page.getByRole('form', { name: 'demande formation' });
    this.boutonEnvoyer = this.formulaire.getByRole('button', { name: 'Envoyer votre demande' });
  }

  /** La page n'est utilisable que si son formulaire est affiché. */
  override get elementCle(): Locator {
    return this.formulaire;
  }
}
