import { describe, it, expect } from 'vitest';
import { handleApiResponse, formatError } from '../apiErrorHandler';

function mockResponse({ ok, status, json }: { ok: boolean; status: number; json?: any }) {
  return {
    ok,
    status,
    json: async () => json,
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
  } as unknown as Response;
}

describe('apiErrorHandler', () => {
  it('handleApiResponse retourne le JSON si ok', async () => {
    const res = mockResponse({ ok: true, status: 200, json: { foo: 'bar' } });
    const data = await handleApiResponse<{ foo: string }>(res, 'Erreur');
    if (data !== true) {
      expect(data.foo).toBe('bar');
    } else {
      throw new Error('Retour true inattendu');
    }
  });

  it('handleApiResponse retourne true si 204', async () => {
    const res = mockResponse({ ok: true, status: 204 });
    const data = await handleApiResponse(res, 'Erreur');
    expect(data).toBe(true);
  });

  it('handleApiResponse lève une erreur API détaillée', async () => {
    const res = mockResponse({ ok: false, status: 400, json: { error: 'Erreur API' } });
    await expect(handleApiResponse(res, 'Erreur')).rejects.toEqual({ error: 'Erreur API' });
  });

  it('handleApiResponse lève une erreur générique si parsing impossible', async () => {
    const res = {
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('fail');
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
    } as unknown as Response;
    await expect(handleApiResponse(res, 'Erreur générique')).rejects.toEqual({
      error: 'Erreur générique',
    });
  });

  it('formatError retourne un objet ApiError', () => {
    expect(formatError({ error: 'Oups' })).toEqual({ error: 'Oups' });
    expect(formatError(undefined, 'Fallback')).toEqual({ error: 'Fallback' });
  });
});
