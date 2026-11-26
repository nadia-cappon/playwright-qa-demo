import type { NomChamp } from '../components/FormulaireContact';

/**
 * Données FICTIVES. Elles ne sont jamais envoyées : les tests vérifient seulement
 * la validation du navigateur, et la garde réseau bloque toute soumission.
 */

/** EX-FRM-01 */
export const champsObligatoires: NomChamp[] = ['nom', 'prenom', 'email', 'telephone', 'message'];
export const champsTexte: NomChamp[] = ['nom', 'prenom', 'societe', 'fonction', 'message'];

/** CT-FRM-04 — partitions d'équivalence de l'email (une ligne = une étape du test) */
export const emailsAControler: { valeur: string; valide: boolean }[] = [
  { valeur: 'prenom.nom@exemple.fr', valide: true },
  { valeur: 'a+tag@exemple.co.uk', valide: true },
  { valeur: 'abc', valide: false },
  { valeur: 'abc@', valide: false },
  { valeur: '@exemple.fr', valide: false },
  { valeur: 'a b@x.fr', valide: false },
];

/** CT-FRM-08 — téléphones invalides qui devraient être refusés (ANO-01) */
export const telephonesInvalides = ['06abc', 'abcdefgh', '<>'];

/** CT-SEC-03 — charges XSS inoffensives, saisies mais jamais envoyées */
export const chargesXss = ['<script>alert(1)</script>', '"><img src=x onerror=alert(1)>'];

/** CT-SEC-01 — valeur limite validée par la QA (EX-SEC-01) */
export const LIMITE_TEXTE = 255;
export const SAISIE_EXCESSIVE = 5000;
