<!--
  Vue Liste des rendez-vous (AppointmentList.vue)

  - Affiche la liste des rendez-vous sous forme de cards (mobile) ou tableau (desktop)
  - Permet la création, l’édition, la visualisation et la suppression de rendez-vous via modales
  - Utilise des composants modulaires (AppointmentItem, AppointmentTableRow, AppointmentActions, AppointmentForm, AppointmentView, ConfirmDelete, Modal)
  - Appels API backend (getAppointments, createAppointment, updateAppointment, deleteAppointment)
  - Accessibilité, responsive, cohérence graphique
-->
<template>
  <div class="w-full min-h-screen bg-[#F3F6FA]">
    <div class="max-w-7xl mx-auto mt-8 px-2 sm:px-4">
      <div class="bg-white rounded-[6px] shadow p-4 sm:p-8 min-h-[480px]">
        <!-- Titre de la page -->
        <h2 class="text-2xl font-bold text-blue-800 mb-4 text-center">Liste des rendez-vous</h2>
        <!-- Alertes (gérées globalement dans App.vue) -->
        <div class="mb-4">
          <div v-if="errors.global" class="text-red-600 font-bold mb-4" data-testid="error-message">
            {{ errors.global }}
          </div>
          <!-- Les alertes globales sont désormais gérées par App.vue -->
        </div>
        <!-- Actions + Filtres (structure harmonisée) -->
        <div class="mb-4 w-full">
          <!-- Ligne 1 : Actions principales (desktop: gauche/droite, mobile: colonne centrée) -->
          <div
            class="flex flex-col gap-1 custom870:flex-row custom870:justify-between custom870:items-center"
          >
            <button
              @click="openCreate"
              class="rounded-[6px] border border-blue-800 text-blue-800 px-2 py-2 font-semibold hover:bg-blue-800 hover:text-white transition-colors duration-200 focus:outline focus:outline-2 focus:outline-blue-800 custom870:w-auto w-full h-12 text-center min-w-0"
              aria-label="Ajouter un rendez-vous"
            >
              Ajouter un rendez-vous
            </button>
            <button
              v-if="statusFilter !== 'all' || dateFilter || patientFilter"
              class="reset-filters-btn rounded-[6px] border border-blue-800 text-blue-800 px-2 py-2 font-semibold hover:bg-blue-800 hover:text-white transition-colors duration-200 focus:outline focus:outline-2 focus:outline-blue-800 custom870:w-auto w-full h-12 whitespace-nowrap mt-2 custom870:mt-0 min-w-0"
              @click="resetAdvancedFilters"
            >
              Réinitialiser les filtres
            </button>
            <router-link
              to="/"
              class="rounded-[6px] border border-[#263238] text-[#263238] px-2 py-2 font-semibold hover:bg-[#263238] hover:text-white transition-colors duration-200 focus:outline focus:outline-2 focus:outline-[#263238] custom870:w-auto w-full h-12 text-center custom870:ml-0 custom870:mr-0 min-w-0"
              aria-label="Retour à l'accueil"
              style="text-align: center"
              >Retour à l'accueil</router-link
            >
          </div>
          <!-- Ligne 2 : Filtres avancés -->
          <div
            class="flex flex-col gap-1 custom870:flex-row custom870:items-end custom870:gap-4 mt-4"
          >
            <div
              class="flex-1 min-w-0 basis-0 w-full relative patient-autocomplete-parent flex flex-col justify-end"
            >
              <label
                for="patient-search-appointments"
                class="font-semibold text-[#263238] min-w-fit flex items-center h-10 mb-1"
                >Rechercher un patient :</label
              >
              <PatientAutocomplete
                id="patient-search-appointments"
                v-model="selectedPatient"
                placeholder="Nom ou prénom..."
                class="w-full"
                ref="patientAutocompleteRef"
              />
            </div>
            <div class="flex-1 min-w-0 basis-0 w-full relative">
              <label
                for="status-filter"
                class="font-semibold text-[#263238] min-w-fit flex items-center h-10 mb-1"
                >Statut :</label
              >
              <div class="relative">
                <select
                  id="status-filter"
                  name="status-filter"
                  v-model="statusFilter"
                  class="border rounded px-2 py-1 w-full h-10 min-w-0 basis-0 appearance-none"
                >
                  <option value="all">Tous</option>
                  <option value="upcoming">À venir</option>
                  <option value="past">Passés</option>
                  <option value="cancelled">Annulés</option>
                </select>
                <span
                  class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      d="M6 8l4 4 4-4"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div class="flex-1 min-w-0 basis-0 w-full relative date-filter-parent">
              <label
                for="date-filter"
                class="font-semibold text-[#263238] min-w-fit flex items-center h-10 mb-1"
                >Date :</label
              >
              <input
                id="date-filter"
                name="date-filter"
                type="date"
                v-model="dateFilter"
                class="border rounded px-2 py-1 w-full h-10 min-w-0 basis-0"
              />
            </div>
          </div>
        </div>
        <!-- Loader pendant le chargement -->
        <AppointmentListLoader v-if="loading" />
        <!-- Message d’état vide si aucun rendez-vous -->
        <div
          v-else-if="!errors.global && filteredAndSortedAppointments.length === 0"
          class="text-slate-800 text-center my-8"
          data-testid="empty-message"
        >
          Aucun rendez-vous à afficher
        </div>
        <!-- Version mobile & tablette < 569px : cards (1 colonne <450px, 2 colonnes 450-568px) -->
        <div
          v-else
          class="grid grid-cols-1 min-[450px]:grid-cols-2 min-[569px]:hidden gap-2 min-[800px]:gap-4 min-[640px]:gap-2 min-[569px]:gap-2 px-0 min-[450px]:px-0 overflow-x-hidden"
        >
          <AppointmentItem
            v-for="appointment in filteredAndSortedAppointments"
            :key="appointment.id"
            :appointment="appointment"
            data-testid="appointment-row"
            @view="openView(appointment)"
            @edit="openEdit(appointment)"
            @delete="openDelete(appointment)"
          />
        </div>
        <!-- Table responsive desktop/tablette (>= 569px) -->
        <div class="hidden min-[569px]:block w-full overflow-x-auto">
          <table class="w-full min-w-0 max-w-full border text-base rounded-[6px]">
            <thead class="bg-[#F5F5F5]">
              <tr>
                <th
                  class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-[#263238] text-sm sm:text-base min-w-[40px] col-id-hide-795-569"
                >
                  ID
                </th>
                <th
                  class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-[#263238] text-sm sm:text-base min-w-[80px]"
                >
                  Titre
                </th>
                <th
                  class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-[#263238] text-sm sm:text-base min-w-[90px]"
                >
                  Date
                </th>
                <th
                  class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-[#263238] text-sm sm:text-base min-w-[70px]"
                >
                  Heure
                </th>
                <th
                  class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-[#263238] text-sm sm:text-base min-w-[110px]"
                >
                  Patient
                </th>
                <th
                  class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-[#263238] text-sm sm:text-base min-w-[80px] truncate"
                >
                  Statut
                </th>
                <th
                  class="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-[#263238] text-sm sm:text-base min-w-[90px] truncate"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AppointmentTableRow
                v-for="appointment in filteredAndSortedAppointments"
                :key="appointment.id"
                :appointment="appointment"
                :id="'appointment-row-' + appointment.id"
                :tabindex="highlightedId === appointment.id ? 0 : -1"
                :class="{ 'animate-highlight': highlightedId === appointment.id }"
                @view="openView(appointment)"
                @edit="openEdit(appointment)"
                @delete="openDelete(appointment)"
                data-testid="appointment-row"
              />
            </tbody>
          </table>
        </div>
        <!-- Modale principale (création, édition, vue) -->
        <Modal v-if="showModal" :model-value="showModal" @update:modelValue="closeModal">
          <template #icon>
            <BaseIcon
              v-if="modalMode === 'create'"
              name="event_available"
              color="#1976D2"
              size="2em"
            />
            <BaseIcon
              v-else-if="modalMode === 'edit'"
              name="edit_calendar"
              color="#43A047"
              size="2em"
            />
            <BaseIcon v-else-if="modalMode === 'view'" name="event" color="#1976D2" size="2em" />
          </template>
          <template #title>
            <span v-if="modalMode === 'create'">Ajouter un rendez-vous</span>
            <span v-else-if="modalMode === 'edit'">Modifier le rendez-vous</span>
            <span v-else-if="modalMode === 'view'">Fiche rendez-vous</span>
          </template>
          <template v-if="modalMode === 'create'">
            <AppointmentForm @created="handleCreated" @close="closeModal" />
          </template>
          <template v-else-if="modalMode === 'edit'">
            <AppointmentForm
              v-if="selectedAppointment"
              :model-value="selectedAppointment"
              @created="handleCreated"
              @close="closeModal"
            />
            <div v-else class="text-slate-800">Aucun rendez-vous sélectionné</div>
          </template>
          <template v-else-if="modalMode === 'view'">
            <AppointmentView v-if="selectedAppointment" :appointment="selectedAppointment" />
            <div v-else class="text-slate-800">Aucun rendez-vous sélectionné</div>
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
  </div>
</template>

<script setup lang="ts">
// Import des composants modulaires
import AppointmentItem from '../components/AppointmentItem.vue';
import AppointmentTableRow from '../components/AppointmentTableRow.vue';
import Modal from '../components/Modal.vue';
import AppointmentForm from '../components/AppointmentForm.vue';
import AppointmentView from '../components/AppointmentView.vue';
import ConfirmDelete from '../components/ConfirmDelete.vue';
import BaseIcon from '../components/BaseIcon.vue';
import PatientAutocomplete from '../components/PatientAutocomplete.vue';
import AppointmentListLoader from '../components/AppointmentListLoader.vue';
import { getAppointments, deleteAppointment } from '../services/appointmentApi';
import { formatError } from '../utils/apiErrorHandler';
import type { Appointment } from '../types/Appointment';
import type { Patient } from '../types/Patient';
import { computed, ref, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAlertStore } from '../stores/alert';

// Données des rendez-vous (récupérées via l'API)
const appointments = ref<Appointment[]>([]);

// Patient sélectionné pour le filtre (contrôle unique, comme dans PatientsList.vue)
const selectedPatient = ref<Patient | null>(null);
const patientAutocompleteRef = ref();

// Gestion de la modale principale (création, édition, vue)
const showModal = ref(false);
const modalMode = ref<'create' | 'edit' | 'view' | null>(null);
const selectedAppointment = ref<Appointment | null>(null);

function openCreate() {
  modalMode.value = 'create';
  selectedAppointment.value = null;
  showModal.value = true;
}
function openEdit(appointment: Appointment) {
  modalMode.value = 'edit';
  selectedAppointment.value = { ...appointment };
  showModal.value = true;
}
function openView(appointment: Appointment) {
  modalMode.value = 'view';
  selectedAppointment.value = { ...appointment };
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}

const errors = ref<Record<string, string>>({});

async function fetchAppointments() {
  try {
    appointments.value = await getAppointments();
  } catch (e) {
    errors.value.global = formatError(e, 'Impossible de charger les rendez-vous').error;
  }
}

const highlightedId = ref<number | null>(null);

async function handleCreated(id?: number) {
  await fetchAppointments();
  if (id) {
    highlightedId.value = id;
    nextTick(() => {
      const el = document.getElementById('appointment-row-' + id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus?.();
      }
      setTimeout(() => {
        highlightedId.value = null;
      }, 2000);
    });
  }
  closeModal();
}

// Gestion de la suppression
const showDeleteModal = ref(false);
const appointmentToDelete = ref<Appointment | null>(null);
const alertStore = useAlertStore();

function openDelete(appointment: Appointment) {
  appointmentToDelete.value = appointment;
  showDeleteModal.value = true;
}
function closeDeleteModal() {
  showDeleteModal.value = false;
}
async function confirmDelete() {
  if (!appointmentToDelete.value) return;
  try {
    await deleteAppointment(appointmentToDelete.value.id);
    await fetchAppointments();
    closeDeleteModal();
    alertStore.show('success', 'Rendez-vous supprimé avec succès');
  } catch (e) {
    errors.value.global =
      e instanceof Error ? e.message : 'Erreur lors de la suppression du rendez-vous.';
    alertStore.show('error', errors.value.global);
  }
}

// Filtres avancés
const statusFilter = ref<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
const dateFilter = ref<string>('');

// Synchronisation URL <-> filtre patient (optionnelle, ne touche pas au champ)
const route = useRoute();
const router = useRouter();
const patientFilter = ref<string | number>('');

const loading = ref(true);

onMounted(async () => {
  await fetchAppointments();
  const id = route.query.patient ? Number(route.query.patient) : null;
  if (id) {
    // Recherche du patient dans la liste des rendez-vous
    const found = appointments.value.find((a) => a.patient && a.patient.id === id)?.patient;
    if (found) {
      selectedPatient.value = found;
      patientFilter.value = found.id;
    }
  }
  loading.value = false;
});
watch(selectedPatient, (val) => {
  if (val) {
    patientFilter.value = val.id;
  } else {
    patientFilter.value = '';
  }
});
watch(patientFilter, (val) => {
  // Synchronisation URL uniquement
  if (val) {
    router.replace({ path: route.path, query: { ...route.query, patient: val } });
  } else {
    const q = { ...route.query };
    delete q.patient;
    router.replace({ path: route.path, query: q });
  }
});

function resetAdvancedFilters() {
  statusFilter.value = 'all';
  dateFilter.value = '';
  selectedPatient.value = null;
  patientAutocompleteRef.value?.reset();
}

// Filtrage principal (utilise selectedPatient.value)
const filteredAndSortedAppointments = computed(() => {
  const now = new Date();
  let list = Array.isArray(appointments.value) ? appointments.value.slice() : [];
  // Filtrage par patient (via autocomplete)
  if (selectedPatient.value && selectedPatient.value.id) {
    list = list.filter((a) => a.patient && a.patient.id === selectedPatient.value!.id);
  }
  // Filtrage par statut
  if (statusFilter.value === 'upcoming') {
    list = list.filter(
      (a) => new Date(a.dateHeure) >= now && a.statut.toLowerCase() !== 'cancelled'
    );
  } else if (statusFilter.value === 'past') {
    list = list.filter(
      (a) => new Date(a.dateHeure) < now && a.statut.toLowerCase() !== 'cancelled'
    );
  } else if (statusFilter.value === 'cancelled') {
    list = list.filter((a) => a.statut.toLowerCase() === 'cancelled');
  }
  // Filtrage par date
  if (dateFilter.value) {
    list = list.filter((a) => a.dateHeure.startsWith(dateFilter.value));
  }
  return list.sort((a, b) => new Date(b.dateHeure).getTime() - new Date(a.dateHeure).getTime());
});
</script>

<style scoped>
/* Contraste renforcé pour accessibilité et hover */
button:hover {
  box-shadow: 0 2px 8px 0 #1976d233;
  transform: translateY(-2px) scale(1.03);
}
.animate-highlight {
  animation: highlight-bg 2s ease;
  outline: 2px solid #ffd600;
}
@keyframes highlight-bg {
  0% {
    background-color: #fff9c4;
  }
  80% {
    background-color: #fff9c4;
  }
  100% {
    background-color: inherit;
  }
}
@media (min-width: 870px) {
  .custom870\:flex {
    display: flex !important;
  }
  .custom870\:flex-row {
    flex-direction: row !important;
  }
  .custom870\:justify-between {
    justify-content: space-between !important;
  }
  .custom870\:items-center {
    align-items: center !important;
  }
  .custom870\:items-end {
    align-items: flex-end !important;
  }
  .custom870\:gap-4 {
    gap: 1rem !important;
  }
  .custom870\:w-\[320px\] {
    width: 320px !important;
  }
  .custom870\:w-\[180px\] {
    width: 180px !important;
  }
  .custom870\:w-auto {
    width: auto !important;
  }
  .custom870\:hidden {
    display: none !important;
  }
  .custom870\:col-span-2 {
    grid-column: span 2 / span 2 !important;
  }
}
@media (max-width: 869px) {
  .custom870\:flex-row {
    flex-direction: column !important;
  }
  .custom870\:justify-between {
    justify-content: flex-start !important;
  }
  .custom870\:items-center {
    align-items: stretch !important;
  }
  .custom870\:items-end {
    align-items: stretch !important;
  }
  .custom870\:gap-4 {
    gap: 0.5rem !important;
  }
  .custom870\:w-auto {
    width: 100% !important;
  }
}
@media (max-width: 870px) and (min-width: 641px) {
  .custom870\:flex {
    display: grid !important;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .custom870\:col-span-2 {
    grid-column: span 2 / span 2 !important;
  }
  .custom870\:w-\[320px\] {
    width: 100% !important;
  }
  .custom870\:w-\[180px\] {
    width: 100% !important;
  }
  .custom870\:mb-0 {
    margin-bottom: 0 !important;
  }
}
@media (max-width: 640px) {
  .custom870\:flex {
    display: block !important;
  }
  .custom870\:col-span-2 {
    grid-column: auto !important;
  }
}
@media (max-width: 677px) and (min-width: 641px) {
  .reset-filters-btn {
    min-width: 120px !important;
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
    font-size: 0.95rem !important;
    white-space: normal !important;
    word-break: break-word !important;
    line-height: 0.8 !important;
  }
}
@media (max-width: 640px) {
  .reset-filters-btn {
    font-size: 0.95rem !important;
    white-space: normal !important;
    word-break: break-word !important;
    line-height: 1.1 !important;
    min-width: 0 !important;
    padding-left: 0.25rem !important;
    padding-right: 0.25rem !important;
  }
  th,
  td {
    padding-left: 0.15rem !important;
    padding-right: 0.15rem !important;
    font-size: 0.95rem !important;
    max-width: 100px !important;
    word-break: break-word !important;
  }
}
@media (max-width: 795px) and (min-width: 569px) {
  th,
  td {
    padding-left: 0.08rem !important;
    padding-right: 0.08rem !important;
    font-size: 0.9rem !important;
    min-width: 0 !important;
    max-width: 90px !important;
    word-break: break-word !important;
  }
  th[colspan],
  td[colspan] {
    min-width: 0 !important;
    max-width: none !important;
  }
}
@media (max-width: 731px) and (min-width: 702px) {
  th,
  td {
    padding-left: 0.01rem !important;
    padding-right: 0.01rem !important;
    font-size: 0.8rem !important;
    min-width: 0 !important;
    max-width: 55px !important;
    word-break: break-word !important;
  }
  th[colspan],
  td[colspan] {
    min-width: 0 !important;
    max-width: none !important;
  }
}
.patient-autocomplete-parent {
  position: relative;
}
.patient-autocomplete-parent .autocomplete-dropdown {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 20;
}
.date-filter-parent {
  position: relative;
}
@media (max-width: 795px) and (min-width: 569px) {
  .col-id-hide-795-569 {
    display: none !important;
  }
}
@media (min-width: 569px) {
  th,
  td {
    text-align: center !important;
  }
}
</style>
