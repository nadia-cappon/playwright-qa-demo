import { request } from '@playwright/test';
import { BASE_URL } from './data/environnement';

/**
 * Hook global exécuté UNE fois avant toute la suite.
 * Critère d'entrée de la stratégie : le site doit être accessible.
 * Sinon, on arrête tout de suite avec un message clair (au lieu de 62 échecs en cascade).
 */
export default async function globalSetup(): Promise<void> {
  const contexte = await request.newContext();
  try {
    const reponse = await contexte.get(BASE_URL);
    if (!reponse.ok()) {
      throw new Error(`Critère d'entrée non rempli : ${BASE_URL} répond ${reponse.status()}`);
    }
  } finally {
    await contexte.dispose();
  }
}
