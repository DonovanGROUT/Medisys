<!--
  PatientView.vue — Vue détaillée d’un patient (lecture seule, accessible)
  ------------------------------------------------------------------------
  Composant Vue 3 pour l’affichage détaillé d’un patient.
  - Utilisé dans les modales ou pages de consultation patient
  - Accessibilité renforcée (icônes, contraste, fallback tiret)
  - Props typées

  Props :
    - patient (objet Patient) : données du patient à afficher

  Accessibilité :
    - Icônes visuelles pour chaque champ
    - Contraste couleurs conforme WCAG AA
    - Champs vides affichés par un tiret (—)

  Exemple d’utilisation :
    <PatientView :patient="patient" />
-->
<template>
  <!-- Fiche détaillée du patient -->
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <BaseIcon name="person" color="#1976D2" size="1.3em" />
      <span class="font-semibold">Nom :</span> {{ patient.nom }}
    </div>
    <div class="flex items-center gap-2">
      <BaseIcon name="person" color="#1976D2" size="1.3em" />
      <span class="font-semibold">Prénom :</span> {{ patient.prenom }}
    </div>
    <div class="flex items-center gap-2">
      <BaseIcon
        :name="patient.sexe === 'F' ? 'female' : patient.sexe === 'M' ? 'male' : 'transgender'"
        color="#1976D2"
        size="1.3em"
      />
      <span class="font-semibold">Sexe :</span>
      {{ patient.sexe === 'F' ? 'Femme' : patient.sexe === 'M' ? 'Homme' : 'Autre' }}
    </div>
    <div class="flex items-center gap-2">
      <BaseIcon name="cake" color="#1976D2" size="1.3em" />
      <span class="font-semibold">Date de naissance :</span> {{ birthDateFormatted }}
    </div>
    <div class="flex items-center gap-2">
      <BaseIcon name="call" color="#1976D2" size="1.3em" />
      <span class="font-semibold">Téléphone :</span> {{ patient.telephone || '—' }}
    </div>
    <div class="flex items-center gap-2">
      <BaseIcon name="email" color="#1976D2" size="1.3em" />
      <span class="font-semibold">Email :</span> {{ patient.email || '—' }}
    </div>
  </div>
</template>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// Import du composant d’icône de base (Material Icons SVG)
// -----------------------------------------------------------------------------
import BaseIcon from './BaseIcon.vue';
import { computed } from 'vue';

/**
 * Props du composant PatientView
 * @prop {Patient} patient - Données du patient à afficher
 */
const props = defineProps<{ patient: any }>();

/**
 * Date de naissance formatée selon la langue du navigateur
 */
const birthDateFormatted = computed(() => {
  if (!props.patient?.dateNaissance) return '';
  const date = new Date(props.patient.dateNaissance);
  if (navigator.language.startsWith('fr')) {
    return date.toLocaleDateString('fr-FR');
  }
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
});
</script>
