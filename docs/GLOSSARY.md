# Glossaire

## 📚 À propos

Glossaire des termes et concepts découverts pendant l'apprentissage du développement d'applications web modernes avec PHP, Symfony et Vue.js.

## 🎯 PHP - Langage de base

**Variable** : Conteneur pour stocker des données, commence par $ en PHP. Exemple : $nom, $age, $email.

**Type de données** : PHP supporte string (texte), int (entier), float (décimal), bool (vrai/faux), array (tableau), null (vide).

**Tableau indexé** : Tableau avec des clés numériques automatiques (0, 1, 2...). Utile pour les listes ordonnées.

**Tableau associatif** : Tableau avec des clés personnalisées (string ou int). Similaire aux dictionnaires ou maps dans d'autres langages.

**Condition** : Structure if/elseif/else pour exécuter du code selon des critères. Switch/case pour comparer une valeur à plusieurs options.

**Opérateurs** : Comparaison (==, ===, !=), logiques (&&, ||, !), arithmétiques (+, -, *, /). L'opérateur === compare type ET valeur.

**Boucle for** : Répétition avec compteur et condition d'arrêt définie. Idéale quand on connaît le nombre d'itérations.

**Boucle foreach** : Itération sur les éléments d'un tableau. La plus utilisée en PHP pour parcourir des collections.

**Boucle while** : Répétition tant qu'une condition est vraie. Attention aux boucles infinies.

**Fonction** : Bloc de code réutilisable avec paramètres et valeur de retour. Permet la modularité et évite la duplication.

**Portée des variables** : Différence entre variables globales (accessibles partout) et locales (dans une fonction seulement).

**Superglobales** : Variables PHP automatiquement disponibles : $_GET, $_POST, $_SESSION, $_COOKIE, $_SERVER, $_FILES.

## 🎯 Base de données

**PDO** : PHP Data Objects, interface standardisée pour accéder aux bases de données de manière sécurisée et portable.

**Requête préparée** : Technique pour séparer la structure SQL des données, prévient les injections SQL.

**CRUD** : Create, Read, Update, Delete - les quatre opérations de base sur les données. Utilisé dans Symfony pour désigner les actions principales sur une entité (ex : Patient) : création, affichage, modification, suppression (cette dernière étant toujours protégée par un token CSRF pour éviter toute suppression non autorisée).

**Connexion BDD** : Établissement de la liaison entre l'application PHP et la base de données via DSN (Data Source Name).

**ORM** : Object-Relational Mapping, technique pour manipuler la base de données avec des objets plutôt que du SQL brut.

## 🎯 Sécurité

**Hash de mot de passe** : Transformation irréversible d'un mot de passe avec password_hash(). Vérification avec password_verify().

**Session** : Mécanisme côté serveur pour conserver des données utilisateur entre les pages. Stockage temporaire sécurisé.

**Cookie** : Stockage de données côté client dans le navigateur. Persistant mais accessible à l'utilisateur.

**Validation** : Vérification et nettoyage des données utilisateur avant traitement. Ne jamais faire confiance aux entrées.

**Base64** : Encodage pour représenter des données binaires en format texte. Utilisé pour le transport de données, pas pour la sécurité.

**password_hash()** : Fonction PHP pour hasher sécurisement les mots de passe avec des algorithmes adaptés (bcrypt, Argon2).

**password_verify()** : Fonction PHP pour vérifier qu'un mot de passe correspond à son hash, sans révéler le hash.

**OpenSSL** : Bibliothèque cryptographique pour le chiffrement, génération de clés et certificats. Essentielle pour HTTPS et données sensibles.

**JSON** : JavaScript Object Notation, format d'échange de données structurées, lisible et léger.

**CSRF** : Cross-Site Request Forgery, attaque où un site malveillant fait exécuter des actions à votre insu. Protection par tokens.

**XSS** : Cross-Site Scripting, injection de code JavaScript malveillant. Protection par échappement des données d'affichage.

**Injection SQL** : Attaque consistant à injecter du code SQL malveillant. Prévention par requêtes préparées.

## 🎯 Programmation orientée objet

**Classe** : Modèle définissant les propriétés et méthodes d'un objet. Template pour créer des instances.

**Instance** : Objet créé à partir d'une classe. Chaque instance a ses propres valeurs pour les propriétés.

**Propriété** : Variable appartenant à une classe. Peut être publique, privée ou protégée.

**Méthode** : Fonction définie dans une classe qui peut agir sur les propriétés de l'objet.

**Constructeur** : Méthode spéciale __construct() appelée automatiquement lors de la création d'un objet.

**Visibilité** : Contrôle d'accès aux propriétés et méthodes (public, private, protected).

**Héritage** : Mécanisme permettant à une classe d'hériter des propriétés et méthodes d'une autre (extends).

**Polymorphisme** : Capacité d'un objet à prendre plusieurs formes selon le contexte.

**Encapsulation** : Principe de cacher les détails internes d'une classe et exposer une interface publique.

**Interface** : Contrat définissant les méthodes qu'une classe doit implémenter (implements).

**Classe abstraite** : Classe qui ne peut pas être instanciée directement, sert de base pour d'autres classes.

**Trait** : Mécanisme de réutilisation de code, alternative à l'héritage multiple.

**Méthode statique** : Méthode appelée sur la classe elle-même, pas sur une instance (static).

**Namespace** : Espace de noms permettant d'organiser le code et éviter les conflits de noms.

**Exception** : Mécanisme de gestion d'erreurs avec try/catch/throw, plus propre que les codes de retour.

**PHPDoc** : Documentation standardisée du code PHP avec des commentaires spéciaux (@param, @return, @throws).

## 🎯 Architecture web

**MVC** : Model-View-Controller, pattern de séparation des responsabilités dans une application.

**Routeur** : Composant qui associe une URL à un contrôleur et une action spécifique.

**Contrôleur** : Classe qui gère la logique métier et fait le lien entre modèle et vue.

**Modèle** : Représentation des données et de la logique métier de l'application.

**Vue** : Partie responsable de l'affichage et de la présentation des données.

**Template** : Fichier de présentation mélant HTML et code pour générer les pages dynamiquement.

**Middleware** : Composant qui s'exécute avant ou après le traitement principal d'une requête.

## 🎯 Outils et frameworks

**Composer** : Gestionnaire de dépendances PHP, permet d'installer et gérer les bibliothèques tierces.

**Autoload** : Chargement automatique des classes PHP, évite les require/include manuels.

**Framework** : Structure logicielle qui fournit une base et des outils pour développer une application.

**Symfony** : Framework PHP professionnel avec de nombreux composants réutilisables.

**Vue.js** : Framework JavaScript pour créer des interfaces utilisateur interactives.

**API REST** : Architecture pour créer des services web utilisant HTTP et les verbes GET, POST, PUT, DELETE.

**JSON** : JavaScript Object Notation, format d'échange de données léger et lisible.

## 🚀 Symfony Framework

**Symfony** : Framework PHP robuste suivant les bonnes pratiques, avec injection de dépendances et architecture MVC.

**Composer** : Gestionnaire de dépendances PHP. `composer require` pour ajouter des packages, `composer install` pour installer.

**Doctrine ORM** : Système de mapping objet-relationnel pour Symfony. Gère les entités, migrations et requêtes base de données.

**Twig** : Moteur de templates de Symfony pour séparer la logique métier de la présentation.

**Bundle** : Module Symfony qui ajoute des fonctionnalités. Exemple : DoctrineBundle pour l'ORM.

**Environment (.env)** : Fichier de configuration des variables d'environnement (base de données, debug, secrets).

**Database URL** : Chaîne de connexion à la base de données au format `mysql://user:password@host:port/database`.

**Docker Compose** : Outil pour définir et orchestrer des applications multi-conteneurs avec un fichier YAML.

**PDO** : PHP Data Objects, interface PHP pour accéder aux bases de données de manière unifiée.

## 🏥 Développement médical

**Patient Entity** : Entité Doctrine représentant un patient avec données personnelles et médicales sécurisées.

**Audit Trail** : Traçabilité des modifications avec timestamps automatiques (createdAt, updatedAt) pour conformité médicale.

**RGPD** : Règlement sur la protection des données. Exige sécurisation et contrôle d'accès aux données personnelles.

**Repository Pattern** : Couche d'abstraction pour l'accès aux données, sépare la logique métier de la persistance.

**Migration** : Script de modification de schéma de base de données, versionnée et reproductible.

**Entity Manager** : Service Doctrine qui gère le cycle de vie des entités (persist, flush, find).

**Fluent Interface** : Pattern où les méthodes retournent $this pour permettre le chaînage : `$patient->setName()->setEmail()`.

**Property Mapping** : Liaison entre propriétés PHP et colonnes de base de données via annotations ORM.

**Constraint Validation** : Validation automatique des données (unique, not null, length) au niveau base et application.

**Test Isolation** : Nettoyage de la base entre tests pour éviter les interdépendances et garantir la reproductibilité.

**FormType** : Classe PHP (ex : PatientType) qui définit la structure d’un formulaire Symfony pour une entité. Permet de générer automatiquement les champs du formulaire et de lier les données à l’entité.

---

### Edit (édition)

Action du CRUD permettant de modifier une entité existante (ex : patient). Implique un formulaire pré-rempli, une validation et une sauvegarde en base.

### FormType

Classe Symfony qui définit la structure d'un formulaire (champs, validation, options). Utilisée pour la création et l'édition d'entités.

### Test fonctionnel

Test automatisé qui simule une requête HTTP et vérifie le comportement d'une page ou d'une action complète (ex : création, édition, affichage d'un patient).

>Glossaire enrichi au fur et à mesure des découvertes
