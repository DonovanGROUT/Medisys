<!--
  -----------------------------------------------------------------------------
  Groupe de boutons d’action patient (modulaire, accessible, réutilisable)
  -----------------------------------------------------------------------------
  Affiche un ensemble de boutons pour agir sur un patient (voir, modifier, supprimer).
  Utilisé dans les cartes, tableaux ou vues patient.

  Props :
    - deleteDisabled (boolean, optionnel) : désactive le bouton supprimer si true

  Events émis :
    - view : demande d’affichage du patient
    - edit : demande d’édition du patient
    - delete : demande de suppression du patient

  Accessibilité :
    - aria-label explicite sur chaque bouton
    - Focus visible
    - Contraste couleurs conforme WCAG AA

  Exemple d’utilisation :
    <PatientActions @view="..." @edit="..." @delete="..." :deleteDisabled="true" />

  -----------------------------------------------------------------------------
-->
<template>
  <!-- Groupe de boutons d’action patient -->
  <div class="flex flex-col gap-3 mt-4 text-center sm:mt-0 sm:flex-row sm:gap-2 sm:justify-center">
    <button
      @click="$emit('view')"
      class="rounded-[6px] bg-blue-800 text-white px-4 py-2 text-base font-semibold hover:bg-blue-900 focus:outline focus:outline-2 focus:outline-blue-800 text-center"
      aria-label="Voir le patient"
    >
      Voir
    </button>
    <button
      @click="$emit('edit')"
      class="rounded-[6px] bg-green-800 text-white px-4 py-2 text-base font-semibold hover:bg-green-900 focus:outline focus:outline-2 focus:outline-green-800 text-center"
      aria-label="Modifier le patient"
      data-testid="edit-patient-btn"
    >
      Modifier
    </button>
    <button
      @click="$emit('delete')"
      :disabled="deleteDisabled"
      class="rounded-[6px] bg-red-800 text-white px-4 py-2 text-base font-semibold text-center"
      aria-label="Supprimer le patient"
      data-testid="delete-patient-btn"
    >
      Supprimer
    </button>
  </div>
</template>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// Définition des props typées (TypeScript)
// -----------------------------------------------------------------------------
defineProps<{
  deleteDisabled?: boolean;
}>();
// -----------------------------------------------------------------------------
// Définition des événements émis
// -----------------------------------------------------------------------------
defineEmits(['view', 'edit', 'delete']);
</script>
