<!--
  -----------------------------------------------------------------------------
  Vue de consultation d’un patient (lecture seule, accessible, harmonisée)
  -----------------------------------------------------------------------------
  Affiche la fiche détaillée d’un patient selon l’ID passé dans l’URL.
  Utilise le composant PatientView pour l’affichage.
  (En attendant l’API, utilise un mock local ou affiche un message si non trouvé.)

  Composants utilisés :
    - PatientView (fiche patient)
    - BaseIcon (icônes)

  Accessibilité :
    - Titres hiérarchisés
    - Contraste couleurs conforme WCAG AA
    - Message explicite si patient non trouvé

  Exemple d’utilisation :
    Route /patients/:id

  -----------------------------------------------------------------------------
-->
<template>
  <div class="max-w-2xl mx-auto mt-8 px-4">
    <div class="bg-white rounded-[6px] shadow p-8">
      <h1 class="text-2xl font-bold text-blue-800 mb-6 text-center">Fiche patient</h1>
      <PatientView v-if="patient" :patient="patient" />
      <div
        v-else-if="errorMsg"
        class="text-center text-red-800 font-semibold flex flex-col items-center gap-2"
      >
        <BaseIcon name="error" size="2em" class="mb-2" />
        <div role="alert">{{ errorMsg + '' }}</div>
      </div>
      <div v-else class="text-center text-gray-500">Chargement en cours...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import PatientView from '../components/PatientView.vue';
import BaseIcon from '../components/BaseIcon.vue';
import { fetchPatients } from '../services/patientService';
import type { Patient } from '../types/Patient';

const route = useRoute();
const patient = ref<Patient | null>(null);
const loading = ref(true);
const errorMsg = ref('');

onMounted(async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const id = Number(route.params.id);
    if (!id) throw new Error('ID patient invalide');
    const patients = await fetchPatients();
    patient.value = patients.find((p) => p.id === id) || null;
    if (!patient.value) errorMsg.value = 'Patient introuvable.';
  } catch (e: unknown) {
    const errorText = e instanceof Error ? e.message : String(e);
    errorMsg.value = String(errorText || 'Erreur lors du chargement du patient.');
    patient.value = null;
  } finally {
    loading.value = false;
  }
});
</script>
