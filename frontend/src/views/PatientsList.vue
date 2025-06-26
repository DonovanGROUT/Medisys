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
    <div class="bg-white rounded-[6px] shadow p-8">
      <!-- Titre de la page -->
      <h2 class="text-2xl font-bold text-[#1976D2] mb-4 text-center">Liste des patients</h2>
      <!-- Alertes (gérées globalement dans App.vue) -->
      <div class="mb-4">
        <div v-if="errors.global" class="text-red-600 font-bold mb-4" data-testid="error-message">
          {{ errors.global }}
        </div>
        <!-- Les alertes globales sont désormais gérées par App.vue -->
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
          class="rounded-[6px] border border-[#263238] text-[#263238] px-4 py-2 font-semibold hover:bg-[#263238] hover:text-white transition-colors duration-200 focus:outline focus:outline-2 focus:outline-[#263238] sm:w-auto w-full"
          aria-label="Retour à l'accueil"
          >Retour à l'accueil</router-link
        >
      </div>
      <!-- Version mobile : cards (< 450px) -->
      <div class="block min-[450px]:hidden space-y-4">
        <!-- Affichage des patients sous forme de cartes -->
        <PatientCard
          v-for="patient in patients"
          :key="patient.id"
          :id="patient.id"
          :gender="patient.sexe"
          :lastName="patient.nom"
          :firstName="patient.prenom"
          :birthDate="patient.dateNaissance"
          :phone="patient.telephone"
          :email="patient.email"
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
      <!-- Table responsive desktop/tablette (>= 450px) -->
      <div class="hidden min-[450px]:block overflow-x-auto">
        <table class="min-w-full border text-base rounded-[6px]">
          <thead class="bg-[#F5F5F5]">
            <tr>
              <th
                class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-[#263238] text-sm sm:text-base"
              >
                ID
              </th>
              <th
                class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-[#263238] text-sm sm:text-base"
              >
                Sexe
              </th>
              <th
                class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-[#263238] text-sm sm:text-base max-w-[100px] break-words"
              >
                Nom
              </th>
              <th
                class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-[#263238] text-sm sm:text-base max-w-[100px] break-words"
              >
                Prénom
              </th>
              <th
                class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-[#263238] min-[810px]:table-cell min-[640px]:hidden hidden text-sm sm:text-base"
              >
                Date de naissance
              </th>
              <th
                class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-[#263238] xl:table-cell hidden text-sm sm:text-base"
              >
                Téléphone
              </th>
              <th
                class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-[#263238] 2xl:table-cell hidden text-sm sm:text-base"
              >
                Email
              </th>
              <th
                class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-[#263238] text-sm sm:text-base"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <PatientTableRow
              v-for="patient in patients"
              :key="patient.id"
              :id="patient.id"
              :gender="patient.sexe"
              :lastName="patient.nom"
              :firstName="patient.prenom"
              :birthDate="patient.dateNaissance"
              :phone="patient.telephone"
              :email="patient.email"
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
              class="rounded-[6px] border border-[#263238] text-[#263238] px-4 py-2 font-semibold hover:bg-[#263238] hover:text-white transition-colors duration-200 focus:outline focus:outline-2 focus:outline-[#263238]"
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
import {
  fetchPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from '../services/patientService';
import type { ApiPatient } from '../services/patientService';
import { ref, onMounted } from 'vue';

// Définition du type Patient local (adapté au front)
interface Patient {
  id: number;
  sexe: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  email: string;
}

// Données des patients (récupérées via l'API)
const patients = ref<Patient[]>([]);

// Appel à l'API pour récupérer la liste des patients
onMounted(async () => {
  try {
    const apiPatients = (await fetchPatients()) as unknown as ApiPatient[];
    patients.value = apiPatients.map((p: ApiPatient): Patient => {
      if (typeof p.id !== 'number') throw new Error('Patient sans id reçu de l’API');
      return {
        id: p.id,
        sexe: p.gender,
        nom: p.lastName,
        prenom: p.firstName,
        dateNaissance: p.birthDate ? p.birthDate.split('T')[0] : '',
        telephone: p.phone ?? '',
        email: p.email ?? '',
      };
    });
  } catch (e) {
    if (e instanceof Error) {
      errors.value.global = e.message;
    } else {
      errors.value.global = 'Erreur inconnue';
    }
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

async function handleSubmit(form: Patient) {
  errors.value = {};
  try {
    if (modalMode.value === 'create') {
      await createPatient({
        firstName: form.prenom,
        lastName: form.nom,
        gender: form.sexe,
        birthDate: form.dateNaissance,
        phone: form.telephone,
        email: form.email,
      });
    } else if (modalMode.value === 'edit' && selectedPatient.value) {
      await updatePatient(selectedPatient.value.id, {
        firstName: form.prenom,
        lastName: form.nom,
        gender: form.sexe,
        birthDate: form.dateNaissance,
        phone: form.telephone,
        email: form.email,
      });
    }
    // Recharge la liste après ajout/modif
    const apiPatients = (await fetchPatients()) as unknown as ApiPatient[];
    patients.value = apiPatients.map((p: ApiPatient): Patient => {
      if (typeof p.id !== 'number') throw new Error('Patient sans id reçu de l’API');
      return {
        id: p.id,
        sexe: p.gender,
        nom: p.lastName,
        prenom: p.firstName,
        dateNaissance: p.birthDate ? p.birthDate.split('T')[0] : '',
        telephone: p.phone ?? '',
        email: p.email ?? '',
      };
    });
    closeModal();
  } catch (e) {
    if (typeof e === 'object' && e && 'violations' in e) {
      // Mapping backend -> front
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
    } else if (typeof e === 'object' && e && 'error' in e) {
      errors.value = { global: (e as { error: string }).error };
    } else if (e instanceof Error) {
      errors.value = { global: e.message };
    } else {
      errors.value = { global: 'Erreur inconnue' };
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
    const apiPatients = (await fetchPatients()) as unknown as ApiPatient[];
    patients.value = apiPatients.map((p: ApiPatient): Patient => {
      if (typeof p.id !== 'number') throw new Error('Patient sans id reçu de l’API');
      return {
        id: p.id,
        sexe: p.gender,
        nom: p.lastName,
        prenom: p.firstName,
        dateNaissance: p.birthDate ? p.birthDate.split('T')[0] : '',
        telephone: p.phone ?? '',
        email: p.email ?? '',
      };
    });
    closeDeleteModal();
  } catch (e) {
    errors.value.global =
      e instanceof Error ? e.message : 'Erreur lors de la suppression du patient.';
  }
}
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
