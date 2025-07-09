# Tests unitaires frontend avec Vitest et Vue 3

## Objectifs
Garantir la robustesse, la maintenabilité et la non-régression du code frontend.

## Stack utilisée
- **Vitest** : framework de test rapide, typé, compatible Jest
- **@vue/test-utils** : utilitaires pour tester les composants Vue 3
- **jsdom** : simulation du DOM pour tester sans navigateur
- **TypeScript** : typage strict des tests
- **Pinia** : gestionnaire d’état, testé avec @pinia/testing
- **jest-axe** : tests d’accessibilité automatisés (audit ARIA, navigation clavier)
- **Helpers et mocks** : centralisation pour la création de données de test, simulation d’API, stores, props, événements

## Bonnes pratiques
- Un fichier de test par composant principal (`src/components/__tests__/*.spec.ts`)
- Bloc de commentaire général en haut de chaque fichier de test
- Commentaire explicite avant chaque test (`it`)
- Utilisation de helpers pour la création de données de test (patients, rendez-vous, etc.)
- Utilisation de mocks pour simuler les props, événements, slots, stores, API
- Validation du rendu, des interactions, des événements émis
- Tests d’accessibilité (labels, navigation clavier, ARIA, focus, jest-axe)
- Tests de robustesse (données incomplètes, statuts inattendus, erreurs API)
- Tests de validation métier (champs obligatoires, dates, statuts, durée)
- Centralisation des helpers et mocks pour éviter la duplication
- Tests de hooks/composables personnalisés
- Tests de stores Pinia (état, mutations, actions)

## Stratégie et organisation des tests
- Les tests couvrent l’ensemble des composants principaux (CRUD rendez-vous, patients, modals, autocomplete, loaders, etc.), les stores Pinia, les helpers, les hooks/composables personnalisés et les services d’API.
- Les tests d’accessibilité sont systématiques sur les formulaires et modales (labels, navigation clavier, ARIA, feedback visuel et audit jest-axe).
- Les cas limites et erreurs API sont simulés via des mocks dédiés.
- Les helpers et mocks sont centralisés dans `src/utils/__tests__/` et `src/services/__tests__/` pour éviter la duplication et tendre à la cohérence des scénarios de test.
- Les tests de validation métier vérifient la gestion des champs obligatoires, des statuts, des dates, des durées, et le feedback utilisateur.
- Les tests de stores Pinia valident l’état, les mutations, les actions et la réactivité des composants connectés.

### Exemple de structure de fichier de test
```ts
/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage général & DOM
- Bouton Valider (création, édition)
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppointmentForm from '../AppointmentForm.vue';

describe('AppointmentForm.vue', () => {
  describe('Affichage', () => {
    it('doit se monter sans erreur', () => {
      const wrapper = mount(AppointmentForm, {
        global: { stubs: { BaseIcon: true } },
      });
      expect(wrapper.exists()).toBe(true);
    });
  });
  describe('Bouton Valider', () => {
    it('affiche le bouton Valider en mode création', () => {
      const wrapper = mount(AppointmentForm, {
        global: { stubs: { BaseIcon: true } },
      });
      const button = wrapper.find('button[type="submit"]');
      expect(button.exists()).toBe(true);
      expect(button.text()).toContain('Valider');
      expect(button.attributes('aria-label')).toBe('Valider le formulaire rendez-vous');
    });
    it('affiche le bouton Valider en mode édition', () => {
      const wrapper = mount(AppointmentForm, {
        props: { modelValue: { id: 1 } },
        global: { stubs: { BaseIcon: true } },
      });
      const button = wrapper.find('button[type="submit"]');
      expect(button.exists()).toBe(true);
      expect(button.text()).toContain('Valider');
      expect(button.attributes('aria-label')).toBe('Valider le formulaire rendez-vous');
    });
  });
  // Le focus trap et la navigation clavier sont testés dans les fichiers de test des modales (Modal.vue/BaseModal.vue)
});
```

> **Note** : Les tests de focus trap, de gestion du focus à l’ouverture et de navigation clavier sont couverts dans `BaseModal.spec.ts` et `Modal.spec.ts`.

## Génération de documentation automatisée
- **Couverture** :
  - `npm run coverage` (rapport texte)
- La documentation des tests repose sur la clarté des commentaires, la structure des fichiers et la couverture générée.

## Difficultés rencontrées
- Erreurs TypeScript sur les globals de test (solution : ajouter "vitest" dans `tsconfig.json`)
- Synchronisation des mocks avec l’API réelle
- Gestion des cas limites (statuts, données incomplètes)
- Accessibilité : focus, ARIA, navigation clavier, audit automatisé (jest-axe)
- Tests de hooks/composables personnalisés
- Tests de stores Pinia (mock, reset, validation d’état)

## Ressources
- [Vitest](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [jsdom](https://github.com/jsdom/jsdom)
- [Pinia Testing](https://pinia.vuejs.org/cookbook/testing.html)
- [jest-axe](https://github.com/nickcolley/jest-axe)

*Fiche enrichie le 09/07/2025 – à compléter selon l’évolution des pratiques et des outils.*
