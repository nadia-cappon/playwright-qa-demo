# Prompt 3 — Analyse d'un échec avec le Trace Viewer

```bash
npx playwright show-trace test-results/<dossier-du-test>/trace.zip
```

```text
Le test <ID> échoue. Voici le message d'erreur, et ce que montre le Trace Viewer :
chronologie des actions, instantané DOM avant / après l'action en échec, onglet Réseau,
onglet Console, ainsi que la capture d'écran d'échec.

1. Classe l'échec : (a) vraie anomalie du site, (b) test fragile (locator, timing),
   (c) résultat attendu erroné, (d) évolution légitime du site.
2. Justifie ton classement uniquement à partir des éléments de la trace, sans supposer.
3. Selon le cas :
   (a) rédige la fiche d'anomalie au format de documentation/05-anomalies.md
       (type, environnement, gravité, priorité, étapes, attendu, obtenu, cause probable,
       correctif suggéré, impact) et propose le code d'une capture ciblée :
       await locator.screenshot({ path: 'documentation/anomalies/captures/ANO-xx.png' })
       + testInfo.attach pour le rapport ;
   (b) ou (d) propose le correctif minimal du Page Object ;
   (c) explique pourquoi l'oracle est faux et propose la nouvelle assertion.
La décision finale revient à la QA.
```
