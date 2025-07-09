# 09 – Explications techniques et wording sur les tests (frontend & backend)

## Objectif de cette fiche

Ce document synthétise la stratégie, les concepts, le wording et les bonnes pratiques de tests dans le projet Medisys, en s’appuyant sur les tests réellement présents (frontend et backend). Il sert de référence rapide pour comprendre le rôle de chaque type de test, la structuration des fichiers, l’utilisation des helpers, et la philosophie de rédaction des tests.

---

## 1. Généralités sur la stratégie de tests

- **Qualité logicielle** : chaque fonctionnalité critique est couverte par des tests automatisés.
- **Couverture (Vitest)** : statements : 96.56 %, branches : 91.42 %, fonctions : 89.24 %, lignes : 96.56 %.
- **Types de tests** : unitaires, d’intégration, de validation, d’accessibilité, de helpers, etc.
- **Automatisation** : vérification manuelle de la couverture avant chaque PR, exécution régulière des tests pendant le développement.

---

## 2. Tests frontend (Vitest)

### a. Organisation et structuration
- Les tests sont situés dans `frontend/src/**/__tests__/`, dans des sous-dossiers comme `components`, `views`, `services`, ou à côté des fichiers testés.
- Suffixes utilisés : `.spec.ts`, `.unit.spec.ts`, `.integration.spec.ts`, `.accessibility.spec.ts`, `.helpers.spec.ts`, `.validation.spec.ts`.
- Structuration par blocs métier (`describe` imbriqués), noms explicites, helpers centralisés.
- Utilisation de mocks robustes, imports dynamiques, typage strict.

### b. Glossaire des fonctions/utilitaires
- **mount** : rendu du composant avec options de test (Vue Test Utils).
- **mocks** : simulation d’API, de stores, de services.
- **helpers** : fonctions utilitaires pour DRY, centralisation des patterns de test (ex : remplissage de formulaire, génération de données).
- **flushPromises** : gestion de l’asynchrone dans les tests.
- **stubs globaux** : pour isoler le composant testé (`{ global: { stubs: { BaseIcon: true } } }`).
- **vi.fn / vi.mock** : création de mocks et spies (Vitest).
- **Assertions courantes** :
  - `expect(wrapper.text()).toContain('...')` : vérifie qu’un texte attendu est présent dans le rendu du composant.
  - `expect(wrapper.find('button').exists()).toBe(true)` : vérifie qu’un bouton (ou un élément ciblé) existe dans le DOM du composant.
  - `expect(wrapper.emitted('eventName')).toBeTruthy()` : vérifie qu’un événement personnalisé a bien été émis par le composant.
  - `expect(wrapper.find('input').element.value).toBe('...')` : vérifie la valeur d’un champ de formulaire.
  - `expect(wrapper.find('#error').text()).toContain('...')` : vérifie qu’un message d’erreur spécifique est affiché.
  - `expect(mockFn).toHaveBeenCalledWith(...)` : vérifie qu’une fonction mockée a été appelée avec certains arguments.
  - `expect(wrapper.exists()).toBe(true)` : vérifie que le composant (ou un sous-élément) existe dans le rendu.

### c. Exemple de structuration réel
```ts
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import AppointmentForm from '../AppointmentForm.vue';

vi.mock('../../services/appointmentApi', () => ({
  createAppointment: vi.fn().mockResolvedValue({ id: 42 }),
  updateAppointment: vi.fn().mockResolvedValue({ id: 42 }),
}));

describe('AppointmentForm - Validation', () => {
  describe('Champs obligatoires', () => {
    it('refuse la soumission sans patient', async () => {
      const wrapper = mount(AppointmentForm, { global: { stubs: { BaseIcon: true } } });
      // ...remplissage des champs requis...
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      expect(wrapper.emitted('created')).toBeTruthy();
    });
  });
});
```

### d. Wording et bonnes pratiques
- **Nommer les tests** de façon explicite : ce qui est testé, le contexte, le résultat attendu.
- **Commentaires JSDoc** en tête de fichier et sur les helpers critiques.
- **Pas de tests inutiles** (ex : slots non utilisés, branches inaccessibles).
- **Accessibilité** : tests sur le focus, la navigation clavier, les attributs ARIA, etc.
- **Feedback immédiat** : validation locale, gestion des erreurs, feedback visuel testé.
- **DRY** : helpers partagés, factorisation des patterns récurrents.

### e. Cas particuliers
- **Focus trap** : tests localisés dans les fichiers de modale.
- **Tests d’intégration** : pour les interactions complexes entre composants.
- **Tests de mapping/validation** : helpers dédiés, typage strict.

---

## 3. Tests backend (PHPUnit)

### a. Organisation
- Tests dans `backend/tests/` (Unit/ et Integration/).
- Fichiers nommés `*Test.php`.
- Utilisation de fixtures, mocks, assertions PHPUnit classiques.

### b. Bonnes pratiques
- **Nommer les méthodes** de test de façon explicite.
- **Structurer** par domaine métier.
- **Vérification de la couverture** via PHPUnit (vérification manuelle, pas de blocage automatique).
- **Automatisation** : exécution des tests backend en CI, vérification manuelle de la couverture.

### c. À étoffer (authentification, sécurité, etc.)
- Les tests backend seront enrichis au fil des évolutions (auth, sécurité, etc.).

---

## 4. Liens utiles et autres fiches
- [05-tests-frontend-vitest.md](05-tests-frontend-vitest.md) : détails sur la configuration et l’exécution des tests frontend.
- [07-tests-backend-phpunit.md](07-tests-backend-phpunit.md) : détails sur les tests backend.
- [GLOSSARY.md](../tech/GLOSSARY.md) : définitions des concepts de tests, helpers, accessibilité, etc.

---

