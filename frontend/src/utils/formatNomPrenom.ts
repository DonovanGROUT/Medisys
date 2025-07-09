// Utilitaires pour formatage nom/prénom (gestion composés, majuscules, etc.)

/**
 * Met en majuscules chaque partie d'un nom (gère les composés)
 * Ex: "le-roux" => "LE-ROUX"
 */
export function formatNom(nom?: string): string {
  if (!nom) return '';
  return nom
    .split('-')
    .map((part) => part.toUpperCase())
    .join('-');
}

/**
 * Met la première lettre de chaque partie d'un prénom en majuscule, le reste en minuscule
 * Ex: "jean-paul" => "Jean-Paul"
 */
export function formatPrenom(prenom?: string): string {
  if (!prenom) return '';
  return prenom
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('-');
}
