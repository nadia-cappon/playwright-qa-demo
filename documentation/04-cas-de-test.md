# Cas de test — 3 parcours, 10 tests

**Démarche** : l'IA a généré un premier catalogue de 33 cas (navigation, liens, pages légales, responsive, audit axe-core…). Après revue, **la QA a retenu 3 parcours** pour une suite courte, lisible et présentable. Les cas non retenus ne sont pas automatisés.

| Parcours | ID | Cas de test | Technique ISTQB | Données | Résultat attendu | Exig. | Auto |
|---|---|---|---|---|---|---|---|
| **1. Parcours utilisateur** | CT-PAR-01 | Un prospect va de l'accueil au formulaire de demande de démonstration via l'offre IARD, puis revient à l'accueil | Bout en bout, cas d'usage (voir fiche détaillée) | Accueil → sous-menu Nos solutions → Assurance IARD → Demander une démo → logo → Découvrir nos logiciels | Sous-menu avec les 4 solutions (capture) ; chaque page attendue s'affiche ; formulaire de démonstration présent ; **aucun envoi** | EX-PAR-01 | ✔ desktop + mobile |
| **2. Accessibilité** | CT-A11Y-05 | Un visiteur adapte l'affichage avec le widget d'accessibilité, retrouve ses réglages au rechargement, puis les réinitialise | Cas d'usage + transition d'états (voir fiche détaillée) | Contraste élevé, niveaux de gris | Effets visibles sur la page ; réglages conservés puis réinitialisés | EX-A11Y-04, EX-A11Y-05 | ✔ |
| | CT-A11Y-08 | L'option de contraste active est annoncée aux lecteurs d'écran | Test d'accessibilité (RGAA 7.1, WCAG 4.1.2) | Contraste élevé | `aria-checked="true"` sur « Contraste élevé » | EX-A11Y-04 | ✔ `test.fail` **ANO-06** |
| **3. Formulaire** | CT-FRM-02 | Envoyer un formulaire vide | Valeur limite (0 champ) | — | Envoi bloqué, message du navigateur, aucune requête | EX-FRM-02 | ✔ |
| | CT-FRM-04 | Format de l'email | Partitions d'équivalence | Valides : `prenom.nom@exemple.fr`, `a+tag@exemple.co.uk` · Invalides : `abc`, `abc@`, `@exemple.fr`, `a b@x.fr` | Valides acceptés, invalides refusés | EX-FRM-03 | ✔ |
| | CT-FRM-08 | Téléphone avec lettres ou symboles | Partition invalide | `06abc`, `abcdefgh`, `<>` | Refusé | EX-FRM-04 | ✔ `test.fail` **ANO-01** |
| | CT-SEC-03 | Saisie de code dans les champs texte | Estimation d'erreur (OWASP) | `<script>alert(1)</script>`, `"><img src=x onerror=alert(1)>` | Conservé comme texte ; aucune boîte de dialogue ; rien d'injecté | EX-SEC-02 | ✔ |
| | CT-SEC-01 | Saisie excessive dans « Nom » | Valeur limite | 5 000 caractères | Saisie limitée à 255 | EX-SEC-01 | ✔ `test.fail` **ANO-02** |

**Total : 8 tests en desktop + le parcours 1 rejoué en mobile = 9 exécutions.**

---

## Fiche détaillée — CT-PAR-01 : du site au formulaire de demande de démonstration

| Champ | Valeur |
|---|---|
| Exigence | EX-PAR-01 |
| Objectif | Vérifier qu'un prospect assureur IARD trouve le formulaire de demande de démonstration, puis peut revenir à l'accueil |
| Technique | Test de bout en bout basé sur un cas d'usage |
| Priorité | P1 (`@parcours`, `@smoke`) |
| Appareils | Desktop (Chrome) et mobile (Pixel 7, menu hamburger) : même test, sans duplication |
| Statut | ✅ Validé par la QA le 25/11/2026 |
| Préconditions | Site accessible ; navigateur neuf (aucun cookie, aucun réglage) |
| Données | Aucune (aucune saisie) |
| Origine | Exigence rédigée par la QA, parcours enregistré par la QA avec Codegen (`codegen/brut/parcours-demo-iard.spec.ts`). Codegen a suivi le sous-menu déroulant ; **la QA a retenu ce chemin** et ajouté une vérification du contenu du sous-menu, avec une capture, car en exécution rapide on ne voit pas les solutions proposées avant le clic |

| Étape | Action | Résultat attendu | Vérification automatisée |
|---|---|---|---|
| 1 | Ouvrir https://www.antenia.com | Page d'accueil affichée ; **logo Antenia visible** (image de l'en-tête) | URL, titre d'onglet, H1 ; logo visible |
| 2 | Ouvrir le sous-menu « Nos solutions » (survol sur desktop ; hamburger puis « Ouvrir Nos solutions » sur mobile) | Le sous-menu s'affiche avec les 4 solutions : **Assurance IARD, Santé et Prévoyance, HUB Pilot, IRIS Flow** | Sous-menu ouvert (`aria-expanded="true"`), 4 solutions visibles ; **capture du sous-menu jointe au rapport** |
| 3 | Cliquer sur « Assurance IARD » dans le sous-menu | Page IARD affichée : titre **« Logiciels de gestion pour l'assurance IARD »** ; bouton **« Demander une démo »** visible | URL `/assurance-iard/`, H1 exact, bouton visible |
| 4 | Cliquer sur « Demander une démo » (premier bouton) | Page « Réservez votre démonstration personnalisée » affichée, avec un **formulaire** et le bouton **« Envoyer votre demande »** | URL `/demande-de-demonstration/`, H1, formulaire et bouton visibles ; **aucune requête d'envoi** |
| 5 | Cliquer sur le logo Antenia | Retour à la page d'accueil | URL, titre, H1 de l'accueil |
| 6 | Repérer puis cliquer sur « Découvrir nos logiciels » | Bouton visible ; la page défile jusqu'à la présentation des logiciels | Bouton visible ; section cible visible après le clic |

| Postconditions | Aucun formulaire envoyé (garde réseau) ; aucun réglage modifié |
|---|---|
| Points d'attention | Le logo n'a pas de texte alternatif (ANO-04) : il est repéré comme l'image du lien d'accueil, pas par son nom. La page IARD contient plusieurs boutons « Demander une démo » qui mènent à la même page. |

**Parcours 3 (formulaire de contact) : 5 cas validés par la QA le 26/11/2026.** Codegen : le clic « Envoyer » sur formulaire vide (CT-FRM-02) provient des enregistrements `codegen/brut/navigation-contact.spec.ts` et `codegen/brut/formulaire-contact.spec.ts` ; les 4 autres cas sont des saisies de données (tables dans `data/formulaire.ts`) sur des champs repérés par leurs identifiants stables, sans nouvel enregistrement nécessaire.

## Décisions de revue (QA)

| Décision | Motif |
|---|---|
| Recentrage sur 3 parcours | Suite courte et présentable ; chaque test justifié par un risque |
| Parcours IARD plutôt qu'un simple clic « Contact » | Il reflète le métier (assurance IARD) et teste plusieurs pages à la suite |
| Widget d'accessibilité plutôt qu'un audit automatique | On teste une fonctionnalité réellement utilisée par les visiteurs, et son effet visible |
| Rejet de « envoyer un formulaire valide » | Site de production : interdit sans autorisation |
| Emails limites (`a@b`) non automatisés | Conformes au standard HTML : ANO-05, gardée comme constat documenté |


---

## Fiche détaillée — CT-A11Y-05 : adapter l'affichage avec le widget d'accessibilité

| Champ | Valeur |
|---|---|
| Exigences | EX-A11Y-04, EX-A11Y-05 |
| Objectif | Vérifier que le widget modifie réellement l'affichage, que les réglages sont conservés au rechargement et qu'ils peuvent être réinitialisés |
| Technique | Cas d'usage + **transition d'états** (normal → contraste élevé + gris → rechargé → réinitialisé) |
| Priorité | P2 (`@a11y`) |
| Appareils | Desktop |
| Préconditions | Navigateur neuf (aucun réglage enregistré) |
| Données | Aucune saisie |
| Origine | Parcours proposé par l'IA, retenu par la QA ; à enregistrer avec Codegen (`codegen/brut/widget-accessibilite.spec.ts`) |
| Statut | ✅ Validé par la QA le 25/11/2026 |

| Étape | Action | Résultat attendu | Vérification automatisée |
|---|---|---|---|
| 1 | Ouvrir https://www.antenia.com | Accueil affichée ; fond **blanc** ; bouton « Accessibilité » visible | URL, titre, H1 ; fond `rgb(255, 255, 255)` ; bouton visible |
| 2 | Cliquer sur le bouton « Accessibilité » | Panneau « Accessibilité » ouvert | Panneau visible ; **capture du panneau jointe au rapport** |
| 3 | Choisir « Contraste élevé » | Fond de page **noir** | Fond `rgb(0, 0, 0)` ; **capture de la page jointe** |
| 4 | Activer « Niveaux de gris » | Option cochée ; page en noir et blanc | `aria-checked="true"` ; filtre `grayscale(1)` sur la page ; **capture jointe** |
| 5 | Fermer le panneau et recharger la page | Réglages conservés et signalés | Fond noir et filtre gris toujours présents ; bouton « … Certains outils sont activés » |
| 6 | Rouvrir le panneau, cliquer sur « Réinitialiser » | Retour à l'affichage normal | Fond blanc ; aucun filtre ; bouton « Options d'accessibilité » ; **capture jointe** |

| Postconditions | Réglages réinitialisés ; chaque test démarre dans un navigateur neuf |
| Implémentation | Étapes 1 à 3 dans un **hook `beforeEach` commun** à CT-A11Y-05 et CT-A11Y-08 (aucune répétition) ; étapes 4 à 6 dans CT-A11Y-05 |
| Captures | Choix de la QA : les assertions portent sur les styles calculés (fiables) ; les captures sont des **preuves jointes au rapport**, pas des assertions visuelles (`toHaveScreenshot` serait fragile sur un site de production et différent entre Windows et la CI Linux) |
|---|---|
| Points d'attention | Le widget ne se charge qu'après une première action du visiteur (souris, défilement) ; « Contraste » propose plusieurs niveaux, le test choisit directement « Contraste élevé ». |

## Fiche détaillée — CT-A11Y-08 : le contraste actif est annoncé aux lecteurs d'écran (ANO-06)

| Champ | Valeur |
|---|---|
| Exigence | EX-A11Y-04 (RGAA 7.1, WCAG 4.1.2 : l'état d'un composant doit être restitué) |
| Étapes | Ouvrir le widget → choisir « Contraste élevé » (étapes 1 à 3 du hook commun) |
| Résultat attendu | L'option « Contraste élevé » a `aria-checked="true"` |
| Résultat constaté | « Par défaut » reste `aria-checked="true"` alors que le fond est noir |
| Automatisation | `test.fail()` + annotation **ANO-06** + capture de preuve. Test **séparé** du parcours CT-A11Y-05 pour qu'une vraie régression du parcours ne soit pas masquée par l'anomalie connue |
| Statut | ✅ Validé par la QA le 25/11/2026 |
