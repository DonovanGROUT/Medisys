<!--
  AppointmentTableRow.vue — Ligne de tableau rendez-vous (affichage principal, accessible)
  -----------------------------------------------------------------------------
  Composant Vue 3 pour l’affichage d’un rendez-vous dans un tableau.
  - Utilisé dans la vue liste des rendez-vous (tableau principal)
  - Accessibilité renforcée (aria-label, focus, responsive)
  - Props typées, slot actions personnalisable

  Props :
    - appointment (Appointment) : données du rendez-vous à afficher

  Events émis :
    - view : demande d’affichage du rendez-vous
    - edit : demande d’édition du rendez-vous
    - delete : demande de suppression du rendez-vous

  Exemple d’utilisation :
    <AppointmentTableRow :appointment="appointment" @view="..." @edit="..." @delete="..." />
-->
<script setup lang="ts">
import type { Appointment } from '../types/Appointment';
import AppointmentActions from './AppointmentActions.vue';
import BaseIcon from './BaseIcon.vue';
import { formatNom, formatPrenom } from '../utils/formatNomPrenom';
import { formatDate, formatTime, statutFr, badgeClass, isPast } from '../utils/appointmentHelpers';
import { ref, onMounted, onUnmounted } from 'vue';

defineProps<{ appointment: Appointment }>();

const showIdColumn = ref(true);

function updateShowIdColumn() {
  const w = window.innerWidth;
  // Masquer la colonne ID uniquement entre 795px et 569px inclus
  showIdColumn.value = !(w <= 795 && w >= 569);
}

onMounted(() => {
  updateShowIdColumn();
  window.addEventListener('resize', updateShowIdColumn);
});
onUnmounted(() => {
  window.removeEventListener('resize', updateShowIdColumn);
});
</script>

<template>
  <tr :class="{ 'bg-gray-100': isPast(appointment.dateHeure) }">
    <td
      v-if="showIdColumn"
      class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base min-[640px]:max-[701px]:px-1 text-slate-800"
    >
      {{ appointment.id }}
    </td>
    <td
      class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base min-[640px]:max-[701px]:px-1 text-slate-800"
    >
      {{ appointment.motif }}
    </td>
    <td
      class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base min-[640px]:max-[701px]:px-1 text-slate-800"
    >
      {{ formatDate(appointment.dateHeure) }}
    </td>
    <td
      class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base min-[640px]:max-[701px]:px-1 text-slate-800"
    >
      {{ formatTime(appointment.dateHeure) }}
    </td>
    <td
      class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base min-[640px]:max-[701px]:px-1 text-slate-800"
    >
      <BaseIcon
        :name="
          appointment.patient.sexe === 'F'
            ? 'female'
            : appointment.patient.sexe === 'M'
              ? 'male'
              : 'transgender'
        "
        color="#1976D2"
        size="1.2em"
        class="align-middle mr-1"
        :aria-label="
          appointment.patient.sexe === 'F'
            ? 'Femme'
            : appointment.patient.sexe === 'M'
              ? 'Homme'
              : 'Autre'
        "
      />
      {{ formatNom(appointment.patient.nom) }} {{ formatPrenom(appointment.patient.prenom) }}
    </td>
    <td class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base min-[640px]:max-[701px]:px-1">
      <span
        :class="badgeClass(appointment.statut)"
        class="inline-block rounded-full px-3 py-1 text-sm font-semibold"
        aria-label="Statut du rendez-vous"
      >
        {{ statutFr(appointment.statut) }}
      </span>
    </td>
    <td class="px-2 py-2 sm:px-4 sm:py-2 text-sm sm:text-base min-[640px]:max-[701px]:px-1">
      <AppointmentActions @view="$emit('view')" @edit="$emit('edit')" @delete="$emit('delete')" />
    </td>
  </tr>
</template>

<style scoped>
@media (min-width: 569px) {
  td {
    text-align: center !important;
  }
}
</style>
