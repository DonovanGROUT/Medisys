# Fiche de révision 03 - Symfony Bases

## 📁 Installation et structure

### Installation Symfony

```bash
# Créer un projet Symfony
composer create-project symfony/skeleton:"7.3.*" nom-projet
cd nom-projet
composer require webapp  # Ajoute les composants web essentiels
```

### Structure de projet

```bash
/projet-symfony/
├── composer.json        # Dépendances et configuration
├── .env                 # Variables d'environnement
├── bin/console          # CLI Symfony
├── config/              # Configuration Symfony
├── public/index.php     # Point d'entrée web
├── src/                 # Code source PHP
├── templates/           # Templates Twig
└── var/                 # Cache et logs
```

## 🗄️ Base de données avec Doctrine

### Configuration (.env)

```bash
DATABASE_URL="mysql://user:password@127.0.0.1:3306/database?serverVersion=8.0&charset=utf8mb4"
```

### Docker Compose (MySQL)

```yaml
services:
  database:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: nom_base
      MYSQL_USER: nom_utilisateur
      MYSQL_PASSWORD: mot_de_passe
      MYSQL_ROOT_PASSWORD: mot_de_passe_root
    ports:
      - "${DB_PORT}:3306"
```

### Commandes Doctrine utiles

```bash
# Créer la base de données
php bin/console doctrine:database:create

# Valider le schéma
php bin/console doctrine:schema:validate

# Exécuter du SQL
php bin/console dbal:run-sql "SHOW TABLES"
```

## 🌐 Serveur de développement

```bash
# Démarrer le serveur (méthode Grafikart)
php -S localhost:8000 -t public

# Alternative avec Symfony CLI
symfony server:start
```

## 📝 Points clés à retenir

- **Convention over Configuration** : Symfony privilégie les conventions pour réduire la configuration
- **Injection de dépendances** : Les services sont automatiquement injectés
- **Environment** : `.env` pour la configuration, jamais de données sensibles en production
- **Sécurité** : Variables sensibles à protéger, utilisateur dédié pour la base de données

## 🔧 Variables d'environnement importantes

- `APP_ENV` : dev, prod, test
- `APP_SECRET` : Clé secrète pour le chiffrement
- `DATABASE_URL` : Connexion base de données
- `MAILER_DSN` : Configuration email

---

> Formation Grafikart Symfony 7 - Phase 1 Installation
