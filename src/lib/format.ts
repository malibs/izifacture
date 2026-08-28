/**
 * Le franc CFA n'a pas de sous-unité : tous les montants sont des entiers de FCFA.
 * Aucun calcul monétaire ne doit passer par un flottant.
 */

const GROUPED = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

/** Normalise les espaces fines insécables d'Intl en espaces insécables classiques. */
function normalizeSpaces(value: string) {
  return value.replace(/[\u202F\u2009]/g, "\u00A0");
}

/** 250000 -> "250 000 FCFA" */
export function formatFCFA(amount: number) {
  return `${normalizeSpaces(GROUPED.format(amount))}\u00A0FCFA`;
}

/** 250000 -> "250 000" (sans devise, pour les gros chiffres déjà libellés) */
export function formatAmount(amount: number) {
  return normalizeSpaces(GROUPED.format(amount));
}

/** 1250000 -> "1,25 M" — pour les axes de graphiques et les libellés compacts. */
export function formatCompactFCFA(amount: number) {
  if (Math.abs(amount) >= 1_000_000) {
    return `${normalizeSpaces(
      new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(
        amount / 1_000_000,
      ),
    )}\u00A0M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `${normalizeSpaces(
      new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(
        amount / 1_000,
      ),
    )}\u00A0k`;
  }
  return formatAmount(amount);
}

/** "2025-06-28" -> "28/06/2025" */
export function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

/** Nombre de jours entiers séparant `isoDate` de `today` (négatif si passé). */
export function daysUntil(isoDate: string, today = new Date()) {
  const target = new Date(`${isoDate}T00:00:00Z`);
  const reference = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  return Math.round((target.getTime() - reference) / 86_400_000);
}

/** "Aïssatou Diallo" -> "AD" */
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** 0.812 -> "81 %" */
export function formatPercent(ratio: number) {
  return `${Math.round(ratio * 100)}\u00A0%`;
}
