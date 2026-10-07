import type { MessageId } from './messages';

export type SplitInput = { billCents: number; tipBasisPoints: number; people: number };

export type Share = { cents: number; extraCent: boolean };

export type SplitResult = { tipCents: number; totalCents: number; shares: Share[]; leftover: number };

export type RawInputs = { bill: string; tip: string; people: string };

export type FieldErrors = Partial<Record<'bill' | 'tip' | 'people', MessageId>>;
