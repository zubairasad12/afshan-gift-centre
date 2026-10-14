export type ClassValue =
  | ClassValue[]
  | string
  | number
  | null
  | boolean
  | undefined
  | { [key: string]: any };

/**
 * Combines class names cleanly, filtering out falsy values
 */
export function cn(...classes: ClassValue[]): string {
  const result: string[] = [];

  function process(item: ClassValue): void {
    if (!item) return;

    if (typeof item === 'string' || typeof item === 'number') {
      result.push(String(item).trim());
    } else if (Array.isArray(item)) {
      item.forEach(process);
    } else if (typeof item === 'object') {
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key) && item[key]) {
          result.push(key);
        }
      }
    }
  }

  classes.forEach(process);
  return result.filter(Boolean).join(' ');
}

/**
 * Formats a numeric price into Pakistani Rupee string (e.g. "Rs. 12,500")
 */
export function formatPrice(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rs. 0';
  }
  const formatted = new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `Rs. ${formatted}`;
}

/**
 * Generates a URL-friendly slug from a text string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncates text with an ellipsis if it exceeds maxLength
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Calculates discount percentage between sale price and compareAt price
 */
export function getDiscountPercentage(price: number, compareAt: number): number {
  if (!compareAt || compareAt <= price) return 0;
  const discount = Math.round(((compareAt - price) / compareAt) * 100);
  return discount > 0 ? discount : 0;
}
