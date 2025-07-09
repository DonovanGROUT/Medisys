/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage & suggestions
- Sélection & événements
- Navigation clavier & accessibilité
- Robustesse (cas limites, erreurs)
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises, VueWrapper } from '@vue/test-utils';
import PatientAutocomplete from '../PatientAutocomplete.vue';
import type { Patient } from '../../types/Patient';
import * as patientService from '../../services/patientService';

// Helper pour monter le composant PatientAutocomplete avec stubs et props personnalisables
function mountPatientAutocomplete(
  props?: Partial<{ modelValue: Patient | null; placeholder: string; disabled: boolean }>
) {
  return mount(PatientAutocomplete, {
    props,
    global: {
      stubs: {
        BaseIcon: true,
      },
    },
  });
}

const mockPatients: Patient[] = [
  { id: 1, nom: 'Dupont', prenom: 'Marie', sexe: 'F', dateNaissance: '1985-04-12' },
  { id: 2, nom: 'Martin', prenom: 'Jean', sexe: 'M', dateNaissance: '1990-01-01' },
  { id: 3, nom: 'Durand', prenom: 'Paul', sexe: 'M', dateNaissance: '1978-09-23' },
];

// -----------------------------------------------------------------------------
// Bloc Affichage & Suggestions
// -----------------------------------------------------------------------------
describe('PatientAutocomplete – Affichage & Suggestions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // Vérifie l’affichage des suggestions selon la saisie
  it('affiche les suggestions selon la saisie', async () => {
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValue(mockPatients);
    const wrapper = mountPatientAutocomplete();
    const input = wrapper.find('input');
    await input.setValue('du');
    await input.trigger('input');
    await flushPromises();
    expect(wrapper.text()).toContain('DUPONT Marie');
    expect(wrapper.text()).toContain('DURAND Paul');
    expect(wrapper.text()).not.toContain('MARTIN Jean');
  });

  // Vérifie l’affichage du message "Aucun patient trouvé"
  it('affiche un message si aucun patient trouvé', async () => {
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValue(mockPatients);
    const wrapper = mountPatientAutocomplete();
    const input = wrapper.find('input');
    await input.setValue('zzzz');
    await input.trigger('input');
    await flushPromises();
    expect(wrapper.text()).toContain('Aucun patient trouvé');
  });

  // Vérifie l’affichage d’une suggestion sans date de naissance
  it('affiche une suggestion sans date de naissance sans planter', async () => {
    const patients = [{ id: 4, nom: 'Test', prenom: 'SansDate', sexe: 'F', dateNaissance: '' }];
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValue(patients);
    const wrapper = mountPatientAutocomplete();
    const input = wrapper.find('input');
    await input.setValue('test');
    await input.trigger('input');
    await flushPromises();
    expect(wrapper.text()).toContain('TEST Sansdate');
    expect(wrapper.find('span.text-xs').exists()).toBe(false);
  });
});

// -----------------------------------------------------------------------------
// Bloc Sélection & Événements
// -----------------------------------------------------------------------------
describe('PatientAutocomplete – Sélection & Événements', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // Vérifie la sélection d’un patient
  it('permet la sélection d’un patient', async () => {
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValue(mockPatients);
    const wrapper = mountPatientAutocomplete();
    const input = wrapper.find('input');
    await input.setValue('mar');
    await input.trigger('input');
    await flushPromises();
    const suggestion = wrapper.find('li');
    await suggestion.trigger('mousedown');
    expect(wrapper.text()).toContain('Patient sélectionné');
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
    const emissions = wrapper.emitted()['update:modelValue'] as [Patient[]][];
    expect(emissions[0][0]).toMatchObject({ nom: 'Dupont', prenom: 'Marie' });
  });

  // Vérifie le reset du champ et de l’émission lors du clic sur la croix
  it('reset le champ et l’émission quand on clique sur la croix', async () => {
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValue(mockPatients);
    const wrapper = mountPatientAutocomplete({ modelValue: mockPatients[0] });
    await flushPromises();
    expect(wrapper.text()).toContain('Patient sélectionné');
    const btn = wrapper.find('button[aria-label="Changer de patient sélectionné"]');
    await btn.trigger('click');
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
    const emissions = wrapper.emitted()['update:modelValue'] as [Patient[]][];
    expect(emissions[emissions.length - 1][0]).toBeNull();
  });

  // Vérifie la gestion d’un patient sans id
  it('gère le cas où selectedPatient n’a pas d’id', async () => {
    // Patient avec id invalide (undefined casté)
    const patientSansId: Patient = {
      id: undefined as unknown as number,
      nom: 'X',
      prenom: 'Y',
      sexe: 'F',
      dateNaissance: '',
    };
    const wrapper = mountPatientAutocomplete({ modelValue: patientSansId });
    await flushPromises();
    expect(wrapper.find('li[aria-selected="true"]').exists()).toBe(false);
  });
});

// -----------------------------------------------------------------------------
// Bloc Navigation clavier & Accessibilité
// -----------------------------------------------------------------------------
describe('PatientAutocomplete – Navigation & Accessibilité', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // Vérifie la navigation clavier et la sélection par entrée
  it('navigation clavier : flèche bas/haut + entrée sélectionne la suggestion', async () => {
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValue(mockPatients);
    const wrapper = mountPatientAutocomplete();
    const input = wrapper.find('input');
    await input.setValue('du');
    await input.trigger('input');
    await flushPromises();
    await input.trigger('keydown', { key: 'ArrowDown' });
    await input.trigger('keydown', { key: 'Enter' });
    await flushPromises();
    const emissions = wrapper.emitted()['update:modelValue'] as [Patient[]][];
    expect(emissions[emissions.length - 1][0]).toMatchObject({ nom: 'Durand', prenom: 'Paul' });
  });

  // Vérifie la fermeture des suggestions avec Escape
  it('ferme les suggestions avec Escape', async () => {
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValue(mockPatients);
    const wrapper = mountPatientAutocomplete();
    const input = wrapper.find('input');
    await input.setValue('du');
    await input.trigger('input');
    await flushPromises();
    expect(wrapper.findAll('li').length).toBeGreaterThan(0);
    await input.trigger('keydown', { key: 'Escape' });
    await flushPromises();
    expect(wrapper.findAll('li').length).toBe(0);
  });

  // Vérifie la gestion des attributs ARIA/accessibilité
  it('gère les attributs ARIA/accessibilité', async () => {
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValue(mockPatients);
    const wrapper = mountPatientAutocomplete();
    const input = wrapper.find('input');
    await input.setValue('du');
    await input.trigger('input');
    await flushPromises();
    expect(input.attributes('aria-autocomplete')).toBe('list');
    expect(input.attributes('aria-controls')).toBe('patient-suggestions');
    expect(wrapper.find('ul[role="listbox"]').exists()).toBe(true);
    expect(wrapper.find('li[role="option"]').exists()).toBe(true);
  });
});

// -----------------------------------------------------------------------------
// Bloc Robustesse
// -----------------------------------------------------------------------------
describe('PatientAutocomplete – Robustesse', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // Vérifie le reset sans patient sélectionné
  it('reset sans patient sélectionné ne déclenche pas d’erreur', async () => {
    const wrapper = mountPatientAutocomplete();
    expect(wrapper.find('button[aria-label="Changer de patient sélectionné"]').exists()).toBe(
      false
    );
    const input = wrapper.find('input');
    await input.setValue('du');
    await input.setValue('');
    expect(input.element.value).toBe('');
    expect(wrapper.find('li[role="option"]').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('Patient sélectionné');
  });

  // Vérifie le early return si patient déjà sélectionné
  it('onInput early return si patient déjà sélectionné', async () => {
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValue(mockPatients);
    const wrapper = mountPatientAutocomplete({ modelValue: mockPatients[0] });
    const input = wrapper.find('input');
    await input.setValue('du');
    await input.trigger('input');
    await flushPromises();
    expect(wrapper.find('li[role="option"]').exists()).toBe(false);
    expect(wrapper.text()).toContain('Patient sélectionné');
  });

  // Vérifie qu’une recherche trop courte ne déclenche pas de suggestions
  it('onInput : recherche trop courte ne déclenche pas de suggestions', async () => {
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValue(mockPatients);
    const wrapper = mountPatientAutocomplete();
    const input = wrapper.find('input');
    await input.setValue('d');
    await input.trigger('input');
    await flushPromises();
    expect(wrapper.find('li[role="option"]').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('Aucun patient trouvé');
  });

  // Vérifie la gestion d’une erreur réseau lors de fetchPatients
  it('onInput : fetchPatients en erreur n’affiche pas de suggestions', async () => {
    vi.spyOn(patientService, 'fetchPatients').mockRejectedValue(new Error('Erreur réseau'));
    const wrapper = mountPatientAutocomplete();
    const input = wrapper.find('input');
    await input.setValue('du');
    await input.trigger('input');
    await flushPromises();
    expect(wrapper.find('li[role="option"]').exists()).toBe(false);
    expect(wrapper.find('.text-sm.text-gray-500').exists()).toBe(false);
  });

  // Vérifie la désactivation du champ si disabled=true
  it('désactive le champ si disabled=true', () => {
    const wrapper = mountPatientAutocomplete({ disabled: true });
    const input = wrapper.find('input');
    expect(input.attributes('disabled')).toBeDefined();
  });
});
