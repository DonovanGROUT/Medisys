# Notes d'Apprentissage

## À propos

Ce fichier centralise mes notes et découvertes au fil de l'apprentissage.

---

## Formation PHP - Notes personnelles

### Bases du langage

**Variables** : Toujours commencer par $, PHP gère automatiquement les types mais on peut déclarer explicitement depuis PHP 7.

**Tableaux** : Deux types principaux - indexés (0,1,2...) et associatifs (clés personnalisées). Les fonctions array_push(), count(), in_array() sont très utiles. Parcours avec foreach (le plus courant) ou for classique.

**Conditions et boucles** : if/elseif/else pour la logique conditionnelle. Pour les boucles : foreach excellent pour parcourir les tableaux, while pour répéter tant qu'une condition est vraie, for avec compteur.

**Fonctions** : Bien penser aux paramètres par défaut et au scope des variables. Les fonctions anonymes pratiques pour les callbacks et les closures (array_map, array_filter).

### Programmation orientée objet

**Classes et objets** : Une classe = un modèle, un objet = une instance. Le constructeur __construct() est appelé automatiquement.

**Visibilité** : public (accessible partout), private (classe uniquement), protected (classe + héritage).

**Héritage** : extends permet de créer des hiérarchies. Attention à bien utiliser parent:: quand nécessaire.

**Méthodes statiques** : Appelées sur la classe elle-même avec ::, pas d'accès à $this.

**DateTime** : API très complète pour manipuler les dates, indispensable pour les applications métier.

**cURL** : Essentiel pour consommer des APIs externes, authentification, traitement JSON.

**Exceptions** : try/catch/throw pour une gestion d'erreurs propre. Possibilité de créer ses propres exceptions.

**Namespaces** : Organisation du code en espaces de noms, évite les conflits. Utilisation avec use et aliases.

**Traits** : Alternative à l'héritage multiple, permet la réutilisation de code.

**Interfaces et classes abstraites** : Contrats que doivent respecter les classes, très utile pour l'architecture.

### Architecture et patterns

**MVC** : Séparation Modèle/Vue/Contrôleur, organisation claire du code.

**Routeur personnalisé** : Gestion des URLs, paramètres, erreurs 404. Base pour comprendre les frameworks.

**QueryBuilder** : Construction dynamique de requêtes SQL, pattern très utilisé dans les frameworks.

**Pattern Repository/Active Record** : Abstraction de l'accès aux données, chaque table = une classe.

### Base de données et sécurité

**PDO et requêtes préparées** : Protection contre l'injection SQL, gestion propre des connexions.

**Sessions et authentification** : password_hash() et password_verify() pour sécuriser les mots de passe.

**Validation des données** : Toujours filtrer et valider les entrées utilisateur.

**Gestion des fichiers** : Upload sécurisé, validation des types, redimensionnement d'images.

### Outils et bonnes pratiques

**Composer** : Gestionnaire de dépendances PHP, autoload automatique des classes.

**Tests unitaires** : PHPUnit pour vérifier le code, TDD, assertions.

**PHPDoc** : Documentation standardisée avec @param, @return, @throws. Améliore l'expérience IDE.

**Refactoring** : Amélioration continue du code, extraction de méthodes, suppression de la duplication.

## Découverte Symfony

> Prochaine étape : framework pour accélérer le développement d'applications web robustes

## Vue.js

> À prévoir : interface utilisateur moderne et interactive

## Problèmes rencontrés

Notes des difficultés et solutions trouvées

## Astuces découvertes

**Tableaux associatifs** : Très pratiques pour structurer les données, comme $_POST ou les configurations.

**Interpolation de variables** : Utiliser les guillemets doubles pour inclure des variables dans les chaînes.

**Opérateur de coalescence** : `??` très pratique pour les valeurs par défaut (`$nom = $_POST['nom'] ?? 'Anonyme'`).

**Fonctions de tableaux** : array_map(), array_filter(), array_reduce() évitent beaucoup de boucles manuelles.

**Namespaces** : Utiliser les namespaces dès le début pour une organisation claire.

**Requêtes préparées** : Toujours utiliser PDO avec des requêtes préparées, même si on fait confiance aux données.

**Typage des paramètres** : Déclarer les types des paramètres de fonctions améliore la robustesse.

**Autoload** : Composer résout automatiquement les dépendances, plus besoin de require partout.

---

### Notes mises à jour au fur et à mesure de l'apprentissage
