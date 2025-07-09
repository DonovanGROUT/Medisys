# Phase 7 – Interface Rendez-vous (Appointment) VueJS

> **Note historique :** Ce document décrit la structure, les étapes et les bonnes pratiques pour la phase de mise en place de l’interface rendez-vous côté frontend. Voir le README principal pour la structure actuelle.

## 🎯 Objectif de cette phase

Mettre en place l’interface utilisateur pour la gestion des rendez-vous (Appointment) côté frontend, en s’appuyant sur l’API existante (DTO exposés par le backend), avec typage strict, sécurité, accessibilité, tests et documentation, selon les bonnes pratiques du projet.

## 📋 Prérequis

- [x] Phases 1 à 6 terminées (backend, entités, API, tests)
- [x] Mapping API ↔ Frontend à jour

## 📝 Résultat attendu

- Une interface rendez-vous complète, accessible, testée, avec gestion des cas limites, intégrée au reste de l’application (UX/UI homogène).
- Refactoring des composants modaux pour accessibilité (BaseModal/Modal).
- Composants réutilisables pour actions, loaders, autocomplete, etc.

## 🚀 Étapes de développement

### 1. Initialisation et structure
- [x] Création des composants Vue pour la gestion des rendez-vous :
  - `AppointmentList.vue` (liste)
  - `AppointmentForm.vue` (création/édition)
  - `AppointmentItem.vue` (affichage d’un rendez-vous)
  - `AppointmentTableRow.vue` (ligne de tableau)
  - `AppointmentView.vue` (vue détaillée d’un rendez-vous)
  - `AppointmentActions.vue` (boutons d’action)
  - `AppointmentListLoader.vue` (loader rendez-vous)
- [x] Création/refactoring de composants réutilisables :
  - `BaseModal.vue`, `Modal.vue` (modale accessible, focus trap)
  - `ConfirmDelete.vue` (confirmation suppression)
  - `BaseIcon.vue` (icônes accessibles)
  - `PatientAutocomplete.vue` (champ de recherche patient)
  - `PatientListLoader.vue` (loader patient)
- [x] Utilisation des stores Pinia pour la gestion d’état global (alertes, utilisateur)
- [x] Ajout des helpers de mapping et de validation (dans cette phase)

### 2. Intégration API et logique métier
- [x] Utilisation du service `appointmentApi.ts` pour toutes les opérations CRUD
- [x] Mapping API ↔ Front via helpers dédiés dans `appointmentApi.ts` et `patientService.ts`
- [x] Gestion des erreurs et des retours API (centralisation dans `apiErrorHandler.ts`)
- [x] Affichage des messages de succès/erreur via le store d’alertes

### 3. UX/UI, accessibilité et robustesse
- [x] États de chargement, succès, erreur
- [x] Mise à jour en temps réel de la liste après modification
- [x] Gestion des cas limites (conflits, champs manquants, statuts invalides)
- [x] Accessibilité : labels, navigation clavier, focus, ARIA, focus trap
- [x] Robustesse face aux données incomplètes ou inattendues

### 4. Tests et validation
- [x] Couverture de tests sur les composants, le store, les helpers et le service API
- [x] Utilisation de Vitest, Vue Test Utils, jsdom, jest-axe pour l’accessibilité
- [x] Tests de validation métier, d’accessibilité, de robustesse
- [x] Centralisation des helpers et mocks pour éviter la duplication

### 5. Documentation et bonnes pratiques
- [x] Documentation des conventions, scripts, workflow
- [x] Guides et index mis à jour
- [x] Mapping API ↔ Frontend synchronisé

## 🏅 Spécificités et bonnes pratiques

- **Découplage** : Le frontend Vue.js consomme l’API via HTTP/JSON (données issues des DTO exposés par le backend).
- **Typage strict** : TypeScript côté front, JSDoc sur les helpers et services.
- **Validation frontend** : Vérification des champs, statuts, dates, gestion des erreurs et cas limites côté front.
- **Tests** : Vitest, Vue Test Utils, jsdom, jest-axe pour l’accessibilité.
- **Accessibilité** : Navigation clavier, lecteurs d’écran, audit ARIA, focus trap, contrastes, labels explicites.
- **Documentation** : Mapping API ↔ Frontend, conventions, scripts, guides mis à jour.
- **Pinia** : Utilisé pour la gestion centralisée des alertes et du rôle utilisateur.
- **Composants réutilisables** : BaseModal, Modal, ConfirmDelete, BaseIcon, PatientAutocomplete, loaders, actions.
- **UX/UI** : Cohérence visuelle, feedback utilisateur, gestion des loaders, messages d’alerte, responsive.

## 🧪 Qualité et tests

- **Tests unitaires frontend** : fichiers Vitest pour chaque composant principal (CRUD, validation, accessibilité, robustesse)
- **Tests d’intégration API** : appels HTTP/JSON simulés, mocks avancés
- **Tests d’accessibilité** : jest-axe, audit ARIA, navigation clavier
- **Couverture documentaire** : guides, mapping, conventions, index à jour
- **Nettoyage** : scripts npm pour formatage et tests

## 🏗️ Structure technique

- `src/components/AppointmentList.vue`
- `src/components/AppointmentForm.vue`
- `src/components/AppointmentItem.vue`
- `src/components/AppointmentTableRow.vue`
- `src/components/AppointmentView.vue`
- `src/components/AppointmentActions.vue`
- `src/components/AppointmentListLoader.vue`
- `src/components/BaseModal.vue`, `src/components/Modal.vue`
- `src/components/ConfirmDelete.vue`
- `src/components/BaseIcon.vue`
- `src/components/PatientAutocomplete.vue`
- `src/components/PatientListLoader.vue`
- `src/services/appointmentApi.ts`
- `src/services/patientService.ts`
- `src/stores/alert.ts`, `src/stores/user.ts`
- `src/types/Appointment.ts`, `src/types/Patient.ts`
- `src/utils/appointmentHelpers.ts` (formatage, statuts, badges, dates)
- `src/utils/apiErrorHandler.ts` (gestion centralisée des erreurs API)
- `src/utils/formatNomPrenom.ts` (formatage nom/prénom)
- `src/components/__tests__/` (tests Vitest)
- `src/services/__tests__/`, `src/utils/__tests__/` (tests unitaires helpers/services)

---

## 🔗 Prochaine phase

- Intégration de l’authentification (phase 8)
- Gestion des droits et sécurité
- Optimisation des performances

---

> Cette phase a permis de doter l’application d’une interface rendez-vous complète, accessible, robuste et testée, avec des composants réutilisables et une UX homogène. Elle pose les bases pour l’intégration de l’authentification.
