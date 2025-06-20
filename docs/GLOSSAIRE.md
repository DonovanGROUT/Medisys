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

**CRUD** : Create, Read, Update, Delete - les quatre opérations de base sur les données.

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

---

>Glossaire enrichi au fur et à mesure des découvertes
