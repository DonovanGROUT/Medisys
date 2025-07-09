# Notes d'Apprentissage

> **Note** : Depuis la migration vers une architecture SPA, le projet est structuré en deux dossiers principaux : `backend/` (Symfony API) et `frontend/` (Vue.js SPA). Voir le [README principal](../../README.md) pour la structure à jour.

> **Frontend** : L'intégration de Tailwind CSS utilise la version 3.x (la version 4 ne fournit plus de CLI local compatible avec Vite/NPM 10+). Voir le [guide d'installation frontend](../../frontend/README.md) pour la démarche complète.

---

## À propos

Ce fichier centralise les notes, astuces, problèmes rencontrés et conventions retenues au fil du projet. Il complète les guides détaillés disponibles dans [`docs/guides/`](./INDEX-guides.md) et les documents techniques dans [`docs/tech/`](../tech/INDEX-tech.md).

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

**Préparation environnement terminée** : Test PHP validé avec succès (classes, chiffrement base64, hashage password_hash, logs JSON, OpenSSL). L'environnement est prêt pour Symfony.

**Phase 1 - Installation Symfony 7.3 terminée** :

- ✅ Symfony skeleton installé avec webapp components
- ✅ Structure projet organisée et documentée
- ✅ Base de données MySQL configurée avec Docker
- ✅ Connexion Doctrine opérationnelle
- ✅ Serveur de développement fonctionnel

**Phase 2 - Entité Patient terminée** :

- ✅ Entité Patient complète avec propriétés médicales
- ✅ Propriétés privées pour sécurité RGPD
- ✅ Repository PatientRepository configuré
- ✅ Migration base de données générée et appliquée
- ✅ Tests unitaires (8 tests, 11 assertions)
- ✅ Tests d'intégration (3 tests, 8 assertions)
- ✅ Audit trail automatique (createdAt/updatedAt)
- ✅ Chaînage fluide des setters (pattern fluent)
- ✅ Validation email unique en base
- ✅ Calcul automatique de l'âge
- ✅ PHPDoc complet sur tous les fichiers

**Configuration finale** :

- MySQL 8.0 via Docker (port ${DB_PORT})
- Variables d'environnement sécurisées
- Base de données `${DB_NAME}` créée
- Base de test `${DB_NAME}_test` dédiée
- Utilisateur dédié configuré

**Phase 3 - Contrôleurs et formulaires (en cours)** :

- Génération de contrôleurs avec `php bin/console make:controller`
- Définition des routes avec les attributs PHP 8 (`#[Route(...)]`)
- Passage de variables du contrôleur à la vue via `$this->render('...', ['patients' => ...])`
- Utilisation de Twig pour afficher des listes, des conditions, des boucles
- Utilisation des repositories pour accéder aux entités Doctrine
- Génération et application de migrations pour la base de données
- Mise en place de tests unitaires et d'intégration avec base de test dédiée
- Utilisation de PHPDoc pour documenter entités, repositories, contrôleurs et tests
- Gestion de la sécurité et de la conformité (audit trail, validation, RGPD)

## Symfony - Approche CRUD et tests fonctionnels

- **CRUD Symfony** : Chaque action (show, new, edit, delete) correspond à une méthode du contrôleur, un template Twig dédié et un test fonctionnel associé.
- **Séparation back/front** : Les templates Twig servent le HTML côté serveur, la future refonte Vue.js utilisera une API dédiée.
- **Tests fonctionnels** : Utilisation de WebTestCase pour simuler des requêtes HTTP et vérifier le rendu (voir PatientControllerTest).
- **PHPDoc** : Documentation systématique des classes et méthodes critiques (contrôleurs, entités, tests) pour la maintenabilité.
- **Documentation des templates** : Bloc de commentaire en tête de chaque .html.twig pour décrire l’usage et les variables attendues.

**Phase 4 - Interface Patient et homepage en Vue.js (en cours)**

- Migration progressive du monolithe Symfony/Twig vers une architecture SPA (Vue.js) + API (Symfony)
- Découplage complet backend (Symfony API) / frontend (SPA Vue 3, Vite, TypeScript, Tailwind CSS)
- Développement frontend avec mocks de données pour permettre un travail itératif et indépendant du backend
- Création et typage strict de tous les composants et vues Vue.js
- Ajout de tests unitaires pour tous les composants principaux (Vitest + jsdom)
- Formatage automatique systématique avec Prettier (`npm run format`)
- Scripts npm utiles : `dev`, `test`, `format`
- Validation régulière des tests (`npm run test`) et du formatage
- Difficulté rencontrée : erreurs TypeScript dans les tests résolues par l’ajout de "vitest" dans `tsconfig.json`
- Prochaine étape : intégration et tests de l’API Symfony avec le frontend Vue.js

## Phase 5 & 6 – Rendez-vous (Appointment)

- **Entité Appointment** : propriétés strictes (date/heure, durée, motif, statut, patient lié), validation métier (date future, durée positive, statut autorisé).
- **Mapping DTO/Entity** : centralisé dans un service dédié (AppointmentMapper), facilite la maintenance et la cohérence API ↔ base.
- **Gestion des statuts** : liste fermée de valeurs autorisées ("scheduled", "cancelled", "completed") validée dans le setter, statuts clairs (à venir, confirmé, annulé, terminé), cohérence avec la charte graphique (voir [`GRAPHIC-CHART.md`](../design/GRAPHIC-CHART.md)).
- **Validation & erreurs** : validation stricte (DTO, entité), gestion centralisée des erreurs métier (retours 400/404 structurés).
- **Documentation API** : schéma OpenAPI à jour, exemples de payloads/réponses, mapping API ↔ Front documenté (voir [`MAPPING-API-FRONT.md`](../tech/MAPPING-API-FRONT.md)).
- **Tests** : intégration CRUD, validation, erreurs métier, base de test isolée.
- **Cohérence Patient/Appointment** : même logique de mapping, validation, gestion des erreurs et documentation.
- **DTO/Mapper** : voir la fiche de révision [`08-dto-mapper-api.md`](../revision-sheets/08-dto-mapper-api.md) pour les bonnes pratiques et exemples concrets.

---

## Vue.js SPA – Architecture, conventions et scripts

> **Contexte** : Depuis la phase 4, le frontend est une SPA Vue 3 (Vite, TypeScript, Tailwind CSS), découplée du backend Symfony (API REST).

### Structure et conventions
- **Organisation** :
  - `frontend/src/components/` : composants Vue réutilisables (PascalCase)
  - `frontend/src/views/` : vues/pages (PascalCase)
  - `frontend/src/services/` : fonctions d’appel API (camelCase)
  - `frontend/src/stores/` : gestion du state (Pinia)
  - `frontend/src/utils/` : fonctions utilitaires (gestion d'erreurs)
  - `frontend/src/assets/` : styles, images, etc.
  - `frontend/src/router.ts` : configuration des routes SPA
- **Conventions de nommage** :
  - Composants : PascalCase (ex : `PatientCard.vue`)
  - Fichiers JS/TS : camelCase
  - Props : camelCase
  - Endpoints API : kebab-case (ex : `/api/patients`)
- **Mapping API** : voir [`MAPPING-API-FRONT.md`](../tech/MAPPING-API-FRONT.md) pour la correspondance des champs Patient (API ↔ frontend).

### Scripts npm utiles
- `npm run dev` : serveur de dev Vite
- `npm run build` : build de production
- `npm run test` : lance tous les tests (Vitest)
- `npm run format` : formatage automatique (Prettier)

### Tests frontend
- **Vitest** + **jsdom** pour les tests unitaires de composants
- Couverture des composants critiques (PatientList, PatientForm, etc.)
- Ajout de tests à chaque évolution majeure
- Difficultés rencontrées : erreurs TypeScript dans les tests résolues par l’ajout de "vitest" dans `tsconfig.json`

### Accessibilité (a11y)
- Utilisation de Tailwind pour garantir un contraste suffisant (voir palette dans la charte graphique)
- Boutons, alertes et formulaires conçus pour être accessibles (exemples dans [`GRAPHIC-CHART.md`](../design/GRAPHIC-CHART.md))
- Navigation clavier testée sur les formulaires principaux

### Bonnes pratiques appliquées
- Utilisation de `fetch` natif pour tous les appels API
- Typage strict avec TypeScript (props, réponses API)
- Formatage systématique avec Prettier avant commit
- Utilisation de Tailwind CSS pour la cohérence visuelle et l’accessibilité
- Tests avec Vitest pour les composants principaux

---

## Problèmes rencontrés

Notes des difficultés et solutions trouvées

**Problème PostgreSQL/PHP 8.2** : Extension pdo_pgsql non disponible pour PHP 8.2 sur Ubuntu 20.04.

- Solution : Migration vers MySQL 8.0
- Configuration Docker simplifiée et plus stable

## Astuces découvertes

**Tableaux associatifs** : Très pratiques pour structurer les données, comme $_POST ou les configurations.

**Interpolation de variables** : Utiliser les guillemets doubles pour inclure des variables dans les chaînes.

**Opérateur de coalescence** : `??` très pratique pour les valeurs par défaut (`$nom = $_POST['nom'] ?? 'Anonyme'`).

**Fonctions de tableaux** : array_map(), array_filter(), array_reduce() évitent beaucoup de boucles manuelles.

**Namespaces** : Utiliser les namespaces dès le début pour une organisation claire.

**Requêtes préparées** : Toujours utiliser PDO avec des requêtes préparées, même si on fait confiance aux données.

**Typage des paramètres** : Déclarer les types des paramètres de fonctions améliore la robustesse.

**Autoload** : Composer résout automatiquement les dépendances, plus besoin de require partout.

**Doctrine ORM** :

- Entités avec annotations/attributs PHP 8
- Propriétés privées + getters/setters pour l'encapsulation
- Migrations automatiques pour évolutions de schéma
- Repository pattern pour l'accès aux données
- Tests d'intégration avec base de test dédiée

**PHPUnit Testing** :

- Tests unitaires sans dépendances externes
- Tests d'intégration avec vraie base de données
- setUp/tearDown pour isolation des tests
- Assertions spécifiques (assertSame vs assertEquals)
- Nettoyage de base entre tests pour éviter conflits

**Sécurité base de données** :

- Permissions MySQL graduelles selon environnement
- Utilisateurs dédiés par contexte (dev/test/prod)
- Variables d'environnement pour credentials
- Audit trail automatique avec createdAt/updatedAt

---

## Notes sur l'action edit (édition patient)

- Utiliser le même FormType pour new/edit simplifie la maintenance.
- Pour les tests fonctionnels, cibler la ligne du patient édité via un email unique et une boucle sur les lignes du tableau (éviter les callbacks dépréciés).
- Les dépréciations PHPUnit n'empêchent pas les tests de passer mais doivent être surveillées pour la pérennité du projet.

## CSRF et robustesse des tests fonctionnels (Delete)

- Pour toute action de suppression, toujours utiliser un formulaire POST avec token CSRF.
- Tester la suppression en simulant le parcours utilisateur réel (extraction du token CSRF depuis le DOM, vérification de la suppression effective, des messages flash et de la redirection).
- Exemple de test robuste : voir `PatientControllerDeleteTest.php`.

> Notes mises à jour au fil de l’apprentissage et des évolutions du projet.

---

## Apports et apprentissages de la phase Rendez-vous (Appointment) VueJS

- **Architecture frontend avancée** :
  - Création de tous les composants rendez-vous (liste, formulaire, item, actions, loaders, autocomplete, etc.) avec typage strict TypeScript.
  - Centralisation des helpers de mapping et de validation dans `utils/` et les services, pour garantir la cohérence et éviter la duplication.
  - Utilisation de Pinia pour la gestion d’état global (alertes, utilisateur), avec tests dédiés.
  - Refactoring des modales pour l’accessibilité (focus trap, navigation clavier, fermeture Échap/clic extérieur, ARIA, feedback visuel).
  - Création de composants réutilisables (modals, loaders, autocomplete, icons, etc.) pour accélérer le développement et garantir la cohérence UX/UI.
  - Application stricte des conventions de nommage et de structure (PascalCase, camelCase, mapping API ↔ Front).

- **Tests frontend et robustesse** :
  - Refactoring strict des fichiers de tests critiques (blocs métier, helpers centralisés, typage strict).
  - Couverture de tests élevée sur les composants critiques, avec focus sur la validation, l’accessibilité, la robustesse et les cas limites.
  - Centralisation des helpers et mocks de test pour éviter la duplication et garantir la cohérence des scénarios.
  - Ajout de tests d’accessibilité systématiques (jest-axe, ARIA, navigation clavier).
  - Utilisation de scripts npm pour le formatage, la couverture, le reset de la base de test.

- **Accessibilité et bonnes pratiques** :
  - Accessibilité systématique sur tous les nouveaux composants (labels, ARIA, navigation clavier, feedback visuel, audit jest-axe).
  - Feedback utilisateur immédiat sur la validation frontend (messages d’erreur, désactivation des boutons, focus sur le champ en erreur).
  - Ne jamais utiliser directement les noms de champs API dans le front : toujours passer par le mapping centralisé.
  - Toujours valider les champs côté frontend avant envoi à l’API.
  - Documentation et harmonisation des blocs de commentaires dans tous les fichiers critiques frontend.

- **Documentation et organisation** :
  - Mise à jour et harmonisation de tous les guides, index, glossaire, mapping, charte graphique, sécurité, etc. pour refléter la réalité du code.
  - Ajout d’exemples concrets de mapping, de validation frontend, de feedback utilisateur, d’accessibilité dans les docs techniques.

> Ces apprentissages ont permis d’améliorer la qualité, la robustesse, l’accessibilité et la maintenabilité du frontend, tout en posant les bases pour l’intégration de l’authentification et la gestion des droits dans la prochaine phase.