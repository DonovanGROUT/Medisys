# Phase 4 - Interface Homepage et Patients VueJS

> **Note historique :** Ce document décrit la structure et les chemins du projet lors de la phase 4 (migration SPA). Depuis cette phase, le frontend est une SPA Vue.js découplée du backend Symfony. Voir le README principal pour la structure actuelle.
> **Branche Git correspondante :** `feature/patient-vuejs-front`

## 🎯 Objectif de cette phase

Mettre en place l’interface Patient et la homepage en SPA Vue.js, découplée du backend Symfony, avec typage strict, sécurité, tests et documentation, selon les bonnes pratiques du projet.

## 📋 Prérequis

- [x] Phases 1 à 3 terminées (backend Symfony fonctionnel, entité Patient, contrôleurs, tests)
- [x] Environnement Node.js, npm et Vite installés
- [x] Connaissances de base Vue.js 3, TypeScript, Tailwind CSS

## 🚀 Étapes de développement

### 1. Initialisation du frontend
- [x] Création du dossier `frontend/` avec Vite, Vue 3, TypeScript, Tailwind CSS
- [x] Configuration Prettier, ESLint, scripts npm (`dev`, `test`, `format`)

### 2. Migration progressive des vues
- [x] Création des composants Vue pour la homepage et la gestion des patients
- [x] Utilisation de mocks de données pour le développement indépendant du backend
- [x] Intégration de l’API Symfony via HTTP/JSON (fetch)

### 3. Tests et validation
- [x] Ajout de tests unitaires (Vitest + jsdom) pour chaque composant principal
- [x] Validation du typage strict (TypeScript)
- [x] Formatage automatique avec Prettier

### 4. Sécurité et accessibilité
- [x] Validation des entrées côté frontend (XSS, typage, contraintes)
- [x] Tests d’accessibilité (navigation clavier, lecteurs d’écran)

### 5. Documentation
- [x] Mapping API ↔ Frontend mis à jour
- [x] Documentation des conventions, scripts, workflow
- [x] Guides et index mis à jour
- [x] Stratégie Gitflow respectée (commits feat/test/docs atomiques)

## 🏥 Spécificités et bonnes pratiques

- **Découplage** : Backend Symfony expose une API REST, frontend Vue.js consomme l’API via HTTP/JSON.
- **Typage strict** : TypeScript côté front, PHPDoc côté back.
- **Sécurité** : Validation côté front (XSS, typage), sécurité backend conservée.
- **Tests** : Vitest côté front, PHPUnit côté back.
- **Accessibilité** : Navigation clavier, lecteurs d’écran testés.
- **Documentation** : Mapping API ↔ Frontend, conventions, scripts, guides mis à jour.
- **Gitflow** : Branche dédiée, commits atomiques, PR, validation systématique.

## 🧪 Qualité et tests

- **Tests unitaires frontend** : fichiers Vitest pour chaque composant principal (CRUD, validation, accessibilité)
- **Tests d’intégration API** : appels HTTP/JSON simulés
- **Couverture documentaire** : guides, mapping, conventions, index à jour
- **Nettoyage** : scripts npm pour formatage et tests

## 🔧 Structure technique

### Structure fichiers (après migration SPA)

```bash
backend/                       # API Symfony (dossier existant)
frontend/                      # SPA Vue.js (créé à cette phase)
frontend/src/components/       # Composants Vue (Patient, Homepage, etc.)
frontend/src/views/            # Vues Vue.js
frontend/tests/                # Tests unitaires frontend (Vitest)
```

## 🛠️ Commandes utiles

```bash
# Initialisation du frontend
npm create vite@latest frontend -- --template vue-ts
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer prettier eslint vitest jsdom
npx tailwindcss init -p

# Lancer le serveur de dev
npm run dev

# Lancer les tests unitaires
npm run test

# Formater le code
npm run format
```

## 🎯 Résultat attendu

À la fin de cette phase :

- ✅ Interface Patient et homepage en SPA Vue.js, découplée, typée, testée
- ✅ Mapping API ↔ Frontend documenté
- ✅ Tests unitaires frontend et backend à jour
- ✅ Documentation et conventions harmonisées
- ✅ Prêt pour la phase suivante (entité Rendez-vous)

## 🔮 Prochaine phase

Passage à la **Phase 5 : Entité Rendez-vous (feature/appointment-entity)**.

---

> Cette phase a permis de valider la migration SPA, le découplage front/back, la robustesse, la sécurité et la documentation, conformément aux bonnes pratiques du projet.
