# Phase 1 - Installation Symfony

## 🎯 Objectif de cette phase

Installer Symfony 7.3 dans le projet existant en préservant la documentation et structure actuelle, puis effectuer les premiers pas avec le framework.

## 📋 Prérequis

- [x] Environnement PHP 8.2+ validé (voir [PREPARATION-PROJET.md](PREPARATION-PROJET.md))
- [x] Composer installé et fonctionnel
- [x] Test d'environnement réussi

## 🚀 Étapes d'installation

### 1. Installation du framework Symfony

- [x] Créer le projet Symfony dans un dossier temporaire
- [x] Ajouter les composants web essentiels
- [x] Déplacer les fichiers Symfony à la racine du projet
- [x] Fusionner les configurations (`.gitignore`, etc.)
- [x] Nettoyer les fichiers temporaires

**Commandes de référence** (formation Grafikart) :

```bash
# Création du squelette
composer create-project symfony/skeleton:"7.3.*" symfony-temp
cd symfony-temp
composer require webapp

# Déplacement vers la racine
cd ..
mv symfony-temp/* .
cat symfony-temp/.gitignore >> .gitignore
mv symfony-temp/.env* .
rm -rf symfony-temp
```

### 2. Configuration de l'environnement de développement

- [x] Vérifier la configuration `.env`
- [x] Ajuster les paramètres pour l'environnement de développement
- [x] Configurer la base de données (**MySQL choisi**)

**Choix de base de données** : MySQL sélectionné pour :

- Base de données relationnelle complète et largement adoptée
- Configuration Docker simple avec les variables d'environnement
- Identifiants spécifiques au projet avec utilisateur dédié

### 3. Découverte de la structure du projet

- [x] Explorer la structure des dossiers Symfony
- [x] Comprendre le rôle de chaque répertoire (`src/`, `config/`, `public/`, etc.)
- [x] Identifier les fichiers de configuration principaux

**Structure attendue après installation** :

```bash
/Medisys/
├── README.md                    # Documentation du projet
├── docs/                        # Documentation détaillée
├── test-environnement.php       # Test de validation PHP
├── composer.json                # Configuration Symfony
├── .env                         # Variables d'environnement
├── bin/                         # Exécutables Symfony
├── config/                      # Configuration Symfony
├── public/                      # Point d'entrée web
├── src/                         # Code source PHP
├── templates/                   # Templates Twig
├── var/                         # Cache et logs
└── vendor/                      # Dépendances Composer
```

### 4. Premier démarrage de l'application

- [x] Démarrer le serveur de développement PHP
- [x] Accéder à la page d'accueil Symfony
- [x] Vérifier que tout fonctionne correctement
- [x] Tester l'environnement de debug

**Test de démarrage** :

```bash
# Serveur de développement (formation Grafikart)
php -S localhost:8000 -t public

# Ou avec le CLI Symfony (alternative)
symfony server:start
```

### 5. Validation finale de l'installation

- [x] **Base de données MySQL** : Conteneur Docker fonctionnel sur le port 3307
- [x] **Connexion Doctrine** : Test de connexion réussi avec les identifiants projet
- [x] **Serveur Symfony** : Application accessible sur `http://localhost:8000`
- [x] **Page d'accueil** : Interface Symfony s'affiche correctement

**Configuration finale validée** :

- MySQL 8.0 via Docker (port 3307)
- Base de données du projet créée et opérationnelle
- Utilisateur dédié avec mot de passe sécurisé
- Connexion Doctrine opérationnelle

## 🔧 Résultat attendu

À la fin de cette phase, le projet disposera de :

- ✅ Un projet Symfony 7.3 fonctionnel
- ✅ Une page d'accueil Symfony accessible
- ✅ La documentation préservée et organisée
- ✅ Un environnement de développement prêt pour la suite

## 🔮 Prochaine phase

Une fois cette installation terminée, passage à la **Phase 2 : Entité Patient** pour créer notre première entité métier avec Doctrine ORM, tests et migrations.

---

> Phase d'installation suivant la formation [Symfony 7 - Grafikart](https://grafikart.fr/formations/apprendre-symfony-7)
