<!--
  AppointmentView.vue — Vue détaillée d’un rendez-vous (lecture seule, accessible)
  -----------------------------------------------------------------------------
  Composant Vue 3 pour l’affichage détaillé d’un rendez-vous.
  - Utilisé dans la modale ou page de consultation rendez-vous
  - Accessibilité renforcée (contraste, fallback tiret)
  - Props typées

  Props :
    - appointment (Appointment) : données du rendez-vous à afficher

  Exemple d’utilisation :
    <AppointmentView :appointment="appointment" />
-->
<template>
  <div v-if="appointment" class="space-y-3">
    <div class="flex items-center gap-2">
      <span class="font-semibold">Motif :</span> {{ appointment.motif || '—' }}
    </div>
    <div class="flex items-center gap-2">
      <span class="font-semibold">Date :</span> {{ formatDate(appointment.dateHeure) || '—' }}
    </div>
    <div class="flex items-center gap-2">
      <span class="font-semibold">Heure :</span> {{ formatTime(appointment.dateHeure) || '—' }}
    </div>
    <div class="flex items-center gap-2">
      <BaseIcon
        :name="
          appointment.patient?.sexe === 'F'
            ? 'female'
            : appointment.patient?.sexe === 'M'
              ? 'male'
              : 'transgender'
        "
        color="#1976D2"
        size="1.3em"
      />
      <span class="font-semibold">Patient :</span>
      <span>
        <template v-if="!appointment.patient?.nom && !appointment.patient?.prenom">—</template>
        <template v-else>
          {{ appointment.patient?.nom || '—' }} {{ appointment.patient?.prenom || '—' }}
        </template>
      </span>
      <router-link
        v-if="appointment.patient?.id"
        :to="`/patients/${appointment.patient.id}`"
        class="ml-2 rounded-[6px] border border-blue-800 text-blue-800 bg-white px-3 py-1 text-xs font-semibold hover:bg-blue-800 hover:text-white transition-all duration-200 focus:outline focus:outline-2 focus:outline-blue-800 flex items-center gap-2"
        aria-label="Voir la fiche patient"
      >
        <BaseIcon name="person" size="1.1em" aria-hidden="true" />
        Voir fiche patient
      </router-link>
    </div>
    <div class="flex items-center gap-2">
      <span class="font-semibold">Date de naissance :</span>
      {{ appointment.patient?.dateNaissance ? formatDate(appointment.patient.dateNaissance) : '—' }}
    </div>
    <div class="flex items-center gap-2">
      <span class="font-semibold">Durée :</span>
      {{ appointment.duree ? appointment.duree + ' min' : '—' }}
    </div>
    <div class="flex items-center gap-2">
      <span class="font-semibold">Statut :</span>
      <span
        :class="badgeClass(appointment.statut)"
        class="inline-block rounded-full px-3 py-1 text-sm font-semibold ml-1"
        aria-label="Statut du rendez-vous"
      >
        {{ statutFr(appointment.statut) }}
      </span>
    </div>
  </div>
  <div v-else class="text-slate-800 italic">Aucun rendez-vous sélectionné.</div>
</template>

<script setup lang="ts">
import { formatDate, formatTime, statutFr, badgeClass } from '../utils/appointmentHelpers';
import type { Appointment } from '../types/Appointment';
import BaseIcon from './BaseIcon.vue';

defineProps<{ appointment: Appointment | null }>();
</script>

<style scoped></style>
