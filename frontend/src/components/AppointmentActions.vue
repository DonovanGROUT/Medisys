<!--
  AppointmentActions.vue — Groupe de boutons d’action rendez-vous (modulaire, accessible)
  -----------------------------------------------------------------------------
  Affiche un ensemble de boutons pour agir sur un rendez-vous (voir, modifier, supprimer).
  Utilisé dans les tableaux ou listes rendez-vous.

  Events émis :
    - view : demande d’affichage du rendez-vous
    - edit : demande d’édition du rendez-vous
    - delete : demande de suppression du rendez-vous

  Accessibilité :
    - aria-label explicite sur chaque bouton
    - Focus visible
    - Contraste couleurs conforme WCAG AA

  Exemple d’utilisation :
    <AppointmentActions @view="..." @edit="..." @delete="..." />
-->
<template>
  <!-- Empilement vertical et étirement sur mobile <569px -->
  <div
    class="flex flex-row gap-2 mt-2 text-center justify-center overflow-x-hidden min-[942px]:flex-row min-[942px]:gap-2 min-[942px]:justify-center min-[804px]:max-[941px]:flex-col min-[804px]:max-[941px]:gap-1 min-[804px]:max-[941px]:items-stretch min-[569px]:max-[803px]:flex-col min-[569px]:max-[803px]:gap-2 min-[569px]:max-[803px]:items-stretch max-[568px]:flex-col max-[568px]:items-stretch"
  >
    <button
      @click="$emit('view')"
      class="rounded-[6px] bg-blue-800 text-white px-2 py-2 text-base font-semibold hover:bg-blue-900 focus:outline focus:outline-2 focus:outline-blue-800 text-center w-full min-h-[44px] min-[569px]:max-[803px]:px-1"
      aria-label="Voir le rendez-vous"
    >
      Voir
    </button>
    <button
      @click="$emit('edit')"
      class="rounded-[6px] bg-green-800 text-white px-2 py-2 text-base font-semibold hover:bg-green-900 focus:outline focus:outline-2 focus:outline-green-800 text-center w-full min-h-[44px] min-[569px]:max-[803px]:px-1"
      aria-label="Modifier le rendez-vous"
    >
      Modifier
    </button>
    <button
      @click="$emit('delete')"
      class="rounded-[6px] bg-red-800 text-white px-2 py-2 text-base font-semibold hover:bg-red-900 focus:outline focus:outline-2 focus:outline-red-800 text-center w-full min-h-[44px] min-[569px]:max-[803px]:px-1"
      aria-label="Supprimer le rendez-vous"
    >
      Supprimer
    </button>
  </div>
</template>

<script setup lang="ts">
// Pas de props nécessaires
</script>

<style scoped></style>
