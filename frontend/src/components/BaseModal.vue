<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 animate-fade-in"
    @mousedown.self="onClickOutside"
    @keydown.esc="onEsc"
    tabindex="-1"
    ref="overlayRef"
    role="dialog"
    aria-modal="true"
    :aria-label="props.ariaLabel"
    data-testid="modal-overlay"
  >
    <div
      class="bg-white rounded-[10px] shadow-xl max-w-lg w-full mx-4 p-0 relative animate-modal-pop-in"
      ref="modalRef"
      data-testid="modal-content"
      tabindex="0"
      @keydown.tab="onTab"
    >
      <slot />
      <button
        v-if="props.showClose"
        @click="$emit('close')"
        class="absolute top-2 right-2 p-2 rounded hover:bg-gray-100 focus:outline focus:outline-2 focus:outline-[#263238] transition-colors duration-200"
        aria-label="Fermer la modale"
        type="button"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

const props = defineProps<{ ariaLabel?: string; showClose?: boolean }>();
const emit = defineEmits(['close']);

const modalRef = ref<HTMLElement | null>(null);
const overlayRef = ref<HTMLElement | null>(null);

function focusFirstElement() {
  nextTick(() => {
    const el = modalRef.value;
    if (!el || typeof el.querySelectorAll !== 'function') return;
    const focusables = el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length) (focusables[0] as HTMLElement).focus();
    else (el as HTMLElement).focus();
  });
}

function onTab(e: KeyboardEvent) {
  const el = modalRef.value;
  if (!el || typeof el.querySelectorAll !== 'function') return;
  const focusables = Array.from(
    el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((f) => !f.hasAttribute('disabled'));
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

function onEsc() {
  emit('close');
}

function onClickOutside() {
  emit('close');
}

onMounted(() => {
  focusFirstElement();
  document.body.style.overflow = 'hidden';
});
onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* Overlay fade-in/out */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.animate-fade-in {
  animation: fade-in 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
.animate-fade-out {
  animation: fade-out 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Modal pop-in/out (scale + fade) */
@keyframes modal-pop-in {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(16px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
@keyframes modal-pop-out {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.96) translateY(16px);
  }
}
.animate-modal-pop-in {
  animation: modal-pop-in 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
.animate-modal-pop-out {
  animation: modal-pop-out 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
