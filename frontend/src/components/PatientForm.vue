<!--
  PatientForm.vue — Formulaire patient (création/édition, accessible, réactif)
  -----------------------------------------------------------------------------
  Composant Vue 3 pour la saisie ou l’édition d’un patient.
  - Utilisé dans les modales ou pages de gestion patient
  - Accessibilité renforcée (ARIA, focus, contraste, erreurs associées)
  - Validation locale avancée (feedback immédiat, UX)
  - Props typées, événements explicites

  Props :
    - modelValue (PatientFormModel|null, optionnel) : valeurs initiales du formulaire (édition)
    - errors (Record<string, string>, optionnel) : erreurs à afficher (backend ou front)

  Events émis :
    - submit : soumission du formulaire (payload = PatientFormModel)
    - cancel : annulation de la saisie

  Accessibilité :
    - Labels associés aux champs (for/id)
    - Focus visible
    - Contraste couleurs conforme WCAG AA
    - Champs requis signalés par HTML5 et aria-required
    - Erreurs associées via aria-describedby et role=alert

  Exemple d’utilisation :
    <PatientForm :modelValue="patient" @submit="..." @cancel="..." />
-->
<template>
  <!-- Formulaire principal patient -->
  <form @submit.prevent="onSubmit" class="space-y-4" aria-label="Formulaire patient" novalidate>
    <!-- Bloc nom/prénom -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label for="lastName" class="block font-semibold mb-1"
          >Nom <span aria-hidden="true" class="text-red-600">*</span></label
        >
        <input
          v-model="form.nom"
          id="lastName"
          type="text"
          required
          maxlength="100"
          class="input"
          @input="validateField('nom')"
          aria-required="true"
          :aria-invalid="!!(localErrors.nom || (props.errors && props.errors.nom))"
          :aria-describedby="
            localErrors.nom || (props.errors && props.errors.nom) ? 'lastName-error' : undefined
          "
        />
        <div
          v-if="localErrors.nom || (props.errors && props.errors.nom)"
          class="text-red-600 text-sm mt-1"
          :id="'lastName-error'"
          role="alert"
        >
          {{ localErrors.nom || props.errors?.nom }}
        </div>
      </div>
      <div class="flex-1">
        <label for="firstName" class="block font-semibold mb-1"
          >Prénom <span aria-hidden="true" class="text-red-600">*</span></label
        >
        <input
          v-model="form.prenom"
          id="firstName"
          type="text"
          required
          maxlength="100"
          class="input"
          @input="validateField('prenom')"
          aria-required="true"
          :aria-invalid="!!(localErrors.prenom || (props.errors && props.errors.prenom))"
          :aria-describedby="
            localErrors.prenom || (props.errors && props.errors.prenom)
              ? 'firstName-error'
              : undefined
          "
        />
        <div
          v-if="localErrors.prenom || (props.errors && props.errors.prenom)"
          class="text-red-600 text-sm mt-1"
          :id="'firstName-error'"
          role="alert"
        >
          {{ localErrors.prenom || props.errors?.prenom }}
        </div>
      </div>
    </div>
    <!-- Bloc sexe/date de naissance -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label for="sexe" class="block font-semibold mb-1"
          >Sexe <span aria-hidden="true" class="text-red-600">*</span></label
        >
        <select
          v-model="form.sexe"
          id="sexe"
          required
          class="input"
          @change="validateField('sexe')"
          aria-required="true"
          :aria-invalid="!!(localErrors.sexe || (props.errors && props.errors.sexe))"
          :aria-describedby="
            localErrors.sexe || (props.errors && props.errors.sexe) ? 'sexe-error' : undefined
          "
        >
          <option value="">Sélectionner</option>
          <option value="F">Femme</option>
          <option value="M">Homme</option>
          <option value="X">Autre</option>
        </select>
        <div
          v-if="localErrors.sexe || (props.errors && props.errors.sexe)"
          class="text-red-600 text-sm mt-1"
          :id="'sexe-error'"
          role="alert"
        >
          {{ localErrors.sexe || props.errors?.sexe }}
        </div>
      </div>
      <div class="flex-1">
        <label for="dateNaissance" class="block font-semibold mb-1"
          >Date de naissance <span aria-hidden="true" class="text-red-600">*</span></label
        >
        <input
          v-model="form.dateNaissance"
          id="dateNaissance"
          type="date"
          required
          :max="new Date().toISOString().split('T')[0]"
          class="input"
          @input="validateField('dateNaissance')"
          aria-required="true"
          :aria-invalid="
            !!(localErrors.dateNaissance || (props.errors && props.errors.dateNaissance))
          "
          :aria-describedby="
            localErrors.dateNaissance || (props.errors && props.errors.dateNaissance)
              ? 'dateNaissance-error'
              : undefined
          "
        />
        <div
          v-if="localErrors.dateNaissance || (props.errors && props.errors.dateNaissance)"
          class="text-red-600 text-sm mt-1"
          :id="'dateNaissance-error'"
          role="alert"
        >
          {{ localErrors.dateNaissance || props.errors?.dateNaissance }}
        </div>
      </div>
    </div>
    <!-- Bloc téléphone/email -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label for="telephone" class="block font-semibold mb-1">Téléphone</label>
        <input
          v-model="form.telephone"
          id="telephone"
          type="tel"
          maxlength="20"
          pattern="^\\+?[0-9 .-]{8,20}$"
          class="input"
          @input="validateField('telephone')"
          aria-required="false"
          :aria-invalid="!!(localErrors.telephone || (props.errors && props.errors.telephone))"
          :aria-describedby="
            localErrors.telephone || (props.errors && props.errors.telephone)
              ? 'telephone-error'
              : undefined
          "
        />
        <div
          v-if="localErrors.telephone || (props.errors && props.errors.telephone)"
          class="text-red-600 text-sm mt-1"
          :id="'telephone-error'"
          role="alert"
        >
          {{ localErrors.telephone || props.errors?.telephone }}
        </div>
      </div>
      <div class="flex-1">
        <label for="email" class="block font-semibold mb-1"
          >Email <span aria-hidden="true" class="text-red-600">*</span></label
        >
        <input
          v-model="form.email"
          id="email"
          type="email"
          required
          maxlength="180"
          class="input"
          @input="validateField('email')"
          aria-required="true"
          :aria-invalid="!!(localErrors.email || (props.errors && props.errors.email))"
          :aria-describedby="
            localErrors.email || (props.errors && props.errors.email) ? 'email-error' : undefined
          "
        />
        <div
          v-if="localErrors.email || (props.errors && props.errors.email)"
          class="text-red-600 text-sm mt-1"
          :id="'email-error'"
          role="alert"
        >
          {{ localErrors.email || props.errors?.email }}
        </div>
      </div>
    </div>
    <!-- Actions -->
    <div class="flex justify-end gap-2 mt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="rounded-[6px] border border-[#263238] text-[#263238] px-4 py-2 font-semibold hover:bg-[#263238] hover:text-white transition-colors duration-200 focus:outline focus:outline-2 focus:outline-[#263238]"
        aria-label="Annuler la saisie"
      >
        Annuler
      </button>
      <button
        type="submit"
        :disabled="!isFormValid"
        class="rounded-[6px] border border-green-800 bg-green-800 text-white px-4 py-2 font-semibold hover:bg-green-900 transition-colors duration-200 focus:outline focus:outline-2 focus:outline-green-800 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Valider le formulaire patient"
      >
        <BaseIcon name="check" size="1.2em" class="mr-1 align-middle" /> Valider
      </button>
    </div>
    <div
      v-if="props.errors && props.errors.global"
      class="text-red-700 text-center font-semibold mb-2"
      id="form-global-error"
      role="alert"
      aria-live="assertive"
    >
      {{ props.errors.global }}
    </div>
  </form>
</template>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// Imports et typage : dépendances Vue et composant d’icône
// -----------------------------------------------------------------------------
import { reactive, watch, computed } from 'vue';
import BaseIcon from './BaseIcon.vue';

// -----------------------------------------------------------------------------
// Définition des props et événements (JSDoc Vue)
// -----------------------------------------------------------------------------
/**
 * Props du composant PatientForm
 * @prop {PatientFormModel|null} [modelValue] - Valeurs initiales (édition)
 * @prop {Record<string, string>} [errors] - Erreurs à afficher (backend/front)
 */
const emit = defineEmits(['submit', 'cancel']);
const props = defineProps<{
  modelValue?: PatientFormModel | null;
  errors?: Record<string, string>;
}>();

// -----------------------------------------------------------------------------
// Modèle de données du formulaire patient
// -----------------------------------------------------------------------------
/**
 * Modèle de données typé pour le formulaire patient
 */
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
// Validation locale avancée (feedback immédiat, UX)
// -----------------------------------------------------------------------------
const localErrors = reactive<Record<string, string>>({});

/**
 * Valide un champ du formulaire et met à jour les erreurs locales
 * @param {string} field - Nom du champ à valider
 */
function validateField(field: string) {
  switch (field) {
    case 'nom':
      localErrors.nom = form.nom.trim() ? '' : 'Le nom est requis.';
      break;
    case 'prenom':
      localErrors.prenom = form.prenom.trim() ? '' : 'Le prénom est requis.';
      break;
    case 'sexe':
      localErrors.sexe = ['F', 'M', 'X'].includes(form.sexe) ? '' : 'Le sexe est requis.';
      break;
    case 'dateNaissance':
      if (!form.dateNaissance) {
        localErrors.dateNaissance = 'La date de naissance est requise.';
      } else if (new Date(form.dateNaissance) > new Date()) {
        localErrors.dateNaissance = 'La date de naissance doit être dans le passé.';
      } else {
        localErrors.dateNaissance = '';
      }
      break;
    case 'email':
      if (!form.email) {
        localErrors.email = "L'email est requis.";
      } else if (!form.email.includes('@')) {
        localErrors.email = "L'email doit contenir un arobase (@).";
      } else if (!form.email.split('@')[1]?.includes('.')) {
        localErrors.email = "L'email doit contenir un point après l'arobase.";
      } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
        localErrors.email = "L'email est invalide.";
      } else {
        localErrors.email = '';
      }
      break;
    case 'telephone':
      if (form.telephone && !/^\+?[0-9 .-]{8,20}$/.test(form.telephone)) {
        localErrors.telephone =
          'Le téléphone doit contenir uniquement des chiffres, espaces, points ou tirets (8 à 20 caractères).';
      } else {
        localErrors.telephone = '';
      }
      break;
  }
}

/**
 * Valide tous les champs du formulaire
 */
function validateAll() {
  validateField('nom');
  validateField('prenom');
  validateField('sexe');
  validateField('dateNaissance');
  validateField('email');
  validateField('telephone');
}

const isFormValid = computed(() => {
  validateAll();
  return (
    !localErrors.nom &&
    !localErrors.prenom &&
    !localErrors.sexe &&
    !localErrors.dateNaissance &&
    !localErrors.email &&
    !localErrors.telephone &&
    form.nom.trim() &&
    form.prenom.trim() &&
    form.sexe &&
    form.dateNaissance
  );
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
    validateAll();
  },
  { immediate: true }
);

// -----------------------------------------------------------------------------
// Soumission du formulaire (émission de l’événement submit)
// -----------------------------------------------------------------------------
/**
 * Soumet le formulaire si valide, sinon affiche les erreurs
 */
function onSubmit() {
  validateAll();
  if (isFormValid.value) {
    emit('submit', { ...form });
  }
}
</script>

<style scoped>
.input {
  @apply w-full rounded-[6px] border border-[#B0BEC5] px-3 py-2 focus:outline focus:outline-2 focus:outline-[#1976D2] transition-colors duration-200;
}
</style>
