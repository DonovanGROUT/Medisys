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

// Store d’alertes globales (Pinia)
const alertStore = useAlertStore();
const { alert } = storeToRefs(alertStore);
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F5F5F5] font-sans">
    <!-- Barre de navigation principale -->
    <nav class="bg-white shadow mb-8">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <RouterLink to="/" class="text-2xl font-bold text-blue-800">Medisys</RouterLink>
        <div class="flex gap-2">
          <RouterLink
            to="/"
            class="rounded-[6px] border border-blue-800 text-blue-800 px-4 py-2 font-semibold hover:bg-blue-800 hover:text-white focus:outline focus:outline-2 focus:outline-blue-800 transition-colors duration-200"
            aria-label="Accueil"
          >
            Accueil
          </RouterLink>
          <RouterLink
            to="/patients"
            class="rounded-[6px] border border-green-800 text-green-800 px-4 py-2 font-semibold hover:bg-green-800 hover:text-white focus:outline focus:outline-2 focus:outline-green-800 transition-colors duration-200"
            aria-label="Patients"
          >
            Patients
          </RouterLink>
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
    <footer class="bg-white text-[#263238] py-4 mt-8 shadow-inner">
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
</style>
