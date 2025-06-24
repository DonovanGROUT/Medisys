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
      <div v-else class="text-center text-red-800 font-semibold flex flex-col items-center gap-2">
        <BaseIcon name="error" size="2em" class="mb-2" />
        Patient introuvable.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import PatientView from '../components/PatientView.vue';
import BaseIcon from '../components/BaseIcon.vue';

// Mock temporaire (à remplacer par appel API plus tard)
const patients = [
  {
    id: 1,
    sexe: 'F',
    nom: 'Dupont',
    prenom: 'Marie',
    dateNaissance: '1985-04-12',
    telephone: '0601020304',
    email: 'marie.dupont@email.com',
  },
  {
    id: 2,
    sexe: 'M',
    nom: 'Martin',
    prenom: 'Paul',
    dateNaissance: '1978-11-23',
    telephone: '',
    email: '',
  },
  {
    id: 3,
    sexe: 'F',
    nom: 'Durand',
    prenom: 'Sophie',
    dateNaissance: '1992-07-05',
    telephone: '0611223344',
    email: 'sophie.durand@email.com',
  },
  {
    id: 4,
    sexe: 'X',
    nom: 'Alex',
    prenom: 'Morgan',
    dateNaissance: '1990-01-01',
    telephone: '0612345678',
    email: 'alex.morgan@email.com',
  },
];

const route = useRoute();
const patientId = Number(route.params.id);
const patient = ref(patients.find((p) => p.id === patientId) || null);
</script>
