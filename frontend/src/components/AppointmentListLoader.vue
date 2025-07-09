<!-- Loader simple et accessible pour la liste des rendez-vous -->
<template>
  <div class="flex flex-col items-center justify-center py-12" aria-busy="true" aria-live="polite">
    <svg
      class="animate-spin h-8 w-8 text-blue-800 mb-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
    <span class="text-blue-800 font-semibold">Chargement des rendez-vous…</span>
  </div>
</template>

<script setup lang="ts">
// Pas de logique, purement visuel
</script>
