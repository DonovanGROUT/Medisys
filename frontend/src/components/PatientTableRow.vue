<!--
  -----------------------------------------------------------------------------
  Ligne de tableau patient (modulaire, accessible, responsive)
  -----------------------------------------------------------------------------
  Affiche les informations principales d’un patient sous forme de ligne de tableau.
  Utilisé dans la vue liste des patients (tableau principal).

  Props :
    - id (number|string) : identifiant unique du patient
    - gender (string) : genre ('M', 'F', ou autre)
    - lastName (string) : nom du patient
    - firstName (string) : prénom du patient
    - birthDate (string) : date de naissance (formatée)
    - phone (string) : numéro de téléphone
    - email (string) : adresse email

  Slots :
    - actions : permet d’injecter des boutons d’action personnalisés (édition, vue, suppression...)
      Si non fourni, des actions par défaut sont affichées.

  Accessibilité :
    - Boutons et liens avec aria-label explicite
    - Focus visible sur les actions
    - Colonnes masquées/adaptatives selon la largeur d’écran (responsive)
    - Contraste couleurs conforme WCAG AA

  Exemple d’utilisation :
    <PatientTableRow v-bind="patient" />

  -----------------------------------------------------------------------------
-->
<template>
  <!-- Ligne principale du tableau patient -->
  <tr>
    <td class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base">{{ id }}</td>
    <td class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base">{{ gender }}</td>
    <td class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base max-w-[100px] break-words">
      {{ lastName }}
    </td>
    <td class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base max-w-[100px] break-words">
      {{ firstName }}
    </td>
    <td
      class="px-2 py-2 sm:px-4 sm:py-2 min-[810px]:table-cell min-[640px]:hidden hidden text-sm sm:text-base"
    >
      {{ birthDate }}
    </td>
    <td class="px-2 py-2 sm:px-4 sm:py-2 xl:table-cell hidden text-sm sm:text-base">{{ phone }}</td>
    <td class="px-2 py-2 sm:px-4 sm:py-2 2xl:table-cell hidden text-sm sm:text-base">
      {{ email }}
    </td>
    <!-- Actions (slot ou fallback) -->
    <td class="px-2 py-2 sm:px-4 sm:py-2 flex flex-col min-[694px]:flex-row gap-2 justify-center">
      <slot name="actions">
        <!-- Actions par défaut (peuvent être remplacées par le parent) -->
        <router-link
          :to="`/patients/${id}`"
          class="rounded-[6px] bg-blue-800 text-white px-4 py-2 text-base font-semibold hover:bg-blue-900 focus:outline focus:outline-2 focus:outline-blue-800 text-center"
          aria-label="Voir le patient"
          >Voir</router-link
        >
        <router-link
          to="#"
          class="rounded-[6px] bg-green-800 text-white px-4 py-2 text-base font-semibold hover:bg-green-900 focus:outline focus:outline-2 focus:outline-green-800 text-center"
          aria-label="Modifier le patient"
          tabindex="-1"
          >Modifier</router-link
        >
        <button
          disabled
          class="rounded-[6px] bg-red-800 text-white px-4 py-2 text-base font-semibold text-center"
          aria-label="Supprimer le patient"
        >
          Supprimer
        </button>
      </slot>
    </td>
  </tr>
</template>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// Définition des props typées (TypeScript)
// -----------------------------------------------------------------------------
defineProps<{
  id: number | string;
  gender: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  phone: string;
  email: string;
}>();
</script>
