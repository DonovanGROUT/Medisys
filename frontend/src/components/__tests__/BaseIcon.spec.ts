/*
 * Tests unitaires du composant BaseIcon.vue
 * Vérifie l'affichage des icônes Material et FontAwesome selon les props.
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseIcon from '../BaseIcon.vue';

describe('BaseIcon', () => {
  // Vérifie que l'icône Material est affichée par défaut
  it('affiche une icône Material par défaut', () => {
    const wrapper = mount(BaseIcon, { props: { name: 'delete' } });
    expect(wrapper.html()).toContain('material-icons');
    expect(wrapper.text()).toContain('delete');
  });

  // Vérifie que l'icône FontAwesome est affichée si type="fa"
  it('affiche une icône FontAwesome si type="fa"', () => {
    const wrapper = mount(BaseIcon, { props: { name: 'user', type: 'fa' } });
    expect(wrapper.html()).toContain('fa-user');
  });
});
