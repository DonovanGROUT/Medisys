# Phase 2 - Entité Patient et Tests

## 🎯 Objectif de cette phase

Créer la première entité métier `Patient` avec Doctrine ORM, implémenter les tests unitaires et d'intégration, et établir les fondations pour la gestion des données médicales.

## 📋 Prérequis

- [x] Phase 1 terminée (Symfony 7.3 installé)
- [x] Base de données MySQL configurée
- [x] Docker opérationnel
- [x] Connexion Doctrine validée

## 🚀 Étapes de développement

### 1. Création de l'entité Patient

- [x] Génération avec `make:entity Patient`
- [x] Ajout des propriétés médicales essentielles
- [x] Configuration des types Doctrine appropriés
- [x] Implémentation de l'audit trail automatique

**Propriétés implémentées** :

```php
- id (int, auto-increment, primary key)
- firstName (string, 100 chars, required)
- lastName (string, 100 chars, required) 
- email (string, 180 chars, unique, required)
- phone (string, 20 chars, optional)
- birthDate (date, required)
- gender (string, 10 chars, required)
- medicalHistory (text, optional)
- createdAt (datetime, auto)
- updatedAt (datetime, auto)
```

### 2. Repository et accès aux données

- [x] Repository `PatientRepository` généré automatiquement
- [x] Documentation sécurité et audit médical
- [x] Méthodes de base pour CRUD sécurisé

**Fonctionnalités sécurité** :

- Contrôle d'accès aux données personnelles
- Audit des requêtes sur dossiers médicaux
- Méthodes de recherche sécurisées

### 3. Migration de base de données

- [x] Génération migration `make:migration`
- [x] Application en développement
- [x] Configuration base de test dédiée
- [x] Application migration sur environnement test

**Migration générée** : `Version20250620175351.php`

### 4. Tests unitaires

- [x] Configuration PHPUnit
- [x] Tests des getters/setters
- [x] Tests du chaînage fluide (pattern fluent)
- [x] Tests des méthodes métier (`getFullName`, `getAge`)
- [x] Tests de l'audit trail automatique

**Résultats tests unitaires** : 8 tests, 11 assertions ✅

### 5. Tests d'intégration

- [x] Configuration base de données de test
- [x] Tests de persistance Doctrine
- [x] Tests contraintes d'unicité email
- [x] Tests audit trail en base
- [x] Isolation entre tests

**Résultats tests d'intégration** : 3 tests, 8 assertions ✅

## 🏥 Spécificités médicales implémentées

### Sécurité et confidentialité

**Propriétés privées** : Toutes les données sensibles sont privées avec accès contrôlé via getters/setters pour respecter les exigences RGPD.

**Audit trail** : Traçabilité automatique avec `createdAt` et `updatedAt` pour conformité réglementaire médicale.

**Validation métier** :

- Email unique (contrainte base de données)
- Calcul automatique de l'âge
- Historique médical optionnel mais sécurisé

### Patterns techniques

**Fluent Interface** : Chaînage des setters pour une syntaxe élégante :

```php
$patient->setFirstName("Donovan")
        ->setLastName("GROUT") 
        ->setEmail("donovan@${PROJECT_NAME}.fr");
```

**Repository Pattern** : Séparation claire entre entité métier et accès données.

**Entity Mapping** : Annotations Doctrine pour liaison objet-relationnel.

## 🧪 Qualité et tests

### Couverture de tests

- **Tests unitaires** : Logique métier sans dépendances
- **Tests d'intégration** : Validation avec vraie base de données
- **PHPDoc** : Documentation complète (100% coverage)
- **Isolation** : Nettoyage automatique entre tests

### Configuration environnements

- **Développement** : Base `${DB_NAME}`
- **Test** : Base `${DB_NAME}_test_test` dédiée
- **Permissions** : Utilisateurs MySQL appropriés par contexte

## 🔧 Configuration technique

### Base de données

```bash
# Bases créées
- ${DB_NAME}              # Développement
- ${DB_NAME}_test_test    # Tests automatisés

# Permissions sécurisées
- ${DB_USER}@% pour développement
- ${DB_USER}@172.19.0.1 pour tests (IP Docker)
```

### Structure fichiers

```bash
src/Entity/Patient.php              # Entité métier
src/Repository/PatientRepository.php # Accès données
migrations/Version*.php             # Migration DB
tests/Unit/Entity/PatientTest.php   # Tests unitaires  
tests/Integration/Repository/       # Tests intégration
```

## 🎯 Résultat attendu

À la fin de cette phase :

- ✅ Entité Patient complète et documentée
- ✅ Base de données avec table `patient`
- ✅ Tests automatisés (unitaires + intégration)
- ✅ Repository pattern implémenté
- ✅ Audit trail médical fonctionnel
- ✅ Documentation PHPDoc complète

## 🔮 Prochaine phase

Une fois cette phase terminée, passage à la **Phase 3 : Contrôleurs et Formulaires** pour créer l'interface d'administration des patients.

---

> Phase suivant les bonnes pratiques Symfony et les exigences du domaine médical
