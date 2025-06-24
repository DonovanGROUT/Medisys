# Graphic Charter - Medisys (Vue.js & Santé)

## 🎨 Objectif

Définir les bases graphiques et UI du projet Medisys pour aspirer à la cohérence visuelle, l’accessibilité et l’inspiration "santé" sur toutes les interfaces (front Vue.js, back Symfony).

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

> **Accessibilité** : Toutes les couleurs d’action (boutons, alertes, liens) doivent utiliser ces classes Tailwind pour avoir un contraste AA/AAA.

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

- **Police principale** : 'Roboto', 'Arial', sans-serif
- **Taille standard texte** : 16px
- **Titres** : 24px (h1), 20px (h2), 18px (h3)

## 🧩 Composants UI récurrents

- **Boutons** :
  - Forme arrondie, fond bleu principal (`#1976D2`), texte blanc (`#FFFFFF`)
  - Hover : bleu foncé (ex : `#115293`)
  - Bouton secondaire : fond blanc (`#FFFFFF`), bord bleu principal (`#1976D2`), texte bleu principal (`#1976D2`)
- **Alertes** :
  - Succès : fond vert validation (`#43A047`), texte blanc (`#FFFFFF`)
  - Erreur : fond rouge alerte (`#E53935`), texte blanc (`#FFFFFF`)
  - Info : fond bleu clair (ex : `#E3F2FD`), texte bleu foncé (`#1976D2` ou `#263238`)
- **Formulaires** :
  - Champs avec bordure arrondie, fond gris clair (`#F5F5F5`)
  - Labels en gras, aide contextuelle en gris foncé (`#263238`)
- **Cartes/Blocs** :
  - Fond blanc (`#FFFFFF`), ombre légère, coins arrondis

## 🖼️ Exemples visuels

| Couleur            | Code      |
|--------------------|-----------|
| Bleu principal     | #1976D2   |
| Vert validation    | #43A047   |
| Rouge alerte       | #E53935   |
| Gris clair         | #F5F5F5   |
| Gris foncé         | #263238   |
| Blanc              | #FFFFFF   |

> Les couleurs utilisées dans les composants UI ci-dessus doivent toujours être issues de cette palette pour garantir la cohérence visuelle.

## 📐 Spacing & arrondis

- **Marge extérieure** : 24px (container principal)
- **Padding interne** : 16px (cartes, boutons)
- **Arrondi** : 6px (boutons, champs, cartes)

## 🏷️ Icônes & pictos

- Utiliser [Material Icons](https://fonts.google.com/icons) ou [FontAwesome](https://fontawesome.com/icons?d=gallery)
- Privilégier les pictos médicaux (stéthoscope, dossier, calendrier, etc.)

---

> Ce document sert de référence lors du développement.  
> **Note** : L’ancienne palette reste en référence pour l’inspiration, mais la palette Tailwind accessible doit être utilisée dans tout le code.
