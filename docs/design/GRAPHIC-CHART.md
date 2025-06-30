# Charte Graphique – Medisys (Vue.js & Santé)

## 🎨 Objectif

Définir les bases graphiques et UI du projet Medisys pour aspirer à la cohérence visuelle, l’accessibilité et l’inspiration "santé" sur toutes les interfaces (front Vue.js, back Symfony). Cette charte est une base : l'adapter si besoin pour répondre aux contraintes UX/UI, tout en gardant la cohérence et l’accessibilité comme priorité.

## 🏥 Inspirations

- Codes visuels du secteur santé : bleu/vert, icônes médicales, boutons arrondis, espaces aérés
- Formation Grafikart Vue.js pour la structure des composants et la simplicité UI

## 🎨 Palette de couleurs

| Usage               | Ancien code | Nouveau (Tailwind) | Code Tailwind |
|---------------------|-------------|--------------------|--------------|
| Bleu principal      | #1976D2     | blue-800           | #1e40af      |
| Vert validation     | #43A047     | green-800          | #166534      |
| Rouge alerte        | #E53935     | red-800            | #991b1b      |
| Gris clair          | #F5F5F5     | gray-100           | #f5f5f5      |
| Gris foncé          | #263238     | slate-800          | #263238      |
| Blanc               | #FFFFFF     | white              | #ffffff      |

> **Accessibilité** : Toutes les couleurs d’action (boutons, alertes, liens) doivent utiliser ces classes Tailwind pour avoir un contraste AA/AAA. **La palette Tailwind est la seule référence pour le code : l’ancienne palette n’est qu’inspiration.**

## 🏷️ Statuts & Badges Rendez-vous

- **Statuts recommandés** :
  - À venir (bleu principal)
  - Confirmé (vert validation)
  - Annulé (rouge alerte)
  - Terminé (gris foncé ou vert pâle)
- Il est possible d’ajouter d’autres statuts si besoin métier (ex : reporté, en attente…).
- **Exemple badge Tailwind** :

  ```html
  <span class="inline-block rounded-full px-3 py-1 text-sm font-semibold text-white bg-blue-800">À venir</span>
  <span class="inline-block rounded-full px-3 py-1 text-sm font-semibold text-white bg-green-800">Confirmé</span>
  <span class="inline-block rounded-full px-3 py-1 text-sm font-semibold text-white bg-red-800">Annulé</span>
  <span class="inline-block rounded-full px-3 py-1 text-sm font-semibold text-white bg-slate-800">Terminé</span>
  ```
- **Accessibilité** :
  - Toujours garantir le contraste texte/fond.
  - Ajouter un pictogramme si besoin pour renforcer la compréhension (ex : check, croix, horloge).

## 🧩 Exemples UI accessibles

- **Bouton principal** :

  ```html
  <button class="rounded-[6px] bg-blue-800 text-white px-4 py-2 font-semibold hover:bg-blue-900 focus:outline focus:outline-2 focus:outline-blue-800">
    Action principale
  </button>
  ```

- **Bouton validation** :

  ```html
  <button class="rounded-[6px] bg-green-800 text-white px-4 py-2 font-semibold hover:bg-green-900 focus:outline focus:outline-2 focus:outline-green-800">
    Valider
  </button>
  ```

- **Alerte succès** :

  ```html
  <div class="bg-green-800 text-white rounded-[6px] px-4 py-2">
    Succès !
  </div>
  ```

- **Alerte erreur** :

  ```html
  <div class="bg-red-800 text-white rounded-[6px] px-4 py-2">
    Erreur !
  </div>
  ```

## 🅰️ Typographie

- Police principale : 'Roboto', 'Arial', sans-serif
- Taille standard texte : 16px
- Titres : 24px (h1), 20px (h2), 18px (h3)

## 📐 Spacing & arrondis

- Marge extérieure : 24px (container principal)
- Padding interne : 16px (cartes, boutons)
- Arrondi : 6px (boutons, champs, cartes)

## 🧩 Composants UI récurrents

- **Boutons** : arrondis, bleu principal, texte blanc, hover bleu foncé. Secondaire : fond blanc, bord bleu, texte bleu.
- **Alertes** : succès (vert), erreur (rouge), info (bleu clair), toujours texte blanc ou foncé selon contraste.
- **Formulaires** : champs arrondis, fond gris clair, labels en gras, aide en gris foncé.
- **Cartes/Blocs** : fond blanc, ombre légère, coins arrondis.

## 🏷️ Icônes & pictos

- Utiliser [Material Icons](https://fonts.google.com/icons) ou [FontAwesome](https://fontawesome.com/icons?d=gallery)
- Privilégier les pictos médicaux (stéthoscope, dossier, calendrier, etc.)
- Les icônes doivent toujours être accompagnées d’un texte ou d’un label accessible pour les lecteurs d’écran.

---

> Ce document sert de référence lors du développement.  
> **Note** : L’ancienne palette reste en référence pour l’inspiration, mais la palette Tailwind accessible doit être utilisée dans tout le code.  
> **Adapter la charte si besoin pour l’UX/UI, mais garder la cohérence et l’accessibilité comme priorité.**
