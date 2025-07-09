<!--
  PatientTableRow.vue — Ligne de tableau patient (affichage principal, accessible)
  -------------------------------------------------------------------------------
  Composant Vue 3 pour l’affichage d’un patient dans un tableau.
  - Utilisé dans la vue liste des patients (tableau principal)
  - Accessibilité renforcée (icônes, aria-label, focus, responsive)
  - Props typées, slot actions personnalisable

  Props :
    - id (number|string) : identifiant unique du patient
    - sexe (string) : genre ('M', 'F', ou autre)
    - nom (string) : nom du patient
    - prenom (string) : prénom du patient
    - dateNaissance (string) : date de naissance (formatée)
    - telephone (string) : numéro de téléphone
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
        :name="sexe === 'F' ? 'female' : sexe === 'M' ? 'male' : 'transgender'"
        color="#1976D2"
        size="1.5em"
        class="align-middle"
        :aria-label="sexe === 'F' ? 'Femme' : sexe === 'M' ? 'Homme' : 'Autre'"
      />
      <span class="sr-only">
        {{ sexe === 'F' ? 'Femme' : sexe === 'M' ? 'Homme' : 'Autre' }}
      </span>
    </td>
    <td class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base max-w-[100px] break-words">
      {{ formatNom(nom) }}
    </td>
    <td class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base max-w-[100px] break-words">
      {{ formatPrenom(prenom) }}
    </td>
    <td
      class="px-2 py-2 sm:px-4 sm:py-2 min-[810px]:table-cell min-[640px]:hidden hidden text-sm sm:text-base"
    >
      {{ birthDateFormatted }}
    </td>
    <td class="px-2 py-2 sm:px-4 sm:py-2 xl:table-cell hidden text-sm sm:text-base">
      {{ telephone }}
    </td>
    <td class="px-2 py-2 sm:px-4 sm:py-2 2xl:table-cell hidden text-sm sm:text-base">
      {{ email }}
    </td>
    <!-- Actions (slot ou fallback) -->
    <td class="px-2 py-2 sm:px-4 sm:py-2 flex flex-col min-[694px]:flex-row gap-2 justify-center">
      <slot name="actions">
        <!-- Actions par défaut (peuvent être remplacées par le parent) -->
        <router-link
          :to="`/patients/${id}`"
          class="rounded-[6px] border border-blue-800 text-blue-800 bg-white px-4 py-2 text-base font-semibold hover:bg-blue-800 hover:text-white transition-all duration-200 focus:outline focus:outline-2 focus:outline-blue-800 text-center flex items-center gap-2"
          aria-label="Voir le patient"
        >
          <BaseIcon name="visibility" size="1.1em" aria-hidden="true" /> Voir
        </router-link>
        <router-link
          to="#"
          class="rounded-[6px] bg-green-800 text-white px-4 py-2 text-base font-semibold hover:bg-green-900 focus:outline focus:outline-2 focus:outline-green-800 text-center flex items-center gap-2"
          aria-label="Modifier le patient"
          tabindex="-1"
        >
          <BaseIcon name="edit" size="1.1em" aria-hidden="true" /> Modifier
        </router-link>
        <button
          disabled
          class="rounded-[6px] bg-red-800 text-white px-4 py-2 text-base font-semibold text-center flex items-center gap-2"
          aria-label="Supprimer le patient"
        >
          <BaseIcon name="delete" size="1.1em" aria-hidden="true" /> Supprimer
        </button>
      </slot>
    </td>
  </tr>
</template>

<script setup lang="ts">
import BaseIcon from './BaseIcon.vue';
import { computed } from 'vue';
import { formatNom, formatPrenom } from '../utils/formatNomPrenom';

/**
 * Props du composant PatientTableRow
 * @prop {number|string} id - Identifiant unique du patient
 * @prop {string} sexe - Genre ('M', 'F', ou autre)
 * @prop {string} nom - Nom du patient
 * @prop {string} prenom - Prénom du patient
 * @prop {string} dateNaissance - Date de naissance (formatée)
 * @prop {string} telephone - Numéro de téléphone
 * @prop {string} email - Adresse email
 */
const props = defineProps<{
  id: number | string;
  sexe: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  email: string;
}>();

/**
 * Date de naissance formatée selon la langue du navigateur
 */
const birthDateFormatted = computed(() => {
  if (!props.dateNaissance) return '';
  const date = new Date(props.dateNaissance);
  // Format jj/mm/aaaa si navigateur français, sinon format local
  if (navigator.language.startsWith('fr')) {
    return date.toLocaleDateString('fr-FR');
  }
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
});
</script>
