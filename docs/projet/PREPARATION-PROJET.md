# Préparation projet - Application santé numérique

## 🎯 Objectif

Préparer l'environnement de développement pour créer une application de gestion médicale moderne avec Symfony et Vue.js. Ce projet simulera les défis techniques rencontrés dans le développement de solutions logicielles pour le secteur de la santé.

## 🏥 Contexte du projet

Nous allons développer une application web simple de gestion médicale pour apprendre Symfony et Vue.js, incluant :

- **Gestion de patients** : Liste et fiches patients simples
- **Rendez-vous** : Planning basique de consultations  
- **Authentification sécurisée** : Connexion avec rôles (médecin/secrétaire)
- **Sécurité RGPD** : Chiffrement des données sensibles, logs d'accès
- **Interface moderne** : Vue.js pour l'interactivité

> Projet éducatif inspiré des défis du secteur médical

## 🔒 Exigences de sécurité - Secteur médical

### Contraintes à découvrir avec Symfony

- **RGPD/GDPR** : Consentement, droit à l'oubli, portabilité des données
- **Données de santé** : Chiffrement des informations sensibles
- **Traçabilité** : Logs des accès aux dossiers patients
- **Authentification forte** : Mots de passe robustes, sessions sécurisées

### Apprentissage progressif avec Symfony

Ces exigences seront implémentées au fur et à mesure de l'apprentissage de Symfony :

- Hashage des mots de passe (Security Bundle)
- Validation des données (Validator Component)
- Gestion des rôles utilisateurs (Security)
- Logs d'audit (Events et Listeners)

## 📚 Prérequis techniques

Pour réaliser cet exercice, il faut :

### 0. Solides bases PHP

**Formation suivie** : [Formation PHP - Grafikart](https://grafikart.fr/formations/php)

**Concepts requis** :

- Classes et objets (pour modéliser patients, rendez-vous)
- Propriétés publiques/privées (encapsulation des données)
- Méthodes et instances (opérations CRUD simples)
- Héritage de base (types d'utilisateurs)
- Espaces de noms (organisation du code)

### 1. PHP (version 8.2 minimum)

```bash
# Vérifier la version installée
php --version
```

>Version 8.2+ requise pour les dernières fonctionnalités de sécurité

Si PHP n'est pas installé, aller sur [php.net](https://www.php.net/downloads)

### 2. Composer (gestionnaire de paquets PHP)

```bash
# Vérifier si Composer est installé
composer --version
```

>Essentiel pour gérer les bibliothèques de sécurité et de conformité médicale

Si Composer n'est pas installé, aller sur [getcomposer.org](https://getcomposer.org/)

### 3. Environnement de développement

- **Éditeur** : VS Code avec extensions PHP et Symfony
- **Base de données** : SQLite pour commencer (simple) ou MySQL
- **Serveur local** : Symfony CLI ou serveur PHP intégré
- **Sécurité** : OpenSSL pour le chiffrement (inclus avec PHP)

### 4. Outils de sécurité (à découvrir progressivement)

- **Validator Symfony** : Validation robuste des données d'entrée
- **Security Bundle** : Authentification et autorisation
- **Audit Logs** : Traçabilité des actions sensibles
- **Password Hasher** : Hashage sécurisé des mots de passe

## ✅ Validation de l'environnement

- [ ] PHP 8.2+ installé et fonctionnel
- [ ] Composer installé et opérationnel  
- [ ] Éditeur configuré avec extensions PHP/Symfony

## 🚀 Test d'environnement complet

Une fois les prérequis validés, vérifier que PHP fonctionne correctement avec les fonctionnalités de sécurité en créant un fichier qui va tester :

- La création d'une classe simple (modélisation d'un patient)
- L'encapsulation des données sensibles
- Le chiffrement basique avec `base64_encode/decode`
- Le hashage de mots de passe avec `password_hash()`
- La génération de logs d'accès avec horodatage

Ce test permettra de valider que l'environnement PHP est prêt pour les fonctionnalités de sécurité que nous implémenterons avec Symfony.

### Validation finale

- [ ] Test de création de classe réussi
- [ ] Test de chiffrement et hashage fonctionnel
- [ ] Logs d'accès générés correctement

## 🔮 Étapes du projet

Ce projet se déroulera progressivement avec l'apprentissage de Symfony :

### Fondations

- Installation Symfony et configuration initiale
- Création des entités de base (Patient, RendezVous, User)
- Interface CRUD simple

### Sécurité et authentification

- Système d'authentification avec rôles
- Validation des données d'entrée
- Gestion des permissions

### Fonctionnalités avancées

- Interface Vue.js interactive
- Conformité RGPD (consentement, suppression)
- Logs d'audit et traçabilité

## 🎯 Objectifs d'apprentissage

- Maîtriser Symfony dans un contexte métier réaliste
- Comprendre les enjeux de sécurité du secteur médical
- Intégrer Vue.js avec Symfony
- Implémenter des bonnes pratiques de développement
- Respecter les contraintes de conformité (RGPD)

---

>Préparation pour un projet d'apprentissage progressif
