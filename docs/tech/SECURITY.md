# 🔒 Configuration Sécurisée - Medisys

## ⚠️ Important pour la Production

Ce projet contient des configurations de **développement** uniquement.

### 🔐 Avant déploiement

1. **Changer tous les mots de passe** dans `backend/.env`
2. **Configurer HTTPS** et certificats SSL
3. **Restreindre les permissions MySQL** aux IPs spécifiques
4. **Activer l'environnement `prod`** (`APP_ENV=prod`)
5. **Vérifier la configuration CORS** (origines autorisées)
6. **Activer l'authentification API** (JWT, session, etc.)
7. **Limiter les droits d'accès** (rôles, scopes, voters)
8. **Mettre à jour toutes les dépendances** (Composer, npm)
9. **Configurer un monitoring et des logs sécurisés** (sans données sensibles)

### 💻 Configuration Développement

- **Mots de passe** : Définis dans les fichiers `backend/.env` (jamais en production)
- **Base de données** : MySQL en conteneur Docker
- **Permissions** : Minimales nécessaires pour Symfony
- **Données de test** : Jamais de vraies données
- **Reset BDD de test** : Voir `docs/tech/DEV-RESET-BDD.md`

### 🔒 Fichiers sensibles (non versionnés)

- `backend/.env` - Configuration principale avec credentials
- `backend/.env.test` - Configuration pour les tests unitaires
- `backend/var/` - Cache et logs Symfony
- `backend/vendor/` - Dépendances Composer

> **Ne jamais versionner de secrets (mots de passe, clés API, tokens). Utiliser des variables d'environnement et renouveler régulièrement les secrets.**

## 📋 Fichiers de configuration

- `backend/.env.example` - Template de configuration (versionné, sans secrets)
- `backend/.env.test.example` - Template pour les tests (versionné, sans secrets)
- `docker/mysql/init.sql.example` - Template d'initialisation MySQL (versionné, sans secrets)
- Copier les templates `.example` vers les fichiers correspondants et ajuster les valeurs

### 🔧 Installation initiale

1. `cp backend/.env.example backend/.env` et ajuster les valeurs
2. `cp backend/.env.test.example backend/.env.test` et ajuster les valeurs
3. `cp docker/mysql/init.sql.example docker/mysql/init.sql` et ajuster les valeurs

---

## 🛡️ Sécurité API et entités Patient/Appointment

- **API protégée** : Authentification obligatoire (JWT, session, etc.)
- **CORS** : Restreindre les origines autorisées
- **Validation stricte** : Payloads validés côté backend (statuts, mapping, cf. `docs/tech/MAPPING-API-FRONT.md`)
- **Gestion des droits** : Accès contrôlés par rôles/voters (Symfony)
- **Centralisation des erreurs** : Voir guides et mapping

## 🛠️ Bonnes pratiques Symfony

- Utiliser le firewall (voir la configuration dans `backend/config/packages/security.yaml`), les voters, l'encodage (hachage) des mots de passe
- Mettre à jour régulièrement les dépendances (Composer, npm)
- Ne jamais exposer d'informations sensibles dans les logs ou les erreurs

> ⚠️ Certains aspects de la sécurité (authentification, gestion avancée des droits côté front/API) seront approfondis après la phase de développement de l'interface front des rendez-vous.

## 🔍 Audit et monitoring

- Activer les logs d'accès et d'erreur (sans données sensibles)
- Utiliser des outils d'audit (composer audit, etc.)

## 📚 Annexes et liens utiles

- [DEV-RESET-BDD.md](../tech/DEV-RESET-BDD.md)
- [MAPPING-API-FRONT.md](../tech/MAPPING-API-FRONT.md)
- [OPENAPI.md](../tech/OPENAPI.md)
- [GLOSSARY.md](../tech/GLOSSARY.md)
- [README.md](../../README.md)

> **Pour toute modification majeure, synchroniser la documentation technique, le mapping et l'OpenAPI.**
