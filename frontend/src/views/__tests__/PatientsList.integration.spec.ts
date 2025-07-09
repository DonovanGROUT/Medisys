/**
 * -------------------------------------------------
 * Sommaire des blocs de tests :
 * - Affichage des patients (succès, erreur API)
 * - Création de patients (succès, erreurs validation)
 * - Modification de patients (succès)
 * - Suppression de patients (succès, erreur API, retour false)
 * - Gestion d'erreur (API, validation, exceptions)
 * - Robustesse (valeurs inattendues, cas limites)
 * - Accessibilité (navigation clavier)
 * Helpers/mocks centralisés en haut de fichier.
 * -------------------------------------------------
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises, VueWrapper } from '@vue/test-utils';
import PatientsList from '../PatientsList.vue';
import * as patientService from '../../services/patientService';
import type { Patient } from '../../services/patientService';

vi.mock('../../services/patientService');

// Stub global BaseIcon pour supprimer les warnings de test
const globalStubs = { stubs: { BaseIcon: true } };

// Helper DRY pour factoriser la création du wrapper avec stubs par défaut
type MountPatientsListOptions = {
  attachTo?: string | Element;
  [key: string]: unknown;
};

function mountPatientsList(options: MountPatientsListOptions = {}) {
  const { attachTo, ...customStubs } = options;
  return mount(PatientsList, {
    ...(attachTo ? { attachTo } : {}),
    global: { stubs: { BaseIcon: true, ...customStubs } },
  });
}

type PatientsListInstance = InstanceType<typeof PatientsList> & {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  showModal: boolean;
  modalMode: 'create' | 'edit' | null;
  selectedPatient: Patient | null;
  showDeleteModal: boolean;
  patientToDelete: Patient | null;
  openCreateModal: () => void;
  openEditModal: (patient: Patient) => void;
  openDeleteModal: (patient: Patient) => void;
  closeModal: () => void;
  closeDeleteModal: () => void;
  confirmDelete: () => Promise<void>;
  handleFormSubmit: (patient: Patient) => Promise<void>;
  fetchPatients: () => Promise<void>;
};

const mockPatients: Patient[] = [
  {
    id: 1,
    nom: 'Test',
    prenom: 'T',
    sexe: 'M',
    dateNaissance: '2000-01-01',
    telephone: '',
    email: 'test@ex.com',
  },
  {
    id: 2,
    nom: 'Demo',
    prenom: 'D',
    sexe: 'F',
    dateNaissance: '1995-05-05',
    telephone: '',
    email: 'demo@ex.com',
  },
];

// Helper pour attendre les mises à jour asynchrones
function waitForUpdates(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 10));
}

// Helper pour simuler une attente de fermeture de modale
async function waitForModalClose(
  wrapper: VueWrapper<InstanceType<typeof PatientsList>>,
  maxTries = 10
) {
  let tries = 0;
  while (wrapper.text().includes('Ajouter un patient') && tries < maxTries) {
    await flushPromises();
    tries++;
  }
}

// Helper pour simuler une attente d'apparition de contenu
async function waitForContent(
  wrapper: VueWrapper<InstanceType<typeof PatientsList>>,
  content: string,
  maxTries = 10
) {
  let tries = 0;
  while (!wrapper.text().toLowerCase().includes(content.toLowerCase()) && tries < maxTries) {
    await flushPromises();
    tries++;
  }
}

describe("PatientsList - Tests d'intégration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Affichage des patients', () => {
    it('affiche la liste des patients avec succès', async () => {
      vi.spyOn(patientService, 'fetchPatients').mockResolvedValue(mockPatients);
      const wrapper = mountPatientsList();
      await flushPromises();

      expect(wrapper.text()).toContain('TEST');
      expect(wrapper.text()).toContain('T');
      expect(wrapper.text()).toContain('DEMO');
      expect(wrapper.text()).toContain('D');
      expect(wrapper.text()).toContain('test@ex.com');
      expect(wrapper.text()).toContain('demo@ex.com');
      expect(wrapper.findAll('[data-testid="patient-row"]').length).toBeGreaterThanOrEqual(2);
    });

    it("affiche le message d'erreur en cas d'échec API", async () => {
      vi.spyOn(patientService, 'fetchPatients').mockRejectedValue(new Error('Erreur API'));
      const wrapper = mountPatientsList();
      await flushPromises();

      expect(wrapper.get('[data-testid="error-message"]').text()).toContain('Erreur API');
    });
  });

  describe('Création de patients', () => {
    it('ajoute un patient avec succès', async () => {
      vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([] as unknown as Patient[]);
      vi.spyOn(patientService, 'createPatient').mockResolvedValue({
        id: 3,
        nom: 'Nouveau',
        prenom: 'Test',
        sexe: 'M',
        dateNaissance: '1990-01-01',
        telephone: '0102030405',
        email: 'nouveau@ex.com',
      } as unknown as Patient);
      vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([
        {
          id: 3,
          nom: 'Nouveau',
          prenom: 'Test',
          sexe: 'M',
          dateNaissance: '1990-01-01',
          telephone: '0102030405',
          email: 'nouveau@ex.com',
        } as unknown as Patient,
      ] as unknown as Patient[]);

      const wrapper = mountPatientsList();
      await flushPromises();

      await wrapper.find('button[aria-label="Ajouter un patient"]').trigger('click');
      await flushPromises();

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

      await waitForModalClose(wrapper);
      await waitForContent(wrapper, 'nouveau');

      expect(wrapper.text().toLowerCase()).toContain('nouveau');
      expect(wrapper.text().toLowerCase()).toContain('test');
      expect(wrapper.text()).toContain('nouveau@ex.com');
    });

    it('affiche les erreurs de validation lors de la création', async () => {
      vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([]);
      vi.spyOn(patientService, 'createPatient').mockRejectedValue({
        violations: {
          nom: ['Le nom est requis.'],
          email: ['Email invalide'],
        },
      });

      const wrapper = mountPatientsList();
      await flushPromises();

      await wrapper.find('button[aria-label="Ajouter un patient"]').trigger('click');
      await flushPromises();

      const emailInput = wrapper.find('#email');
      expect(emailInput.exists()).toBe(true);
      await emailInput.setValue('test@');
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      await flushPromises();

      expect(wrapper.text()).toContain('Le nom est requis.');
      expect(wrapper.text()).toContain("L'email doit contenir un point après l'arobase.");
    });
  });

  describe('Modification de patients', () => {
    it('modifie un patient avec succès', async () => {
      vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([
        {
          id: 1,
          nom: 'Test',
          prenom: 'T',
          sexe: 'M',
          dateNaissance: '2000-01-01',
          telephone: '',
          email: 'test@ex.com',
        } as unknown as Patient,
      ] as unknown as Patient[]);
      vi.spyOn(patientService, 'updatePatient').mockResolvedValue({
        id: 1,
        nom: 'TestModif',
        prenom: 'T',
        sexe: 'M',
        dateNaissance: '2000-01-01',
        telephone: '',
        email: 'testmodif@ex.com',
      } as unknown as Patient);
      vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([
        {
          id: 1,
          nom: 'TestModif',
          prenom: 'T',
          sexe: 'M',
          dateNaissance: '2000-01-01',
          telephone: '',
          email: 'testmodif@ex.com',
        } as unknown as Patient,
      ] as unknown as Patient[]);

      const wrapper = mountPatientsList();
      await flushPromises();

      await wrapper.find('[data-testid="edit-patient-btn"]').trigger('click');
      await flushPromises();

      const lastNameInput = wrapper.find('#lastName');
      expect(lastNameInput.exists()).toBe(true);
      await lastNameInput.setValue('TestModif');
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();

      expect(wrapper.text().toLowerCase()).toContain('testmodif');
      expect(wrapper.text().toLowerCase()).toContain('t');
      expect(wrapper.text()).toContain('testmodif@ex.com');
    });
  });

  describe('Suppression de patients', () => {
    it('supprime un patient avec succès', async () => {
      vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([
        {
          id: 2,
          nom: 'Demo',
          prenom: 'D',
          sexe: 'F',
          dateNaissance: '1995-05-05',
          telephone: '',
          email: 'demo@ex.com',
        } as unknown as Patient,
      ] as unknown as Patient[]);
      vi.spyOn(patientService, 'deletePatient').mockResolvedValue(true);
      vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([] as unknown as Patient[]);

      const wrapper = mountPatientsList();
      await flushPromises();

      await wrapper.find('[data-testid="delete-patient-btn"]').trigger('click');
      await flushPromises();
      await wrapper.find('[data-testid="confirm-delete-btn"]').trigger('click');
      await flushPromises();

      expect(wrapper.text().toLowerCase()).not.toContain('demo');
      expect(wrapper.text()).not.toContain('demo@ex.com');
    });

    it('affiche une erreur si la suppression échoue', async () => {
      vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([
        {
          id: 2,
          nom: 'Demo',
          prenom: 'D',
          sexe: 'F',
          dateNaissance: '1995-05-05',
          telephone: '',
          email: 'demo@ex.com',
        } as unknown as Patient,
      ] as unknown as Patient[]);
      vi.spyOn(patientService, 'deletePatient').mockRejectedValue(
        new Error('Erreur API suppression')
      );

      const wrapper = mountPatientsList();
      await flushPromises();

      await wrapper.find('[data-testid="delete-patient-btn"]').trigger('click');
      await flushPromises();
      await wrapper.find('[data-testid="confirm-delete-btn"]').trigger('click');
      await flushPromises();

      expect(wrapper.text()).toContain('Erreur API suppression');
    });

    it('affiche une erreur si la suppression retourne false', async () => {
      vi.spyOn(patientService, 'fetchPatients').mockResolvedValueOnce([
        {
          id: 2,
          nom: 'Demo',
          prenom: 'D',
          sexe: 'F',
          dateNaissance: '1995-05-05',
          telephone: '',
          email: 'demo@ex.com',
        } as unknown as Patient,
      ] as unknown as Patient[]);
      vi.spyOn(patientService, 'deletePatient').mockResolvedValue(false as unknown as true);

      const wrapper = mountPatientsList();
      await flushPromises();

      await wrapper.find('[data-testid="delete-patient-btn"]').trigger('click');
      await flushPromises();
      await wrapper.find('[data-testid="confirm-delete-btn"]').trigger('click');
      await flushPromises();

      expect(wrapper.text()).toMatch(/erreur.*suppression/i);
    });
  });

  describe('Accessibilité', () => {
    it('bouton Ajouter un patient est focusable au clavier', async () => {
      vi.spyOn(patientService, 'fetchPatients').mockResolvedValue([] as unknown as Patient[]);
      const wrapper = mountPatientsList({ attachTo: document.body });
      await flushPromises();

      const addBtn = wrapper.find('button[aria-label="Ajouter un patient"]');
      expect(addBtn.exists()).toBe(true);
      (addBtn.element as HTMLElement).focus();
      expect(document.activeElement).toBe(addBtn.element);

      wrapper.unmount();
    });
  });
});
