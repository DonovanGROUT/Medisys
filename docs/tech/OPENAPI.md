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

## Accès à la documentation Swagger UI

La documentation interactive est accessible en local à l’adresse suivante :

- http://localhost:8000/swagger-ui/index.html

Le fichier OpenAPI (`/openapi.yaml`) est chargé automatiquement à l’ouverture de Swagger UI.

## Remarques

- Après toute modification des annotations OpenAPI dans le code source, il est nécessaire de régénérer le fichier `openapi.yaml` pour que la documentation soit à jour.
- Il est possible d’automatiser cette génération via un hook Git par exemple, mais cela n’est pas activé par défaut.
