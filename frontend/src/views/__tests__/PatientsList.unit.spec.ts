/**
 * -------------------------------------------------
 * Sommaire des blocs de tests :
 * - Affichage et navigation modale
 * - Création et édition de patients
 * - Suppression de patients
 * - Gestion d'erreur (API, JS, valeurs inattendues)
 * - Robustesse (cas limites, valeurs nulles)
 * Helpers/mocks centralisés en haut de fichier.
 * -------------------------------------------------
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PatientsList from '../PatientsList.vue';
import type { Patient } from '../../types/Patient';
import type { ComponentPublicInstance } from 'vue';
import * as patientService from '../../services/patientService';

// Mock centralisé des services patients
vi.mock('../../services/patientService', () => ({
  fetchPatients: vi.fn().mockResolvedValue([]),
  createPatient: vi.fn(),
  updatePatient: vi.fn(),
  deletePatient: vi.fn(),
}));

// Stub global BaseIcon pour supprimer les warnings de test
const globalStubs = { stubs: { BaseIcon: true } };

// Helper DRY pour factoriser la création du wrapper avec stubs par défaut
function mountPatientsList(customStubs: Record<string, unknown> = {}) {
  return mount(PatientsList, {
    global: { stubs: { BaseIcon: true, ...customStubs } },
  });
}

// Type pour l'instance du composant PatientsList
type PatientsListInstance = ComponentPublicInstance & {
  showModal: boolean;
  modalMode: 'create' | 'edit' | 'view' | null;
  selectedPatient: Patient | null;
  openCreate: () => void;
  openEdit: (patient: Patient) => void;
  openView: (patient: Patient) => void;
  closeModal: () => void;
  openDelete: (patient: Patient) => void;
  closeDeleteModal: () => void;
  showDeleteModal: boolean;
  patientToDelete: Patient | null;
  confirmDelete: () => Promise<void>;
  handleSubmit: (patient: Patient) => Promise<void>;
  errors: Record<string, string>;
};

// Patient de test standard
const mockPatient: Patient = {
  id: 1,
  nom: 'Dupont',
  prenom: 'Jean',
  sexe: 'M',
  dateNaissance: '1980-01-01',
  telephone: '0123456789',
  email: 'jean.dupont@example.com',
};

describe('PatientsList.vue (unit)', () => {
  describe('Affichage et navigation modale', () => {
    it('ouvre et ferme la modale de création', async () => {
      // Vérification de l'ouverture et fermeture des modales
      const wrapper = mountPatientsList();

      (wrapper.vm as PatientsListInstance).openCreate();
      expect((wrapper.vm as PatientsListInstance).showModal).toBe(true);
      expect((wrapper.vm as PatientsListInstance).modalMode).toBe('create');

      (wrapper.vm as PatientsListInstance).closeModal();
      expect((wrapper.vm as PatientsListInstance).showModal).toBe(false);
    });

    it('ouvre et ferme la modale de édition', async () => {
      // Navigation vers le mode édition avec patient sélectionné
      const wrapper = mountPatientsList();

      (wrapper.vm as PatientsListInstance).openEdit(mockPatient);
      expect((wrapper.vm as PatientsListInstance).showModal).toBe(true);
      expect((wrapper.vm as PatientsListInstance).modalMode).toBe('edit');
      expect((wrapper.vm as PatientsListInstance).selectedPatient).toEqual(mockPatient);
    });

    it('ouvre et ferme la modale de consultation', async () => {
      // Navigation vers le mode consultation (lecture seule)
      const wrapper = mountPatientsList();

      (wrapper.vm as PatientsListInstance).openView(mockPatient);
      expect((wrapper.vm as PatientsListInstance).showModal).toBe(true);
      expect((wrapper.vm as PatientsListInstance).modalMode).toBe('view');
      expect((wrapper.vm as PatientsListInstance).selectedPatient).toEqual(mockPatient);
    });

    it('affiche le titre approprié selon le mode', async () => {
      // Vérification des titres contextuels des modales
      const wrapper = mountPatientsList();

      (wrapper.vm as PatientsListInstance).openEdit(mockPatient);
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toMatch(/modifier le patient/i);

      (wrapper.vm as PatientsListInstance).openView(mockPatient);
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toMatch(/fiche patient/i);
    });

    it('ouvre et ferme la modale de suppression', async () => {
      // Gestion de la modale de confirmation de suppression
      const wrapper = mountPatientsList();

      (wrapper.vm as PatientsListInstance).openDelete(mockPatient);
      expect((wrapper.vm as PatientsListInstance).showDeleteModal).toBe(true);
      expect((wrapper.vm as PatientsListInstance).patientToDelete).toEqual(mockPatient);

      (wrapper.vm as PatientsListInstance).closeDeleteModal();
      expect((wrapper.vm as PatientsListInstance).showDeleteModal).toBe(false);
    });
  });

  describe('Création et édition de patients', () => {
    it('traite les erreurs de validation avec détails', async () => {
      // Gestion des erreurs de validation détaillées par champ
      vi.spyOn(patientService, 'createPatient').mockRejectedValue({
        violations: { nom: ['Le nom est obligatoire'] },
      });

      const wrapper = mountPatientsList();
      (wrapper.vm as PatientsListInstance).openCreate();
      await (wrapper.vm as PatientsListInstance).handleSubmit({} as Patient);

      expect((wrapper.vm as PatientsListInstance).errors.nom).toContain('Le nom est obligatoire');
    });

    it('traite les erreurs globales de API', async () => {
      // Gestion des erreurs générales de l'API
      vi.spyOn(patientService, 'createPatient').mockRejectedValue({
        error: 'Service temporairement indisponible',
      });

      const wrapper = mountPatientsList();
      (wrapper.vm as PatientsListInstance).openCreate();
      await (wrapper.vm as PatientsListInstance).handleSubmit({} as Patient);

      expect((wrapper.vm as PatientsListInstance).errors.global).toBe(
        'Service temporairement indisponible'
      );
    });

    it('traite les exceptions JavaScript standard', async () => {
      // Gestion des erreurs JavaScript classiques
      vi.spyOn(patientService, 'createPatient').mockRejectedValue(
        new Error('Connexion réseau impossible')
      );

      const wrapper = mountPatientsList();
      (wrapper.vm as PatientsListInstance).openCreate();
      await (wrapper.vm as PatientsListInstance).handleSubmit({} as Patient);

      expect((wrapper.vm as PatientsListInstance).errors.global).toBe(
        'Connexion réseau impossible'
      );
    });

    it('mappe correctement toutes les clés backend vers le front dans les erreurs de validation', async () => {
      vi.spyOn(patientService, 'createPatient').mockImplementation(() => {
        throw {
          violations: {
            firstName: ['Champ requis'],
            lastName: ['Champ requis'],
            gender: ['Valeur invalide'],
            birthDate: ['Format incorrect'],
            phone: ['Numéro invalide'],
            custom: ['Erreur personnalisée'],
          },
        };
      });
      const wrapper = mountPatientsList();
      (wrapper.vm as PatientsListInstance).openCreate();
      await (wrapper.vm as PatientsListInstance).handleSubmit({} as Patient);
      expect((wrapper.vm as PatientsListInstance).errors).toEqual({
        prenom: 'Champ requis',
        nom: 'Champ requis',
        sexe: 'Valeur invalide',
        dateNaissance: 'Format incorrect',
        telephone: 'Numéro invalide',
        custom: 'Erreur personnalisée',
      });
    });
  });

  describe('Suppression de patients', () => {
    it('ignore la suppression si aucun patient sélectionné', async () => {
      // Protection contre les suppressions sans sélection
      const wrapper = mountPatientsList();
      (wrapper.vm as PatientsListInstance).patientToDelete = null;

      await expect((wrapper.vm as PatientsListInstance).confirmDelete()).resolves.toBeUndefined();
    });

    it('affiche une erreur si la suppression échoue', async () => {
      // Gestion des erreurs lors de la suppression
      vi.spyOn(patientService, 'deletePatient').mockRejectedValue(
        new Error('Patient référencé dans des rendez-vous')
      );

      const wrapper = mountPatientsList();
      (wrapper.vm as PatientsListInstance).openDelete(mockPatient);
      await (wrapper.vm as PatientsListInstance).confirmDelete();

      expect((wrapper.vm as PatientsListInstance).errors.global).toMatch(
        /Patient référencé dans des rendez-vous/i
      );
    });
  });

  describe('Gestion des erreurs', () => {
    it('affiche une erreur si le chargement initial échoue', async () => {
      // Gestion des erreurs lors du chargement de la liste
      vi.spyOn(patientService, 'fetchPatients').mockRejectedValueOnce(
        new Error('Base de données inaccessible')
      );

      const wrapper = mountPatientsList();
      await wrapper.vm.$nextTick();

      expect((wrapper.vm as PatientsListInstance).errors.global).toBe(
        'Base de données inaccessible'
      );
    });

    it('gère les erreurs inconnues lors du chargement', async () => {
      // Protection contre les valeurs d'erreur inattendues
      vi.spyOn(patientService, 'fetchPatients').mockRejectedValueOnce(42);

      const wrapper = mountPatientsList();
      await wrapper.vm.$nextTick();

      expect((wrapper.vm as PatientsListInstance).errors.global).toBe('Erreur inconnue');
    });

    it('gère les erreurs inconnues lors de la soumission', async () => {
      // Protection contre les types d'erreur non standards
      vi.spyOn(patientService, 'createPatient').mockImplementation(() => {
        throw 42;
      });

      const wrapper = mountPatientsList();
      (wrapper.vm as PatientsListInstance).openCreate();
      await (wrapper.vm as PatientsListInstance).handleSubmit({} as Patient);

      expect((wrapper.vm as PatientsListInstance).errors.global).toBe('Erreur inconnue');
    });

    it('gère un objet erreur sans violations ni error', async () => {
      // Cas d'objet inattendu sans propriété attendue
      vi.spyOn(patientService, 'createPatient').mockImplementation(() => {
        throw { foo: 'bar' };
      });
      const wrapper = mountPatientsList();
      (wrapper.vm as PatientsListInstance).openCreate();
      await (wrapper.vm as PatientsListInstance).handleSubmit({} as Patient);
      expect((wrapper.vm as PatientsListInstance).errors.global).toBe('Erreur inconnue');
    });
  });
});
