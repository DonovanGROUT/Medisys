<!--
  PatientAutocomplete.vue — Champ de recherche patient avec suggestions dynamiques, navigation clavier, accessibilité
  Réutilisable partout où l’on souhaite sélectionner un patient (formulaire, filtre, etc.)
-->
<template>
  <div class="relative">
    <input
      v-model="search"
      :placeholder="placeholder"
      class="border rounded px-2 py-1 w-full"
      autocomplete="off"
      @input="onInput"
      @keydown="onKeydown"
      aria-autocomplete="list"
      :aria-controls="suggestions.length > 0 && search ? 'patient-suggestions' : undefined"
      v-bind="
        suggestions.length > 0 && search && activeSuggestion >= 0
          ? { 'aria-activedescendant': 'patient-suggestion-' + activeSuggestion }
          : {}
      "
      :disabled="disabled"
      :id="props.id || 'patient-search'"
      :name="props.id || 'patient-search'"
    />
    <ul
      v-if="suggestions.length > 0 && search"
      id="patient-suggestions"
      class="border rounded bg-white mt-1 max-h-60 overflow-auto absolute left-0 right-0 z-10"
      role="listbox"
    >
      <li
        v-for="(patient, index) in suggestions"
        :key="patient.id"
        @mousedown.prevent="select(patient)"
        :class="[
          'px-2 py-1 cursor-pointer',
          activeSuggestion === index ? 'bg-blue-100 font-bold' : 'hover:bg-blue-100',
        ]"
        role="option"
        :id="'patient-suggestion-' + index"
        :aria-selected="selectedPatient && selectedPatient.id === patient.id ? 'true' : 'false'"
      >
        {{ formatNom(patient.nom) }} {{ formatPrenom(patient.prenom) }}
        <span v-if="patient.dateNaissance" class="text-xs text-gray-400 ml-2">
          ({{ formatDateFr(patient.dateNaissance) }})
        </span>
      </li>
    </ul>
    <div v-if="loading" class="text-sm text-gray-500">Chargement...</div>
    <div v-if="notFound && search.length >= 2" class="text-sm text-red-500 flex items-center gap-2">
      Aucun patient trouvé
      <router-link
        to="/patients"
        class="rounded-[6px] border border-blue-800 text-blue-800 bg-white px-4 py-2 font-semibold hover:bg-blue-800 hover:text-white transition-all duration-200 focus:outline focus:outline-2 focus:outline-blue-800 flex items-center gap-2 ml-2"
        aria-label="Ajouter un patient"
      >
        <BaseIcon name="add" size="1.2em" aria-hidden="true" />
        Ajouter un patient
      </router-link>
    </div>
    <div
      v-if="selectedPatient && !suggestions.length"
      class="text-xs text-green-700 mt-1 mb-1 w-full min-h-[24px] flex items-center"
    >
      Patient sélectionné : {{ formatNom(selectedPatient.nom) }}
      {{ formatPrenom(selectedPatient.prenom) }}
      <button
        type="button"
        @click="reset"
        class="ml-2 text-gray-500 hover:text-red-600 text-lg font-bold px-2"
        aria-label="Changer de patient sélectionné"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { fetchPatients } from '../services/patientService';
import { formatNom, formatPrenom } from '../utils/formatNomPrenom';
import type { Patient } from '../types/Patient';

function formatDateFr(date: string): string {
  if (!date) return '';
  // date attendue au format aaaa-mm-jj
  const [y, m, d] = date.split('-');
  if (!y || !m || !d) return date;
  return `${d}/${m}/${y}`;
}

const props = defineProps<{
  modelValue?: Patient | null;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: Patient | null): void;
}>();

const search = ref('');
const suggestions = ref<Patient[]>([]);
const loading = ref(false);
const notFound = ref(false);
const activeSuggestion = ref(-1);
const selectedPatient = ref<Patient | null>(props.modelValue ?? null);

watch(
  () => props.modelValue,
  (val) => {
    selectedPatient.value = val ?? null;
    if (val) {
      search.value = formatNom(val.nom) + ' ' + formatPrenom(val.prenom);
      suggestions.value = [];
    }
  }
);

function reset() {
  selectedPatient.value = null;
  search.value = '';
  suggestions.value = [];
  emit('update:modelValue', null);
}

async function onInput() {
  if (selectedPatient.value) return;
  const val = search.value.trim();
  if (val.length < 2) {
    suggestions.value = [];
    notFound.value = false;
    return;
  }
  loading.value = true;
  try {
    const all = await fetchPatients();
    suggestions.value = all.filter(
      (p) =>
        typeof p.id === 'number' &&
        ((p.nom + ' ' + p.prenom).toLowerCase().includes(val.toLowerCase()) ||
          (p.prenom + ' ' + p.nom).toLowerCase().includes(val.toLowerCase()))
    );
    notFound.value = suggestions.value.length === 0;
    activeSuggestion.value = suggestions.value.length ? 0 : -1;
  } catch (e) {
    suggestions.value = [];
    notFound.value = false;
    // Optionnel : afficher un message d'erreur utilisateur
  } finally {
    loading.value = false;
  }
}

function select(patient: Patient) {
  selectedPatient.value = patient;
  search.value = formatNom(patient.nom) + ' ' + formatPrenom(patient.prenom);
  suggestions.value = [];
  emit('update:modelValue', patient);
}

function onKeydown(e: KeyboardEvent) {
  if (!suggestions.value.length || selectedPatient.value) return;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeSuggestion.value = (activeSuggestion.value + 1) % suggestions.value.length;
    scrollToActiveSuggestion();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeSuggestion.value =
      (activeSuggestion.value - 1 + suggestions.value.length) % suggestions.value.length;
    scrollToActiveSuggestion();
  } else if (e.key === 'Enter' && activeSuggestion.value >= 0) {
    e.preventDefault();
    select(suggestions.value[activeSuggestion.value]);
    activeSuggestion.value = -1;
  } else if (e.key === 'Escape') {
    suggestions.value = [];
  }
}
function scrollToActiveSuggestion() {
  nextTick(() => {
    const el = document.getElementById('patient-suggestion-' + activeSuggestion.value);
    if (el) el.scrollIntoView({ block: 'nearest' });
  });
}

defineExpose({ reset });
</script>
