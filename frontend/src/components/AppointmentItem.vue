<!--
  AppointmentItem.vue — Carte rendez-vous (affichage principal, accessible, modulaire)
  -----------------------------------------------------------------------------
  Composant Vue 3 pour l’affichage synthétique d’un rendez-vous.
  - Utilisé dans la liste des rendez-vous
  - Accessibilité renforcée (structure, aria-label, focus, contraste)
  - Props typées

  Props :
    - appointment (Appointment) : données du rendez-vous à afficher

  Exemple d’utilisation :
    <AppointmentItem :appointment="appointment" />
-->
<template>
  <div
    :class="[
      'border rounded-[6px] p-2 min-[450px]:p-4 mb-2 flex flex-col gap-3 bg-white shadow-sm overflow-x-hidden min-h-[180px] flex-1',
      isPast(appointment.dateHeure) ? 'bg-gray-100' : '',
    ]"
  >
    <!-- Motif + Statut responsive: <569px = colonne (statut sous motif), <450px = ligne (statut à droite) -->
    <div
      class="flex flex-col min-[450px]:flex-col min-[569px]:flex-row min-[569px]:items-center min-[569px]:justify-between mb-2 gap-2"
    >
      <!-- Titre + statut sur la même ligne entre 376px et 449px -->
      <div
        class="flex flex-col min-[376px]:max-[449px]:flex-row min-[376px]:max-[449px]:items-center min-[376px]:max-[449px]:justify-between w-full"
      >
        <div
          class="font-semibold text-blue-800 text-base break-words max-w-full text-center min-[569px]:text-left"
        >
          {{ appointment.motif }}
        </div>
        <div
          class="flex items-center gap-1 self-center min-[450px]:self-center min-[450px]:justify-center min-[450px]:w-full min-[450px]:mt-2 min-[569px]:ml-2 min-[569px]:self-auto min-[450px]:max-[568px]:justify-center min-[450px]:max-[568px]:w-full min-[376px]:max-[449px]:ml-2"
        >
          <span class="text-xs text-slate-700 font-medium mr-1">Statut : </span>
          <span
            :class="badgeClass(appointment.statut)"
            class="inline-block rounded-full px-3 py-1 text-xs font-semibold text-center"
            aria-label="Statut du rendez-vous"
          >
            {{ statutFr(appointment.statut) }}
          </span>
        </div>
      </div>
    </div>
    <div
      class="flex flex-wrap items-center text-slate-800 text-sm mb-1 justify-center text-center min-[569px]:justify-start min-[569px]:text-left"
    >
      <span class="mr-2 break-words max-w-full">
        <svg
          v-if="appointment.patient.sexe === 'F'"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 20 20"
          aria-label="Femme"
          class="inline align-middle mr-1"
        >
          <circle cx="10" cy="7" r="4" stroke="#1976D2" stroke-width="2" />
          <path d="M10 11v5M7 16h6" stroke="#1976D2" stroke-width="2" />
        </svg>
        <svg
          v-else-if="appointment.patient.sexe === 'M'"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 20 20"
          aria-label="Homme"
          class="inline align-middle mr-1"
        >
          <circle cx="10" cy="7" r="4" stroke="#1976D2" stroke-width="2" />
          <path d="M14 3l3 3M17 3v3h-3" stroke="#1976D2" stroke-width="2" />
        </svg>
        <svg
          v-else
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 20 20"
          aria-label="Autre"
          class="inline align-middle mr-1"
        >
          <circle cx="10" cy="7" r="4" stroke="#1976D2" stroke-width="2" />
          <path d="M10 11v5" stroke="#1976D2" stroke-width="2" />
        </svg>
        <span class="font-semibold break-words max-w-full"
          >{{ appointment.patient.prenom }} {{ appointment.patient.nom }}</span
        >
      </span>
    </div>
    <div
      class="flex flex-row flex-wrap gap-2 text-xs text-slate-700 mb-1 break-words max-w-full justify-center text-center min-[569px]:justify-start min-[569px]:text-left min-[376px]:max-[449px]:text-base"
    >
      <span>
        Date :
        <span class="font-bold min-[569px]:font-normal">{{
          formatDate(appointment.dateHeure)
        }}</span>
      </span>
      <span>
        Heure :
        <span class="font-bold min-[569px]:font-normal">{{
          formatTime(appointment.dateHeure)
        }}</span>
      </span>
      <span>
        Durée : <span class="font-bold min-[569px]:font-normal">{{ appointment.duree }} min</span>
      </span>
    </div>
    <!-- Bloc boutons aligné en bas sur mobile -->
    <div>
      <AppointmentActions @view="$emit('view')" @edit="$emit('edit')" @delete="$emit('delete')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Appointment } from '../types/Appointment';
import AppointmentActions from './AppointmentActions.vue';
import { formatDate, formatTime, statutFr, badgeClass, isPast } from '../utils/appointmentHelpers';

defineProps<{ appointment: Appointment }>();

defineEmits(['view', 'edit', 'delete']);
</script>

<style scoped></style>
