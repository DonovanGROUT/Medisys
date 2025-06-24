/*
 * Tests unitaires du composant PatientView.vue
 * Vérifie l'affichage des informations patient et le fallback si données manquantes.
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PatientView from '../PatientView.vue';

describe('PatientView', () => {
  const patient = {
    nom: 'Dupont',
    prenom: 'Marie',
    sexe: 'F',
    dateNaissance: '1985-04-12',
    telephone: '0601020304',
    email: 'marie.dupont@email.com',
  };

  // Vérifie que toutes les informations du patient sont affichées
  it('affiche toutes les infos du patient', () => {
    const wrapper = mount(PatientView, { props: { patient } });
    expect(wrapper.text()).toContain('Dupont');
    expect(wrapper.text()).toContain('Marie');
    expect(wrapper.text()).toContain('Femme');
    expect(wrapper.text()).toContain('1985-04-12');
    expect(wrapper.text()).toContain('0601020304');
    expect(wrapper.text()).toContain('marie.dupont@email.com');
  });

  // Vérifie qu'un tiret est affiché si téléphone ou email manquant
  it('affiche un tiret si téléphone ou email manquant', () => {
    const wrapper = mount(PatientView, {
      props: { patient: { ...patient, telephone: '', email: '' } },
    });
    expect(wrapper.text()).toContain('—');
  });
});
