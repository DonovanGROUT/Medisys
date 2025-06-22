# Fiche de révision PHP - Programmation orientée objet

## 🏗️ Classes et Objets

**Concept de base** : Une classe est un modèle, un objet est une instance de ce modèle.

```php
class Personne {
    public $nom;
    private $age;
    
    public function __construct($nom, $age) {
        $this->nom = $nom;
        $this->age = $age;
    }
    
    public function getAge() {
        return $this->age;
    }
    
    public function sePresenter() {
        return "Je suis " . $this->nom . ", j'ai " . $this->age . " ans";
    }
}

$personne = new Personne("Alice", 25);
echo $personne->sePresenter(); // Je suis Alice, j'ai 25 ans
```

**Points clés** :

- Déclaration avec `class`
- Propriétés (variables de la classe)
- Méthodes (fonctions de la classe)
- `$this` pour accéder aux propriétés/méthodes de l'instance
- `new` pour créer une instance

## 🔒 Visibilité des Propriétés

**Contrôle d'accès** aux propriétés et méthodes :

```php
class Compte {
    public $titulaire;        // Accessible partout
    protected $numeroCompte;  // Accessible dans la classe et ses enfants
    private $solde;          // Accessible uniquement dans cette classe
    
    public function getSolde() {
        return $this->solde; // Accès autorisé depuis la classe
    }
    
    public function deposer($montant) {
        $this->solde += $montant;
    }
}
```

**Règles** :

- `public` : Accessible de partout
- `private` : Seulement dans la classe qui la définit
- `protected` : Dans la classe et ses classes filles

## ⚡ Méthodes Statiques

**Appelées sur la classe**, pas sur une instance :

```php
class MathUtils {
    public static function calculer($a, $b, $operation) {
        switch($operation) {
            case '+': return $a + $b;
            case '*': return $a * $b;
            default: return 0;
        }
    }
    
    public static $pi = 3.14159;
}

// Appel sans créer d'instance
$resultat = MathUtils::calculer(5, 3, '+');
echo $resultat; // 8
echo MathUtils::$pi; // 3.14159
```

**Points clés** :

- Utilisation du mot-clé `static`
- Appel avec `::`
- Pas d'accès à `$this`
- Utile pour des fonctions utilitaires

## 🧬 Héritage

**Une classe peut hériter** d'une autre classe :

```php
class Vehicule {
    protected $marque;
    protected $couleur;
    
    public function __construct($marque, $couleur) {
        $this->marque = $marque;
        $this->couleur = $couleur;
    }
    
    public function getDescription() {
        return $this->marque . " " . $this->couleur;
    }
}

class Voiture extends Vehicule {
    private $nombrePortes;
    
    public function __construct($marque, $couleur, $nombrePortes) {
        parent::__construct($marque, $couleur); // Appel du constructeur parent
        $this->nombrePortes = $nombrePortes;
    }
    
    public function getDescription() {
        return parent::getDescription() . " avec " . $this->nombrePortes . " portes";
    }
}

$voiture = new Voiture("Toyota", "rouge", 4);
echo $voiture->getDescription(); // Toyota rouge avec 4 portes
```

**Points clés** :

- `extends` pour hériter
- `parent::` pour accéder aux méthodes du parent
- Possibilité de surcharger les méthodes
- Accès aux éléments `protected` du parent

## 📦 Namespaces

**Organisation du code** pour éviter les conflits :

```php
namespace App\Model;

class User {
    // Code de la classe User
}

namespace App\Service;

class User {
    // Une autre classe User pour les services
}

// Utilisation
use App\Model\User as ModelUser;
use App\Service\User as ServiceUser;

$user = new ModelUser();
$service = new ServiceUser();
```

**Points clés** :

- `namespace` au début du fichier
- `use` pour importer des classes
- `as` pour créer des alias
- Séparation par `\`

## ⚠️ Exceptions

**Gestion structurée des erreurs** :

```php
class ValidationException extends Exception {
    public function __construct($message = "Erreur de validation") {
        parent::__construct($message);
    }
}

class Validator {
    public function validerEmail($email) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new ValidationException("Email invalide: $email");
        }
        return true;
    }
}

// Utilisation
try {
    $validator = new Validator();
    $validator->validerEmail("email-invalide");
} catch (ValidationException $e) {
    echo "Erreur: " . $e->getMessage();
} catch (Exception $e) {
    echo "Erreur générique: " . $e->getMessage();
} finally {
    echo "Validation terminée";
}
```

**Points clés** :

- `throw` pour lancer une exception
- `try/catch` pour capturer
- `finally` pour le nettoyage
- Hiérarchie d'exceptions possible
- Exceptions personnalisées héritent d'`Exception`

## 🏗️ Interfaces et Classes Abstraites

**Contrats et modèles** :

```php
// Interface = contrat
interface Drawable {
    public function draw();
    public function getArea();
}

// Classe abstraite = modèle partiel
abstract class Shape {
    protected $color;
    
    abstract public function getArea(); // Doit être implémentée
    
    public function getColor() { // Peut être héritée
        return $this->color;
    }
}

class Circle extends Shape implements Drawable {
    private $radius;
    
    public function __construct($radius, $color) {
        $this->radius = $radius;
        $this->color = $color;
    }
    
    public function getArea() {
        return pi() * $this->radius * $this->radius;
    }
    
    public function draw() {
        echo "Dessiner un cercle " . $this->color;
    }
}
```

**Points clés** :

- Interface avec `interface` et `implements`
- Classe abstraite avec `abstract`
- Une classe peut implémenter plusieurs interfaces
- Une classe abstraite ne peut pas être instanciée

## ✅ Concepts clés POO

- **Encapsulation** : Cacher les détails internes avec private/protected
- **Héritage** : Réutiliser et étendre le code existant avec extends
- **Polymorphisme** : Même interface, comportements différents
- **Abstraction** : Modéliser les concepts avec des classes abstraites et interfaces

## 🔗 Applications pratiques

La POO est utile pour :

- **Modéliser des entités** : User, Product, Order...
- **Organiser le code** : Classes par responsabilité
- **Réutiliser du code** : Héritage et traits
- **Gérer les erreurs** : Exceptions personnalisées
