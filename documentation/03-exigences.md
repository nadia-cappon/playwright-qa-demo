# Exigences (base de test)

Sans cahier des charges, ces exigences ont été **proposées par l'IA** à partir de l'exploration du site (25/11/2026) et des bonnes pratiques, puis **validées et sélectionnées par la QA**.

| ID | Exigence | Source | Prio | Parcours | Validation QA |
|---|---|---|---|---|---|
| EX-PAR-01 | Un prospect peut aller de l'accueil jusqu'au formulaire de **demande de démonstration**, en passant par le sous-menu « Nos solutions » et l'offre « Assurance IARD » (critères d'acceptation ci-dessous) | Parcours métier, défini par la QA | P1 | 1 | ✅ (complétée par la QA après Codegen) |
| EX-A11Y-04 | Le widget d'accessibilité adapte réellement l'affichage (contraste élevé, niveaux de gris) | Existant ; RGAA 3 (couleurs) | P2 | 2 | ✅ |
| EX-A11Y-05 | Les réglages du widget sont conservés au rechargement et peuvent être réinitialisés | Existant | P2 | 2 | ✅ |
| EX-FRM-02 | Un formulaire incomplet n'est jamais envoyé | Qualité des données | P1 | 3 | ✅ |
| EX-FRM-03 | L'adresse email doit respecter un format valide | Qualité des données | P1 | 3 | ✅ |
| EX-FRM-04 | Le téléphone n'accepte que des chiffres et les séparateurs usuels | Existant (attribut `pattern`) | P1 | 3 | ✅ |
| EX-SEC-01 | Les champs limitent le nombre de caractères (255 pour les champs texte) | OWASP (validation des entrées) | P2 | 3 | ✅ |
| EX-SEC-02 | Une saisie contenant du code (XSS) n'est jamais exécutée | OWASP Top 10 – A03 Injection | P1 | 3 | ✅ |

## EX-PAR-01 — Critères d'acceptation (parcours défini par la QA)

| # | Action de l'utilisateur | Résultat attendu |
|---|---|---|
| 1 | Ouvre le site antenia.com | La page d'accueil s'affiche, avec le **logo Antenia** (image) dans l'en-tête |
| 2 | Ouvre le sous-menu « Nos solutions » (survol sur desktop, menu hamburger sur mobile) | Le sous-menu s'affiche avec les solutions : **Assurance IARD, Santé et Prévoyance, HUB Pilot, IRIS Flow** |
| 3 | Clique sur « Assurance IARD » dans le sous-menu | Une nouvelle page s'affiche avec le titre **« Logiciels de gestion pour l'assurance IARD »** et un bouton **« Demander une démo »** |
| 4 | Clique sur « Demander une démo » | Une nouvelle page s'affiche (« Réservez votre démonstration personnalisée ») avec un **formulaire** et un bouton **« Envoyer votre demande »** |
| 5 | Clique sur le logo Antenia | Retour à la page d'accueil |
| 6 | Repère le bouton « Découvrir nos logiciels » et clique dessus | Le bouton est visible ; la page défile jusqu'à la présentation des logiciels |

⚠️ Le formulaire de démonstration n'est **jamais envoyé** (site de production) : la garde réseau bloque toute soumission.

## EX-A11Y-04 / EX-A11Y-05 — Critères d'acceptation (parcours 2)

| # | Action de l'utilisateur | Résultat attendu |
|---|---|---|
| 1 | Ouvre antenia.com | Accueil affichée, fond **blanc** ; bouton rond « Accessibilité » visible en bas à droite |
| 2 | Clique sur le bouton « Accessibilité » | Le panneau « Accessibilité » s'ouvre |
| 3 | Choisit **Contraste élevé** | Le fond de la page devient **noir** ; l'option active est annoncée aux lecteurs d'écran (RGAA 7.1) |
| 4 | Active **Niveaux de gris** | L'option est cochée ; la page s'affiche **en noir et blanc** |
| 5 | Ferme le panneau puis recharge la page | Réglages **conservés** ; le bouton indique « Certains outils sont activés » |
| 6 | Rouvre le panneau et clique sur **Réinitialiser** | Fond **blanc**, couleurs normales ; le bouton redevient « Options d'accessibilité » |

## Constats d'exploration utilisés

- **Parcours** : le sous-menu « Nos solutions » (bouton « Ouvrir Nos solutions », attribut `aria-expanded`) présente 4 solutions : Assurance IARD, Santé et Prévoyance, HUB Pilot, IRIS Flow ; il s'ouvre au survol sur desktop ; la page IARD (titre « Logiciels de gestion pour l'assurance IARD ») propose plusieurs boutons « Demander une démo » qui mènent tous à `/demande-de-demonstration/` ; cette page (titre « Réservez votre démonstration personnalisée ») contient un formulaire et le bouton « Envoyer votre demande ». Sur mobile, le menu s'ouvre avec le bouton « Permuter le menu ».
- **Logo** : le logo de l'en-tête est une image (`Fichier-3.webp`) **sans texte alternatif** (`alt` vide). On ne peut donc pas le trouver par son nom accessible : c'est l'anomalie ANO-04 (constat d'accessibilité).
- **Formulaire de démonstration** : son nom technique est « demande formation » (et non « démonstration ») : à signaler comme observation.
- **Widget** : « Ally by Elementor », rendu dans un Shadow DOM ouvert. Contraste élevé : fond `rgb(0, 0, 0)`. Niveaux de gris : `filter: grayscale(1)` sur `<html>`. Le réglage est enregistré dans le navigateur, et le bouton devient « Options d'accessibilité. Certains outils sont activés ».
- **Chargement différé** : le site ne charge certains scripts (dont le widget) qu'après une première action du visiteur (souris, défilement). Les tests reproduisent ce comportement.
- **Formulaire** : validation native du navigateur. Champs obligatoires : Nom, Prénom, Email, Téléphone, Message. Email : `type="email"`. Téléphone : `pattern="[0-9()#&+*-=.]+"`. Aucun `maxlength`.
- **Identifiants** : aucun `data-testid` ; les champs ont des `id` stables (`form-field-…`).
