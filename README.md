# Medisys - Projet d'Apprentissage : Symfony 7 + Vue.js
<!-- DEPLOY-LINK-START -->
➡️ [Projet en construction]
<!-- DEPLOY-LINK-END -->

## 🏗️ Migration monolithe → SPA & Objectifs pédagogiques

Le projet migre d’une application monolithique Symfony/Twig vers une architecture moderne :
- **Backend** : Symfony 7 (API REST)
- **Frontend** : SPA Vue 3 (Vite, TypeScript, Tailwind CSS, tests Vitest)

**Objectifs pédagogiques** :
- Apprendre à migrer un projet existant vers une architecture SPA, en gardant la maîtrise de Symfony côté backend et en découvrant les outils modernes côté frontend.
- Travailler avec des mocks de données côté frontend pour permettre un développement itératif et indépendant du backend, avant de brancher l’API réelle.
- Approfondir la compréhension des enjeux de sécurité, de performance, et de maintenabilité dans une architecture découpée.

## 📦 Structure du projet

- `backend/` : Application Symfony (API, configuration, tests, assets, etc.)
- `frontend/` : Application SPA Vue.js (Vite, Tailwind CSS v3, composants, vues)
- `docs/` : Documentation, wireframes, notes, fiches de révision
- `docker/` : Configuration Docker (base de données, etc.)
- `compose.yaml` : Orchestration Docker Compose
- `README.md` : Ce fichier

> Chaque sous-dossier (`backend/`, `frontend/`) possède son propre README pour les instructions spécifiques.

## 📋 Description

Je démarre l'apprentissage de Symfony 7 et Vue.js en suivant notamment les formations Grafikart pour la partie théorique. Mon objectif est de créer **Medisys**, une application de gestion médicale simple pour l'apprentissage.

## 🎯 Objectif

Apprendre Symfony 7 et Vue.js en créant un projet concret inspiré du domaine médical (gestion de patients et rendez-vous).

## 🖥️ Stack technique

- Backend : Symfony 7 (API)
- Frontend : Vue 3, Vite, TypeScript, Tailwind CSS v3, Prettier, Vitest, jsdom
- Docker, MySQL

## 🚀 Scripts utiles (frontend)

- `npm run dev` : Lancer le serveur de développement Vite
- `npm run test` : Lancer tous les tests unitaires (Vitest + jsdom)
- `npm run format` : Formater tout le code avec Prettier

## 📝 Ressources et Documentation

- **Prérequis** : [Formation PHP - Grafikart](https://grafikart.fr/formations/php)
- **Formation Symfony 7** : [Grafikart](https://grafikart.fr/formations/apprendre-symfony-7)
- **Formation Vue.js** : [Grafikart](https://grafikart.fr/formations/vuejs)

**Documentation du projet** :

- [Notes d'apprentissage](docs/LEARNING-NOTES.md)
- [Glossaire technique](docs/GLOSSARY.md)
- [Fiches de révision](docs/revision-sheets/INDEX.md)
- [Concepts métier santé](docs/MEDICAL-BUSINESS-CONCEPTS.md)
- [Étapes du projet](docs/project/PROJECT-PREPARATION.md)
- [Phase 1 : Installation Symfony](docs/project/PHASE-1-SYMFONY-INSTALLATION.md)
- [Phase 2 : Entité Patient](docs/project/PHASE-2-PATIENT-ENTITY.md)
- [Phase 3 : Contrôleurs et formulaires Patient](docs/project/PHASE-3-PATIENT-CONTROLLERS-FORMS.md)

**Note** : La documentation inclut des notions déjà acquises lors de formations antérieures, mais qui restent utiles pour le développement d'applications web avec PHP, Symfony et Vue.js.

## 🚀 Avancement du projet

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

### 🚧 Phase 4 - Interface Patient et homepage en Vue.js : Migration SPA Vue.js (en cours)

- Début de la migration du monolithe Symfony/Twig vers une architecture SPA (Vue.js) + API (Symfony)
- Séparation claire du backend (Symfony) et du frontend (Vue.js)
- Nouvelle structure de projet en place
- Documentation et roadmap détaillées pour la migration progressive
- **Frontend** : Initialisation Vite/Vue/TypeScript/Tailwind, création et typage strict des composants, ajout de Prettier, création et documentation des tests unitaires (Vitest + jsdom), formatage automatique Prettier
- **Tests** : 24 tests unitaires frontend (100% OK)

## 🧪 Tests et Qualité

- **Tests unitaires frontend** : 9 fichiers, 24 tests
- **Tests unitaires backend** : 1 fichier, 8 tests, 11 assertions ✅
- **Tests fonctionnels (contrôleur)** : 4 fichiers, 4 tests (show, new, edit, delete) ✅
- **Tests d'intégration (repository)** : 1 fichier, 3 tests (save/retrieve, email uniqueness, audit trail) ✅
- **Total assertions** : 58 (backend) + 24 (frontend)
- **Couverture PHPDoc** : 100% ✅
- **Architecture** : Repository Pattern + Entity/Migration + SPA
- **Sécurité** : Suppression protégée par CSRF, aucun accès direct en GET, tests robustes sur la suppression

---

*Début de l'aventure !*
