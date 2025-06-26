<!--
  -----------------------------------------------------------------------------
  Composant d’alerte globale (succès, erreur, info, accessible)
  -----------------------------------------------------------------------------
  Affiche un message d’alerte stylisé avec icône selon le type (info, succès, erreur).
  Utilisé pour les notifications globales ou locales dans l’application.

  Props :
    - type ('info'|'success'|'error') : type d’alerte
    - message (string) : texte à afficher

  Accessibilité :
    - Icône visuelle selon le type
    - Contraste couleurs conforme WCAG AA
    - Rôle implicite (ajouter role="alert" si besoin)

  Exemple d’utilisation :
    <Alert type="success" message="Patient ajouté avec succès" />

  -----------------------------------------------------------------------------
-->
<template>
  <!-- Message d’alerte stylisé -->
  <div
    v-if="message"
    :class="alertClass"
    class="rounded-[6px] px-4 py-2 mb-2 flex items-center gap-2 shadow"
  >
    <BaseIcon v-if="type === 'success'" name="check_circle" size="1.5em" class="shrink-0" />
    <BaseIcon v-else-if="type === 'error'" name="error" size="1.5em" class="shrink-0" />
    <BaseIcon v-else name="info" size="1.5em" class="shrink-0" />
    <span>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// Imports et typage
// -----------------------------------------------------------------------------
import { computed } from 'vue';
import BaseIcon from './BaseIcon.vue';

/**
 * Props du composant Alert
 * @prop {'info'|'success'|'error'} type - Type d’alerte
 * @prop {string} message - Texte à afficher
 */
const props = defineProps<{
  type: 'info' | 'success' | 'error';
  message: string;
}>();

/**
 * Classe CSS calculée selon le type d’alerte
 */
const alertClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-800 text-white';
    case 'error':
      return 'bg-red-800 text-white';
    case 'info':
    default:
      return 'bg-blue-50 text-blue-800';
  }
});
</script>
