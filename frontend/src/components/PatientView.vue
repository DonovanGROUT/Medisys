<!--
  -----------------------------------------------------------------------------
  Vue détaillée d’un patient (lecture seule, modulaire, accessible)
  -----------------------------------------------------------------------------
  Affiche les informations détaillées d’un patient sous forme de fiche.
  Utilisé dans les modales ou pages de consultation patient.

  Props :
    - patient (objet Patient) : données du patient à afficher

  Accessibilité :
    - Icônes visuelles pour chaque champ
    - Contraste couleurs conforme WCAG AA
    - Champs vides affichés par un tiret (—)

  Exemple d’utilisation :
    <PatientView :patient="patient" />

  -----------------------------------------------------------------------------
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
      <span class="font-semibold">Date de naissance :</span> {{ patient.dateNaissance }}
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
// -----------------------------------------------------------------------------
// Définition des props typées (TypeScript)
// -----------------------------------------------------------------------------
defineProps<{ patient: any }>();
</script>
