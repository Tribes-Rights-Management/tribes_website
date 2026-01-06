/**
 * Copyright Line Utility - SINGLE SOURCE OF TRUTH
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * DO NOT HARDCODE YEARS ANYWHERE ELSE IN THE CODEBASE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This utility generates the canonical copyright line for:
 * - Website footers (PublicLayout, DashboardLayout)
 * - License Package PDFs (cover page + individual license pages)
 * - Single License PDFs
 * - Admin export layouts
 * - Any other location requiring a copyright notice
 * 
 * RULES:
 * - Start year is always 2025 (company founding year)
 * - Uses en dash (–) for year ranges, not hyphen (-)
 * - If current year is 2025: "© 2025 Tribes Rights Management LLC"
 * - If current year > 2025: "© 2025–{currentYear} Tribes Rights Management LLC"
 * 
 * USAGE:
 * - UI components: getCopyrightLine() uses client Date
 * - Server/Edge functions: getCopyrightLine(serverYear) for consistency
 * - PDFs: Always prefer server-provided year to avoid client clock drift
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Company founding year - the start of all copyright ranges */
export const COPYRIGHT_START_YEAR = 2025;

/** Legal entity name for copyright notices */
export const COPYRIGHT_ENTITY = "Tribes Rights Management LLC";

/**
 * Generates the full copyright line with dynamic year range.
 * 
 * @param currentYear - Optional override for current year (use for server-side generation)
 * @param includeRightsReserved - Whether to include "All rights reserved." suffix
 * @returns Formatted copyright string with en dash for year ranges
 * 
 * @example
 * // Client-side (uses system date)
 * getCopyrightLine() // "© 2025–2026 Tribes Rights Management LLC. All rights reserved."
 * 
 * @example
 * // Server-side (explicit year)
 * getCopyrightLine(2027) // "© 2025–2027 Tribes Rights Management LLC. All rights reserved."
 * 
 * @example
 * // Without "All rights reserved"
 * getCopyrightLine(undefined, false) // "© 2025–2026 Tribes Rights Management LLC"
 */
export function getCopyrightLine(
  currentYear?: number,
  includeRightsReserved: boolean = true
): string {
  const year = currentYear ?? new Date().getFullYear();
  
  const yearRange = year > COPYRIGHT_START_YEAR 
    ? `${COPYRIGHT_START_YEAR}–${year}` // en dash (–), not hyphen (-)
    : `${COPYRIGHT_START_YEAR}`;
  
  const base = `© ${yearRange} ${COPYRIGHT_ENTITY}`;
  
  return includeRightsReserved 
    ? `${base}. All rights reserved.`
    : base;
}

/**
 * Generates just the year range portion for custom formatting.
 * 
 * @param currentYear - Optional override for current year
 * @returns Year range string (e.g., "2025" or "2025–2027")
 */
export function getCopyrightYearRange(currentYear?: number): string {
  const year = currentYear ?? new Date().getFullYear();
  
  return year > COPYRIGHT_START_YEAR 
    ? `${COPYRIGHT_START_YEAR}–${year}`
    : `${COPYRIGHT_START_YEAR}`;
}
