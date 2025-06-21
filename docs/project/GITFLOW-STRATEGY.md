# GitFlow Strategy - Medisys

## 🌿 Structure des branches

### Branches principales

- **`main`** : Code de production stable (releases)
- **`develop`** : Branche d'intégration pour le développement

### Branches de fonctionnalité

- **`feature/`** : Nouvelles fonctionnalités (suivant les phases du projet)
  - `feature/patient-entity` (Phase 2 - Entité Patient)
  - `feature/patient-controllers-forms` (Phase 3 - Interface Patient)
  - `feature/appointment-entity` (Phase 4 - Entité Rendez-vous)
  - `feature/appointment-controllers` (Phase 5 - Interface Rendez-vous)
  - `feature/user-authentication` (Phase 6 - Authentification)

### Branches de support

- **`hotfix/`** : Corrections urgentes en production

## 🔄 Workflow

### Pour une nouvelle fonctionnalité

1. **Créer une branche feature** à partir de `develop`

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/patient-controllers-forms
   ```

2. **Développer la fonctionnalité**

   ```bash
   # Commits de développement
   git add .
   git commit -m "feat: add Patient entity with basic fields"
   git push origin feature/patient-entity
   ```

3. **Créer une Pull Request** sur GitHub
   - Source : `feature/patient-entity`
   - Target : `develop`
   - Révision du code et validation des tests

4. **Merger la PR** et supprimer la branche

   ```bash
   # Après merge de la PR
   git checkout develop
   git pull origin develop
   git branch -d feature/patient-entity
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

## 📋 Prochaines features prévues

- `feature/patient-entity` : ✅ **TERMINÉE** - Entité Patient avec Doctrine
- `feature/patient-controllers-forms` : 🔄 **PROCHAINE** - Contrôleurs et formulaires Patient
- `feature/appointment-entity` : 📅 **FUTURE** - Entité Rendez-vous
- `feature/appointment-controllers` : 📅 **FUTURE** - Interface Rendez-vous
- `feature/user-authentication` : 📅 **FUTURE** - Système d'authentification

> Les features suivent la progression des phases documentées

## ✅ Avantages de cette approche

- **Isolation** : Chaque fonctionnalité est développée indépendamment
- **Stabilité** : `main` reste toujours stable
- **Révision** : Les Pull Requests permettent une révision systématique du code
- **Collaboration** : Facilite le travail en équipe (en cas d'ajout de nouveaux développeurs)
- **Historique** : Traçabilité claire des fonctionnalités
