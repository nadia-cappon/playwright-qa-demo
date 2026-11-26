# Prompt 2 — Refactorisation d'un script Codegen en Page Object Model

Utilisé après l'enregistrement d'un parcours avec Codegen :

```bash
npx playwright codegen https://www.antenia.com/contact/ --target=playwright-test -o codegen/brut/contact.spec.ts
```

```text
Voici un script brut produit par Playwright Codegen (codegen/brut/<fichier>.spec.ts)
et les cas de test retenus qu'il doit couvrir (IDs : ...).

Refactorise-le en respectant CLAUDE.md :
- Ne modifie pas le fichier brut : il reste dans codegen/brut/ comme preuve.
- Déplace chaque locator dans le Page Object concerné (pages/), qui hérite de BasePage.
  Conserve les locators getByRole / getByLabel proposés par Codegen quand ils sont robustes ;
  remplace ceux qui sont fragiles (nth(), textes trop longs, classes générées).
- Sors les données dans data/ et transforme les répétitions en tests pilotés par les données.
- Remplace les URLs complètes par des chemins relatifs (baseURL).
- Supprime les actions superflues (clics de focus, scrolls).
- Ajoute les assertions qui correspondent EXACTEMENT au résultat attendu de chaque cas.
- Préfixe chaque test par l'ID du cas et ajoute les tags.
- Utilise les fixtures (garde réseau anti-POST, bannière cookies).
- Anomalie connue : test.fail() avec l'annotation { type: 'anomalie', description: 'ANO-xx' }.

Puis rédige documentation/06-codegen-avant-apres.md : extrait brut, extrait refactorisé,
et liste des transformations avec leur justification.
```
