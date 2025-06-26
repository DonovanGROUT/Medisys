# Réinitialiser l'environnement de développement Medisys (base de données)

> ⚠️ **Attention** : Cette procédure efface irréversiblement toutes les données existantes dans la base de développement. Ne jamais exécuter cette procédure en production.

## Objectif
Repartir d'une base de données MySQL propre, avec les migrations et les fixtures appliquées, afin de garantir un environnement de développement cohérent.

## Procédure manuelle (à exécuter pour repartir de zéro)

1. Arrêter et supprimer les conteneurs et volumes Docker (remise à zéro de la base) :

```bash
docker compose down -v
```

2. Redémarrer la base de données :

```bash
docker compose up -d
```

3. Se placer dans le dossier backend (si pas déjà dedans) :

```bash
cd backend
```

4. Lancer les migrations Doctrine :

```bash
php bin/console doctrine:migrations:migrate --no-interaction
```

5. Charger les fixtures Symfony :

```bash
php bin/console doctrine:fixtures:load --no-interaction
```

6. Démarrer le serveur Symfony (si pas déjà fait) :

```bash
php -S 0.0.0.0:8000 -t public
```

7. Appliquer les migrations sur la base de test (pour les tests automatisés) :

```bash
php bin/console doctrine:migrations:migrate --env=test --no-interaction
```

---

- Accéder à l'application sur `localhost:8000` (ou via le front sur le port 5173).
- Les IDs des patients repartent à 1 à chaque réinitialisation complète.
- Cette méthode assure un environnement de développement fiable et reproductible.
