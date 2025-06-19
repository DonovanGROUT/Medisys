# Fiche de révision PHP - Concepts avancés

## 🧪 Tests Unitaires avec PHPUnit

**Pourquoi tester** : Vérifier que le code fonctionne correctement et éviter les régressions.

```php
class CalculatorTest extends TestCase {
    public function testAddition() {
        $calculator = new Calculator();
        $this->assertEquals(5, $calculator->add(2, 3));
    }
    
    public function testDivisionByZero() {
        $this->expectException(InvalidArgumentException::class);
        $calculator->divide(10, 0);
    }
}
```

**Concepts clés** : Classe hérite de `TestCase`, méthodes `test*`, assertions (`assertEquals`, `assertTrue`), test d'exceptions

## 🏗️ Architecture MVC

**Séparation des responsabilités** :

```php
// Modèle - Données
class UserModel {
    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
}

// Vue - Présentation  
class UserView {
    public function render($user) {
        echo "<h1>" . htmlspecialchars($user['name']) . "</h1>";
    }
}

// Contrôleur - Logique
class UserController {
    public function show($id) {
        $user = $this->model->findById($id);
        $this->view->render($user);
    }
}
```

**Principe** : Séparer données (Model), affichage (View) et logique (Controller)

## 🔗 Query Builder

**Construction dynamique de requêtes** :

```php
class QueryBuilder {
    private $query = '';
    private $params = [];
    
    public function select($columns = '*') {
        $this->query = "SELECT $columns";
        return $this;
    }
    
    public function from($table) {
        $this->query .= " FROM $table";
        return $this;
    }
    
    public function where($condition, $value) {
        $this->query .= " WHERE $condition";
        $this->params[] = $value;
        return $this;
    }
}

// Utilisation
$users = (new QueryBuilder())
    ->select('name, email')
    ->from('users')
    ->where('age > ?', 18)
    ->execute();
```

**Principe** : Chaînage de méthodes pour construire des requêtes SQL dynamiques

## 🏭 Patterns de Conception

### Repository Pattern

**Principe** : Séparer la logique de récupération des données du reste de l'application.

```php
interface UserRepositoryInterface {
    public function find($id);
    public function findAll();
    public function save($user);
}

class UserRepository implements UserRepositoryInterface {
    public function find($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    // ...
}
```

**Avantage** : Code testable, base de données interchangeable

### Singleton Pattern

**Principe** : Une seule instance de classe dans toute l'application.

```php
class Database {
    private static $instance = null;
    
    private function __construct() {
        $this->pdo = new PDO($dsn, $user, $pass);
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
}
```

**Usage** : Connexions DB, loggers, configurations

## 🔄 Traits

**Principe** : Partager du code entre classes qui n'ont pas de relation d'héritage.

```php
trait Timestampable {
    private $createdAt;
    
    public function updateTimestamps() {
        $this->createdAt = new DateTime();
    }
}

trait Loggable {
    public function log($message) {
        echo "[" . date('Y-m-d H:i:s') . "] $message\n";
    }
}

class Article {
    use Timestampable, Loggable;  // Utilise plusieurs traits
    
    public function save() {
        $this->updateTimestamps();
        $this->log("Article sauvegardé");
    }
}
```

**Avantage** : Réutilisation horizontale du code, évite la duplication

## 📦 Composer et Autoload

**Problème** : Comment gérer les dépendances et éviter les `require` manuels partout ?

**Solution** : Composer automatise l'installation des packages et le chargement des classes.

```json
{
    "name": "mon-projet/app",
    "require": {
        "monolog/monolog": "^3.0",
        "symfony/validator": "^6.0"
    },
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

**Autoload automatique** :

```php
require_once 'vendor/autoload.php';

use App\Model\User;
use Monolog\Logger;

$user = new User(); // Chargé automatiquement depuis src/Model/User.php
$logger = new Logger('app'); // Dépendance externe installée via Composer
```

**Avantages** :

- Plus besoin de `require` manuel
- Gestion automatique des versions
- Standard PSR-4 pour l'organisation des fichiers
- Écosystème riche de packages disponibles

## 🌐 APIs et cURL

**Principe** : Communiquer avec des services externes via HTTP.

```php
class ApiClient {
    private $baseUrl, $apiKey;
    
    public function get($endpoint) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $this->baseUrl . $endpoint,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->apiKey,
                'Content-Type: application/json'
            ]
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new ApiException("Erreur API: $httpCode");
        }
        
        return json_decode($response, true);
    }
}
```

**Concepts clés** : cURL, gestion erreurs HTTP, authentification, JSON

## 📅 DateTime et Gestion des Dates

**Principe** : Manipuler les dates de manière fiable.

```php
// Créer et formater des dates
$date = DateTime::createFromFormat('Y-m-d H:i', '2024-03-15 14:30');
$date->add(new DateInterval('PT2H')); // Ajouter 2 heures
echo $date->format('d/m/Y H:i'); // 15/03/2024 16:30

// Calculer un âge
$naissance = new DateTime('1990-05-15');
$age = (new DateTime())->diff($naissance)->y;

// Gestion fuseaux horaires
$date = new DateTime('2024-03-15 14:30', new DateTimeZone('Europe/Paris'));
$date->setTimezone(new DateTimeZone('UTC'));
```

**Concepts clés** : `createFromFormat`, `DateInterval`, `DateTimeZone`, `diff`, `clone`

## ✅ Bonnes Pratiques

### 🔒 Sécurité

```php
// ❌ DANGEREUX - Injection SQL
$sql = "SELECT * FROM users WHERE email = '" . $_POST['email'] . "'";

// ✅ SÉCURISÉ - Requête préparée
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$_POST['email']]);

// ✅ Échappement pour affichage
echo htmlspecialchars($user['name'], ENT_QUOTES, 'UTF-8');
```

### ⚡ Performance

```php
// ❌ Problème N+1 requêtes
foreach ($users as $user) {
    $posts = $pdo->prepare("SELECT * FROM posts WHERE user_id = ?");
    $posts->execute([$user['id']]);
}

// ✅ Une requête avec JOIN
$sql = "SELECT u.*, p.title FROM users u LEFT JOIN posts p ON u.id = p.user_id";
```

### 🛠️ Maintenabilité

- **Documentation** : PHPDoc sur classes et méthodes
- **Tests** : Couverture des fonctions critiques  
- **Standards** : PSR-1, PSR-4, PSR-12
- **Architecture** : MVC, Repository pattern

---

> Cette fiche couvre les concepts PHP avancés nécessaires avant d'aborder Symfony
