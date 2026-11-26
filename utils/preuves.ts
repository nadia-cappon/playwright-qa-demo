import { test, type Locator, type Page } from '@playwright/test';

/** Annotation qui relie un test à sa fiche d'anomalie (visible dans le rapport HTML). */
export function anomalie(id: string) {
  return { type: 'anomalie', description: `${id} — voir documentation/05-anomalies.md` };
}

/**
 * Déclare une anomalie connue : le test DOIT échouer tant que l'anomalie existe.
 * Le jour où le site est corrigé, le test passe… et Playwright le signale.
 */
export function anomalieConnue(id: string): void {
  test.fail(true, `${id} — anomalie connue, voir documentation/05-anomalies.md`);
}

/**
 * Capture de preuve d'une anomalie (étape 9 de la stratégie) :
 * jointe au rapport HTML et enregistrée dans documentation/anomalies/captures/<ID>.png
 */
export async function capturerPreuve(element: Locator, idAnomalie: string): Promise<void> {
  const image = await element.screenshot({ path: `documentation/anomalies/captures/${idAnomalie}.png` });
  await test.info().attach(`preuve-${idAnomalie}`, { body: image, contentType: 'image/png' });
}

/**
 * Capture d'illustration jointe au rapport HTML (ce n'est pas une anomalie) :
 * par exemple, le sous-menu ouvert avant le clic, invisible en exécution rapide.
 */
export async function joindreCapture(element: Locator, nom: string): Promise<void> {
  await test.info().attach(nom, { body: await element.screenshot(), contentType: 'image/png' });
}

/** Capture de la partie visible de la page, jointe au rapport HTML (effet visuel d'un réglage). */
export async function joindreCaptureEcran(page: Page, nom: string): Promise<void> {
  await test.info().attach(nom, { body: await page.screenshot(), contentType: 'image/png' });
}
