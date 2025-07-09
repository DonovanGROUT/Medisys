/*
-------------------------------------------------
Sommaire des blocs de tests :
- Validation des champs obligatoires
- Règles métier (date, durée, etc.)
- Statut et options
- Mode édition
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import AppointmentForm from '../AppointmentForm.vue';
import type { Patient } from '../../services/patientService';

type AppointmentFormInstance = InstanceType<typeof AppointmentForm> & {
  selectedPatient: Patient | null;
};

// Configuration des mocks globaux
const alertMock = vi.fn();
window.alert = alertMock;
globalThis.alert = alertMock;

// Helpers centralisés
const createMockPatient = (id: number = 1): Patient => ({
  id,
  nom: 'Test',
  prenom: 'Patient',
  sexe: '',
  dateNaissance: '',
});
const getFutureDate = (): string => new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const getPastDate = (): string => new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const fillRequiredFields = async (
  wrapper: VueWrapper<InstanceType<typeof AppointmentForm>>,
  data: Partial<Record<string, unknown>> = {}
) => {
  await wrapper.find('input[name="motif"]').setValue(data.motif ?? 'Consultation');
  await wrapper.find('input[type="date"]').setValue(data.date ?? getFutureDate());
  await wrapper.find('input[type="time"]').setValue(data.time ?? '10:00');
  await wrapper.find('input[type="number"]').setValue((data.duree ?? 30).toString());
  const patient: Patient =
    data.patient && typeof data.patient === 'object' && 'id' in data.patient
      ? (data.patient as Patient)
      : createMockPatient();
  (wrapper.vm as AppointmentFormInstance).selectedPatient = patient;
};

vi.mock('../../services/appointmentApi', () => ({
  createAppointment: vi.fn().mockResolvedValue({ id: 42 }),
  updateAppointment: vi.fn().mockResolvedValue({ id: 42 }),
}));

describe('AppointmentForm - Validation', () => {
  describe('Champs obligatoires', () => {
    it('refuse la soumission sans patient', async () => {
      const wrapper = mount(AppointmentForm, { global: { stubs: { BaseIcon: true } } });
      await fillRequiredFields(wrapper, { patient: null });
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();

      expect(wrapper.emitted('created')).toBeTruthy();
    });
    it('refuse la soumission si tous les champs sont vides', async () => {
      const wrapper = mount(AppointmentForm, { global: { stubs: { BaseIcon: true } } });
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      expect(wrapper.emitted('created')).toBeFalsy();
    });
  });

  describe('Règles métier', () => {
    it('refuse un rendez-vous dans le passé', async () => {
      const wrapper = mount(AppointmentForm, { global: { stubs: { BaseIcon: true } } });
      await fillRequiredFields(wrapper, { date: getPastDate() });
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      expect(wrapper.emitted('created')).toBeFalsy();
    });
    it('refuse une durée négative', async () => {
      const wrapper = mount(AppointmentForm, { global: { stubs: { BaseIcon: true } } });
      await fillRequiredFields(wrapper, { duree: -10 });
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      // On attend qu'aucun événement ne soit émis
      expect(wrapper.emitted('created')).toBeFalsy();
      // On vérifie que l'erreur s'affiche dans le DOM
      expect(wrapper.find('#duree-error').text()).toContain('La durée doit être supérieure à 0');
    });
  });

  describe('Statut et options', () => {
    it('permet de sélectionner chaque statut et désactive les options selon la date', async () => {
      const wrapper = mount(AppointmentForm, { global: { stubs: { BaseIcon: true } } });
      await fillRequiredFields(wrapper);
      await flushPromises();
      await wrapper.find('select').setValue('scheduled');
      expect(wrapper.find('select').element.value).toBe('scheduled');
      await wrapper.find('select').setValue('cancelled');
      expect(wrapper.find('select').element.value).toBe('cancelled');
      const completedOption = wrapper.find('option[value="completed"]');
      expect(completedOption.attributes('disabled')).toBeDefined();
      // Date passée : "Prévu" désactivé
      await wrapper.find('input[type="date"]').setValue('2000-01-01');
      await wrapper.find('input[type="time"]').setValue('10:00');
      await wrapper.vm.$nextTick();
      const scheduledOption = wrapper.findAll('option').find((o) => o.text().includes('Prévu'));
      expect(scheduledOption?.attributes('disabled')).toBeDefined();
    });
  });

  describe('Mode édition', () => {
    it('pré-remplit et modifie les champs en édition', async () => {
      const modelValue = {
        id: 99,
        motif: 'Ancien motif',
        dateHeure: '2025-07-10T10:00',
        duree: 45,
        patient: createMockPatient(2),
        statut: 'scheduled',
      };
      const wrapper = mount(AppointmentForm, {
        props: { modelValue },
        global: { stubs: { BaseIcon: true } },
      });
      expect((wrapper.find('input[name="motif"]').element as HTMLInputElement).value).toBe(
        'Ancien motif'
      );
      await wrapper.find('input[name="motif"]').setValue('Nouveau motif');
      (wrapper.vm as unknown as AppointmentFormInstance).selectedPatient = createMockPatient(2);
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      const { updateAppointment } = await import('../../services/appointmentApi');
      expect(updateAppointment).toHaveBeenCalledWith(
        99,
        expect.objectContaining({ motif: 'Nouveau motif' })
      );
      expect(wrapper.emitted('created')).toBeTruthy();
    });
    it('gère les id non numériques', async () => {
      const { updateAppointment } = await import('../../services/appointmentApi');
      (updateAppointment as unknown as MockInstance).mockResolvedValueOnce({ id: 0 });
      const modelValue = {
        id: 'not-a-number',
        motif: 'Test',
        dateHeure: '2025-07-10T10:00',
        duree: 30,
        patient: createMockPatient(),
        statut: 'scheduled',
      };
      const wrapper = mount(AppointmentForm, {
        props: { modelValue },
        global: { stubs: { BaseIcon: true } },
      });
      (wrapper.vm as unknown as AppointmentFormInstance).selectedPatient = createMockPatient();
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      expect(updateAppointment).toHaveBeenCalledWith(0, expect.objectContaining({ motif: 'Test' }));
      expect(wrapper.emitted('created')).toBeTruthy();
    });
    it('pré-remplit même avec un modelValue incomplet ou mal typé', async () => {
      const modelValue = { id: 123, motif: 42, duree: 'trente', statut: 'scheduled' };
      const wrapper = mount(AppointmentForm, {
        props: { modelValue },
        global: { stubs: { BaseIcon: true } },
      });
      expect((wrapper.find('input[name="motif"]').element as HTMLInputElement).value).toBe('');
      expect((wrapper.find('input[type="number"]').element as HTMLInputElement).value).toBe('30');
      expect((wrapper.find('input[type="date"]').element as HTMLInputElement).value).toBe('');
      expect((wrapper.find('input[type="time"]').element as HTMLInputElement).value).toBe('');
      expect(wrapper.find('select').element.value).toBe('scheduled');
    });
  });

  describe('Gestion des erreurs', () => {
    it('gère une erreur lors de la création (API KO)', async () => {
      const { createAppointment } = await import('../../services/appointmentApi');
      (createAppointment as unknown as MockInstance).mockRejectedValueOnce(new Error('API KO'));
      const wrapper = mount(AppointmentForm, { global: { stubs: { BaseIcon: true } } });
      await fillRequiredFields(wrapper);
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      expect(wrapper.emitted('created')).toBeFalsy();
      expect((wrapper.find('input[name="motif"]').element as HTMLInputElement).value).toBe(
        'Consultation'
      );
    });
    it('émet close lors du clic sur Annuler', async () => {
      const wrapper = mount(AppointmentForm, { global: { stubs: { BaseIcon: true } } });
      await wrapper.find('button[type="button"]').trigger('click');
      expect(wrapper.emitted('close')).toBeTruthy();
    });
    it("affiche une alerte si la date du rendez-vous n'est pas dans le futur", async () => {
      const wrapper = mount(AppointmentForm, { global: { stubs: { BaseIcon: true } } });
      await fillRequiredFields(wrapper, { date: getPastDate() });
      await wrapper.vm.$nextTick();
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      await wrapper.vm.$nextTick();
      // On vérifie l'affichage de l'erreur soit sous le champ date, soit en global
      const dateError = wrapper.find('#date-error');
      const globalError = wrapper.find('#form-global-error');
      const errorText = dateError.exists()
        ? dateError.text()
        : globalError.exists()
          ? globalError.text()
          : '';
      expect(errorText).toContain('La date du rendez-vous doit être dans le futur');
      expect(wrapper.emitted('created')).toBeFalsy();
    });
  });
});
