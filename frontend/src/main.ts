// -----------------------------------------------------------------------------
// Point d’entrée principal de l’application Medisys (SPA Vue.js)
// -----------------------------------------------------------------------------
// - Initialise l’application Vue
// - Installe Pinia (store global)
// - Installe le routeur Vue
// - Monte l’application sur #app
// -----------------------------------------------------------------------------

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './assets/main.css';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
