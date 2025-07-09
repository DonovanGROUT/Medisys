// Helpers pour rendez-vous (formatage, statut, badge, etc.)
// Utilisables dans tous les composants rendez-vous

export function formatDate(dateHeure: string): string {
  if (!dateHeure) return '';
  const d = new Date(dateHeure);
  return d.toLocaleDateString('fr-FR');
}

export function formatTime(dateHeure: string): string {
  return dateHeure ? dateHeure.split('T')[1]?.substring(0, 5) : '';
}

export function statutFr(statut: string): string {
  switch (statut) {
    case 'scheduled':
      return 'À venir';
    case 'confirmed':
      return 'Confirmé';
    case 'cancelled':
      return 'Annulé';
    case 'completed':
      return 'Terminé';
    default:
      return statut;
  }
}

export function badgeClass(statut: string): string {
  switch (statut) {
    case 'scheduled':
      return 'text-white bg-blue-800';
    case 'confirmed':
      return 'text-white bg-green-800';
    case 'cancelled':
      return 'text-white bg-red-800';
    case 'completed':
      return 'text-white bg-slate-800';
    default:
      return 'text-white bg-slate-800';
  }
}

export function isPast(dateHeure: string): boolean {
  return new Date(dateHeure) < new Date();
}
