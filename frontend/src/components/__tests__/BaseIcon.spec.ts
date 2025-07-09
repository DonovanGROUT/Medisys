/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage des icônes Material et FontAwesome
- Robustesse (type inconnu)
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import BaseIcon from '../BaseIcon.vue';

// Helper pour monter le composant BaseIcon avec props typées
function mountBaseIcon(props: {
  name: string;
  type?: 'material' | 'fa';
  size?: string;
  color?: string;
}): VueWrapper<InstanceType<typeof BaseIcon>> {
  return mount(BaseIcon, { props });
}

// -----------------------------------------------------------------------------
// Bloc Affichage
// -----------------------------------------------------------------------------
describe('BaseIcon – Affichage', () => {
  it('affiche une icône Material par défaut', () => {
    const wrapper = mountBaseIcon({ name: 'delete' });
    expect(wrapper.html()).toContain('material-icons');
    expect(wrapper.text()).toContain('delete');
  });

  it('affiche une icône FontAwesome si type="fa"', () => {
    const wrapper = mountBaseIcon({ name: 'user', type: 'fa' });
    expect(wrapper.html()).toContain('fa-user');
  });

  it('affiche le slot par défaut si type inconnu', () => {
    // Test de robustesse : type non supporté, on force le passage par le slot
    const wrapper = mount(BaseIcon, {
      props: { name: 'custom', type: 'unknown' as 'material' }, // typage strict, valeur non supportée
      slots: { default: '<svg class="custom-svg"/>' },
    });
    expect(wrapper.find('.custom-svg').exists()).toBe(true);
  });
});
