<!--
  Vue Liste des patients (PatientsList.vue)

  - Affiche la liste des patients sous forme de cards (mobile) ou tableau (desktop)
  - Permet la création, l’édition, la visualisation et la suppression de patients via modales
  - Utilise des composants modulaires (PatientCard, PatientTableRow, PatientActions, PatientForm, PatientView, ConfirmDelete, Modal)
  - Mock de patients (à remplacer par l’API backend)
  - Accessibilité, responsive, cohérence graphique
-->
<template>
  <div class="max-w-7xl mx-auto mt-8 px-4">
    <div class="bg-white rounded-[6px] shadow p-8 min-h-[340px]">
      <!-- Titre de la page -->
      <h2 class="text-2xl font-bold text-blue-800 mb-4 text-center">Liste des patients</h2>
      <!-- Alertes (gérées globalement dans App.vue) -->
      <div class="mb-4">
        <div v-if="errors.global" class="text-red-600 font-bold mb-4" data-testid="error-message">
          {{ errors.global }}
        </div>
        <!-- Les alertes globales sont gérées par App.vue -->
      </div>
      <!-- Boutons d’action principaux (ajout, retour) -->
      <div
        class="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-center"
      >
        <button
          @click="openCreate"
          class="rounded-[6px] border border-green-800 text-green-800 px-4 py-2 font-semibold hover:bg-green-800 hover:text-white transition-colors duration-200 focus:outline focus:outline-2 focus:outline-green-800 sm:w-auto w-full"
          aria-label="Ajouter un patient"
        >
          Ajouter un patient
        </button>
        <router-link
          to="/"
          class="rounded-[6px] border border-slate-800 text-slate-800 px-4 py-2 font-semibold hover:bg-slate-800 hover:text-white transition-colors duration-200 focus:outline focus:outline-2 focus:outline-slate-800 sm:w-auto w-full"
          aria-label="Retour à l'accueil"
          >Retour à l'accueil</router-link
        >
      </div>
      <!-- Barre de recherche patient -->
      <div class="mb-4 flex flex-col sm:flex-row sm:items-start gap-2">
        <label
          for="patient-search"
          class="font-semibold text-slate-800 sm:mr-2 min-w-fit flex items-center h-10"
          >Rechercher un patient :</label
        >
        <div class="flex flex-col w-full sm:w-80">
          <PatientAutocomplete
            id="patient-search"
            v-model="searchPatient"
            placeholder="Nom ou prénom..."
            class="w-full"
          />
        </div>
      </div>
      <!-- Loader pendant le chargement -->
      <!-- Wrapper layout pour stabiliser le CLS et garantir l'affichage mobile -->
      <div class="min-h-[480px] w-full">
        <PatientListLoader v-if="loading" />
        <div v-else>
          <div
            v-if="!errors.global && filteredPatients.length === 0"
            class="text-slate-800 text-center my-8"
            data-testid="empty-message"
          >
            Aucun patient à afficher
          </div>
          <!-- Version mobile & tablette < 569px : cards (1 colonne <450px, 2 colonnes 450-568px) -->
          <div
            v-if="!errors.global && filteredPatients.length > 0"
            class="grid grid-cols-1 min-[450px]:grid-cols-2 min-[569px]:hidden gap-4"
          >
            <!-- Affichage des patients sous forme de cartes -->
            <PatientCard
              v-for="patient in filteredPatients"
              :key="patient.id"
              :id="patient.id"
              :sexe="patient.sexe"
              :nom="patient.nom"
              :prenom="patient.prenom"
              :dateNaissance="patient.dateNaissance"
              :telephone="patient.telephone ?? ''"
              :email="patient.email ?? ''"
              data-testid="patient-row"
            >
              <template #actions>
                <PatientActions
                  @view="openView(patient)"
                  @edit="openEdit(patient)"
                  @delete="openDelete(patient)"
                />
              </template>
            </PatientCard>
          </div>
          <!-- Table responsive desktop/tablette (>= 569px) -->
          <div
            v-if="!errors.global && filteredPatients.length > 0"
            class="hidden min-[569px]:block overflow-x-auto"
          >
            <table class="min-w-full border text-base rounded-[6px]">
              <thead class="bg-[#F5F5F5]">
                <tr>
                  <th
                    class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-slate-800 text-sm sm:text-base"
                  >
                    ID
                  </th>
                  <th
                    class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-slate-800 text-sm sm:text-base"
                  >
                    Sexe
                  </th>
                  <th
                    class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-slate-800 text-sm sm:text-base max-w-[100px] break-words"
                  >
                    Nom
                  </th>
                  <th
                    class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-slate-800 text-sm sm:text-base max-w-[100px] break-words"
                  >
                    Prénom
                  </th>
                  <th
                    class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-slate-800 text-sm sm:text-base min-[810px]:table-cell min-[640px]:hidden hidden"
                  >
                    Date de naissance
                  </th>
                  <th
                    class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-slate-800 text-sm sm:text-base xl:table-cell hidden"
                  >
                    Téléphone
                  </th>
                  <th
                    class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-slate-800 text-sm sm:text-base 2xl:table-cell hidden"
                  >
                    Email
                  </th>
                  <th
                    class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-slate-800 text-sm sm:text-base"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <PatientTableRow
                  v-for="patient in filteredPatients"
                  :key="patient.id"
                  :id="patient.id"
                  :sexe="patient.sexe"
                  :nom="patient.nom"
                  :prenom="patient.prenom"
                  :dateNaissance="patient.dateNaissance"
                  :telephone="patient.telephone ?? ''"
                  :email="patient.email ?? ''"
                  data-testid="patient-row"
                >
                  <template #actions>
                    <PatientActions
                      @view="openView(patient)"
                      @edit="openEdit(patient)"
                      @delete="openDelete(patient)"
                    />
                  </template>
                </PatientTableRow>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- Modale principale (création, édition, vue) -->
      <Modal v-if="showModal" :model-value="showModal" @update:modelValue="closeModal">
        <template #icon>
          <BaseIcon v-if="modalMode === 'create'" name="person_add" color="#1976D2" size="2em" />
          <BaseIcon v-else-if="modalMode === 'edit'" name="edit" color="#43A047" size="2em" />
          <BaseIcon v-else-if="modalMode === 'view'" name="person" color="#1976D2" size="2em" />
        </template>
        <template #title>
          <span v-if="modalMode === 'create'">Ajouter un patient</span>
          <span v-else-if="modalMode === 'edit'">Modifier le patient</span>
          <span v-else-if="modalMode === 'view'">Fiche patient</span>
        </template>
        <template v-if="modalMode === 'create'">
          <PatientForm @submit="handleSubmit" @cancel="closeModal" :errors="errors" />
        </template>
        <template v-else-if="modalMode === 'edit'">
          <PatientForm
            :model-value="selectedPatient"
            @submit="handleSubmit"
            @cancel="closeModal"
            :errors="errors"
          />
        </template>
        <template v-else-if="modalMode === 'view'">
          <PatientView :patient="selectedPatient" />
          <div class="flex justify-end mt-4">
            <button
              @click="closeModal"
              class="rounded-[6px] border border-slate-800 text-slate-800 px-4 py-2 font-semibold hover:bg-slate-800 hover:text-white transition-colors duration-200 focus:outline focus:outline-2 focus:outline-slate-800"
            >
              Fermer
            </button>
          </div>
        </template>
      </Modal>
      <!-- Modale de confirmation de suppression -->
      <Modal
        v-if="showDeleteModal"
        :model-value="showDeleteModal"
        @update:modelValue="closeDeleteModal"
      >
        <template #icon>
          <BaseIcon name="delete" color="#E53935" size="2em" />
        </template>
        <template #title>
          <span>Suppression</span>
        </template>
        <ConfirmDelete @confirm="confirmDelete" @cancel="closeDeleteModal" />
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import des composants modulaires
import PatientCard from '../components/PatientCard.vue';
import PatientTableRow from '../components/PatientTableRow.vue';
import Modal from '../components/Modal.vue';
import PatientForm from '../components/PatientForm.vue';
import PatientView from '../components/PatientView.vue';
import PatientActions from '../components/PatientActions.vue';
import ConfirmDelete from '../components/ConfirmDelete.vue';
import BaseIcon from '../components/BaseIcon.vue';
import PatientAutocomplete from '../components/PatientAutocomplete.vue';
import PatientListLoader from '../components/PatientListLoader.vue';
import {
  fetchPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from '../services/patientService';
import type { Patient } from '../types/Patient';
import { computed, ref, onMounted } from 'vue';
import { useAlertStore } from '../stores/alert';

// Données des patients (récupérées via l'API)
const patients = ref<Patient[]>([]);

// État de chargement
const loading = ref(true);

// Appel à l'API pour récupérer la liste des patients
onMounted(async () => {
  try {
    patients.value = await fetchPatients();
  } catch (e) {
    if (e instanceof Error) {
      errors.value.global = e.message;
    } else {
      errors.value.global = 'Erreur inconnue';
    }
  } finally {
    loading.value = false;
  }
});

// Gestion de la modale principale (création, édition, vue)
const showModal = ref(false);
const modalMode = ref<'create' | 'edit' | 'view' | null>(null);
const selectedPatient = ref<Patient | null>(null);

function openCreate() {
  modalMode.value = 'create';
  selectedPatient.value = null;
  showModal.value = true;
}
function openEdit(patient: Patient) {
  modalMode.value = 'edit';
  selectedPatient.value = { ...patient };
  showModal.value = true;
}
function openView(patient: Patient) {
  modalMode.value = 'view';
  selectedPatient.value = { ...patient };
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}

const errors = ref<Record<string, string>>({});

const alertStore = useAlertStore();

async function handleSubmit(form: Patient) {
  errors.value = {};
  try {
    if (modalMode.value === 'create') {
      await createPatient({
        id: 0, // ou undefined si optionnel
        nom: form.nom,
        prenom: form.prenom,
        sexe: form.sexe,
        dateNaissance: form.dateNaissance,
        telephone: form.telephone,
        email: form.email,
      });
      alertStore.show('success', 'Patient créé avec succès');
    } else if (modalMode.value === 'edit' && selectedPatient.value) {
      await updatePatient(selectedPatient.value.id, {
        nom: form.nom,
        prenom: form.prenom,
        sexe: form.sexe,
        dateNaissance: form.dateNaissance,
        telephone: form.telephone,
        email: form.email,
      });
      alertStore.show('success', 'Patient modifié avec succès');
    }
    // Recharge la liste après ajout/modif
    patients.value = await fetchPatients();
    closeModal();
  } catch (e) {
    if (typeof e === 'object' && e && 'violations' in e) {
      // Mapping backend (API anglais) -> front (français)
      errors.value = Object.fromEntries(
        Object.entries((e as { violations: Record<string, string[]> }).violations).map(([k, v]) => [
          k === 'firstName'
            ? 'prenom'
            : k === 'lastName'
              ? 'nom'
              : k === 'gender'
                ? 'sexe'
                : k === 'birthDate'
                  ? 'dateNaissance'
                  : k === 'phone'
                    ? 'telephone'
                    : k,
          Array.isArray(v) ? v.join(', ') : String(v),
        ])
      ) as Record<string, string>;
      alertStore.show('error', 'Erreur lors de la validation du formulaire');
    } else if (typeof e === 'object' && e && 'error' in e) {
      errors.value = { global: (e as { error: string }).error };
      alertStore.show('error', errors.value.global);
    } else if (e instanceof Error) {
      errors.value = { global: e.message };
      alertStore.show('error', e.message);
    } else {
      errors.value = { global: 'Erreur inconnue' };
      alertStore.show('error', 'Erreur inconnue');
    }
  }
}

// Gestion de la suppression
const showDeleteModal = ref(false);
const patientToDelete = ref<Patient | null>(null);

function openDelete(patient: Patient) {
  patientToDelete.value = patient;
  showDeleteModal.value = true;
}
function closeDeleteModal() {
  showDeleteModal.value = false;
}
async function confirmDelete() {
  if (!patientToDelete.value) return;
  try {
    await deletePatient(patientToDelete.value.id);
    // Recharge la liste après suppression
    patients.value = await fetchPatients();
    closeDeleteModal();
    alertStore.show('success', 'Patient supprimé avec succès');
  } catch (e) {
    errors.value.global =
      e instanceof Error ? e.message : 'Erreur lors de la suppression du patient.';
    alertStore.show('error', errors.value.global);
  }
}

const searchPatient = ref(null as Patient | null);

const filteredPatients = computed(() => {
  if (!searchPatient.value) return patients.value;
  return patients.value.filter((p) => {
    const s = searchPatient.value;
    if (!s) return true;
    return (
      p.id === s.id ||
      (p.nom && s.nom && p.nom.toLowerCase().includes(s.nom.toLowerCase())) ||
      (p.prenom && s.prenom && p.prenom.toLowerCase().includes(s.prenom.toLowerCase()))
    );
  });
});

// Expose explicitement les méthodes et propriétés critiques pour les tests unitaires
defineExpose({
  openCreate,
  openEdit,
  openView,
  closeModal,
  openDelete,
  closeDeleteModal,
  confirmDelete,
  handleSubmit,
  errors,
  showModal,
  showDeleteModal,
  patientToDelete,
});
</script>

<style scoped>
/* Contraste renforcé pour accessibilité et hover */
button,
.router-link,
a {
  transition:
    box-shadow 0.2s,
    transform 0.2s,
    color 0.2s,
    background 0.2s;
}
button.bg-\[\#43A047\],
.router-link.bg-\[\#43A047\] {
  background-color: #2e7031 !important;
}
button.bg-\[\#E53935\],
.router-link.bg-\[\#E53935\] {
  background-color: #b71c1c !important;
}
button.text-\[\#43A047\],
.router-link.text-\[\#43A047\] {
  color: #20551c !important;
}
button.text-\[\#E53935\],
.router-link.text-\[\#E53935\] {
  color: #b71c1c !important;
}
button:hover,
.router-link:hover,
a:hover {
  box-shadow: 0 2px 8px 0 #1976d233;
  transform: translateY(-2px) scale(1.03);
}
tr:nth-child(even) {
  background-color: #f5f5f5;
}
tr:hover {
  background-color: #e3f2fd;
  transition: background 0.2s;
}
</style>
