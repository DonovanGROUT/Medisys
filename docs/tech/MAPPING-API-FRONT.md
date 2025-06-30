# Mapping API ↔ Frontend (Patient)

Ce document présente la correspondance entre les champs exposés par l’API Symfony (en anglais) et ceux utilisés côté frontend Vue.js (en français) pour la ressource Patient.

| API (anglais)   | Frontend (français) |
|-----------------|---------------------|
| id              | id                  |
| lastName        | nom                 |
| firstName       | prenom              |
| gender          | sexe                |
| birthDate       | dateNaissance       |
| phone           | telephone           |
| email           | email               |

> Ce mapping est central pour garantir la cohérence des échanges de données, la robustesse des tests et la clarté du code. Il doit être mis à jour à chaque évolution du modèle Patient.
> 
> Ce mapping doit toujours être synchronisé avec l’entité `Patient` côté backend (`src/Entity/Patient.php`) et les types/interfaces utilisés côté frontend (ex : `Patient.ts`).
> Pour toute nouvelle ressource exposée par l’API (ex : Rendez-vous), créer un mapping similaire pour garantir la cohérence des échanges.

---

# Mapping API ↔ Frontend (Appointment)

Ce document présente la correspondance entre les champs exposés par l’API Symfony (en anglais) et ceux utilisés côté frontend Vue.js (en français) pour la ressource Rendez-vous.

| API (anglais) | Frontend (français) |
|---------------|---------------------|
| id            | id                  |
| patient       | patient             |
| dateTime      | dateHeure           |
| duration      | duree               |
| reason        | motif               |
| status        | statut              |

> Ce mapping doit être synchronisé avec l’entité `Appointment` (`src/Entity/Appointment.php`) et le type/interface `Appointment.ts` côté frontend.
> Adapter les noms si besoin selon la convention du front.

---

## Détails complémentaires (Appointment)

- **patient** : objet ou identifiant. L’API retourne généralement un objet patient complet (voir mapping Patient), le frontend peut n’utiliser que certains champs (id, nom, prénom…). Pour la création, seul l’id du patient est attendu dans le payload.
- **status** : valeur autorisée parmi une liste fermée : `scheduled`, `cancelled`, `completed`. Voir la charte graphique pour la correspondance visuelle (badge/couleur).
- **Validation stricte** : chaque champ doit respecter le type, le format et les valeurs attendues (ex : date ISO, durée positive, statut autorisé).

### Exemple de payload API → Front (lecture rendez-vous)

```json
{
  "id": 42,
  "patient": {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Alice"
  },
  "dateHeure": "2025-07-01T09:00:00+00:00",
  "duree": 30,
  "motif": "Consultation annuelle",
  "statut": "scheduled"
}
```

### Exemple de payload Front → API (création rendez-vous)

```json
{
  "patientId": 1,
  "dateTime": "2025-07-01T09:00:00+00:00",
  "duration": 30,
  "reason": "Consultation annuelle",
  "status": "scheduled"
}
```

> Mettre à jour ce mapping à chaque évolution du modèle ou de l’API pour garantir la robustesse des échanges et la clarté du code.
