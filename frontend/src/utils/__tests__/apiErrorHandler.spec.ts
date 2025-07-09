/**
 * -----------------------------------------------------
 * Sommaire des blocs de tests :
 * - Vérifie la robustesse de la gestion d’erreur API côté front
 * - Couvre tous les cas de handleApiResponse (succès, 204, erreur API, parsing, JSON invalide)
 * - Vérifie le typage et la cohérence de formatError
 * Helpers/mocks centralisés en haut de fichier.
 * -----------------------------------------------------
 */

/**
 * Tests unitaires du module apiErrorHandler (TypeScript)
 * -----------------------------------------------------
 */
import { describe, it, expect } from 'vitest';
import { handleApiResponse, formatError } from '../apiErrorHandler';

// Helper strict pour mocker un objet Response
function mockResponse<T = unknown>(options: {
  ok: boolean;
  status: number;
  json?: T;
  throwOnJson?: boolean;
}): Response {
  return {
    ok: options.ok,
    status: options.status,
    json: async () => {
      if (options.throwOnJson) throw new Error('fail');
      return options.json as T;
    },
    headers: new Headers(),
    redirected: false,
    statusText: '',
    type: 'basic',
    url: '',
    clone: () => ({}) as Response,
    body: null,
    bodyUsed: false,
    arrayBuffer: async () => new ArrayBuffer(0),
    blob: async () => new Blob(),
    formData: async () => new FormData(),
    text: async () => '',
  } as Response;
}

describe('apiErrorHandler', () => {
  // --- Bloc : handleApiResponse ---
  it('retourne le JSON si ok', async () => {
    const res = mockResponse({ ok: true, status: 200, json: { foo: 'bar' } });
    const data = await handleApiResponse<{ foo: string }>(res, 'Erreur');
    expect(data).toEqual({ foo: 'bar' });
  });

  it('retourne true si 204', async () => {
    const res = mockResponse({ ok: true, status: 204 });
    const data = await handleApiResponse(res, 'Erreur');
    expect(data).toBe(true);
  });

  it('lève une erreur API détaillée', async () => {
    const res = mockResponse({ ok: false, status: 400, json: { error: 'Erreur API' } });
    await expect(handleApiResponse(res, 'Erreur')).rejects.toEqual({ error: 'Erreur API' });
  });

  it('lève une erreur générique si parsing impossible', async () => {
    const res = mockResponse({ ok: false, status: 500, throwOnJson: true });
    await expect(handleApiResponse(res, 'Erreur générique')).rejects.toEqual({
      error: 'Erreur générique',
    });
  });

  it('retourne un objet vide si JSON invalide mais ok', async () => {
    const res = mockResponse({ ok: true, status: 200, throwOnJson: true });
    const data = await handleApiResponse(res, 'Erreur');
    expect(data).toEqual({});
  });

  // --- Bloc : formatError ---
  it('retourne un objet ApiError', () => {
    expect(formatError({ error: 'Oups' })).toEqual({ error: 'Oups' });
    expect(formatError(undefined, 'Fallback')).toEqual({ error: 'Fallback' });
  });
});
