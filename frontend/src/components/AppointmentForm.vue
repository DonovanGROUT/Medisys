<!--
  AppointmentForm.vue — Formulaire rendez-vous (création, accessible, réactif)
  -----------------------------------------------------------------------------
  Composant Vue 3 pour la saisie d’un rendez-vous.
  - Utilisé dans la modale de création de rendez-vous
  - Accessibilité renforcée (ARIA, focus, contraste, erreurs associées)
  - Validation locale (feedback immédiat, UX)
  - Props typées, événements explicites

  Events émis :
    - close : fermeture de la modale
    - created : rendez-vous créé (rafraîchit la liste)

  Accessibilité :
    - Labels associés aux champs (for/id)
    - Focus visible
    - Contraste couleurs conforme WCAG AA
    - Champs requis signalés par HTML5 et aria-required

  Exemple d’utilisation :
    <AppointmentForm @close="..." @created="..." />
-->
<template>
  <form @submit.prevent="submit" novalidate aria-label="Formulaire rendez-vous">
    <div class="mb-3">
      <label class="block mb-1" for="motif">Motif</label>
      <input
        v-model="form.motif"
        name="motif"
        id="motif"
        class="border rounded px-2 py-1 w-full"
        required
        :aria-invalid="!!errors.motif"
        :aria-describedby="errors.motif ? 'motif-error' : undefined"
        @input="validateField('motif')"
      />
      <div v-if="errors.motif" class="text-red-600 text-sm mt-1" id="motif-error" role="alert">
        {{ errors.motif }}
      </div>
    </div>
    <div class="mb-3 flex gap-2">
      <div class="w-1/2">
        <label class="block mb-1" for="date">Date</label>
        <input
          v-model="form.date"
          type="date"
          name="date"
          id="date"
          class="border rounded px-2 py-1 w-full"
          required
          :aria-invalid="!!errors.date"
          :aria-describedby="errors.date ? 'date-error' : undefined"
          @input="validateField('date')"
        />
        <div v-if="errors.date" class="text-red-600 text-sm mt-1" id="date-error" role="alert">
          {{ errors.date }}
        </div>
      </div>
      <div class="w-1/2">
        <label class="block mb-1" for="heure">Heure</label>
        <input
          v-model="form.heure"
          type="time"
          name="heure"
          id="heure"
          class="border rounded px-2 py-1 w-full"
          required
          :aria-invalid="!!errors.heure"
          :aria-describedby="errors.heure ? 'heure-error' : undefined"
          @input="validateField('heure')"
        />
        <div v-if="errors.heure" class="text-red-600 text-sm mt-1" id="heure-error" role="alert">
          {{ errors.heure }}
        </div>
      </div>
    </div>
    <div class="mb-3">
      <label class="block mb-1" for="duree">Durée (minutes)</label>
      <input
        v-model.number="form.duree"
        type="number"
        min="1"
        name="duree"
        id="duree"
        class="border rounded px-2 py-1 w-full"
        required
        :aria-invalid="!!errors.duree"
        :aria-describedby="errors.duree ? 'duree-error' : undefined"
        @input="validateField('duree')"
      />
      <div v-if="errors.duree" class="text-red-600 text-sm mt-1" id="duree-error" role="alert">
        {{ errors.duree }}
      </div>
    </div>
    <div class="mb-3">
      <label class="block mb-1" for="patient-autocomplete">Patient</label>
      <PatientAutocomplete
        v-model="selectedPatient"
        placeholder="Rechercher un patient"
        :disabled="isEdit && !!props.modelValue"
        id="patient-autocomplete"
      />
      <div
        v-if="errors.patientId"
        class="text-red-600 text-sm mt-1"
        id="patientId-error"
        role="alert"
      >
        {{ errors.patientId }}
      </div>
    </div>
    <div class="mb-3">
      <label class="block mb-1" for="statut">Statut</label>
      <select
        v-model="form.statut"
        name="statut"
        id="statut"
        class="border rounded px-2 py-1 w-full"
        required
        :aria-invalid="!!errors.statut"
        :aria-describedby="errors.statut ? 'statut-error' : undefined"
        @change="validateField('statut')"
      >
        <option
          v-for="opt in statutOptions"
          :key="opt.value"
          :value="opt.value"
          :disabled="
            (opt.value === 'completed' && !isPast) || (opt.value === 'scheduled' && !isDateFuture)
          "
        >
          {{ opt.label }}
        </option>
      </select>
      <div v-if="errors.statut" class="text-red-600 text-sm mt-1" id="statut-error" role="alert">
        {{ errors.statut }}
      </div>
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <button
        type="button"
        @click="$emit('close')"
        class="rounded-[6px] border border-[#263238] text-[#263238] px-4 py-2 font-semibold hover:bg-[#263238] hover:text-white transition-all duration-200 focus:outline focus:outline-2 focus:outline-[#263238]"
        aria-label="Annuler la saisie"
      >
        Annuler
      </button>
      <button
        type="submit"
        class="rounded-[6px] border border-green-800 bg-green-800 text-white px-4 py-2 font-semibold hover:bg-green-900 transition-all duration-200 focus:outline focus:outline-2 focus:outline-green-800 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Valider le formulaire rendez-vous"
        :disabled="!isFormValid"
      >
        <BaseIcon name="check" size="1.2em" class="mr-1 align-middle" />
        Valider
      </button>
    </div>
    <div
      v-if="errors.global"
      class="text-red-700 text-center font-semibold mb-2"
      id="form-global-error"
      role="alert"
      aria-live="assertive"
    >
      {{ errors.global }}
    </div>
  </form>
</template>

<script setup lang="ts">
import PatientAutocomplete from './PatientAutocomplete.vue';
import BaseIcon from './BaseIcon.vue';
import { ref, computed, watch, nextTick } from 'vue';
import { createAppointment, updateAppointment } from '../services/appointmentApi';
import { formatNom, formatPrenom } from '../utils/formatNomPrenom';
import type { Patient } from '../types/Patient';
import { useAlertStore } from '../stores/alert';

const props = defineProps<{ modelValue?: Record<string, unknown> }>();
const emit = defineEmits(['close', 'created']);

const form = ref({
  motif: '',
  date: '',
  heure: '',
  duree: 30,
  patientId: undefined as number | undefined,
  patientNom: '',
  statut: 'scheduled' as 'scheduled' | 'cancelled' | 'completed',
});

// Pré-remplissage si modelValue fourni (édition)
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      let dateHeure = val.dateHeure || '';
      let date = '',
        heure = '';
      // Exemple pour la ligne 136 :
      // if (typeof dateHeure === 'string' && dateHeure.includes('T')) {
      //   [date, heure] = dateHeure.split('T');
      // }
      // Pour les autres accès (val.motif, val.duree, val.patient?.id, etc.), vérifier le type avant d'accéder à la propriété.
      if (typeof dateHeure === 'string' && dateHeure.includes('T')) {
        [date, heure] = dateHeure.split('T');
        heure = heure?.slice(0, 5) || '';
      }
      form.value = {
        motif: typeof val.motif === 'string' ? val.motif : '',
        date,
        heure,
        duree: typeof val.duree === 'number' ? val.duree : 30,
        patientId:
          typeof val.patient === 'object' &&
          val.patient !== null &&
          'id' in val.patient &&
          typeof (val.patient as Partial<Patient>).id === 'number'
            ? (val.patient as Partial<Patient>).id
            : undefined,
        patientNom:
          typeof val.patient === 'object' &&
          val.patient !== null &&
          'prenom' in val.patient &&
          'nom' in val.patient
            ? ((val.patient as Partial<Patient>).prenom || '') +
              ' ' +
              ((val.patient as Partial<Patient>).nom || '')
            : '',
        statut:
          typeof val.statut === 'string' &&
          ['scheduled', 'cancelled', 'completed'].includes(val.statut)
            ? (val.statut as 'scheduled' | 'cancelled' | 'completed')
            : 'scheduled',
      };
    }
  },
  { immediate: true }
);

const statutOptions = [
  { value: 'scheduled', label: 'Prévu' },
  { value: 'cancelled', label: 'Annulé' },
  { value: 'completed', label: 'Terminé' },
];

const isPast = computed(() => {
  if (!form.value.date || !form.value.heure) return false;
  return new Date(form.value.date + 'T' + form.value.heure) < new Date();
});
const isDateFuture = computed(() => {
  if (!form.value.date || !form.value.heure) return false;
  return new Date(form.value.date + 'T' + form.value.heure) > new Date();
});
const isEdit = computed(() => !!props.modelValue && !!props.modelValue.id);

const selectedPatient = ref<Patient | null>(null);

watch(selectedPatient, (val) => {
  if (val) {
    form.value.patientId = val.id;
    form.value.patientNom = formatPrenom(val.prenom) + ' ' + formatNom(val.nom);
  } else {
    form.value.patientId = undefined;
    form.value.patientNom = '';
  }
});

const errors = ref<Record<string, string>>({});

function validateField(field: string) {
  switch (field) {
    case 'motif':
      errors.value.motif = form.value.motif.trim() ? '' : 'Le motif est requis.';
      break;
    case 'date':
      if (!form.value.date.trim()) {
        errors.value.date = 'La date est requise.';
      } else if (
        !isEdit.value &&
        form.value.date &&
        form.value.heure &&
        new Date(form.value.date + 'T' + form.value.heure) <= new Date()
      ) {
        errors.value.date = 'La date du rendez-vous doit être dans le futur.';
      } else {
        errors.value.date = '';
      }
      break;
    case 'heure':
      errors.value.heure = form.value.heure.trim() ? '' : "L'heure est requise.";
      break;
    case 'duree':
      errors.value.duree = form.value.duree > 0 ? '' : 'La durée doit être supérieure à 0.';
      break;
    case 'patientId':
      errors.value.patientId = form.value.patientId ? '' : 'Le patient est requis.';
      break;
    case 'statut':
      errors.value.statut = ['scheduled', 'cancelled', 'completed'].includes(form.value.statut)
        ? ''
        : 'Le statut est requis.';
      break;
  }
}

function validateAll() {
  validateField('motif');
  validateField('date');
  validateField('heure');
  validateField('duree');
  validateField('patientId');
  validateField('statut');
}

const isFormValid = computed(() => {
  validateAll();
  return (
    !errors.value.motif &&
    !errors.value.date &&
    !errors.value.heure &&
    !errors.value.duree &&
    !errors.value.patientId &&
    !errors.value.statut &&
    form.value.motif.trim() !== '' &&
    form.value.date.trim() !== '' &&
    form.value.heure.trim() !== '' &&
    form.value.duree > 0 &&
    !!form.value.patientId &&
    ['scheduled', 'cancelled', 'completed'].includes(form.value.statut)
  );
});

const alertStore = useAlertStore();

// Ajout d'un événement pour signaler l'ID du rendez-vous créé ou modifié
async function submit() {
  validateAll();
  if (!isFormValid.value) return;
  try {
    if (!form.value.patientId) return;
    const dateHeure =
      form.value.date && form.value.heure ? `${form.value.date}T${form.value.heure}` : '';
    let appointmentId = 0;
    if (isEdit.value && props.modelValue?.id) {
      const id = typeof props.modelValue.id === 'number' ? props.modelValue.id : 0;
      const updated = await updateAppointment(id, {
        motif: form.value.motif,
        dateHeure,
        duree: form.value.duree,
        patient: {
          id: form.value.patientId,
          nom: '',
          prenom: '',
          sexe: '',
          dateNaissance: '',
        },
        statut: form.value.statut,
        id: typeof props.modelValue.id === 'number' ? props.modelValue.id : 0,
      });
      appointmentId = updated.id;
      alertStore.show('success', 'Rendez-vous modifié avec succès');
    } else {
      const created = await createAppointment({
        motif: form.value.motif,
        dateHeure,
        duree: form.value.duree,
        patient: {
          id: form.value.patientId,
          nom: '',
          prenom: '',
          sexe: '',
          dateNaissance: '',
        },
        statut: form.value.statut,
        id: 0,
      });
      appointmentId = created.id;
      alertStore.show('success', 'Rendez-vous créé avec succès');
    }
    form.value = {
      motif: '',
      date: '',
      heure: '',
      duree: 30,
      patientId: undefined,
      patientNom: '',
      statut: 'scheduled',
    };
    selectedPatient.value = null;
    errors.value = {};
    emit('created', appointmentId);
    await nextTick();
    emit('close');
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'violations' in error) {
      // Mapping backend (API anglais) -> front (français)
      errors.value = Object.fromEntries(
        Object.entries(
          (error as Record<string, unknown>).violations as Record<string, string[]>
        ).map(([k, v]) => [
          k === 'motif'
            ? 'motif'
            : k === 'dateHeure' || k === 'date'
              ? 'date'
              : k === 'heure'
                ? 'heure'
                : k === 'duree'
                  ? 'duree'
                  : k === 'patient' || k === 'patientId'
                    ? 'patientId'
                    : k === 'statut'
                      ? 'statut'
                      : k,
          Array.isArray(v) ? v.join(', ') : String(v),
        ])
      ) as Record<string, string>;
    } else if (error && typeof error === 'object' && 'error' in error) {
      errors.value = { global: (error as Record<string, unknown>).error as string };
    } else if (error instanceof Error) {
      errors.value = { global: error.message };
    } else {
      errors.value = { global: 'Erreur inconnue' };
    }
  }
}
</script>

<style scoped></style>
