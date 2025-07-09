// -----------------------------------------------------------------------------
// Définition du routeur principal de l’application Medisys (SPA Vue.js)
// -----------------------------------------------------------------------------
// - Gère la navigation entre les pages principales (accueil, patients, mentions légales…)
// - Utilise l’historique HTML5 (mode SPA)
// - À terme, chaque route doit pointer vers une vue dédiée (ex : PatientShow)
// -----------------------------------------------------------------------------

import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './views/HomePage.vue';
import PatientsList from './views/PatientsList.vue';
import PatientForm from './components/PatientForm.vue';
import LegalNotice from './views/LegalNotice.vue';
import PatientShow from './views/PatientShow.vue';
import AppointmentList from './views/AppointmentList.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/patients', name: 'Patients', component: PatientsList },
  { path: '/patients/new', name: 'PatientNew', component: PatientForm },
  { path: '/patients/:id', name: 'PatientShow', component: PatientShow },
  { path: '/appointments', name: 'Appointments', component: AppointmentList },
  { path: '/mentions-legales', name: 'LegalNotice', component: LegalNotice },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
