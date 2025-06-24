<!--
  -----------------------------------------------------------------------------
  Composant modale générique (accessibilité, transitions, slots)
  -----------------------------------------------------------------------------
  Affiche une boîte de dialogue modale centrée, avec overlay, header personnalisable,
  et gestion de la fermeture.

  Props :
    - modelValue (boolean) : contrôle l’ouverture/fermeture de la modale

  Slots :
    - icon : icône contextuelle optionnelle dans l’en-tête
    - title : titre de la modale
    - default : contenu principal

  Events émis :
    - update:modelValue : fermeture de la modale (v-model)

  Accessibilité :
    - Overlay semi-transparent
    - Bouton de fermeture avec aria-label
    - Contraste couleurs conforme WCAG AA
    - Transitions animées

  Exemple d’utilisation :
    <Modal v-model="showModal"><template #title>Mon titre</template>...</Modal>

  -----------------------------------------------------------------------------
-->
<template>
  <!-- Modale générique avec overlay -->
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        class="bg-white rounded-[10px] shadow-xl max-w-lg w-full mx-4 p-0 relative animate-fade-in"
      >
        <!-- Header de la modale -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] rounded-t-[10px] bg-[#F5F5F5]"
        >
          <slot name="icon">
            <!-- Icône contextuelle optionnelle -->
          </slot>
          <slot name="title">
            <span class="text-lg font-semibold text-[#263238]">&nbsp;</span>
          </slot>
          <button
            @click="$emit('update:modelValue', false)"
            aria-label="Fermer la modale"
            class="ml-auto text-[#263238] hover:text-[#E53935] text-2xl font-bold focus:outline focus:outline-2 focus:outline-[#1976D2] flex items-center justify-center"
          >
            <BaseIcon name="close" size="1.7em" />
          </button>
        </div>
        <!-- Contenu principal -->
        <div class="p-6">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// Import du composant d’icône de base (Material Icons SVG)
// -----------------------------------------------------------------------------
import BaseIcon from './BaseIcon.vue';
// -----------------------------------------------------------------------------
// Définition des props typées (TypeScript)
// -----------------------------------------------------------------------------
defineProps<{ modelValue: boolean }>();
defineEmits(['update:modelValue']);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
