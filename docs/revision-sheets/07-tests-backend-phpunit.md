# Fiche de révision : Tests backend (PHPUnit)

## Objectif

Garantir la robustesse du backend Symfony via des tests unitaires, fonctionnels et d’intégration avec PHPUnit.

## Types de tests

- **Tests unitaires** : vérifient le comportement isolé d’une classe ou d’une méthode, sans dépendance à la base de données ni au framework. Exemple : test d’un service ou d’une fonction utilitaire.
- **Tests fonctionnels** : valident le fonctionnement complet d’un contrôleur ou d’une route, en simulant une requête HTTP et en accédant à la base de données de test. Exemple : test d’un endpoint CRUD Patient.
- **Tests d’intégration** : vérifient l’interaction entre plusieurs composants (ex : Repository et base de données réelle de test, ou appels API).

## Localisation

- `backend/tests/Unit/` : tests unitaires (services, helpers, etc.)
- `backend/tests/Integration/Controller/` : tests fonctionnels et API (Patient)
- `backend/tests/Integration/Repository/` : tests d’intégration sur PatientRepository

## Exécution

```bash
cd backend
php bin/phpunit
```

## Bonnes pratiques

- Utiliser des fixtures/mocks pour isoler les cas
- Vérifier les assertions clés (statut HTTP, contenu JSON, base de données)
- Couvrir les cas d’erreur et de validation
- Isoler la base de données de test (reset entre chaque test)

## Ressources
- [Documentation officielle PHPUnit](https://phpunit.de/)
- [Symfony Testing](https://symfony.com/doc/current/testing.html)
