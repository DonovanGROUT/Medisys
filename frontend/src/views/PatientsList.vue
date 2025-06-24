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
          <PatientForm @submit="handleSubmit" @cancel="closeModal" />
        </template>
        <template v-else-if="modalMode === 'edit'">
          <PatientForm :model-value="selectedPatient" @submit="handleSubmit" @cancel="closeModal" />
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
import { ref } from 'vue';

// Mock de patients (à remplacer par l’API plus tard)
const patients = ref([
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
]);

// Gestion de la modale principale (création, édition, vue)
const showModal = ref(false);
const modalMode = ref<'create' | 'edit' | 'view' | null>(null);
const selectedPatient = ref<any>(null);

function openCreate() {
  modalMode.value = 'create';
  selectedPatient.value = null;
  showModal.value = true;
}
function openEdit(patient: any) {
  modalMode.value = 'edit';
  selectedPatient.value = { ...patient };
  showModal.value = true;
}
function openView(patient: any) {
  modalMode.value = 'view';
  selectedPatient.value = { ...patient };
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}

function handleSubmit(/* form: any */) {
  // Ici tu ajoutes ou modifies le patient (mock ou API)
  closeModal();
}

// Gestion de la suppression
const showDeleteModal = ref(false);
const patientToDelete = ref<any>(null);

function openDelete(patient: any) {
  patientToDelete.value = patient;
  showDeleteModal.value = true;
}
function closeDeleteModal() {
  showDeleteModal.value = false;
}
function confirmDelete() {
  // Suppression du patient (mock)
  const idx = patients.value.findIndex((p: any) => p.id === patientToDelete.value.id);
  if (idx !== -1) patients.value.splice(idx, 1);
  closeDeleteModal();
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
