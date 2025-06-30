# Phase 6 – Contrôleurs et API Appointment (Rendez-vous)

> **Note historique :** Ce document décrit la structure, les étapes et les bonnes pratiques pour la phase de mise en place des contrôleurs API Appointment. Voir le README principal pour la structure actuelle.

## 🎯 Objectif de cette phase

Mettre en place l’API REST complète pour la ressource Appointment : contrôleur, mapping, validation, gestion des erreurs, documentation, tests, cohérence avec Patient.

## 📋 Prérequis

- [x] Phase Patient terminée (entité, API, tests)
- [x] Phase Appointment (entité, repository, fixtures, tests)
- [x] Base de données synchronisée et fixtures chargées

## 🚀 Étapes de développement

### 1. Création du contrôleur API
- [x] Génération du contrôleur `AppointmentApiController`
- [x] Définition des routes REST (GET, POST, PUT, PATCH, DELETE)
- [x] Injection des dépendances nécessaires dans le contrôleur (`AppointmentRepository`, `AppointmentMapper`, `ValidatorInterface`, `SerializerInterface`)

### 2. Mapping et validation
- [x] Création du service `AppointmentMapper` (centralisation du mapping DTO ↔ entité)
- [x] Validation stricte des données (DTO, entité, contraintes métier)
- [x] Gestion explicite des erreurs de validation et de mapping (retour 400 structuré)

### 3. Gestion des erreurs métier
- [x] Gestion des cas patient inexistant, conflit, validation, etc.
- [x] Retour d’erreurs structurées (400, 404, etc.)

### 4. Documentation technique
- [x] Mise à jour du schéma OpenAPI (endpoints, schémas, exemples)
- [x] Ajout d’exemples de payloads et de réponses
- [x] Synchronisation du mapping API ↔ Front (`docs/tech/MAPPING-API-FRONT.md`)

### 5. Tests backend
- [x] Ajout de tests d’intégration pour chaque endpoint (CRUD, erreurs, validation)

### 6. Sécurité & TODO
- [x] Préparation de la vérification des droits d’accès (TODO, annotations)

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
- Centralisation du mapping dans un service dédié

## 🧪 Qualité et tests

- **Tests unitaires** : logique métier, validation
- **Tests d’intégration** : persistance, recherche, validation API
- **Fixtures** : génération réaliste de rendez-vous

## 🔧 Configuration technique

- Base de données : voir phase Patient
- Fichiers principaux :
  - `backend/src/Controller/Api/AppointmentApiController.php`
  - `backend/src/Mapper/AppointmentMapper.php`
  - `backend/src/Dto/AppointmentDTO.php`
  - `backend/src/Entity/Appointment.php`
  - `backend/src/Repository/AppointmentRepository.php`
  - `backend/migrations/Version*.php`
  - `backend/tests/Unit/Entity/AppointmentTest.php`
  - `backend/tests/Integration/Repository/AppointmentRepositoryTest.php`
  - `backend/src/DataFixtures/AppointmentFixtures.php`

## 🧪 Exemples de payloads et réponses

### Création d’un rendez-vous (POST /api/appointments)
```json
{
  "patientId": 1,
  "dateTime": "2025-07-01T09:00:00+00:00",
  "duration": 30,
  "reason": "Consultation annuelle",
  "status": "scheduled"
}
```

### Réponse succès (201)
```json
{
  "id": 42,
  "patient": { /* ... */ },
  "dateTime": "2025-07-01T09:00:00+00:00",
  "duration": 30,
  "reason": "Consultation annuelle",
  "status": "scheduled"
}
```

### Réponse erreur validation (400)
```json
{
  "error": "Données invalides",
  "violations": {
    "dateTime": ["La date du rendez-vous doit être dans le futur."],
    "patientId": ["Aucun patient avec l'ID fourni"]
  }
}
```

## 🎯 Résultat attendu

- ✅ Contrôleur API Appointment complet et documenté
- ✅ Endpoints REST CRUD fonctionnels et robustes
- ✅ Mapping DTO ↔ entité centralisé
- ✅ Validation stricte et gestion d’erreurs structurée
- ✅ Documentation OpenAPI et mapping API/Front à jour
- ✅ Tests d’intégration automatisés pour chaque endpoint (CRUD, erreurs, validation)

## 🔮 Prochaine phase

---

> Cette phase a permis de valider la robustesse de l’API Appointment, la centralisation du mapping, la gestion stricte des validations et des erreurs, ainsi que la couverture par des tests d’intégration automatisés.
