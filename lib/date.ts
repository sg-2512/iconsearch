/**
 * Date utility helpers for dynamic freshness and SEO metadata.
 */

export function getDynamicYear(): number {
  return new Date().getFullYear()
}

export function getFormattedCurrentMonthYear(): string {
  const date = new Date()
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function formatDateToMonthYear(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return getFormattedCurrentMonthYear()
  }
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
