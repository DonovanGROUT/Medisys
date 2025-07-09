# GitFlow Strategy - Medisys

## 🌿 Structure des branches

### Branches principales

- **`main`** : Code de production stable (releases)
- **`develop`** : Branche d'intégration pour le développement

### Branches de fonctionnalité

- **`feature/`** : Nouvelles fonctionnalités (suivant les phases du projet)
  - `feature/patient-entity` (Phase 2 - Entité Patient)
  - `feature/patient-controllers-forms` (Phase 3 - Contrôleurs et formulaires patient)
  - `feature/patient-vuejs-front` (Phase 4 - Interface Patient et homepage en VueJS)
  - `feature/appointment-entity` (Phase 5 - Entité Rendez-vous)
  - `feature/appointment-controllers` (Phase 6 - API/contrôleurs Rendez-vous)
  - `feature/appointment-vuejs-front` (Phase 7 - Interface Rendez-vous en VueJS)
  - `feature/user-authentication` (Phase 8 - Authentification)

### Branches de support

- **`hotfix/`** : Corrections urgentes en production
  - Créer à partir de `main`, merger dans `main` puis dans `develop`.

## 🔄 Workflow

### Pour une nouvelle fonctionnalité

1. **Créer une branche feature** à partir de `develop`

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nom-fonctionnalite
   ```

2. **Développer la fonctionnalité**
   - Commits atomiques et explicites (voir conventions ci-dessous)
   - Vérification systématique des tests (`npm run test`, `npm run coverage` ou équivalent)
   - Push sur la branche feature

3. **Créer une Pull Request** sur GitHub
   - Source : `feature/xxx`
   - Target : `develop`
   - Revue de code, validation des tests et de la couverture

4. **Merger la PR** et supprimer la branche

   ```bash
   # Après merge de la PR
   git checkout develop
   git pull origin develop
   git branch -d feature/xxx
   ```

### Pour une release vers production

1. **Merger develop dans main** via Pull Request

   ```bash
   # Créer une PR : develop → main
   # Optionnel : Ajouter un tag pour marquer les étapes importantes
   git checkout main
   git pull origin main
   git tag v1.0.0  # Ex: v1.0.0 (Symfony), v1.1.0 (Patient), v2.0.0 (Auth)
   git push origin main --tags
   ```

### Pour un hotfix urgent

1. **Créer une branche hotfix à partir de main**

   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/nom-correctif
   # Corriger, commit, push
   git push origin hotfix/nom-correctif
   # PR vers main, puis merger aussi dans develop
   ```

## 📝 Conventions de commits

### Préfixes standards

- **`feat:`** Nouvelle fonctionnalité
- **`fix:`** Correction de bug
- **`docs:`** Documentation uniquement
- **`style:`** Formatage (espaces, virgules, etc.)
- **`refactor:`** Refactoring du code
- **`test:`** Ajout ou modification de tests
- **`chore:`** Tâches de maintenance

### Exemples

```bash
feat: add Patient entity with basic fields
fix: resolve database connection timeout
docs: update README with installation steps
```

## ✅ Avantages de cette approche

- **Isolation** : Chaque fonctionnalité est développée indépendamment
- **Stabilité** : `main` reste toujours stable
- **Révision** : Les Pull Requests permettent une révision systématique du code
- **Collaboration** : Facilite le travail en équipe (en cas d'ajout de nouveaux développeurs)
- **Historique** : Traçabilité claire des fonctionnalités

## 📋 Suivi des features (phases)

- `feature/patient-entity` : ✅ **TERMINÉE** - Entité Patient avec Doctrine
- `feature/patient-controllers-forms` : ✅ **TERMINÉE** - Contrôleurs et formulaires Patient
- `feature/patient-vuejs-front` : ✅ **TERMINÉE** - Interface Patient et homepage en Vue.js (SPA)
- `feature/appointment-entity` : ✅ **TERMINÉE** - Entité Rendez-vous (Doctrine, validation, tests, docs)
- `feature/appointment-controllers` : ✅ **TERMINÉE** - API/contrôleurs Rendez-vous
- `feature/appointment-vuejs-front` : ✅ **TERMINÉE** - Interface Rendez-vous en Vue.js (SPA)
- `feature/user-authentication` : 📅 **PROCHAINE** - Système d'authentification

> Les features suivent la progression des phases documentées.
