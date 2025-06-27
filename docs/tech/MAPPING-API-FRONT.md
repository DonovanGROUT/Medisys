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
