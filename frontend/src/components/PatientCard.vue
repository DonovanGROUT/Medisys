<!--
  -----------------------------------------------------------------------------
  Composant carte patient (modulaire, accessible, responsive)
  -----------------------------------------------------------------------------
  Affiche les informations principales d’un patient sous forme de carte stylisée.
  Utilisé dans la liste des patients ou ailleurs pour présenter un patient de façon
  compacte et visuelle.

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
    - Icône de genre avec alternative visuelle
    - Boutons et liens avec aria-label explicite
    - Focus visible sur les actions
    - Contraste couleurs conforme WCAG AA

  Exemple d’utilisation :
    <PatientCard v-bind="patient" />

  -----------------------------------------------------------------------------
-->
<template>
  <!-- Carte principale du patient -->
  <div
    class="border rounded-[6px] p-4 bg-[#F5F5F5] text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
  >
    <!-- En-tête : icône genre + nom complet -->
    <div class="flex items-center justify-center gap-2 mb-2">
      <BaseIcon
        :name="gender === 'F' ? 'female' : gender === 'M' ? 'male' : 'transgender'"
        color="#1976D2"
        size="2em"
        class="bg-white rounded-full shadow p-1"
      />
      <span class="font-bold text-[#263238] text-lg">{{ lastName }} {{ firstName }}</span>
    </div>
    <!-- Informations principales -->
    <div class="text-base text-[#263238] mb-1">{{ birthDate }}</div>
    <div class="text-base text-[#263238] mb-1">{{ phone }}</div>
    <div class="text-base text-[#263238] mb-1">{{ email }}</div>
    <!-- Actions (slot ou fallback) -->
    <div class="flex flex-col gap-3 mt-4 text-center">
      <slot name="actions">
        <!-- Actions par défaut (peuvent être remplacées par le parent) -->
        <router-link
          :to="`/patients/${id}`"
          class="rounded-[6px] bg-[#1976D2] text-white px-4 py-2 text-base font-semibold hover:bg-[#115293] focus:outline focus:outline-2 focus:outline-[#1976D2] flex items-center justify-center transition-all duration-200"
          aria-label="Voir le patient"
        >
          <BaseIcon name="visibility" size="1.2em" class="mr-1 align-middle" /> Voir
        </router-link>
        <router-link
          to="#"
          class="rounded-[6px] bg-green-800 text-white px-4 py-2 text-base font-semibold hover:bg-green-900 focus:outline focus:outline-2 focus:outline-green-800 flex items-center justify-center transition-all duration-200"
          aria-label="Modifier le patient"
          tabindex="-1"
        >
          <BaseIcon name="edit" size="1.2em" class="mr-1 align-middle" /> Modifier
        </router-link>
        <button
          disabled
          class="rounded-[6px] bg-red-800 text-white px-4 py-2 text-base font-semibold flex items-center justify-center transition-all duration-200"
          aria-label="Supprimer le patient"
        >
          <BaseIcon name="delete" size="1.2em" class="mr-1 align-middle" /> Supprimer
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
