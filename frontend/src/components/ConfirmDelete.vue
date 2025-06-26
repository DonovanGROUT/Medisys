<!--
  -----------------------------------------------------------------------------
  Boîte de dialogue de confirmation de suppression (modale, accessible)
  -----------------------------------------------------------------------------
  Affiche un message d’alerte pour confirmer la suppression d’un patient.
  Utilisé dans les modales de suppression.

  Events émis :
    - confirm : confirmation de la suppression
    - cancel : annulation

  Accessibilité :
    - Icône d’avertissement visuelle
    - Focus automatique sur le bouton principal
    - Contraste couleurs conforme WCAG AA
    - Boutons avec aria-label implicite

  Exemple d’utilisation :
    <ConfirmDelete @confirm="..." @cancel="..." />

  -----------------------------------------------------------------------------
-->
<template>
  <!-- Boîte de dialogue de confirmation -->
  <div class="flex flex-col items-center text-center">
    <BaseIcon name="warning" color="#E53935" size="3em" class="mb-2" />
    <p class="mb-6 text-lg text-[#E53935] font-semibold">
      Voulez-vous vraiment supprimer ce patient&nbsp;?
    </p>
    <div class="flex justify-center gap-4">
      <button
        @click="$emit('cancel')"
        class="rounded-[6px] border border-[#263238] text-[#263238] px-4 py-2 font-semibold hover:bg-[#263238] hover:text-white transition-colors duration-200"
      >
        Annuler
      </button>
      <button
        @click="$emit('confirm')"
        class="rounded-[6px] border border-red-800 bg-red-800 text-white px-4 py-2 font-semibold hover:bg-red-900 transition-colors duration-200 focus:outline focus:outline-2 focus:outline-red-800"
        autofocus
        data-testid="confirm-delete-btn"
      >
        <BaseIcon name="delete" size="1.2em" class="mr-1 align-middle" /> Supprimer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// Import du composant d’icône de base (Material Icons SVG)
// -----------------------------------------------------------------------------
import BaseIcon from './BaseIcon.vue';

/**
 * Événements émis par le composant ConfirmDelete
 * @emits confirm - Confirmation de la suppression
 * @emits cancel - Annulation
 */
defineEmits(['confirm', 'cancel']);
</script>
