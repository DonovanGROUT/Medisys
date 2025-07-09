/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage conditionnel du contenu
- Émission d’événements (fermeture, update:modelValue)
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/

import { describe, it, expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import Modal from '../Modal.vue';

// Helper pour monter le composant Modal avec props et slots
function mountModal(
  props: { modelValue: boolean },
  slots?: Record<string, string>
): VueWrapper<InstanceType<typeof Modal>> {
  return mount(Modal, { props, slots });
}

// -----------------------------------------------------------------------------
// Bloc Affichage
// -----------------------------------------------------------------------------
describe('Modal – Affichage', () => {
  it('affiche le contenu quand modelValue=true', () => {
    const wrapper = mountModal({ modelValue: true }, { default: '<div>Contenu</div>' });
    expect(wrapper.html()).toContain('Contenu');
  });

  it('n’affiche rien quand modelValue=false', () => {
    const wrapper = mountModal({ modelValue: false });
    expect(wrapper.html()).not.toContain('bg-white');
  });
});

// -----------------------------------------------------------------------------
// Bloc Événements
// -----------------------------------------------------------------------------
describe('Modal – Événements', () => {
  it('émet update:modelValue=false au clic sur le bouton de fermeture', async () => {
    const wrapper = mountModal({ modelValue: true });
    await wrapper.find('button[aria-label="Fermer la modale"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });
});

// -----------------------------------------------------------------------------
// Bloc Slots & Header
// -----------------------------------------------------------------------------
describe('Modal – Slots & Header', () => {
  it('affiche le slot title et le slot icon si fournis', () => {
    const wrapper = mountModal(
      { modelValue: true },
      {
        icon: '<span class="icon">[icon]</span>',
        title: '<span class="title">Titre personnalisé</span>',
        default: '<div>Contenu</div>',
      }
    );
    expect(wrapper.html()).toContain('Titre personnalisé');
    expect(wrapper.html()).toContain('[icon]');
  });

  it('affiche le fallback du slot title si non fourni', () => {
    const wrapper = mountModal({ modelValue: true }, { default: '<div>Contenu</div>' });
    // Le fallback est un span vide (nbsp)
    expect(wrapper.find('span.text-lg').exists()).toBe(true);
  });

  it('affiche uniquement le slot default si bare=true', () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true, bare: true },
      slots: { default: '<div>Contenu nu</div>' },
    });
    expect(wrapper.html()).toContain('Contenu nu');
    // Pas de header
    expect(wrapper.find('button[aria-label="Fermer la modale"]').exists()).toBe(false);
    expect(wrapper.find('.border-b').exists()).toBe(false);
  });
});

// -----------------------------------------------------------------------------
// Bloc Accessibilité & Structure
// -----------------------------------------------------------------------------
describe('Modal – Accessibilité', () => {
  it('le bouton de fermeture est focusable et a un aria-label', () => {
    const wrapper = mountModal({ modelValue: true });
    const btn = wrapper.find('button[aria-label="Fermer la modale"]');
    expect(btn.exists()).toBe(true);
    expect(btn.attributes('aria-label')).toBe('Fermer la modale');
  });

  it('la modale a un aria-label sur BaseModal', () => {
    const wrapper = mountModal({ modelValue: true });
    const baseModal = wrapper.findComponent({ name: 'BaseModal' });
    expect(baseModal.attributes('aria-label')).toBe('Modale');
  });
});

// -----------------------------------------------------------------------------
// Bloc Événements avancés (fermeture via overlay/Escape)
// -----------------------------------------------------------------------------
describe('Modal – Fermeture avancée', () => {
  it('émet update:modelValue=false quand BaseModal émet close (Escape ou overlay)', async () => {
    const wrapper = mountModal({ modelValue: true });
    // Simule l’émission de l’événement close par BaseModal
    await wrapper.findComponent({ name: 'BaseModal' }).vm.$emit('close');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
  });
});

// -----------------------------------------------------------------------------
// Bloc Cas limites
// -----------------------------------------------------------------------------
describe('Modal – Cas limites', () => {
  it('n’affiche aucun contenu de modale si modelValue=false', () => {
    const wrapper = mountModal({ modelValue: false });
    // On ne doit pas trouver le container de la modale ni le contenu principal
    expect(wrapper.find('.p-6').exists()).toBe(false);
    expect(wrapper.find('.bg-white').exists()).toBe(false);
  });

  it('supporte l’ouverture/fermeture dynamique', async () => {
    const wrapper = mountModal({ modelValue: false }, { default: '<div>Contenu</div>' });
    expect(wrapper.html()).not.toContain('Contenu');
    await wrapper.setProps({ modelValue: true });
    expect(wrapper.html()).toContain('Contenu');
    await wrapper.setProps({ modelValue: false });
    expect(wrapper.html()).not.toContain('Contenu');
  });
});
