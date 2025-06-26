# Tests unitaires frontend avec Vitest et Vue 3

## Objectifs
- Garantir la robustesse, la maintenabilité et la non-régression du code frontend.

## Stack utilisée
- **Vitest** : framework de test rapide, typé, compatible Jest
- **@vue/test-utils** : utilitaires pour tester les composants Vue 3
- **jsdom** : simulation du DOM pour tester sans navigateur
- **TypeScript** : typage strict des tests

## Bonnes pratiques
- Un fichier de test par composant principal (`src/components/__tests__/*.spec.ts`)
- Bloc de commentaire général en haut de chaque fichier de test
- Commentaire explicite avant chaque test (`it`)
- Utilisation de mocks pour simuler les props, événements, slots, etc.
- Validation du rendu, des interactions et des événements émis

## Exemples
```ts
// Bloc de commentaire général
// ...
describe('MonComposant', () => {
  // Vérifie l’affichage du titre
  it('affiche le titre', () => {
    // ...
  });
});
```

## Difficultés rencontrées
- Erreurs TypeScript sur les globals de test (solution : ajouter "vitest" dans `tsconfig.json`)

## Ressources
- [Vitest](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [jsdom](https://github.com/jsdom/jsdom)
