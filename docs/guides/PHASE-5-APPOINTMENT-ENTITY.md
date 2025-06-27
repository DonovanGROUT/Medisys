# Phase 5 - Entité Appointment (Rendez-vous) et Tests

> **Note historique :** Ce document décrit la structure et les chemins du projet pour la phase Appointment. Voir le README principal pour la structure actuelle.

## 🎯 Objectif de cette phase

Créer l’entité métier `Appointment` (rendez-vous) avec Doctrine ORM, implémenter les tests unitaires et d’intégration, et documenter la gestion des rendez-vous médicaux.

## 📋 Prérequis

- [x] Phase Patient terminée
- [x] Base de données synchronisée
- [x] Fixtures Patient existantes

## 🚀 Étapes de développement

### 1. Création de l'entité Appointment

- [x] Génération avec `make:entity Appointment`
- [x] Ajout des propriétés métier essentielles
- [x] Contraintes de validation (date future, durée, statut, patient...)
- [x] Annotations OpenAPI pour la documentation

**Propriétés implémentées** :

```php
- id (int, auto-increment, primary key)
- patient (ManyToOne, obligatoire)
- dateTime (datetime, obligatoire, future)
- duration (int, >0, obligatoire)
- reason (string, obligatoire)
- status (string, enum: planned/done/canceled, obligatoire)
```

### 2. Repository et accès aux données

- [x] Repository `AppointmentRepository` généré
- [x] Méthodes de recherche par patient, à venir, etc.

### 3. Migration de base de données

- [x] Génération migration
- [x] Application en dev et test

### 4. Fixtures

- [x] Génération de rendez-vous de test liés aux patients
- [x] Chargement en base de test

**Exemple de rendez-vous généré** :

```json
{
  "id": 1,
  "patient": 42,
  "dateTime": "2025-07-01T09:30:00+02:00",
  "duration": 30,
  "reason": "Consultation annuelle",
  "status": "planned"
}
```

### 5. Tests backend

- [x] Tests unitaires (validation, contraintes, exceptions)
- [x] Tests d’intégration repository (persistance, recherche)

### 6. Documentation technique

- [x] Mapping API ↔ Frontend mis à jour
- [x] Présent document de phase créé

## 🏥 Spécificités métier et validation

- La date/heure doit être dans le futur
- La durée doit être strictement positive
- Le patient est obligatoire
- Le motif et le statut sont obligatoires
- Le statut doit être une valeur autorisée (enum)

## 🔧 Patterns techniques

- Fluent Interface sur les setters
- Repository Pattern
- Annotations Doctrine et OpenAPI

## 🧪 Qualité et tests

- **Tests unitaires** : logique métier, validation
- **Tests d’intégration** : persistance, recherche
- **Fixtures** : génération réaliste de rendez-vous

## 🔧 Configuration technique

- Base de données : voir phase Patient
- Fichiers principaux :
  - `backend/src/Entity/Appointment.php`
  - `backend/src/Repository/AppointmentRepository.php`
  - `backend/migrations/Version*.php`
  - `backend/tests/Unit/Entity/AppointmentTest.php`
  - `backend/tests/Integration/Repository/AppointmentRepositoryTest.php`
  - `backend/src/DataFixtures/AppointmentFixtures.php`

## 🎯 Résultat attendu

- ✅ Entité Appointment complète et documentée
- ✅ Table `appointment` en base
- ✅ Tests automatisés (unitaires + intégration)
- ✅ Mapping API/Front à jour
- ✅ Documentation technique présente

## 🔮 Prochaine phase

Passage à la **Phase 6 : Contrôleurs et API Appointment**.

---

> Cette phase a permis de valider la gestion des rendez-vous (entité, validation, tests, documentation), conformément aux bonnes pratiques du projet.
