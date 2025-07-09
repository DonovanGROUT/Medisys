<!--
  PatientCard.vue — Carte patient (affichage principal, accessible, modulaire)
  -----------------------------------------------------------------------------
  Composant Vue 3 pour l’affichage synthétique d’un patient.
  - Utilisé dans les listes, dashboards, ou vues patient
  - Accessibilité renforcée (icônes, aria-label, focus, contraste)
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
    - Icône de genre avec alternative visuelle
    - Boutons et liens avec aria-label explicite
    - Focus visible sur les actions
    - Contraste couleurs conforme WCAG AA

  Exemple d’utilisation :
    <PatientCard v-bind="patient" />
-->
<template>
  <!-- Carte principale du patient -->
  <div
    class="border rounded-[6px] p-4 bg-[#F5F5F5] text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 patient-card-root"
  >
    <!-- En-tête : icône genre + nom complet -->
    <div class="flex items-center justify-center gap-2 mb-2">
      <BaseIcon
        :name="sexe === 'F' ? 'female' : sexe === 'M' ? 'male' : 'transgender'"
        color="#1976D2"
        size="2em"
        class="bg-white rounded-full shadow p-1"
        :aria-label="sexe === 'F' ? 'Femme' : sexe === 'M' ? 'Homme' : 'Autre'"
      />
      <span class="sr-only">
        {{ sexe === 'F' ? 'Femme' : sexe === 'M' ? 'Homme' : 'Autre' }}
      </span>
      <span class="font-bold text-[#263238] text-lg"
        >{{ formatNom(nom) }} {{ formatPrenom(prenom) }}</span
      >
    </div>
    <!-- Informations principales -->
    <div class="text-base text-[#263238] mb-1">{{ birthDateFormatted }}</div>
    <div class="text-base text-[#263238] mb-1">{{ telephone }}</div>
    <div class="text-base text-[#263238] mb-1 patient-email">{{ email }}</div>
    <!-- Actions (slot ou fallback) -->
    <div class="flex flex-col gap-3 mt-4 text-center patient-card-actions">
      <slot name="actions">
        <!-- Actions par défaut (peuvent être remplacées par le parent) -->
        <router-link
          :to="`/patients/${id}`"
          class="rounded-[6px] border border-blue-800 text-blue-800 bg-white px-4 py-2 text-base font-semibold hover:bg-blue-800 hover:text-white transition-all duration-200 focus:outline focus:outline-2 focus:outline-blue-800 flex items-center justify-center gap-2"
          aria-label="Voir le patient"
        >
          <BaseIcon name="visibility" size="1.2em" class="mr-1 align-middle" aria-hidden="true" />
          Voir
        </router-link>
        <router-link
          to="#"
          class="rounded-[6px] bg-green-800 text-white px-4 py-2 text-base font-semibold hover:bg-green-900 focus:outline focus:outline-2 focus:outline-green-800 flex items-center justify-center transition-all duration-200 gap-2"
          aria-label="Modifier le patient"
          tabindex="-1"
        >
          <BaseIcon name="edit" size="1.2em" class="mr-1 align-middle" aria-hidden="true" />
          Modifier
        </router-link>
        <button
          disabled
          class="rounded-[6px] bg-red-800 text-white px-4 py-2 text-base font-semibold flex items-center justify-center transition-all duration-200 gap-2"
          aria-label="Supprimer le patient"
        >
          <BaseIcon name="delete" size="1.2em" class="mr-1 align-middle" aria-hidden="true" />
          Supprimer
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// Import du composant d’icône de base (Material Icons SVG)
// -----------------------------------------------------------------------------
import BaseIcon from './BaseIcon.vue';
import { computed } from 'vue';
import { formatNom, formatPrenom } from '../utils/formatNomPrenom';

// -----------------------------------------------------------------------------
// Définition des props typées (TypeScript)
// -----------------------------------------------------------------------------
/**
 * Props du composant PatientCard
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

<style scoped>
@media (max-width: 568px) and (min-width: 450px) {
  .patient-card-root {
    min-height: 220px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    height: 100% !important;
  }
  .patient-card-actions {
    margin-top: auto !important;
  }
}
@media (max-width: 569px) and (min-width: 451px) {
  .patient-email {
    font-size: 0.85rem !important;
    word-break: break-all !important;
    line-break: anywhere !important;
  }
}
@media (max-width: 450px) {
  .patient-email {
    font-size: 0.8rem !important;
    word-break: break-all !important;
    line-break: anywhere !important;
  }
}
</style>
