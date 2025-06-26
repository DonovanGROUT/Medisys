# 🔒 Configuration Sécurisée - Medisys

## ⚠️ Important pour la Production

Ce projet contient des configurations de **développement** uniquement.

### 🔐 Avant déploiement

1. **Changer tous les mots de passe** dans `backend/.env`
2. **Configurer HTTPS** et certificats SSL
3. **Restreindre les permissions MySQL** aux IPs spécifiques
4. **Activer l'environnement `prod`** (`APP_ENV=prod`)

### 💻 Configuration Développement

- **Mots de passe** : Définis dans les fichiers `backend/.env` (jamais en production)
- **Base de données** : MySQL en conteneur Docker
- **Permissions** : Minimales nécessaires pour Symfony

### 🔒 Fichiers sensibles (non versionnés)

- `backend/.env` - Configuration principale avec credentials
- `backend/.env.test` - Configuration pour les tests unitaires
- `backend/var/` - Cache et logs Symfony
- `backend/vendor/` - Dépendances Composer

## 📋 Fichiers de configuration

- `backend/.env.example` - Template de configuration (versionné, sans secrets)
- `backend/.env.test.example` - Template pour les tests (versionné, sans secrets)
- `docker/mysql/init.sql.example` - Template d'initialisation MySQL (versionné, sans secrets)
- Copier les templates `.example` vers les fichiers correspondants et ajuster les valeurs

### 🔧 Installation initiale

1. `cp backend/.env.example backend/.env` et ajuster les valeurs
2. `cp backend/.env.test.example backend/.env.test` et ajuster les valeurs
3. `cp docker/mysql/init.sql.example docker/mysql/init.sql` et ajuster les valeurs
