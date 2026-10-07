import type { Share } from '../types';

const CENTS_PER_UNIT = 100;
const THOUSANDS_BOUNDARY = /\B(?=(\d{3})+(?!\d))/g;

export function formatAmount(cents: number): string {
  const whole = Math.floor(cents / CENTS_PER_UNIT);
  const fraction = cents % CENTS_PER_UNIT;
  return `${String(whole).replace(THOUSANDS_BOUNDARY, ',')}.${String(fraction).padStart(2, '0')}`;
}

export function formatShareLine(index: number, share: Share): string {
  return `Person ${index + 1}: ${formatAmount(share.cents)}`;
}
