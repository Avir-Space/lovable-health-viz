/* eslint-disable @typescript-eslint/no-explicit-any */
export type RangeTag = '1D'|'1W'|'2W'|'1M'|'6M'|'1Y';

export function deriveSourcesFromKey(k: string): string[] {
  const u = (k || '').toUpperCase();
  const s: string[] = [];
  if (u.includes('AMOS')) s.push('AMOS');
  if (u.includes('SAP')) s.push('SAP');
  if (u.includes('TRAX')) s.push('TRAX');
  if (u.includes('RAMCO')) s.push('Ramco');
  if (u.includes('AIMS')) s.push('AIMS');
  if (u.includes('JEPPESEN')) s.push('Jeppesen');
  return s;
}

export function compactNumber(n: number, unit = '') {
  if (n == null || Number.isNaN(n)) return '';
  const fmt = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 2 });
  return `${fmt.format(n)}${unit}`;
}

export function formatAxisNumber(n: number, unit = '') {
  if (n == null || Number.isNaN(n)) return '';
  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
  return `${fmt.format(n)}${unit}`;
}

export function truncateLabel(v: string, max = 12) {
  if (!v) return '';
  return v.length > max ? `${v.slice(0, max - 1)}…` : v;
}

export function pretty(v: any) {
  if (v == null) return '';
  return typeof v === 'object' ? JSON.stringify(v) : String(v);
}

export function formatDateByRange(isoOrLabel: string, range: RangeTag) {
  const d = new Date(isoOrLabel);
  const parsed = !Number.isNaN(d.getTime());
  if (!parsed) return truncateLabel(isoOrLabel, 16);

  const locales: Intl.LocalesArgument = undefined;
  let opts: Intl.DateTimeFormatOptions;
  switch (range) {
    case '1D': opts = { hour: '2-digit', minute: '2-digit' }; break;
    case '1W':
    case '2W':
    case '1M': opts = { month: 'short', day: 'numeric' }; break;
    case '6M': opts = { month: 'short' }; break;
    case '1Y': opts = { month: 'short', year: '2-digit' }; break;
    default:   opts = { month: 'short', day: 'numeric' };
  }
  return new Intl.DateTimeFormat(locales, opts).format(d);
}
