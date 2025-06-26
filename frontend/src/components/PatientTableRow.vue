<!--
  PatientTableRow.vue — Ligne de tableau patient (affichage principal, accessible)
  -------------------------------------------------------------------------------
  Composant Vue 3 pour l’affichage d’un patient dans un tableau.
  - Utilisé dans la vue liste des patients (tableau principal)
  - Accessibilité renforcée (icônes, aria-label, focus, responsive)
  - Props typées, slot actions personnalisable

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
-->
<template>
  <!-- Ligne principale du tableau patient -->
  <tr>
    <td class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base">{{ id }}</td>
    <td class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base">
      <BaseIcon
        :name="gender === 'F' ? 'female' : gender === 'M' ? 'male' : 'transgender'"
        color="#1976D2"
        size="1.5em"
        class="align-middle"
        :aria-label="gender === 'F' ? 'Femme' : gender === 'M' ? 'Homme' : 'Autre'"
      />
      <span class="sr-only">
        {{ gender === 'F' ? 'Femme' : gender === 'M' ? 'Homme' : 'Autre' }}
      </span>
    </td>
    <td class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base max-w-[100px] break-words">
      {{ lastName }}
    </td>
    <td class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base max-w-[100px] break-words">
      {{ firstName }}
    </td>
    <td
      class="px-2 py-2 sm:px-4 sm:py-2 min-[810px]:table-cell min-[640px]:hidden hidden text-sm sm:text-base"
    >
      {{ birthDateFormatted }}
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
import BaseIcon from './BaseIcon.vue';
import { computed } from 'vue';

/**
 * Props du composant PatientTableRow
 * @prop {number|string} id - Identifiant unique du patient
 * @prop {string} gender - Genre ('M', 'F', ou autre)
 * @prop {string} lastName - Nom du patient
 * @prop {string} firstName - Prénom du patient
 * @prop {string} birthDate - Date de naissance (formatée)
 * @prop {string} phone - Numéro de téléphone
 * @prop {string} email - Adresse email
 */
const props = defineProps<{
  id: number | string;
  gender: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  phone: string;
  email: string;
}>();

/**
 * Date de naissance formatée selon la langue du navigateur
 */
const birthDateFormatted = computed(() => {
  if (!props.birthDate) return '';
  const date = new Date(props.birthDate);
  // Format jj/mm/aaaa si navigateur français, sinon format local
  if (navigator.language.startsWith('fr')) {
    return date.toLocaleDateString('fr-FR');
  }
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
});
</script>
