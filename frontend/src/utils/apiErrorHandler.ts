// Centralisation de la gestion des erreurs API/réseau (TypeScript)

/**
 * Structure standardisée pour les erreurs API côté front.
 * Toutes les erreurs propagées par les services doivent respecter ce format.
 */
export interface ApiError {
  error: string;
}

/**
 * Analyse la réponse d'une requête fetch et gère les cas d'erreur ou de succès.
 * @template T Type attendu en cas de succès
 * @param {Response} response - Réponse fetch à analyser
 * @param {string} defaultError - Message d'erreur par défaut si la réponse n'est pas exploitable
 * @returns {Promise<T | true>} Données typées ou true (pour DELETE/204)
 * @throws {ApiError} en cas d'erreur API ou réseau
 */
export async function handleApiResponse<T = unknown>(
  response: Response,
  defaultError: string
): Promise<T | true> {
  if (response.ok) {
    if (response.status === 204) return true;
    try {
      return (await response.json()) as T;
    } catch {
      return {} as T;
    }
  }
  let error: ApiError;
  try {
    error = await response.json();
  } catch {
    error = { error: defaultError };
  }
  throw error;
}

/**
 * Formate toute erreur reçue ou levée en ApiError standardisé.
 * @param {unknown} e - Erreur d'origine (objet, string, etc.)
 * @param {string} [fallback='Erreur réseau'] - Message par défaut si l'erreur n'est pas exploitable
 * @returns {ApiError} Erreur formatée pour affichage ou propagation
 */
export function formatError(e: unknown, fallback = 'Erreur réseau'): ApiError {
  return {
    error:
      e &&
      typeof e === 'object' &&
      'error' in e &&
      typeof (e as { error?: unknown }).error === 'string'
        ? (e as { error: string }).error
        : fallback,
  };
}
