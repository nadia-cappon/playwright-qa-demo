import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { FormulaireContact } from '../components/FormulaireContact';

export class ContactPage extends BasePage {
  readonly chemin = '/contact/';
  readonly titreAttendu = /Contactez-nous/i;

  readonly formulaire: FormulaireContact;

  constructor(page: Page) {
    super(page);
    this.formulaire = new FormulaireContact(page);
  }

  /** La page Contact n'est utilisable que si son formulaire est affiché. */
  override get elementCle(): Locator {
    return this.formulaire.racine;
  }
}
