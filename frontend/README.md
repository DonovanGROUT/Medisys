# Frontend Medisys (SPA Vue 3 + Vite + TypeScript)

Ce dossier contient l’application frontend développée en Vue 3, initialisée avec Vite et TypeScript.

## Structure du frontend

- `src/` : composants Vue, pages, assets JS/TS
- `public/` : fichiers statiques
- `node_modules/` : dépendances NPM (non versionnées)
- `vite.config.ts` : configuration Vite
- `tsconfig.json` : configuration TypeScript
- `tailwind.config.js` : configuration Tailwind CSS
- `postcss.config.js` : configuration PostCSS

## Stack technique

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) (v3.x)

## Lancement du frontend

```bash
cd frontend
npm install
npm run dev
```

Accès local : [http://localhost:5173](http://localhost:5173)

## Dépendances principales

- Vue 3, Vite, TypeScript
- Tailwind CSS v3.x (⚠️ version 3 recommandée pour compatibilité CLI locale)
- PostCSS, Autoprefixer

## Notes d'installation Tailwind CSS

- La version 4 de Tailwind CSS ne fournit plus de CLI local compatible avec Vite/NPM 10+.
- Utiliser la version 3.x pour s'assurer de la génération des fichiers de config (`tailwind.config.js`, `postcss.config.js`) et l'intégration avec Vite.
- Voir la documentation du projet pour la démarche complète.

> Voir le README principal à la racine pour la documentation globale et la stratégie de migration SPA.
