# Backend Medisys

Ce dossier contient toute l’application Symfony (API, configuration, entités, tests, etc.).

> **Note sur la suppression des patients et rendez-vous**
> 
> En environnement de développement/test, la suppression d’un patient entraîne la suppression en cascade de tous ses rendez-vous (relation ManyToOne avec `onDelete: 'CASCADE'`).
> 
> **En production**, il est recommandé de privilégier l’archivage ou l’anonymisation des données plutôt que la suppression physique, afin de respecter la traçabilité, la conformité légale et l’intégrité métier.

## Structure du backend

- `bin/` : scripts Symfony
- `config/` : configuration du framework
- `migrations/` : migrations Doctrine
- `public/` : point d’entrée HTTP (index.php)
- `src/` : code source PHP (contrôleurs, entités, etc.)
- `templates/` : templates Twig (admin, emails)
- `translations/` : fichiers de traduction
- `var/` : cache, logs
- `vendor/` : dépendances PHP
- `assets/` : assets back (si besoin)
- `tests/` : tests unitaires et fonctionnels
- `.phpunit.cache/` : cache des tests
- `.env*` : configuration d’environnement
- `.editorconfig`, `.gitignore`, `.vscode/` : outils et configuration du projet

## Scripts npm utiles (automatisation)

Les scripts suivants sont disponibles dans le `package.json` du backend :

- `npm run create` : crée la base de données de développement
- `npm run drop` : supprime la base de données de développement
- `npm run migrate` : lance les migrations Doctrine sur la base de développement
- `npm run fixtures` : charge les fixtures sur la base de développement
- `npm run create:test` : crée la base de test
- `npm run drop:test` : supprime la base de test
- `npm run migrate:test` : lance les migrations sur la base de test
- `npm run fixtures:test` : charge les fixtures sur la base de test
- `npm run reset` : réinitialise complètement la base de développement (drop, create, migrate, fixtures)
- `npm run reset:test` : réinitialise complètement la base de test
- `npm run reset:full` : réinitialise à la fois la base de développement et la base de test
- `npm test` : lance la suite de tests PHPUnit
- `npm run test:full` : réinitialise la base de test puis lance la suite de tests
- `npm run openapi:generate` : génère la documentation OpenAPI (Swagger)
- `npm run serve` : lance le serveur PHP intégré sur http://127.0.0.1:8000 (API accessible en local)

> Ces scripts facilitent le développement, les tests et la CI. Ils sont complémentaires à l’automatisation Docker.

## Lancement du backend

Voir le README principal à la racine pour les instructions globales.

---

Pour la documentation technique détaillée (mapping, sécurité, conventions, API), voir [../docs/tech/INDEX-tech.md](../docs/tech/INDEX-tech.md).
Pour la roadmap et l’état d’avancement global, se référer au README principal à la racine du projet.
