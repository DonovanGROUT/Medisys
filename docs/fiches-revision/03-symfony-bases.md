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
      - "3307:3306"
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

## 🏥 Entités et base de données

### Création d'entité

```bash
# Générer une entité
php bin/console make:entity NomEntite

# Générer une migration
php bin/console make:migration

# Appliquer les migrations
php bin/console doctrine:migrations:migrate
```

### Exemple entité Patient

```php
#[ORM\Entity(repositoryClass: PatientRepository::class)]
class Patient
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $firstName = null;

    // Getters/setters avec chaînage fluide
    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;
        return $this; // Permet le chaînage
    }
}
```

### Patterns importants

- **Repository Pattern** : Séparation logique métier / accès données
- **Fluent Interface** : Chaînage des setters pour syntaxe élégante
- **Audit Trail** : `createdAt`/`updatedAt` automatiques pour traçabilité

## 🧪 Tests avec PHPUnit

### Configuration tests

```bash
# Installer PHPUnit (inclus avec webapp)
composer require --dev phpunit/phpunit

# Lancer les tests
php bin/phpunit
```

### Types de tests

**Tests unitaires** : Logique métier sans dépendances

```bash
tests/Unit/Entity/PatientTest.php
```

**Tests d'intégration** : Avec vraie base de données

```bash
tests/Integration/Repository/PatientRepositoryTest.php
```

### Base de données de test

```bash
# Configuration .env.test
DATABASE_URL="mysql://user:pass@127.0.0.1:3307/app_test"

# Appliquer migrations en test
php bin/console doctrine:migrations:migrate --env=test
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
