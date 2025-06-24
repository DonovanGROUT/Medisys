# Migration d’un monolithe Symfony/Twig vers une SPA Vue.js

## Objectifs
- Moderniser l’architecture : découpler backend (Symfony API) et frontend (SPA Vue 3, Vite, TypeScript, Tailwind CSS).
- Améliorer la maintenabilité, la testabilité, l’accessibilité et la documentation du projet.
- Permettre un développement itératif et indépendant du backend grâce aux mocks de données côté frontend.

## Étapes principales
- Analyse de l’existant (monolithe Symfony/Twig)
- Création d’un dossier `frontend/` (Vite, Vue 3, TypeScript, Tailwind CSS)
- Découpage progressif des fonctionnalités côté frontend (composants, vues, routes)
- Mise en place d’une API Symfony pour exposer les données
- Utilisation de mocks côté frontend pour le développement initial
- Migration progressive des écrans et des interactions

## Bonnes pratiques
- Garder une structure de projet claire et modulaire
- Documenter chaque étape de la migration (README, notes d’apprentissage, fiches de révision)
- Harmoniser les conventions de code, de tests et de documentation
- Valider chaque étape par des tests unitaires et fonctionnels

## Difficultés rencontrées
- Gestion des dépendances et des outils (Vite, Prettier, Vitest, jsdom)

## Ressources utiles
- [Documentation Symfony](https://symfony.com/doc/current/index.html)
- [Documentation Vue.js](https://vuejs.org/)
- [Documentation Vite](https://vitejs.dev/)
- [Formation Grafikart Symfony 7](https://grafikart.fr/formations/apprendre-symfony-7)
- [Formation Grafikart Vue.js](https://grafikart.fr/formations/vuejs)
