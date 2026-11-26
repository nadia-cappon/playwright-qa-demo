# Plan de test — le « quoi, quand, avec quoi, qui »

> Application de la [stratégie](01-strategie-de-test.md) au projet **playwright-qa-demo**.
> Version 1.0 — 25/11/2026 — Rédigé par Nadia Cappon (QA), avec l'assistance de l'IA (Claude Code).

## 1. Objet et objectifs

Démontrer, en 5 minutes, une démarche QA outillée par l'IA sur le site public **https://www.antenia.com**, au travers de **3 parcours et 10 tests** :
- vérifier qu'un prospect atteint le formulaire de demande de démonstration, **sur ordinateur comme sur téléphone** (risque P1 : une grande partie des visiteurs consulte le site sur mobile) ;
- vérifier que le widget d'accessibilité modifie réellement l'affichage ;
- vérifier la validation et la sécurité côté navigateur du formulaire de contact.

## 2. Périmètre

| Parcours | Contenu | Exigences | Tests |
|---|---|---|---|
| **1. Parcours utilisateur** | Accueil (logo) → sous-menu « Nos solutions » → Assurance IARD → Demander une démo → retour par le logo → Découvrir nos logiciels | EX-PAR-01 | CT-PAR-01 (desktop + mobile) |
| **2. Accessibilité** | Widget : contraste élevé, niveaux de gris, réglage conservé puis réinitialisé | EX-A11Y-04, EX-A11Y-05 | CT-A11Y-05 à 07 |
| **3. Formulaire de contact** | Formulaire vide, format de l'email, téléphone, XSS, longueur | EX-FRM-02 à 04, EX-SEC-01, EX-SEC-02 | CT-FRM-02, 04, 08 ; CT-SEC-01, 03 |

**Hors périmètre** : envoi réel des formulaires, sécurité côté serveur, performance et charge, navigateurs autres que Chromium, contenus éditoriaux (blog, pages légales).

## 3. Base de test

Pas de spécification fournie : exigences déduites de l'exploration du site et des référentiels RGPD, OWASP et RGAA → [`03-exigences.md`](03-exigences.md).

## 4. Environnement de test

| Élément | Valeur |
|---|---|
| Application | https://www.antenia.com (production) |
| Navigateurs | Chromium : « Desktop Chrome » (1280×720) et « Pixel 7 » (mobile, tactile) |
| Outillage | Node.js, Playwright Test 1.65, TypeScript ; VS Code ; Claude Code + Playwright MCP |
| Données | Fictives uniquement (aucune donnée personnelle) |
| Exécution | Poste de la QA (Windows) et CI GitHub Actions (Ubuntu) |

## 5. Organisation et rôles

| Rôle | Responsabilités |
|---|---|
| **QA (Nadia Cappon)** | Exigences, choix des parcours, enregistrements Codegen, validation de chaque étape, analyse des échecs, fiches d'anomalie, rapport |
| **IA (Claude Code)** | Exploration, propositions d'exigences et de cas, refactorisation du code, aide à l'analyse des traces |

## 6. Planning

| Étape | Livrable | Statut |
|---|---|---|
| 1. Exploration | Constats dans `03-exigences.md` | ✅ |
| 2. Stratégie et plan | `01`, `02` | ✅ |
| 3. Exigences | `03-exigences.md` | ✅ |
| 4. Cas de test | `04-cas-de-test.md` | Parcours 1 ✅ · parcours 2 ✅ · parcours 3 ✅ |
| 5. Codegen | `codegen/brut/` | Parcours 1 ✅ · parcours 2 ✅ · parcours 3 ✅ (enregistrement initial) |
| 6. Page Object Model | `components/`, `pages/`, `tests/` | ✅ 3 parcours |
| 7. Exécution et Trace Viewer | Rapport HTML | ✅ 9 / 9 conformes |
| 8. Anomalies | `05-anomalies.md` + captures | ✅ 5 anomalies confirmées |
| 9. Clôture | `07-rapport-de-test.md` | ✅ |
| 10. Publication | Dépôt GitHub `playwright-qa-demo` | À faire |

## 7. Critères d'entrée et de sortie

| Critères d'entrée | Critères de sortie |
|---|---|
| Site accessible (vérifié automatiquement par `globalSetup`) | 100 % des tests prévus exécutés (10) |
| Exigences et cas de test validés par la QA | 0 échec inattendu ; anomalies connues marquées `test.fail()` |
| Environnement installé (`npm install`) | Chaque anomalie avec fiche et capture |
| | 0 test instable sur 3 exécutions successives |

## 8. Risques projet et parades

| Risque | Parade |
|---|---|
| Le site évolue (textes, menus) | Locators sémantiques et données dans `data/` : une seule correction |
| Bannière cookies ou scripts chargés en différé perturbent les tests | Bannière cookies (service tiers Axeptio) **bloquée** dans le navigateur de test ; simulation de présence du visiteur ; `toPass` |
| Envoi accidentel d'un formulaire en production | Garde réseau automatique qui bloque et fait échouer le test |
| Temps limité (entretien le 26/11) | Périmètre réduit à 3 parcours, validation étape par étape |

## 9. Livrables

Stratégie, plan, exigences, cas de test, fiches d'anomalie avec captures, document Codegen avant / après, code (Page Object Model), rapport HTML Playwright, rapport de test de clôture, dépôt GitHub avec CI.
