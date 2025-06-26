# Medisys - Projet d'Apprentissage : Symfony 7 + Vue.js
<!-- DEPLOY-LINK-START -->
➡️ [Projet en construction]
<!-- DEPLOY-LINK-END -->

## 📑 Table des matières

- [Medisys - Projet d'Apprentissage : Symfony 7 + Vue.js](#medisys---projet-dapprentissage--symfony-7--vuejs)
  - [📑 Table des matières](#-table-des-matières)
  - [🚀 Liens rapides](#-liens-rapides)
  - [🏗️ Présentation \& Objectifs](#️-présentation--objectifs)
  - [🏛️ Architecture \& Stack technique](#️-architecture--stack-technique)
  - [📦 Structure du projet](#-structure-du-projet)
  - [🚦 Avancement \& Roadmap](#-avancement--roadmap)
    - [✅ Phase 1 - Installation Symfony (Terminée)](#-phase-1---installation-symfony-terminée)
    - [✅ Phase 2 - Entité Patient (Terminée)](#-phase-2---entité-patient-terminée)
    - [✅ Phase 3 - Contrôleurs et Formulaires (Terminée)](#-phase-3---contrôleurs-et-formulaires-terminée)
    - [✅ Phase 4 - Migration SPA Vue.js (Terminée)](#-phase-4---migration-spa-vuejs-terminée)
    - [🚧 Prochaine phase (branche à venir)](#-prochaine-phase-branche-à-venir)
  - [🧪 Tests et Qualité](#-tests-et-qualité)
  - [🛠️ Scripts utiles (frontend)](#️-scripts-utiles-frontend)
  - [📏 Conventions \& bonnes pratiques](#-conventions--bonnes-pratiques)
  - [📝 Ressources et Documentation](#-ressources-et-documentation)
  - [📚 Annexes](#-annexes)

---

## 🚀 Liens rapides

- [Glossaire technique](docs/GLOSSARY.md)
- [Sécurité](docs/SECURITY.md)
- [Documentation API (OpenAPI)](docs/README-OPENAPI.md)
- [Guides techniques](docs/project/)
- [Fiches de révision (index)](docs/revision-sheets/INDEX.md)

---

## 🏗️ Présentation & Objectifs

Je démarre l'apprentissage de Symfony 7 et Vue.js en suivant notamment les formations Grafikart pour la partie théorique.

Le projet a d'abord consisté à construire un début d'application monolithique Symfony/Twig (gestion de patients et rendez-vous), puis à migrer progressivement vers une architecture moderne :
- **Backend** : Symfony 7 (API REST)
- **Frontend** : SPA Vue 3 (Vite, TypeScript, Tailwind CSS, tests Vitest)

**Objectif pédagogique** : Apprendre Symfony 7 et Vue.js en créant un projet inspiré du domaine médical (gestion de patients et rendez-vous), en partant d'un monolithe pour aller vers une SPA découplée.

## 🏛️ Architecture & Stack technique

- **Backend** : Symfony 7 (API REST, Doctrine), sécurité (CSRF, validation, XSS, gestion des erreurs), validation stricte, tests (PHPUnit)
- **Frontend** : Vue 3 (SPA), Vite, TypeScript, Tailwind CSS v3, sécurité (validation, XSS, gestion erreurs), tests (Vitest, jsdom), Prettier
- **Docker, MySQL**

**Découpage** :
- Le backend (API Symfony) et le frontend (SPA Vue.js) sont deux applications indépendantes qui communiquent via HTTP/JSON. Un mapping explicite est réalisé entre les modèles de données exposés par l’API (en anglais) et ceux utilisés côté frontend (en français).
- Sécurité et validation appliquées côté backend ET frontend.
- Typage strict généralisé (TypeScript côté front, PHPDoc côté back).

## 📦 Structure du projet

- `backend/` : Application Symfony (API, configuration, tests, assets, etc.)
- `frontend/` : Application SPA Vue.js (Vite, Tailwind CSS v3, composants, vues)
- `docs/` : Documentation, guides, notes, fiches de révision
- `docker/` : Configuration Docker (base de données, etc.)
- `compose.yaml` : Orchestration Docker Compose
- `README.md` : Ce fichier

> Chaque sous-dossier (`backend/`, `frontend/`) possède son propre README pour les instructions spécifiques.

## 🚦 Avancement & Roadmap

### ✅ Phase 1 - Installation Symfony (Terminée)
- Symfony 7.3 installé et configuré
- Base de données MySQL avec Docker
- Serveur de développement opérationnel

### ✅ Phase 2 - Entité Patient (Terminée)
- Entité Patient complète avec propriétés médicales
- Repository PatientRepository configuré
- Migration de base de données appliquée
- Tests unitaires et d'intégration fonctionnels
- Documentation PHPDoc complète

### ✅ Phase 3 - Contrôleurs et Formulaires (Terminée)
- Contrôleur PatientController (CRUD complet)
- Formulaires de création/édition
- Templates Twig
- CRUD complet pour Patient (show, new, edit, delete)
- Tests fonctionnels (show, new, edit, delete)

### ✅ Phase 4 - Migration SPA Vue.js (Terminée)
- Migration vers une architecture découplée : SPA Vue.js côté frontend, API Symfony côté backend
- Refactoring du code pour séparer clairement les responsabilités front/back
- Mise en place d’un mapping explicite entre les modèles API (anglais) et front (français)
- Typage strict généralisé (TypeScript côté front, PHPDoc côté back)
- Sécurité renforcée (validation, XSS, CSRF, gestion des erreurs)
- Ajout et fiabilisation des tests unitaires et d’intégration (frontend et backend)
- Accessibilité : tests et améliorations pour la navigation clavier et les lecteurs d’écran
- Documentation enrichie (guides, glossaire, fiches de révision, conventions)

### 🚧 Prochaine phase (branche à venir)
- Phase 5 : Création de l’entité Rendez-vous (`feature/appointment-entity`)
- Préparation des contrôleurs et de l’interface de gestion des rendez-vous

## 🧪 Tests et Qualité

- **Tests unitaires frontend** : 12 fichiers, 57 tests (CRUD, validation, erreurs, accessibilité)
- **Tests unitaires backend** : 1 fichier, 8 tests, 11 assertions ✅
- **Tests fonctionnels (contrôleur)** : 4 fichiers, 4 tests (show, new, edit, delete) ✅
- **Tests d'intégration (repository)** : 1 fichier, 3 tests (save/retrieve, email uniqueness, audit trail) ✅
- **Tests d'intégration frontend** : 1 fichier, 8 tests (CRUD, erreurs API, accessibilité)
- **Total tests backend** : 39, **assertions** : 123
- **Total tests frontend** : 57
- **Couverture PHPDoc** : 100% ✅
- **Architecture** : Repository Pattern + Entity/Migration + SPA
- **Sécurité** : Suppression protégée par CSRF, validation stricte, XSS, tests robustes

## 🛠️ Scripts utiles (frontend)

- `npm run dev` : Lancer le serveur de développement Vite
- `npm run test` : Lancer tous les tests unitaires (Vitest + jsdom)
- `npm run format` : Formater tout le code avec Prettier

## 📏 Conventions & bonnes pratiques

- **Mapping API/front** : voir [docs/GLOSSARY.md](docs/GLOSSARY.md) (tableau de correspondance ApiPatient ↔ Patient)
- **Typage strict** : TypeScript côté front, PHPDoc côté back
- **Sécurité** : validation systématique, XSS, CSRF, gestion des données sensibles, voir [docs/SECURITY.md](docs/SECURITY.md)
- **Tests** : unitaires, intégration, accessibilité côté frontend ([docs/revision-sheets/05-tests-frontend-vitest.md](docs/revision-sheets/05-tests-frontend-vitest.md)) ET backend ([docs/revision-sheets/07-tests-backend-phpunit.md](docs/revision-sheets/07-tests-backend-phpunit.md))

## 📝 Ressources et Documentation

- [Formation PHP - Grafikart](https://grafikart.fr/formations/php)
- [Formation Symfony 7 - Grafikart](https://grafikart.fr/formations/apprendre-symfony-7)
- [Formation Vue.js - Grafikart](https://grafikart.fr/formations/vuejs)
- [Documentation officielle Symfony](https://symfony.com/doc/current/index.html)
- [Documentation officielle Vue.js](https://vuejs.org/)
- [Documentation officielle Vite](https://vitejs.dev/)

## 📚 Annexes

- [docs/README.md](docs/README.md) — Synthèse et arborescence documentaire
- [docs/tech/INDEX-tech.md](docs/tech/INDEX-tech.md) — Documentation technique (mapping, sécurité, API, conventions, glossaire)
- [docs/guides/INDEX-guides.md](docs/guides/INDEX-guides.md) — Guides projet, historique, roadmap, notes d’apprentissage
- [docs/revision-sheets/INDEX-revision-sheets.md](docs/revision-sheets/INDEX-revision-sheets.md) — Fiches de révision
- [docs/business/INDEX-business.md](docs/business/INDEX-business.md) — Concepts métier santé
- [docs/design/INDEX-design.md](docs/design/INDEX-design.md) — Charte graphique

---

*Début de l'aventure, documentation et code en amélioration continue !*
