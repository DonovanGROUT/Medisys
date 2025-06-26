# Prettier & formatage automatique du code

## Objectifs
- Garantir une base de code homogène, lisible et sans débat de style
- Faciliter la relecture, la maintenance et la contribution en équipe

## Stack utilisée
- **Prettier** : outil de formatage automatique (JS, TS, Vue, CSS, Markdown, etc.)
- Intégration dans VS Code (extension recommandée)
- Script npm : `npm run format`

## Bonnes pratiques
- Un seul outil de formatage pour tout le frontend (pas de conflit avec ESLint)
- Formatage automatique à chaque sauvegarde dans l’éditeur
- Fichier `.prettierrc` pour la configuration du style
- Fichier `.prettierignore` pour exclure certains fichiers/dossiers
- Validation du formatage avant chaque commit ou PR

## Commandes utiles
- `npm run format` : formate tout le code du frontend

## Difficultés rencontrées
- Problèmes d’affichage d’erreurs d’indentation dans VS Code (solution : désactiver ESLint, utiliser Prettier comme formateur par défaut)

## Ressources
- [Prettier](https://prettier.io/)
- [Extension VS Code Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
