export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatNumber(value: number, decimals: number = 2): string {
  return Number(value).toFixed(decimals)
}

export function generateId(): string {
  // Fallback for environments where crypto.randomUUID is not available
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Simple fallback ID generator
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}