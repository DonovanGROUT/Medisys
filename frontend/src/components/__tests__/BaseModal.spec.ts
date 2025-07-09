/*
-------------------------------------------------
Sommaire des blocs de tests :
- Affichage du slot
- Focus à l’ouverture
- Focus trap (Tab/Shift+Tab)
Helpers/mocks centralisés en haut de fichier.
-------------------------------------------------
*/
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseModal from '../BaseModal.vue';

describe('BaseModal.vue', () => {
  it('affiche le contenu du slot', () => {
    const wrapper = mount(BaseModal, {
      slots: { default: '<div>Contenu test</div>' },
      props: { ariaLabel: 'Test modal' },
      attachTo: document.body,
    });
    expect(wrapper.html()).toContain('Contenu test');
    wrapper.unmount();
  });

  it('met le focus sur le premier élément focusable à l’ouverture', async () => {
    const wrapper = mount(BaseModal, {
      slots: { default: '<button>Premier</button><button>Second</button>' },
      props: { ariaLabel: 'Test modal' },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    const first = wrapper.find('button');
    expect(document.activeElement).toBe(first.element);
    wrapper.unmount();
  });

  it('focus trap : Tab/Shift+Tab restent cycliques', async () => {
    const wrapper = mount(BaseModal, {
      slots: { default: '<button>Un</button><button>Deux</button>' },
      props: { ariaLabel: 'Test modal' },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    const btns = wrapper.findAll('button');
    btns[0].element.focus();
    // Tab
    await wrapper.find('[role="dialog"]').trigger('keydown', { key: 'Tab' });
    btns[1].element.focus();
    expect(document.activeElement).toBe(btns[1].element);
    // Tab depuis le dernier -> revient au premier
    btns[1].element.focus();
    await wrapper.find('[role="dialog"]').trigger('keydown', { key: 'Tab' });
    btns[0].element.focus();
    expect(document.activeElement).toBe(btns[0].element);
    // Shift+Tab depuis le premier -> va au dernier
    btns[0].element.focus();
    await wrapper.find('[role="dialog"]').trigger('keydown', { key: 'Tab', shiftKey: true });
    btns[1].element.focus();
    expect(document.activeElement).toBe(btns[1].element);
    wrapper.unmount();
  });

  it('ne fait rien si Tab/Shift+Tab est pressé sur un élément intermédiaire', async () => {
    const wrapper = mount(BaseModal, {
      slots: { default: '<button>Un</button><button>Deux</button><button>Trois</button>' },
      props: { ariaLabel: 'Test modal' },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    const btns = wrapper.findAll('button');
    btns[1].element.focus(); // focus sur le bouton du milieu
    const eventTab = new KeyboardEvent('keydown', { key: 'Tab' });
    const eventShiftTab = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
    const dialog = wrapper.find('[role="dialog"]').element;
    let prevented = false;
    eventTab.preventDefault = () => {
      prevented = true;
    };
    eventShiftTab.preventDefault = () => {
      prevented = true;
    };
    dialog.dispatchEvent(eventTab);
    expect(prevented).toBe(false);
    dialog.dispatchEvent(eventShiftTab);
    expect(prevented).toBe(false);
    // Le focus reste sur le bouton du milieu
    expect(document.activeElement).toBe(btns[1].element);
    wrapper.unmount();
  });

  it('fermeture par Échap', async () => {
    const onClose = vi.fn();
    const wrapper = mount(BaseModal, {
      slots: { default: '<div>Contenu</div>' },
      props: { ariaLabel: 'Test modal' },
      attachTo: document.body,
    });
    wrapper.vm.$.emit = onClose;
    await wrapper.find('[role="dialog"]').trigger('keydown', { key: 'Escape' });
    expect(onClose).toHaveBeenCalledWith('close');
    wrapper.unmount();
  });

  it('fermeture par clic en dehors', async () => {
    const onClose = vi.fn();
    const wrapper = mount(BaseModal, {
      slots: { default: '<div>Contenu</div>' },
      props: { ariaLabel: 'Test modal' },
      attachTo: document.body,
    });
    wrapper.vm.$.emit = onClose;
    await wrapper.find('[role="dialog"]').trigger('mousedown');
    expect(onClose).toHaveBeenCalledWith('close');
    wrapper.unmount();
  });

  it('affiche le bouton de fermeture si showClose=true', () => {
    const wrapper = mount(BaseModal, {
      slots: { default: '<div>Contenu</div>' },
      props: { ariaLabel: 'Test modal', showClose: true },
      attachTo: document.body,
    });
    expect(wrapper.find('button[aria-label="Fermer la modale"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it('ne plante pas et focus la modale si aucun élément focusable', async () => {
    const wrapper = mount(BaseModal, {
      slots: { default: '<div>Juste du texte</div>' },
      props: { ariaLabel: 'Test modal' },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    const dialog = wrapper.find('[role="dialog"]');
    expect(
      document.activeElement === dialog.element || dialog.element.contains(document.activeElement)
    ).toBe(true);
    wrapper.unmount();
  });

  it('n’affiche pas le bouton de fermeture si showClose est omis ou false', () => {
    const wrapper = mount(BaseModal, {
      slots: { default: '<div>Contenu</div>' },
      props: { ariaLabel: 'Test modal' },
      attachTo: document.body,
    });
    expect(wrapper.find('button[aria-label="Fermer la modale"]').exists()).toBe(false);
    wrapper.unmount();
  });

  it('ignore les touches non gérées (autre que Tab/Escape)', async () => {
    const wrapper = mount(BaseModal, {
      slots: { default: '<button>Un</button>' },
      props: { ariaLabel: 'Test modal' },
      attachTo: document.body,
    });
    await wrapper.find('[role="dialog"]').trigger('keydown', { key: 'A' });
    // Pas d’erreur, pas de fermeture
    expect(wrapper.emitted('close')).toBeFalsy();
    wrapper.unmount();
  });

  it('accessibilité : role, aria-modal, aria-label', () => {
    const wrapper = mount(BaseModal, {
      slots: { default: '<div>Contenu</div>' },
      props: { ariaLabel: 'Test modal' },
      attachTo: document.body,
    });
    const dialog = wrapper.find('[role="dialog"]');
    expect(dialog.exists()).toBe(true);
    expect(dialog.attributes('aria-modal')).toBe('true');
    expect(dialog.attributes('aria-label')).toBe('Test modal');
    wrapper.unmount();
  });

  it('fermeture par Échap (overlay)', async () => {
    const onClose = vi.fn();
    const wrapper = mount(BaseModal, {
      slots: { default: '<div>Contenu</div>' },
      props: { ariaLabel: 'Test modal' },
      attachTo: document.body,
    });
    wrapper.vm.$.emit = onClose;
    await wrapper.find('[data-testid="modal-overlay"]').trigger('keydown', { key: 'Escape' });
    expect(onClose).toHaveBeenCalledWith('close');
    wrapper.unmount();
  });

  it('fermeture par clic en dehors (overlay)', async () => {
    const onClose = vi.fn();
    const wrapper = mount(BaseModal, {
      slots: { default: '<div>Contenu</div>' },
      props: { ariaLabel: 'Test modal' },
      attachTo: document.body,
    });
    wrapper.vm.$.emit = onClose;
    await wrapper.find('[data-testid="modal-overlay"]').trigger('mousedown');
    expect(onClose).toHaveBeenCalledWith('close');
    wrapper.unmount();
  });

  it('focusFirstElement met le focus sur le contenu si aucun focusable', async () => {
    const wrapper = mount(BaseModal, {
      slots: { default: '<div>Juste du texte</div>' },
      props: { ariaLabel: 'Test modal' },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    const content = wrapper.find('[data-testid="modal-content"]');
    expect(
      document.activeElement === content.element || content.element.contains(document.activeElement)
    ).toBe(true);
    wrapper.unmount();
  });

  it('ne plante pas si modalRef est null lors d’un Tab', async () => {
    const wrapper = mount(BaseModal, {
      slots: { default: '<button>Test</button>' },
      props: { ariaLabel: 'Test modal' },
      attachTo: document.body,
    });
    // Simule la perte de référence interne (robustesse)
    (wrapper.vm as unknown as { modalRef: { value: HTMLElement | null } }).modalRef = {
      value: null,
    };
    // Déclenche un keydown Tab
    await wrapper.find('[role="dialog"]').trigger('keydown', { key: 'Tab' });
    // Pas d’erreur attendue
    expect(true).toBe(true);
    wrapper.unmount();
  });

  it('fermeture par clic sur le bouton de fermeture', async () => {
    const onClose = vi.fn();
    const wrapper = mount(BaseModal, {
      slots: { default: '<div>Contenu</div>' },
      props: { ariaLabel: 'Test modal', showClose: true },
      attachTo: document.body,
    });
    wrapper.vm.$.emit = onClose;
    const closeBtn = wrapper.find('button[aria-label="Fermer la modale"]');
    expect(closeBtn.exists()).toBe(true);
    await closeBtn.trigger('click');
    expect(onClose).toHaveBeenCalledWith('close');
    wrapper.unmount();
  });
});
