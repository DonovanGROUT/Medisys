<!--
  -----------------------------------------------------------------------------
  Page d’accueil de l’application Medisys (responsive, accessible, harmonisée)
  -----------------------------------------------------------------------------
  Présente l’application, son identité visuelle, et les principales actions.
  Met en avant la sécurité, la rapidité et l’ergonomie pour les professionnels.

  Composants utilisés :
    - BaseIcon (icônes Material Icons)

  Accessibilité :
    - Images avec alt explicite
    - Boutons et liens accessibles (focus, aria-label)
    - Contraste couleurs conforme WCAG AA

  Exemple d’utilisation :
    Route / (page d’accueil)

  -----------------------------------------------------------------------------
-->
<template>
  <div class="max-w-5xl mx-auto mt-8 px-4">
    <!-- Titre centré sur toute la largeur, logo à droite du titre sur desktop, au-dessus sur mobile -->
    <div class="flex flex-col xs:flex-row items-center justify-center mb-8 gap-2 xs:gap-4">
      <h1 class="text-4xl font-bold text-blue-800 font-sans text-center order-2 xs:order-1">
        Bienvenue dans Medisys
      </h1>
      <BaseIcon name="medical_services" size="2.5em" class="text-blue-800 order-1 xs:order-2" />
    </div>
    <div
      class="bg-white rounded-[6px] shadow p-8 w-full flex flex-col md:flex-row items-center gap-8"
    >
      <!-- Colonne gauche : illustration + boutons -->
      <div class="flex-shrink-0 flex flex-col items-center w-full md:w-1/2 mb-8 md:mb-0">
        <img
          src="/medisys-illustration.svg"
          alt="Illustration médicale"
          class="w-48 md:w-64"
          width="192"
          height="192"
        />
        <div class="flex flex-col sm:flex-row gap-4 w-full justify-center mt-6">
          <router-link
            to="/patients"
            class="inline-block border border-blue-800 text-blue-800 px-6 py-2 rounded-[6px] font-semibold hover:bg-blue-800 hover:text-white focus:outline focus:outline-2 focus:outline-blue-800 transition-colors duration-200 text-center"
          >
            Voir les patients
          </router-link>
          <router-link
            to="/appointments"
            class="inline-block border border-green-800 text-green-800 px-6 py-2 rounded-[6px] font-semibold hover:bg-green-800 hover:text-white focus:outline focus:outline-2 focus:outline-green-800 transition-colors duration-200 text-center"
            aria-label="Prendre un rendez-vous"
          >
            Prendre un rendez-vous
          </router-link>
        </div>
      </div>
      <!-- Colonne droite : contenu principal -->
      <div class="flex-1 flex flex-col items-center w-full">
        <p class="text-lg mb-6 text-slate-800 font-sans text-center">
          Votre solution moderne et sécurisée pour la gestion médicale.
        </p>
        <div class="mt-8 w-full">
          <h2 class="text-2xl font-bold text-blue-800 mb-4 text-center">Pourquoi Medisys&nbsp;?</h2>
          <ul class="space-y-2 text-slate-700 text-base">
            <li class="flex items-center justify-center">
              <BaseIcon name="lock" class="text-green-800 mr-2" /> Sécurité des données
            </li>
            <li class="flex items-center justify-center">
              <BaseIcon name="bolt" class="text-blue-800 mr-2" /> Rapidité d’accès
            </li>
            <li class="flex items-center justify-center">
              <BaseIcon name="groups" class="text-green-800 mr-2" /> Pensé pour les professionnels
              de santé
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 529px) {
  .xs\:flex-row {
    flex-direction: row !important;
  }
  .xs\:gap-4 {
    gap: 1rem !important;
  }
  .xs\:order-1 {
    order: 1 !important;
  }
  .xs\:order-2 {
    order: 2 !important;
  }
  .order-1 {
    order: 1 !important;
  }
  .order-2 {
    order: 2 !important;
  }
  .flex-col {
    flex-direction: column !important;
  }
}
@media (min-width: 530px) {
  .xs\:flex-row {
    flex-direction: row !important;
  }
  .xs\:gap-4 {
    gap: 1rem !important;
  }
  .xs\:order-1 {
    order: 1 !important;
  }
  .xs\:order-2 {
    order: 2 !important;
  }
}
</style>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// Import du composant d’icône de base (Material Icons SVG)
// -----------------------------------------------------------------------------
import BaseIcon from '../components/BaseIcon.vue';
</script>
