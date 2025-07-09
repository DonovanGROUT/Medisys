<!--
  Composant racine de l’application Medisys (SPA Vue.js)

  - Gère la structure globale (navigation, alertes, contenu, footer)
  - Intègre le routeur Vue (RouterView)
  - Affiche les alertes globales via Pinia
  - Applique la charte graphique et l’accessibilité
-->
<script setup lang="ts">
// Import des composants et hooks principaux
import { RouterView, RouterLink } from 'vue-router';
import Alert from './components/Alert.vue';
import { storeToRefs } from 'pinia';
import { useAlertStore } from './stores/alert';
import { useUserStore } from './stores/user';

// Store d’alertes globales (Pinia)
const alertStore = useAlertStore();
const { alert } = storeToRefs(alertStore);

// Store utilisateur (Pinia)
const userStore = useUserStore();
const { isAuthenticated, username } = storeToRefs(userStore);
</script>

<template>
  <div class="min-h-screen flex flex-col gap-y-8 bg-[#F5F5F5] font-sans">
    <!-- Barre de navigation principale -->
    <nav class="bg-white shadow mb-8">
      <div
        class="container mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
      >
        <RouterLink
          to="/"
          class="text-2xl font-bold text-blue-800 text-center sm:text-left sm:mr-8 sm:pr-6 sm:border-r sm:border-gray-300"
          >Medisys</RouterLink
        >
        <div class="flex flex-col sm:flex-row w-full sm:items-center sm:justify-between gap-2">
          <!-- Groupe navigation principale -->
          <div class="flex gap-2 w-full justify-center sm:justify-start sm:w-auto">
            <RouterLink
              to="/"
              class="rounded-[6px] border border-blue-800 text-blue-800 px-4 py-2 font-semibold hover:bg-blue-800 hover:text-white focus:outline focus:outline-2 focus:outline-blue-800 transition-colors duration-200 flex items-center justify-center h-12 min-h-[44px] whitespace-nowrap text-center w-full sm:w-auto"
            >
              Accueil
            </RouterLink>
            <RouterLink
              to="/patients"
              class="rounded-[6px] border border-green-800 text-green-800 px-4 py-2 font-semibold hover:bg-green-800 hover:text-white focus:outline focus:outline-2 focus:outline-green-800 transition-colors duration-200 flex items-center justify-center h-12 min-h-[44px] whitespace-nowrap text-center w-full sm:w-auto"
            >
              Patients
            </RouterLink>
            <RouterLink
              to="/appointments"
              class="rounded-[6px] border border-purple-800 text-purple-800 px-4 py-2 font-semibold hover:bg-purple-800 hover:text-white focus:outline focus:outline-2 focus:outline-purple-800 transition-colors duration-200 flex items-center justify-center h-12 min-h-[44px] whitespace-nowrap text-center w-full sm:w-auto"
            >
              Rendez-vous
            </RouterLink>
          </div>
          <!-- Séparateur visuel -->
          <div class="hidden sm:block border-l border-gray-300 h-10 mx-4"></div>
          <!-- Groupe authentification -->
          <div class="flex gap-2 w-full justify-center sm:justify-end sm:w-auto mt-2 sm:mt-0">
            <template v-if="!isAuthenticated">
              <button
                @click="userStore.login('demo')"
                class="rounded-[6px] border border-gray-800 text-gray-800 px-4 py-2 font-semibold hover:bg-gray-800 hover:text-white focus:outline focus:outline-2 focus:outline-gray-800 transition-colors duration-200 flex items-center justify-center h-12 min-h-[44px] whitespace-nowrap text-center w-full sm:w-auto"
                aria-label="Connexion"
              >
                Connexion
              </button>
              <button
                class="rounded-[6px] border border-blue-800 text-blue-800 px-4 py-2 font-semibold hover:bg-blue-800 hover:text-white focus:outline focus:outline-2 focus:outline-blue-800 transition-colors duration-200 flex items-center justify-center h-12 min-h-[44px] whitespace-nowrap text-center w-full sm:w-auto"
                aria-label="Inscription"
              >
                Inscription
              </button>
            </template>
            <template v-else>
              <span class="px-2 py-2 text-gray-700 font-semibold flex items-center">
                {{ username }}
              </span>
              <button
                @click="userStore.logout()"
                class="rounded-[6px] border border-red-700 text-red-700 px-4 py-2 font-semibold hover:bg-red-700 hover:text-white focus:outline focus:outline-2 focus:outline-red-700 transition-colors duration-200 flex items-center justify-center h-12 min-h-[44px] whitespace-nowrap text-center w-full sm:w-auto"
                aria-label="Déconnexion"
              >
                Déconnexion
              </button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Alertes globales (success, erreur, info) -->
    <Alert
      v-if="alert"
      :type="alert.type"
      :message="alert.message"
      @close="alertStore.clear()"
      class="mb-4 container mx-auto"
    />

    <!-- Contenu principal (routé) -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Pied de page (footer) -->
    <footer class="bg-white text-[#263238] py-4 shadow-inner">
      <div
        class="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left"
      >
        <p class="mb-0">
          &copy; {{ new Date().getFullYear() }} Medisys - Système de gestion médicale
        </p>
        <div class="flex flex-col sm:flex-row gap-2 items-center">
          <RouterLink
            to="/mentions-legales"
            class="rounded-[6px] border border-blue-800 text-blue-800 px-4 py-1 font-semibold hover:bg-blue-800 hover:text-white focus:outline focus:outline-2 focus:outline-blue-800 transition-colors duration-200 text-center"
          >
            Mentions légales
          </RouterLink>
          <a
            href="mailto:contact@medisys.fr"
            class="rounded-[6px] border border-green-800 text-green-800 px-4 py-1 font-semibold hover:bg-green-800 hover:text-white focus:outline focus:outline-2 focus:outline-green-800 transition-colors duration-200 text-center"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
.font-sans {
  font-family: 'Roboto', Arial, sans-serif;
}
@media (max-width: 800px) and (min-width: 641px) {
  nav .flex .rounded-\[6px\] {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
    font-size: 0.95rem !important;
  }
}
@media (max-width: 767px) and (min-width: 641px) {
  nav .container {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
  nav .flex {
    gap: 0.25rem !important;
  }
  nav .text-2xl {
    margin-right: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
  nav .border-l {
    margin-left: 0.5rem !important;
    margin-right: 0.5rem !important;
  }
}
@media (max-width: 640px) {
  nav .flex .rounded-\[6px\] {
    font-size: 0.9rem !important;
    padding-left: 0.4rem !important;
    padding-right: 0.4rem !important;
  }
}
</style>
