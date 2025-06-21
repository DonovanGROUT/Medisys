# Fiche de révision PHP - Les bases

## 📝 Variables et Types

**Syntaxe** : Toutes les variables commencent par `$` en PHP.

**Types principaux** :

- `string` : Texte entre guillemets simples ou doubles
- `int` : Nombres entiers positifs ou négatifs  
- `float` : Nombres décimaux
- `bool` : true ou false
- `array` : Collection d'éléments
- `null` : Valeur vide

**Conversion automatique** : PHP est faiblement typé, il convertit automatiquement les types selon le contexte.

**Déclaration de type** : Possible depuis PHP 7 pour plus de sécurité.

## 📊 Tableaux

**Tableau indexé** : Clés numériques automatiques (0, 1, 2...)

```php
$fruits = ['pomme', 'banane', 'orange'];
echo $fruits[0]; // pomme
```

**Tableau associatif** : Clés personnalisées (string/int)

```php
$personne = ['nom' => 'Dupont', 'age' => 30];
echo $personne['nom']; // Dupont
```

**Fonctions utiles** :

- `count()` : Nombre d'éléments
- `array_push()` : Ajouter un élément
- `in_array()` : Vérifier la présence d'une valeur

## 🔀 Conditions

**Structure if/elseif/else** :

```php
if ($age >= 18) {
    echo "Majeur";
} elseif ($age >= 16) {
    echo "Peut conduire";
} else {
    echo "Mineur";
}
```

**Switch/case** : Pour comparer une valeur à plusieurs options

```php
switch ($jour) {
    case 'lundi':
        echo "Début de semaine";
        break;
    case 'vendredi':
        echo "Fin de semaine";
        break;
    default:
        echo "Jour normal";
}
```

**Opérateurs** :

- Comparaison : `==` (valeur), `===` (type + valeur), `!=`, `!==`
- Logiques : `&&` (et), `||` (ou), `!` (non)

## 🔄 Boucles

**Boucle for** : Quand on connaît le nombre d'itérations

```php
for ($i = 0; $i < 10; $i++) {
    echo $i;
}
```

**Boucle while** : Tant qu'une condition est vraie

```php
while ($condition) {
    // Code à répéter
}
```

**Boucle foreach** : Parcours de tableaux (la plus utilisée)

```php
foreach ($tableau as $element) {
    echo $element;
}
// Avec clé et valeur
foreach ($tableau as $cle => $valeur) {
    echo "$cle : $valeur";
}
```

**Contrôle** : `break` (sortir), `continue` (passer au suivant)

## 🔧 Fonctions

**Déclaration** :

```php
function nomFonction($param1, $param2 = 'défaut') {
    return $param1 . $param2;
}
```

**Paramètres par défaut** : Valeurs utilisées si le paramètre n'est pas fourni.

**Valeur de retour** : `return` renvoie une valeur et termine la fonction.

**Portée des variables** : Variables locales à la fonction vs globales.

**Fonctions anonymes** :

```php
$fonction = function($x) {
    return $x * 2;
};
```

## 🌐 Superglobales

Variables automatiquement disponibles dans tous les scopes :

- `$_GET` : Données envoyées via URL (paramètres)
- `$_POST` : Données envoyées via formulaire
- `$_SESSION` : Variables de session (côté serveur)
- `$_COOKIE` : Cookies (côté client)
- `$_SERVER` : Informations sur le serveur et requête
- `$_FILES` : Fichiers uploadés

## ✅ Points clés à retenir

- Toujours utiliser `$` devant les variables
- `===` plus strict que `==`
- `foreach` excellent pour les tableaux
- Fonctions avec paramètres par défaut = flexibilité
- Superglobales disponibles partout
- PHP convertit automatiquement les types

## 🔗 Application pour le web médical

Ces bases sont essentielles pour :

- Traiter les formulaires patients (`$_POST`)
- Gérer les sessions utilisateur (`$_SESSION`)
- Valider les données avec conditions
- Parcourir les listes de patients avec `foreach`
- Créer des fonctions réutilisables pour les calculs médicaux
