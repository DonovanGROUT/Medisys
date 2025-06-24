<!--
  -----------------------------------------------------------------------------
  Formulaire patient (création/édition, modulaire, accessible, réactif)
  -----------------------------------------------------------------------------
  Affiche un formulaire pour saisir ou éditer les informations d’un patient.
  Utilisé dans les modales ou pages de gestion patient.

  Props :
    - modelValue (PatientFormModel|null, optionnel) : valeurs initiales du formulaire (édition)

  Events émis :
    - submit : soumission du formulaire (payload = PatientFormModel)
    - cancel : annulation de la saisie

  Accessibilité :
    - Labels associés aux champs (for/id)
    - Focus visible
    - Contraste couleurs conforme WCAG AA
    - Champs requis signalés par HTML5

  Exemple d’utilisation :
    <PatientForm :modelValue="patient" @submit="..." @cancel="..." />

  -----------------------------------------------------------------------------
-->
<template>
  <!-- Formulaire principal patient -->
  <form @submit.prevent="onSubmit" class="space-y-4">
    <!-- Bloc nom/prénom -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label for="lastName" class="block font-semibold mb-1">Nom</label>
        <input v-model="form.nom" id="lastName" type="text" required class="input" />
      </div>
      <div class="flex-1">
        <label for="firstName" class="block font-semibold mb-1">Prénom</label>
        <input v-model="form.prenom" id="firstName" type="text" required class="input" />
      </div>
    </div>
    <!-- Bloc sexe/date de naissance -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label for="sexe" class="block font-semibold mb-1">Sexe</label>
        <select v-model="form.sexe" id="sexe" required class="input">
          <option value="">Sélectionner</option>
          <option value="F">Femme</option>
          <option value="M">Homme</option>
          <option value="X">Autre</option>
        </select>
      </div>
      <div class="flex-1">
        <label for="dateNaissance" class="block font-semibold mb-1">Date de naissance</label>
        <input v-model="form.dateNaissance" id="dateNaissance" type="date" required class="input" />
      </div>
    </div>
    <!-- Bloc téléphone/email -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label for="telephone" class="block font-semibold mb-1">Téléphone</label>
        <input v-model="form.telephone" id="telephone" type="tel" class="input" />
      </div>
      <div class="flex-1">
        <label for="email" class="block font-semibold mb-1">Email</label>
        <input v-model="form.email" id="email" type="email" class="input" />
      </div>
    </div>
    <!-- Actions -->
    <div class="flex justify-end gap-2 mt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="rounded-[6px] border border-[#263238] text-[#263238] px-4 py-2 font-semibold hover:bg-[#263238] hover:text-white transition-colors duration-200 focus:outline focus:outline-2 focus:outline-[#263238]"
      >
        Annuler
      </button>
      <button
        type="submit"
        class="rounded-[6px] border border-green-800 bg-green-800 text-white px-4 py-2 font-semibold hover:bg-green-900 transition-colors duration-200 focus:outline focus:outline-2 focus:outline-green-800 flex items-center justify-center"
      >
        <BaseIcon name="check" size="1.2em" class="mr-1 align-middle" /> Valider
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// Imports et typage
// -----------------------------------------------------------------------------
import { reactive, watch } from 'vue';
import BaseIcon from './BaseIcon.vue';

// -----------------------------------------------------------------------------
// Définition des props et événements
// -----------------------------------------------------------------------------
const props = defineProps<{
  modelValue?: PatientFormModel | null;
}>();
const emit = defineEmits(['submit', 'cancel']);

// -----------------------------------------------------------------------------
// Modèle de données du formulaire patient
// -----------------------------------------------------------------------------
export interface PatientFormModel {
  id?: number;
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: string;
  telephone?: string;
  email?: string;
}

// -----------------------------------------------------------------------------
// Initialisation du formulaire (réactif)
// -----------------------------------------------------------------------------
const form = reactive<PatientFormModel>({
  nom: '',
  prenom: '',
  sexe: '',
  dateNaissance: '',
  telephone: '',
  email: '',
});

// -----------------------------------------------------------------------------
// Synchronisation du formulaire avec la prop modelValue (édition)
// -----------------------------------------------------------------------------
watch(
  () => props.modelValue,
  (val) => {
    if (val) Object.assign(form, val);
    else
      Object.assign(form, {
        nom: '',
        prenom: '',
        sexe: '',
        dateNaissance: '',
        telephone: '',
        email: '',
      });
  },
  { immediate: true }
);

// -----------------------------------------------------------------------------
// Soumission du formulaire
// -----------------------------------------------------------------------------
function onSubmit() {
  emit('submit', { ...form });
}
</script>

<style scoped>
.input {
  @apply w-full rounded-[6px] border border-[#B0BEC5] px-3 py-2 focus:outline focus:outline-2 focus:outline-[#1976D2] transition-colors duration-200;
}
</style>
