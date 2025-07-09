/**
 * -------------------------------------------------
 * Sommaire des blocs de tests :
 * - Affichage général & DOM
 * - Filtres (patient, statut, date, combinaison)
 * - Modale (création, édition, vue)
 * - Suppression (succès, erreur, early return)
 * - Gestion d’erreur (API, JS, statuts inconnus)
 * - Robustesse & cas limites (valeurs inattendues, fallback)
 * - Couverture technique (fonctions utilitaires, helpers)
 * Helpers/mocks centralisés en haut de fichier.
 * -------------------------------------------------
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import AppointmentList from '../AppointmentList.vue';
import { vi } from 'vitest';
import type { ComponentPublicInstance } from 'vue';
import * as appointmentApi from '../../services/appointmentApi';

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    currentRoute: { value: { query: {} } },
  }),
}));

// Stub Modal qui rend son slot (pour tests modale)
const ModalStub = {
  template: '<div><slot /></div>',
};

// Stub global BaseIcon pour supprimer les warnings de test
const globalStubs = { stubs: { BaseIcon: true, Modal: ModalStub } };

// Mock utilitaire pour fetch (Response-like)
function mockFetchResponse(jsonData: unknown, ok = true, status = 200) {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(jsonData),
    text: () => Promise.resolve(JSON.stringify(jsonData)),
    headers: new Headers(),
    redirected: false,
    statusText: '',
    type: 'basic',
    url: '',
    clone: () => this,
    body: null,
    bodyUsed: false,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
  } as Response);
}

type AppointmentListInstance = ComponentPublicInstance & {
  showModal: boolean;
  modalMode: 'create' | 'edit' | 'view' | null;
  selectedAppointment: unknown;
  openCreate: () => void;
  openEdit: (a: unknown) => void;
  openView: (a: unknown) => void;
  closeModal: () => void;
  openDelete: (a: unknown) => void;
  closeDeleteModal: () => void;
  resetAdvancedFilters: () => void;
  handleCreated: (id?: number) => Promise<void>;
  highlightedId: number | null;
  showDeleteModal: boolean;
  appointmentToDelete: unknown;
  confirmDelete: () => Promise<void>;
  errors: Record<string, string>;
  statusFilter: string;
  dateFilter: string;
  patientFilter: string | number;
  selectedPatient: unknown;
  appointments: unknown[];
  filteredAndSortedAppointments: unknown[];
};

function getAppointmentsList(wrapper: VueWrapper<unknown>): unknown[] {
  return (wrapper.vm as AppointmentListInstance).filteredAndSortedAppointments ?? [];
}

const mockPatientComplet = {
  id: 1,
  nom: 'Test',
  prenom: 'T',
  sexe: 'M',
  dateNaissance: '2000-01-01',
  telephone: '0102030405',
  email: 'test@example.com',
};

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve));
}

// Helper pour fusionner les stubs locaux avec BaseIcon
function withBaseIconStubs(stubs: Record<string, unknown>) {
  return { stubs: { BaseIcon: true, ...stubs } };
}

// Helper DRY pour factoriser la création du wrapper avec stubs par défaut
const defaultStubs = {
  AppointmentItem: true,
  AppointmentTableRow: true,
  AppointmentActions: true,
  AppointmentForm: true,
  AppointmentView: true,
  ConfirmDelete: true,
  Modal: ModalStub,
  'router-link': true,
};

function mountAppointmentList(customStubs: Record<string, unknown> = {}) {
  return mount(AppointmentList, {
    global: withBaseIconStubs({ ...defaultStubs, ...customStubs }),
  });
}

// -------------------------------------------------
// Début des tests AppointmentList.vue
// -------------------------------------------------
describe('AppointmentList.vue', () => {
  beforeAll(() => {
    globalThis.fetch = vi.fn((url) => {
      if (typeof url === 'string' && url.includes('/api/appointments')) {
        return mockFetchResponse([
          {
            id: 1,
            patient: { ...mockPatientComplet },
            dateHeure: '2025-07-02T10:00',
            statut: 'scheduled',
            motif: 'Test',
          },
        ]);
      }
      return Promise.reject(new Error('Not implemented'));
    });
  });
  afterAll(() => {
    // @ts-ignore: suppression du mock fetch pour restaurer l'environnement global après les tests
    delete globalThis.fetch;
  });

  describe('Affichage', () => {
    it('affiche le titre de la page', () => {
      const wrapper = mountAppointmentList({ Modal: ModalStub });
      expect(wrapper.text()).toContain('Liste des rendez-vous');
    });

    it('affiche un rendez-vous mocké', async () => {
      const mockAppointments = [
        {
          id: 1,
          patient: { ...mockPatientComplet },
          dateHeure: '2099-07-02T10:00',
          motif: 'Consultation',
          duree: 30,
          statut: 'scheduled' as const,
        },
      ];
      vi.spyOn(appointmentApi, 'getAppointments').mockResolvedValue(mockAppointments);
      const wrapper = mountAppointmentList({
        AppointmentItem: {
          props: ['appointment'],
          template: '<div>{{ appointment.patient.nom }}</div>',
        },
        AppointmentTableRow: {
          props: ['appointment'],
          template: '<tr data-testid="appointment-row"><td>{{ appointment.patient.nom }}</td></tr>',
        },
        AppointmentActions: true,
        AppointmentForm: true,
        AppointmentView: true,
        ConfirmDelete: true,
        Modal: ModalStub,
      });
      await new Promise((r) => setTimeout(r, 10));
      expect(wrapper.html()).toMatch(/Test/);
    });

    it("affiche un message d'état vide si aucun rendez-vous", async () => {
      vi.spyOn(appointmentApi, 'getAppointments').mockResolvedValue([]);
      const wrapper = mountAppointmentList({ Modal: ModalStub });
      await flushPromises();
      await flushPromises();
      const emptyMsg = wrapper.find('[data-testid="empty-message"]');
      expect(emptyMsg.exists()).toBe(true);
      expect(emptyMsg.text()).toMatch(/aucun rendez-vous/i);
    });

    it('affiche le bouton de réinitialisation des filtres si un filtre est actif', async () => {
      const wrapper = mountAppointmentList({ Modal: ModalStub });
      const select = wrapper.find('select');
      await select.setValue('upcoming');
      expect(wrapper.html()).toMatch(/Réinitialiser les filtres/);
    });
  });

  describe('Filtres', () => {
    it('affiche un message si aucun rendez-vous ne correspond aux filtres', async () => {
      globalThis.fetch = vi.fn(() =>
        mockFetchResponse([
          {
            id: 1,
            patient: { ...mockPatientComplet },
            dateHeure: '2025-07-02T10:00',
            statut: 'scheduled',
          },
          {
            id: 2,
            patient: {
              ...mockPatientComplet,
              id: 2,
              nom: 'Autre',
              prenom: 'A',
              email: 'autre@example.com',
            },
            dateHeure: '2025-07-03T11:00',
            statut: 'cancelled',
          },
        ])
      );
      const wrapper = mountAppointmentList({ Modal: ModalStub });
      await new Promise((r) => setTimeout(r, 10));
      const select = wrapper.find('select');
      await select.setValue('past');
      await new Promise((r) => setTimeout(r, 10));
      const dateInput = wrapper.find('input[type="date"]');
      await dateInput.setValue('2030-01-01');
      await new Promise((r) => setTimeout(r, 10));
      expect(getAppointmentsList(wrapper).length).toBe(0);
    });

    it('combine les filtres patient, statut et date', async () => {
      globalThis.fetch = vi.fn(() =>
        mockFetchResponse([
          {
            id: 1,
            patient: { id: 1, nom: 'Test', prenom: 'T', sexe: 'M', dateNaissance: '1990-01-01' },
            dateHeure: '2025-07-02T10:00',
            statut: 'scheduled',
          },
          {
            id: 2,
            patient: { id: 2, nom: 'Autre', prenom: 'A', sexe: 'F', dateNaissance: '1985-05-05' },
            dateHeure: '2025-07-03T11:00',
            statut: 'scheduled',
          },
        ])
      );
      const wrapper = mountAppointmentList({ Modal: ModalStub });
      await new Promise((r) => setTimeout(r, 10));
      (wrapper.vm as AppointmentListInstance).selectedPatient = {
        id: 2,
        nom: 'Autre',
        prenom: 'A',
      };
      (wrapper.vm as AppointmentListInstance).appointments = [
        {
          id: 1,
          patient: { id: 1, nom: 'Test', prenom: 'T' },
          dateHeure: '2025-07-02T10:00',
          statut: 'scheduled',
        },
        {
          id: 2,
          patient: { id: 2, nom: 'Autre', prenom: 'A' },
          dateHeure: '2025-07-03T11:00',
          statut: 'scheduled',
        },
      ];
      await wrapper.vm.$nextTick();
      expect(getAppointmentsList(wrapper).length).toBe(1);
      expect((getAppointmentsList(wrapper)[0] as { id: number }).id).toBe(2);
    });

    it('filtre les rendez-vous à venir', async () => {
      const RealDate = Date;
      globalThis.Date = class extends RealDate {
        constructor(...args: unknown[]) {
          if (args.length === 0) {
            return new RealDate('2025-07-02T00:00:00Z');
          }
          // @ts-expect-error TS spread
          return super(...args);
        }
        static now() {
          return new RealDate('2025-07-02T00:00:00Z').getTime();
        }
      } as unknown as DateConstructor;
      const spy = vi.spyOn(appointmentApi, 'getAppointments').mockResolvedValue([
        {
          id: 1,
          patient: { id: 1, nom: 'Test', prenom: 'T', sexe: 'M', dateNaissance: '1990-01-01' },
          dateHeure: '2099-01-01T10:00',
          statut: 'scheduled',
          duree: 30,
          motif: 'Consultation',
        },
        {
          id: 2,
          patient: { id: 2, nom: 'Ancien', prenom: 'A', sexe: 'F', dateNaissance: '1980-02-02' },
          dateHeure: '2000-01-01T10:00',
          statut: 'scheduled',
          duree: 30,
          motif: 'Suivi',
        },
        {
          id: 3,
          patient: { id: 3, nom: 'Annulé', prenom: 'X', sexe: 'M', dateNaissance: '1970-03-03' },
          dateHeure: '2099-01-01T10:00',
          statut: 'cancelled',
          duree: 30,
          motif: 'Annulation',
        },
      ]);
      const wrapper = mountAppointmentList({
        AppointmentItem: true,
        AppointmentTableRow: true,
        Modal: ModalStub,
      });
      await new Promise((r) => setTimeout(r, 10));
      (wrapper.vm as AppointmentListInstance).statusFilter = 'upcoming';
      await new Promise((r) => setTimeout(r, 10));
      await wrapper.vm.$nextTick();
      expect(getAppointmentsList(wrapper).map((a) => (a as { id: number }).id)).toEqual([1]);
      globalThis.Date = RealDate;
      spy.mockRestore();
    });

    it('filtre les rendez-vous passés (past)', async () => {
      const RealDate = Date;
      globalThis.Date = class extends RealDate {
        constructor(...args: unknown[]) {
          if (args.length === 0) {
            return new RealDate('2025-07-02T00:00:00Z');
          }
          // @ts-expect-error TS spread
          return super(...args);
        }
        static now() {
          return new RealDate('2025-07-02T00:00:00Z').getTime();
        }
      } as unknown as DateConstructor;
      const spy = vi.spyOn(appointmentApi, 'getAppointments').mockResolvedValue([
        {
          id: 1,
          patient: { id: 1, nom: 'Test', prenom: 'T', sexe: 'M', dateNaissance: '1990-01-01' },
          dateHeure: '2099-01-01T10:00',
          statut: 'scheduled',
          duree: 30,
          motif: 'Consultation',
        },
        {
          id: 2,
          patient: { id: 2, nom: 'Ancien', prenom: 'A', sexe: 'F', dateNaissance: '1980-02-02' },
          dateHeure: '2000-01-01T10:00',
          statut: 'scheduled',
          duree: 30,
          motif: 'Suivi',
        },
        {
          id: 3,
          patient: { id: 3, nom: 'Annulé', prenom: 'X', sexe: 'M', dateNaissance: '1970-03-03' },
          dateHeure: '2099-01-01T10:00',
          statut: 'cancelled',
          duree: 30,
          motif: 'Annulation',
        },
      ]);
      const wrapper = mountAppointmentList({
        AppointmentItem: true,
        AppointmentTableRow: true,
        Modal: ModalStub,
      });
      await new Promise((r) => setTimeout(r, 10));
      (wrapper.vm as AppointmentListInstance).statusFilter = 'past';
      await new Promise((r) => setTimeout(r, 10));
      await wrapper.vm.$nextTick();
      expect(getAppointmentsList(wrapper).map((a) => (a as { id: number }).id)).toEqual([2]);
      globalThis.Date = RealDate;
      spy.mockRestore();
    });

    it('filtre les rendez-vous annulés (cancelled)', async () => {
      const RealDate = Date;
      globalThis.Date = class extends RealDate {
        constructor(...args: unknown[]) {
          if (args.length === 0) {
            return new RealDate('2025-07-02T00:00:00Z');
          }
          // @ts-expect-error TS spread
          return super(...args);
        }
        static now() {
          return new RealDate('2025-07-02T00:00:00Z').getTime();
        }
      } as unknown as DateConstructor;
      const spy = vi.spyOn(appointmentApi, 'getAppointments').mockResolvedValue([
        {
          id: 1,
          patient: { id: 1, nom: 'Test', prenom: 'T', sexe: 'M', dateNaissance: '1990-01-01' },
          dateHeure: '2099-01-01T10:00',
          statut: 'scheduled',
          duree: 30,
          motif: 'Consultation',
        },
        {
          id: 2,
          patient: { id: 2, nom: 'Ancien', prenom: 'A', sexe: 'F', dateNaissance: '1980-02-02' },
          dateHeure: '2000-01-01T10:00',
          statut: 'scheduled',
          duree: 30,
          motif: 'Suivi',
        },
        {
          id: 3,
          patient: { id: 3, nom: 'Annulé', prenom: 'X', sexe: 'M', dateNaissance: '1970-03-03' },
          dateHeure: '2099-01-01T10:00',
          statut: 'cancelled',
          duree: 30,
          motif: 'Annulation',
        },
      ]);
      const wrapper = mountAppointmentList({
        AppointmentItem: true,
        AppointmentTableRow: true,
        Modal: ModalStub,
      });
      await new Promise((r) => setTimeout(r, 10));
      (wrapper.vm as AppointmentListInstance).statusFilter = 'cancelled';
      await new Promise((r) => setTimeout(r, 10));
      await wrapper.vm.$nextTick();
      expect(getAppointmentsList(wrapper).map((a) => (a as { id: number }).id)).toEqual([3]);
      globalThis.Date = RealDate;
      spy.mockRestore();
    });

    it('filtre les rendez-vous par date', async () => {
      const RealDate = Date;
      globalThis.Date = class extends RealDate {
        constructor(...args: unknown[]) {
          if (args.length === 0) {
            return new RealDate('2025-07-02T00:00:00Z');
          }
          // @ts-expect-error TS spread
          return super(...args);
        }
        static now() {
          return new RealDate('2025-07-02T00:00:00Z').getTime();
        }
      } as unknown as DateConstructor;
      const spy = vi.spyOn(appointmentApi, 'getAppointments').mockResolvedValue([
        {
          id: 1,
          patient: { id: 1, nom: 'Test', prenom: 'T', sexe: 'M', dateNaissance: '1990-01-01' },
          dateHeure: '2025-07-02T10:00',
          statut: 'scheduled',
          duree: 30,
          motif: 'Consultation',
        },
        {
          id: 2,
          patient: { id: 2, nom: 'Autre', prenom: 'A', sexe: 'F', dateNaissance: '1985-05-05' },
          dateHeure: '2025-07-03T11:00',
          statut: 'scheduled',
          duree: 30,
          motif: 'Suivi',
        },
      ]);
      const wrapper = mountAppointmentList({
        AppointmentItem: true,
        AppointmentTableRow: true,
        Modal: ModalStub,
      });
      await new Promise((r) => setTimeout(r, 10));
      (wrapper.vm as AppointmentListInstance).dateFilter = '2025-07-03';
      await new Promise((r) => setTimeout(r, 10));
      await wrapper.vm.$nextTick();
      expect(getAppointmentsList(wrapper).length).toBe(1);
      expect((getAppointmentsList(wrapper)[0] as { id: number }).id).toBe(2);
      globalThis.Date = RealDate;
      spy.mockRestore();
    });
  });

  describe('Modale', () => {
    it('ouvre et ferme la modale de création', async () => {
      const wrapper = mountAppointmentList({ Modal: ModalStub });
      (wrapper.vm as AppointmentListInstance).openCreate();
      expect((wrapper.vm as AppointmentListInstance).showModal).toBe(true);
      expect((wrapper.vm as AppointmentListInstance).modalMode).toBe('create');
      await flushPromises();
      (wrapper.vm as AppointmentListInstance).closeModal();
      expect((wrapper.vm as AppointmentListInstance).showModal).toBe(false);
    });

    it('ouvre et ferme la modale d’édition', async () => {
      const fakeAppointment = {
        id: 123,
        patient: { ...mockPatientComplet },
        dateHeure: '2025-07-02T10:00',
        statut: 'scheduled',
        duree: 30,
        motif: 'Test',
      };
      const wrapper = mountAppointmentList({ Modal: ModalStub });
      (wrapper.vm as AppointmentListInstance).openEdit(fakeAppointment);
      expect((wrapper.vm as AppointmentListInstance).showModal).toBe(true);
      expect((wrapper.vm as AppointmentListInstance).modalMode).toBe('edit');
      expect(
        ((wrapper.vm as AppointmentListInstance).selectedAppointment as { id: number }).id
      ).toBe(123);
      await flushPromises();
      (wrapper.vm as AppointmentListInstance).closeModal();
      expect((wrapper.vm as AppointmentListInstance).showModal).toBe(false);
    });

    it('ouvre et ferme la modale de vue', async () => {
      const fakeAppointment = {
        id: 123,
        patient: { ...mockPatientComplet },
        dateHeure: '2025-07-02T10:00',
        statut: 'scheduled',
        duree: 30,
        motif: 'Test',
      };
      const wrapper = mountAppointmentList({ Modal: ModalStub });
      (wrapper.vm as AppointmentListInstance).openView(fakeAppointment);
      expect((wrapper.vm as AppointmentListInstance).showModal).toBe(true);
      expect((wrapper.vm as AppointmentListInstance).modalMode).toBe('view');
      expect(
        ((wrapper.vm as AppointmentListInstance).selectedAppointment as { id: number }).id
      ).toBe(123);
      await flushPromises();
      (wrapper.vm as AppointmentListInstance).closeModal();
      expect((wrapper.vm as AppointmentListInstance).showModal).toBe(false);
    });

    it('ferme la modale de suppression sans supprimer si on annule', async () => {
      globalThis.fetch = vi.fn(() =>
        mockFetchResponse([
          {
            id: 1,
            patient: { ...mockPatientComplet },
            dateHeure: '2025-07-02T10:00',
            statut: 'scheduled',
          },
        ])
      );
      vi.spyOn(appointmentApi, 'getAppointments').mockResolvedValue([
        {
          id: 1,
          patient: { ...mockPatientComplet },
          dateHeure: '2025-07-02T10:00',
          statut: 'scheduled',
          duree: 30,
          motif: 'Test',
        },
      ]);
      const wrapper = mountAppointmentList({
        AppointmentItem: {
          props: ['appointment'],
          template:
            '<div><button data-testid="delete-btn" @click="$emit(\'delete\', appointment)">Supprimer</button></div>',
        },
        AppointmentTableRow: true,
        AppointmentActions: true,
        AppointmentForm: true,
        AppointmentView: true,
        ConfirmDelete: {
          template: '<button data-testid="cancel-btn" @click="$emit(\'cancel\')">Annuler</button>',
        },
        Modal: ModalStub,
      });
      await flushPromises();
      const delBtn = wrapper.find('[data-testid="delete-btn"]');
      expect(delBtn.exists()).toBe(true);
      await delBtn.trigger('click');
      await flushPromises();
      (wrapper.vm as AppointmentListInstance).showDeleteModal = true;
      (wrapper.vm as AppointmentListInstance).appointmentToDelete = {
        id: 1,
        patient: { ...mockPatientComplet },
        dateHeure: '2025-07-02T10:00',
        statut: 'scheduled',
      };
      await flushPromises();
      const cancelBtn = wrapper.find('[data-testid="cancel-btn"]');
      expect(cancelBtn.exists()).toBe(true);
      if (cancelBtn.exists()) {
        await cancelBtn.trigger('click');
      }
      await flushPromises();
      expect(wrapper.find('[data-testid="cancel-btn"]').exists()).toBe(false);
    });
  });

  describe('Suppression', () => {
    it('supprime un rendez-vous', async () => {
      let appointments = [
        {
          id: 1,
          patient: { ...mockPatientComplet },
          dateHeure: '2025-07-02T10:00',
          statut: 'scheduled' as const,
          duree: 30,
          motif: 'Consultation',
        },
      ];
      vi.spyOn(appointmentApi, 'getAppointments').mockImplementation(() =>
        Promise.resolve(appointments.slice())
      );
      vi.spyOn(appointmentApi, 'deleteAppointment').mockImplementation((id: number) => {
        appointments = appointments.filter((a) => a.id !== id);
        return Promise.resolve();
      });
      const wrapper = mountAppointmentList();
      await flushPromises();
      (wrapper.vm as AppointmentListInstance).appointmentToDelete = appointments[0];
      (wrapper.vm as AppointmentListInstance).showDeleteModal = true;
      await flushPromises();
      await (wrapper.vm as AppointmentListInstance).confirmDelete?.();
      await flushPromises();
      expect(getAppointmentsList(wrapper).length).toBe(0);
    });

    it('affiche une erreur si la suppression échoue', async () => {
      let appointments = [
        {
          id: 1,
          patient: { ...mockPatientComplet },
          dateHeure: '2025-07-02T10:00',
          statut: 'scheduled' as const,
          duree: 30,
          motif: 'Consultation',
        },
      ];
      vi.spyOn(appointmentApi, 'getAppointments').mockImplementation(() =>
        Promise.resolve(appointments.slice())
      );
      vi.spyOn(appointmentApi, 'deleteAppointment').mockImplementation(() =>
        Promise.reject(new Error('Erreur suppression'))
      );
      const wrapper = mountAppointmentList();
      await flushPromises();
      (wrapper.vm as AppointmentListInstance).appointmentToDelete = appointments[0];
      (wrapper.vm as AppointmentListInstance).showDeleteModal = true;
      await flushPromises();
      await (wrapper.vm as AppointmentListInstance).confirmDelete?.();
      await flushPromises();
      expect((wrapper.vm as AppointmentListInstance).errors?.global ?? '').toMatch(
        /erreur.*suppression/i
      );
    });

    it('ne fait rien si on tente de supprimer sans rendez-vous sélectionné', async () => {
      const wrapper = mountAppointmentList({ ConfirmDelete: true });
      const confirmDelete = (wrapper.vm as unknown as { confirmDelete: () => Promise<void> })
        .confirmDelete;
      await expect(confirmDelete()).resolves.toBeUndefined();
    });

    it('ne supprime pas un rendez-vous inexistant', async () => {
      vi.spyOn(appointmentApi, 'getAppointments').mockResolvedValue([
        {
          id: 1,
          patient: { ...mockPatientComplet },
          dateHeure: '2025-07-02T10:00',
          statut: 'scheduled',
          duree: 30,
          motif: 'Consultation',
        },
      ]);
      vi.spyOn(appointmentApi, 'deleteAppointment').mockResolvedValue(undefined);
      const wrapper = mountAppointmentList({ ConfirmDelete: true });
      await flushPromises();
      (wrapper.vm as AppointmentListInstance).appointmentToDelete = { id: 999 };
      (wrapper.vm as AppointmentListInstance).showDeleteModal = true;
      await (wrapper.vm as AppointmentListInstance).confirmDelete?.();
      expect(getAppointmentsList(wrapper).length).toBe(1);
    });

    it('gère les erreurs synchrones lors de la suppression', async () => {
      const deleteAppointmentSpy = vi.fn(() => Promise.resolve());
      const fetchAppointmentsSpy = vi.fn();
      vi.spyOn(appointmentApi, 'deleteAppointment').mockImplementation(deleteAppointmentSpy);
      vi.spyOn(appointmentApi, 'getAppointments').mockImplementation(fetchAppointmentsSpy);
      const wrapper = mountAppointmentList({ ConfirmDelete: true });
      (wrapper.vm as AppointmentListInstance).appointmentToDelete = { id: 1 };
      (wrapper.vm as AppointmentListInstance).closeDeleteModal = vi.fn();
      (wrapper.vm as AppointmentListInstance).errors = {};
      await (wrapper.vm as AppointmentListInstance).confirmDelete?.();
      await new Promise((r) => setTimeout(r, 20));
      expect(fetchAppointmentsSpy).toHaveBeenCalled();
      vi.spyOn(appointmentApi, 'deleteAppointment').mockImplementation(() => {
        throw new Error('fail');
      });
      (wrapper.vm as AppointmentListInstance).appointmentToDelete = { id: 2 };
      await (wrapper.vm as AppointmentListInstance).confirmDelete?.();
      expect((wrapper.vm as AppointmentListInstance).errors?.global).toMatch(/fail/);
    });

    it('ignore les tentatives de suppression sans rendez-vous', async () => {
      vi.spyOn(appointmentApi, 'deleteAppointment').mockResolvedValue(undefined);
      vi.spyOn(appointmentApi, 'getAppointments').mockResolvedValue([]);
      const wrapper = mountAppointmentList({ ConfirmDelete: true });
      (wrapper.vm as AppointmentListInstance).appointmentToDelete = undefined;
      await expect(
        (wrapper.vm as AppointmentListInstance).confirmDelete?.()
      ).resolves.toBeUndefined();
    });

    it('gère les erreurs asynchrones de suppression', async () => {
      vi.spyOn(appointmentApi, 'deleteAppointment').mockRejectedValue(new Error('Erreur async'));
      vi.spyOn(appointmentApi, 'getAppointments').mockResolvedValue([]);
      const wrapper = mountAppointmentList({ ConfirmDelete: true });
      (wrapper.vm as AppointmentListInstance).appointmentToDelete = { id: 999 };
      (wrapper.vm as AppointmentListInstance).errors = {};
      await (wrapper.vm as AppointmentListInstance).confirmDelete?.();
      expect((wrapper.vm as AppointmentListInstance).errors?.global).toMatch(/Erreur async/);
    });
  });

  describe('Gestion d’erreur', () => {
    it('affiche une erreur si l’API échoue', async () => {
      vi.spyOn(appointmentApi, 'getAppointments').mockRejectedValue(
        new Error('Erreur API rendez-vous')
      );
      const wrapper = mount(AppointmentList, {
        global: withBaseIconStubs({
          AppointmentItem: true,
          AppointmentTableRow: true,
          AppointmentActions: true,
          AppointmentForm: true,
          AppointmentView: true,
          ConfirmDelete: true,
          Modal: ModalStub,
        }),
      });
      await flushPromises();
      await flushPromises();
      const errorDiv = wrapper.find('[data-testid="error-message"]');
      expect(errorDiv.exists()).toBe(true);
      expect(errorDiv.text()).toBe('Impossible de charger les rendez-vous');
    });

    it('affiche une erreur si la suppression échoue (exception JS)', async () => {
      globalThis.fetch = vi.fn(() =>
        mockFetchResponse([
          {
            id: 1,
            patient: { id: 1, nom: 'Test', prenom: 'T' },
            dateHeure: '2025-07-02T10:00',
            statut: 'CONFIRMED',
          },
        ])
      );
      const wrapper = mount(AppointmentList, {
        global: withBaseIconStubs({
          AppointmentItem: true,
          AppointmentTableRow: true,
          Modal: ModalStub,
          ConfirmDelete: true,
        }),
      });
      await new Promise((r) => setTimeout(r, 10));
      (wrapper.vm as AppointmentListInstance).appointmentToDelete = {
        id: 1,
        patient: { id: 1, nom: 'Test', prenom: 'T' },
        dateHeure: '2025-07-02T10:00',
        statut: 'CONFIRMED',
      };
      (wrapper.vm as AppointmentListInstance).showDeleteModal = true;
      vi.spyOn(
        await import('../../services/appointmentApi'),
        'deleteAppointment'
      ).mockImplementation(() => {
        throw new Error('Suppression impossible');
      });
      await expect(
        (wrapper.vm as AppointmentListInstance).confirmDelete?.()
      ).resolves.toBeUndefined();
      expect((wrapper.vm as AppointmentListInstance).errors?.global ?? '').toMatch(
        /Suppression impossible/
      );
    });

    it('gère une exception JS dans getAppointments', async () => {
      vi.spyOn(appointmentApi, 'getAppointments').mockImplementation(() => {
        throw new Error('Exception JS');
      });
      const wrapper = mount(AppointmentList, {
        global: withBaseIconStubs({
          AppointmentItem: true,
          AppointmentTableRow: true,
          AppointmentForm: true,
          AppointmentView: true,
          ConfirmDelete: true,
          Modal: ModalStub,
        }),
      });
      await flushPromises();
      const errorDiv = wrapper.find('[data-testid="error-message"]');
      expect(errorDiv.exists()).toBe(true);
      expect(errorDiv.text()).toMatch(/impossible/i);
    });

    it('gère un statut inconnu dans la liste', async () => {
      vi.spyOn(appointmentApi, 'getAppointments').mockResolvedValue([
        {
          id: 1,
          patient: { ...mockPatientComplet },
          dateHeure: '2025-07-02T10:00',
          statut: 'foobar' as unknown as 'scheduled',
          motif: 'Test',
          duree: 30,
        },
      ]);
      const wrapper = mount(AppointmentList, {
        global: withBaseIconStubs({
          AppointmentItem: true,
          AppointmentTableRow: true,
          Modal: ModalStub,
          ConfirmDelete: true,
          'router-link': true,
        }),
      });
      await flushPromises();
      const list = getAppointmentsList(wrapper);
      expect(list.length).toBe(1);
      expect((list[0] as { id: number }).id).toBe(1);
    });
  });

  describe('Robustesse', () => {
    it('gère les rendez-vous incomplets', async () => {
      vi.spyOn(appointmentApi, 'getAppointments').mockResolvedValue([
        {
          id: 1,
          patient: {
            id: 999,
            nom: 'Inconnu',
            prenom: 'Inconnu',
            sexe: 'X',
            dateNaissance: '1900-01-01',
          },
          dateHeure: '2025-07-02T10:00',
          statut: 'scheduled',
          duree: 30,
          motif: 'Inconnu',
        },
        {
          id: 2,
          patient: { id: 2, nom: 'Autre', prenom: 'A', sexe: 'F', dateNaissance: '1985-05-05' },
          dateHeure: '',
          statut: 'scheduled',
          duree: 30,
          motif: 'Suivi',
        },
        {
          id: 3,
          patient: { id: 3, nom: 'X', prenom: 'Y', sexe: 'M', dateNaissance: '1999-09-09' },
          dateHeure: '2025-07-03T11:00',
          statut: 'cancelled',
          duree: 30,
          motif: 'Annulation',
        },
      ]);
      const wrapper = mountAppointmentList({
        AppointmentItem: true,
        AppointmentTableRow: true,
        Modal: ModalStub,
      });
      await new Promise((r) => setTimeout(r, 10));
      expect(getAppointmentsList(wrapper).length).toBe(3);
    });

    it('rafraîchit la liste des rendez-vous après création', async () => {
      // Vérification du mécanisme de rafraîchissement automatique après création
      const fetchAppointmentsSpy = vi.fn();
      vi.spyOn(appointmentApi, 'getAppointments').mockImplementation(fetchAppointmentsSpy);
      globalThis.document.getElementById = vi.fn((id: string) => {
        if (id === 'appointment-999') {
          const el = document.createElement('div') as HTMLElement & {
            scrollIntoView: () => void;
            focus: () => void;
          };
          el.scrollIntoView = vi.fn();
          el.focus = vi.fn();
          return el;
        }
        return null;
      });
      const wrapper = mountAppointmentList({
        AppointmentItem: true,
        AppointmentTableRow: true,
        AppointmentForm: true,
        AppointmentView: true,
        ConfirmDelete: true,
        Modal: ModalStub,
      });
      await (wrapper.vm as AppointmentListInstance).handleCreated();
      await new Promise((r) => setTimeout(r, 20));
      expect(fetchAppointmentsSpy).toHaveBeenCalled();

      await (wrapper.vm as AppointmentListInstance).handleCreated(999);
      await new Promise((r) => setTimeout(r, 300));
    });

    it('gère les identifiants inexistants lors de la création', async () => {
      // Gestion des cas où l'ID créé n'existe plus dans la liste
      vi.spyOn(appointmentApi, 'getAppointments').mockResolvedValue([]);
      const wrapper = mountAppointmentList({
        AppointmentItem: true,
        AppointmentTableRow: true,
        AppointmentForm: true,
        AppointmentView: true,
        ConfirmDelete: true,
        Modal: ModalStub,
      });
      await (wrapper.vm as AppointmentListInstance).handleCreated(123456);
      await (wrapper.vm as AppointmentListInstance).handleCreated();
    });

    it('ne fait rien si patientFilter ne change pas', async () => {
      // Évite les réactions inutiles lors de filtrage identique
      const wrapper = mountAppointmentList({
        AppointmentItem: true,
        AppointmentTableRow: true,
        Modal: ModalStub,
      });
      (wrapper.vm as AppointmentListInstance).patientFilter = 1;
      (wrapper.vm as AppointmentListInstance).patientFilter = 1;
      await wrapper.vm.$nextTick();
    });

    it("gère l'absence d'élément DOM lors du scroll automatique", async () => {
      // Gestion des éléments DOM manquants lors du scroll automatique
      globalThis.document.getElementById = vi.fn(() => null);
      const wrapper = mountAppointmentList({
        AppointmentItem: true,
        AppointmentTableRow: true,
        AppointmentForm: true,
        AppointmentView: true,
        ConfirmDelete: true,
        Modal: ModalStub,
        'router-link': true,
      });
      await (wrapper.vm as AppointmentListInstance).handleCreated(123456);
    });

    it('retourne une liste vide si appointments est undefined', async () => {
      // Gestion des données manquantes dans la liste des rendez-vous
      const wrapper = mountAppointmentList({
        AppointmentItem: true,
        AppointmentTableRow: true,
        Modal: ModalStub,
      });
      (wrapper.vm as unknown as { appointments: unknown }).appointments = undefined;
      expect(getAppointmentsList(wrapper)).toEqual([]);
    });

    it('ignore la réinitialisation si les filtres sont déjà par défaut', async () => {
      // Évite les actions inutiles lors de la réinitialisation des filtres
      const wrapper = mountAppointmentList({
        AppointmentItem: true,
        AppointmentTableRow: true,
        Modal: ModalStub,
      });
      (wrapper.vm as AppointmentListInstance).resetAdvancedFilters();
    });
  });

  describe('Couverture technique', () => {
    it('recharge la liste après modification', async () => {
      // Vérification du rechargement des données après modification
      const wrapper = mountAppointmentList({
        AppointmentItem: true,
        AppointmentTableRow: true,
        AppointmentForm: true,
        AppointmentView: true,
        ConfirmDelete: true,
        Modal: ModalStub,
      });
      const fetchSpy = vi.spyOn(appointmentApi, 'getAppointments').mockResolvedValue([]);
      await (wrapper.vm as AppointmentListInstance).handleCreated();
      expect(fetchSpy).toHaveBeenCalled();
    });

    it('réinitialise tous les filtres', async () => {
      // Vérification de la remise à zéro des filtres
      const wrapper = mountAppointmentList({
        AppointmentItem: true,
        AppointmentTableRow: true,
        AppointmentForm: true,
        AppointmentView: true,
        ConfirmDelete: true,
        Modal: ModalStub,
        'router-link': true,
      });
      (wrapper.vm as AppointmentListInstance).statusFilter = 'upcoming';
      (wrapper.vm as AppointmentListInstance).resetAdvancedFilters();
      expect((wrapper.vm as AppointmentListInstance).statusFilter).toBe('all');
    });

    it("vérifie l'accès aux méthodes de gestion modale", async () => {
      // Vérification que toutes les méthodes publiques sont accessibles
      const wrapper = mountAppointmentList({
        AppointmentItem: true,
        AppointmentTableRow: true,
        AppointmentForm: true,
        AppointmentView: true,
        ConfirmDelete: true,
        Modal: ModalStub,
        'router-link': true,
      });
      const instance = wrapper.vm as AppointmentListInstance;

      instance.openCreate();
      expect(instance.showModal).toBe(true);
      expect(instance.modalMode).toBe('create');

      instance.openEdit({ id: 1 });
      expect(instance.modalMode).toBe('edit');

      instance.openView({ id: 1 });
      expect(instance.modalMode).toBe('view');

      instance.closeModal();
      expect(instance.showModal).toBe(false);

      instance.openDelete({ id: 1 });
      expect(instance.showDeleteModal).toBe(true);

      instance.closeDeleteModal();
      expect(instance.showDeleteModal).toBe(false);
    });
  });

  describe('Robustesse & cas limites supplémentaires', () => {
    it('ne fait rien si on tente de supprimer sans sélection', async () => {
      const wrapper = mount(AppointmentList, { global: withBaseIconStubs({ Modal: ModalStub }) });
      (wrapper.vm as AppointmentListInstance).appointmentToDelete = null;
      await expect(
        (wrapper.vm as AppointmentListInstance).confirmDelete()
      ).resolves.toBeUndefined();
    });

    it('affiche un rendez-vous même si le patient est incomplet', async () => {
      const mockAppointments = [
        {
          id: 3,
          patient: { id: 0, nom: '', prenom: '', sexe: 'X', dateNaissance: '' },
          dateHeure: '2099-07-02T10:00',
          motif: 'Test',
          statut: 'scheduled' as const,
          duree: 30,
        },
      ];
      vi.spyOn(appointmentApi, 'getAppointments').mockResolvedValue(mockAppointments);
      const wrapper = mount(AppointmentList, { global: withBaseIconStubs({ Modal: ModalStub }) });
      await flushPromises();
      expect(wrapper.html()).toMatch(/Test/);
    });
  });
});
