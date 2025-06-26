<!--
  -----------------------------------------------------------------------------
  Composant d’icône de base (Material Icons ou FontAwesome, accessible)
  -----------------------------------------------------------------------------
  Affiche une icône vectorielle (Material Icons par défaut, FontAwesome possible).
  Utilisé partout pour harmoniser l’affichage des icônes.

  Props :
    - name (string) : nom de l’icône (ex: 'delete', 'edit', 'user')
    - type ('material'|'fa', optionnel) : type d’icône ('material' par défaut)
    - size (string, optionnel) : taille CSS (ex: '24px', '1.5em')
    - color (string, optionnel) : couleur CSS

  Slots :
    - default : permet d’injecter un SVG personnalisé si besoin

  Accessibilité :
    - Icônes décoratives (aria-hidden)
    - Contraste couleurs conforme WCAG AA

  Exemple d’utilisation :
    <BaseIcon name="delete" size="2em" color="#E53935" />

  -----------------------------------------------------------------------------
-->
<template>
  <!-- Affichage de l’icône selon le type -->
  <span v-if="iconType === 'material'" class="material-icons align-middle" :style="iconStyle">{{
    name
  }}</span>
  <i
    v-else-if="iconType === 'fa'"
    :class="['fa', `fa-${name}`]"
    :style="iconStyle"
    aria-hidden="true"
  ></i>
  <slot v-else />
</template>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// Imports et typage
// -----------------------------------------------------------------------------
import { computed } from 'vue';

/**
 * Props du composant BaseIcon
 * @prop {string} name - Nom de l'icône (ex: 'delete', 'edit', 'user')
 * @prop {'material'|'fa'} [type] - Type d’icône ('material' par défaut)
 * @prop {string} [size] - Taille CSS (ex: '24px', '1.5em')
 * @prop {string} [color] - Couleur CSS
 */
const props = defineProps<{
  name: string; // nom de l'icône (ex: 'delete', 'edit', 'user')
  type?: 'material' | 'fa'; // 'material' (par défaut) ou 'fa' (FontAwesome)
  size?: string; // ex: '24px', '1.5em'
  color?: string;
}>();

/**
 * Type d’icône à afficher ('material' ou 'fa')
 */
const iconType = computed(() => props.type || 'material');

/**
 * Style CSS appliqué à l’icône (taille, couleur)
 */
const iconStyle = computed(() => ({
  fontSize: props.size || '1.5em',
  color: props.color || 'inherit',
}));
</script>

<!--
Pour Material Icons :
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
Pour FontAwesome :
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
-->
