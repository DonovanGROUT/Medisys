import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import PatientsList from '../PatientsList.vue';
import * as patientService from '../../services/patientService';
import type { ApiPatient, Patient } from '../../services/patientService';

// Mock du service patientService
vi.mock('../../services/patientService');

// On prépare les mocks au format API (anglais)
const mockPatientsApi: ApiPatient[] = [
  {
    id: 1,
    gender: 'M',
    lastName: 'Test',
    firstName: 'T',
    birthDate: '2000-01-01',
    phone: '',
    email: 'test@ex.com',
  },
  {
    id: 2,
    gender: 'F',
    lastName: 'Demo',
    firstName: 'D',
    birthDate: '1995-05-05',
    phone: '',
    email: 'demo@ex.com',
  },
];

/**
 * Test d'intégration de la vue PatientsList.vue
 * - Vérifie l'affichage de la liste des patients (mock API)
 * - Vérifie la gestion d'une erreur API
 */
describe('PatientsList.vue (intégration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Vérifie que la liste des patients est affichée correctement lorsque l'API retourne des données.
   */
  it('affiche la liste des patients (succès)', async () => {
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValue(
      mockPatientsApi as unknown as Patient[]
    );
    const wrapper = mount(PatientsList);
    await flushPromises();
    // On vérifie que les patients sont bien affichés (au moins 2 lignes)
    expect(wrapper.text()).toContain('Test T');
    expect(wrapper.text()).toContain('Demo D');
    expect(wrapper.findAll('[data-testid="patient-row"]').length).toBeGreaterThanOrEqual(2);
  });

  /**
   * Vérifie que le message d'erreur est affiché si l'API échoue.
   */
  it('affiche une erreur si l’API échoue', async () => {
    vi.spyOn(patientService, 'fetchPatients').mockRejectedValue(new Error('Erreur API'));
    const wrapper = mount(PatientsList);
    await flushPromises();
    expect(wrapper.get('[data-testid="error-message"]').text()).toContain('Erreur API');
  });
});

/**
 * Test d'intégration de la création de patient
 * - Succès : le patient est ajouté à la liste
 * - Erreur de validation : les messages d'erreur sont affichés
 */
describe('PatientsList.vue (création patient)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Vérifie qu'un patient est ajouté à la liste après une création réussie.
   */
  it('ajoute un patient à la liste (succès)', async () => {
    // Mock initial : liste vide
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([] as unknown as Patient[]);
    // Mock création : succès (format ApiPatient)
    vi.spyOn(patientService, 'createPatient').mockResolvedValue({
      id: 3,
      gender: 'M',
      lastName: 'Nouveau',
      firstName: 'Test',
      birthDate: '1990-01-01',
      phone: '0102030405',
      email: 'nouveau@ex.com',
    } as unknown as Patient);
    // Mock fetch après création : retourne le nouveau patient (format ApiPatient)
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([
      {
        id: 3,
        gender: 'M',
        lastName: 'Nouveau',
        firstName: 'Test',
        birthDate: '1990-01-01',
        phone: '0102030405',
        email: 'nouveau@ex.com',
      } as unknown as Patient,
    ] as unknown as Patient[]);
    const wrapper = mount(PatientsList);
    await flushPromises();
    // Simule l'ouverture de la modale et la soumission du formulaire
    await wrapper.find('button[aria-label="Ajouter un patient"]').trigger('click');
    await flushPromises(); // attendre que la modale s'affiche
    // Remplir le formulaire (adapter les sélecteurs pour utiliser les id)
    const lastNameInput = wrapper.find('#lastName');
    const firstNameInput = wrapper.find('#firstName');
    const birthDateInput = wrapper.find('#dateNaissance');
    const emailInput = wrapper.find('#email');
    const sexeSelect = wrapper.find('#sexe');
    expect(lastNameInput.exists()).toBe(true);
    expect(firstNameInput.exists()).toBe(true);
    expect(birthDateInput.exists()).toBe(true);
    expect(emailInput.exists()).toBe(true);
    expect(sexeSelect.exists()).toBe(true);
    await lastNameInput.setValue('Nouveau');
    await firstNameInput.setValue('Test');
    await birthDateInput.setValue('1990-01-01');
    await emailInput.setValue('nouveau@ex.com');
    await sexeSelect.setValue('M');
    await wrapper.find('form').trigger('submit.prevent');
    // Attendre la propagation asynchrone et la fermeture de la modale
    let tries = 0;
    while (wrapper.text().includes('Ajouter un patient') && tries < 10) {
      await flushPromises();
      tries++;
    }
    // Attendre que la liste soit mise à jour
    tries = 0;
    while (!wrapper.text().includes('Nouveau') && tries < 10) {
      await flushPromises();
      tries++;
    }
    // Vérifie que le patient apparaît dans la liste
    expect(wrapper.text()).toContain('Nouveau');
    expect(wrapper.text()).toContain('Test');
    expect(wrapper.text()).toContain('nouveau@ex.com');
  });

  /**
   * Vérifie que les erreurs de validation sont affichées si l'API retourne des violations.
   */
  it('affiche les erreurs de validation lors de la création', async () => {
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([]);
    vi.spyOn(patientService, 'createPatient').mockRejectedValue({
      violations: {
        nom: ['Le nom est requis.'],
        email: ['Email invalide'],
      },
    });
    const wrapper = mount(PatientsList);
    await flushPromises();
    await wrapper.find('button[aria-label="Ajouter un patient"]').trigger('click');
    await flushPromises(); // attendre que la modale s'affiche
    // Remplir le champ email avec une valeur invalide pour déclencher la validation
    const emailInput = wrapper.find('#email');
    expect(emailInput.exists()).toBe(true);
    await emailInput.setValue('test@');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    await flushPromises();
    // Vérifie que les messages d'erreur sont affichés
    expect(wrapper.text()).toContain('Le nom est requis.');
    expect(wrapper.text()).toContain("L'email doit contenir un point après l'arobase.");
  });
});

/**
 * Test d'intégration de la modification et suppression de patient
 * - Succès : le patient est modifié ou supprimé dans la liste
 */
describe('PatientsList.vue (édition/suppression patient)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('modifie un patient existant (succès)', async () => {
    // Mock initial : 1 patient
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([
      {
        id: 1,
        gender: 'M',
        lastName: 'Test',
        firstName: 'T',
        birthDate: '2000-01-01',
        phone: '',
        email: 'test@ex.com',
      } as unknown as Patient,
    ] as unknown as Patient[]);
    // Mock update : succès
    vi.spyOn(patientService, 'updatePatient').mockResolvedValue({
      id: 1,
      gender: 'M',
      lastName: 'TestModif',
      firstName: 'T',
      birthDate: '2000-01-01',
      phone: '',
      email: 'testmodif@ex.com',
    } as unknown as Patient);
    // Mock fetch après update
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([
      {
        id: 1,
        gender: 'M',
        lastName: 'TestModif',
        firstName: 'T',
        birthDate: '2000-01-01',
        phone: '',
        email: 'testmodif@ex.com',
      } as unknown as Patient,
    ] as unknown as Patient[]);
    const wrapper = mount(PatientsList);
    await flushPromises();
    // Simule l'ouverture du formulaire d'édition (adapter le sélecteur si besoin)
    await wrapper.find('[data-testid="edit-patient-btn"]').trigger('click');
    await flushPromises();
    // Remplir le champ nom
    const lastNameInput = wrapper.find('#lastName');
    expect(lastNameInput.exists()).toBe(true);
    await lastNameInput.setValue('TestModif');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    // Vérifie que le patient modifié apparaît dans la liste
    expect(wrapper.text()).toContain('TestModif');
    expect(wrapper.text()).toContain('testmodif@ex.com');
  });

  it('supprime un patient existant (succès)', async () => {
    // Mock initial : 1 patient
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([
      {
        id: 2,
        gender: 'F',
        lastName: 'Demo',
        firstName: 'D',
        birthDate: '1995-05-05',
        phone: '',
        email: 'demo@ex.com',
      } as unknown as Patient,
    ] as unknown as Patient[]);
    // Mock suppression : succès
    vi.spyOn(patientService, 'deletePatient').mockResolvedValue(true);
    // Mock fetch après suppression : liste vide
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([] as unknown as Patient[]);
    const wrapper = mount(PatientsList);
    await flushPromises();
    // Simule le clic sur le bouton de suppression
    await wrapper.find('[data-testid="delete-patient-btn"]').trigger('click');
    await flushPromises();
    // Simule le clic sur le bouton de confirmation dans la modale
    await wrapper.find('[data-testid="confirm-delete-btn"]').trigger('click');
    await flushPromises();
    // Vérifie que le patient n'apparaît plus dans la liste
    expect(wrapper.text()).not.toContain('Demo');
    expect(wrapper.text()).not.toContain('demo@ex.com');
  });

  /**
   * Vérifie que le message d'erreur est affiché si l'API échoue lors de la suppression d'un patient.
   * - Mocke un échec de suppression (deletePatient reject)
   * - Vérifie l'affichage du message d'erreur dans l'UI
   */
  it('affiche une erreur si la suppression échoue', async () => {
    // Mock initial : 1 patient
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([
      {
        id: 2,
        gender: 'F',
        lastName: 'Demo',
        firstName: 'D',
        birthDate: '1995-05-05',
        phone: '',
        email: 'demo@ex.com',
      } as unknown as Patient,
    ] as unknown as Patient[]);
    // Mock suppression : échec
    vi.spyOn(patientService, 'deletePatient').mockRejectedValue(
      new Error('Erreur API suppression')
    );
    const wrapper = mount(PatientsList);
    await flushPromises();
    // Simule le clic sur le bouton de suppression
    await wrapper.find('[data-testid="delete-patient-btn"]').trigger('click');
    await flushPromises();
    // Simule le clic sur le bouton de confirmation dans la modale
    await wrapper.find('[data-testid="confirm-delete-btn"]').trigger('click');
    await flushPromises();
    // Vérifie que le message d'erreur s'affiche
    expect(wrapper.text()).toContain('Erreur API suppression');
  });
});

/**
 * Test d'accessibilité de la vue PatientsList.vue
 * - Vérifie que le bouton "Ajouter un patient" est accessible au clavier (focusable)
 * - Garantit la conformité minimale pour la navigation clavier
 */
describe('PatientsList.vue (accessibilité)', () => {
  /**
   * Vérifie que le bouton "Ajouter un patient" peut recevoir le focus via .focus()
   * (simulateur de navigation clavier)
   */
  it('le bouton Ajouter un patient est focusable au clavier', async () => {
    vi.spyOn(patientService, 'fetchPatients').mockResolvedValue([] as unknown as Patient[]);
    const wrapper = mount(PatientsList, { attachTo: document.body });
    await flushPromises();
    const addBtn = wrapper.find('button[aria-label="Ajouter un patient"]');
    expect(addBtn.exists()).toBe(true);
    (addBtn.element as HTMLElement).focus();
    expect(document.activeElement).toBe(addBtn.element);
    wrapper.unmount();
  });
});
