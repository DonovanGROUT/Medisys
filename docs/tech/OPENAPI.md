# Documentation OpenAPI – Génération et consultation

Ce document décrit la procédure standard pour générer et consulter la documentation OpenAPI de l’API Symfony du projet.

## Outil utilisé

La génération de la documentation OpenAPI repose sur le package [`zircote/swagger-php`](https://github.com/zircote/swagger-php), installé via Composer dans le backend Symfony. Cet outil permet de générer une spécification OpenAPI au format **YAML** (par défaut en version 3.0).

## Génération de la documentation OpenAPI

Pour générer la documentation OpenAPI après une modification de l’API :

1. Se placer dans le dossier `backend` :
   ```bash
   cd backend
   ```
2. Exécuter la commande suivante pour générer le fichier `openapi.yaml` :
   ```bash
   npm run openapi:generate
   ```
   (ou `yarn openapi:generate` si Yarn est utilisé)

Le fichier généré se trouve dans `public/openapi.yaml` et peut être consulté via Swagger UI.

> Le fichier généré peut être aussi visualisé directement en ligne de commande ou dans un éditeur :
>
> ```bash
> cat public/openapi.yaml
> # ou ouvrir dans VS Code, Sublime, etc.
> ```

## Accès à la documentation Swagger UI

La documentation interactive est accessible en local à l’adresse suivante :

- http://localhost:8000/swagger-ui/index.html

> Swagger UI est embarqué dans le projet (dossier `public/swagger-ui/`), aucune installation externe n’est nécessaire.

Le fichier OpenAPI (`/openapi.yaml`) est chargé automatiquement à l’ouverture de Swagger UI.

## Remarques

- Après toute modification des annotations OpenAPI dans le code source (contrôleurs, DTO, entités), il est nécessaire de régénérer le fichier `openapi.yaml` pour que la documentation soit à jour.
- La documentation générée doit toujours être synchronisée avec le code source et validée avec le mapping API ↔ Front (`MAPPING-API-FRONT.md`) et la charte graphique (statuts, payloads, etc.).
- Il est possible d’automatiser cette génération via un hook Git par exemple, mais cela n’est pas activé par défaut.
