type Props = {
  value?: number | string;
  unit?: string;
  align?: 'left' | 'center' | 'right';
};

function formatNumber(n: number | string) {
  if (typeof n === 'string') return n;
  if (typeof n !== 'number' || Number.isNaN(n)) return '–';
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
}

const NBSP_NARROW = '\u202F';

export default function NumericChart({ value, unit, align = 'left' }: Props) {
  const textAlign =
    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

  const formatted = formatNumber(value ?? '–');
  const out = unit ? `${formatted}${NBSP_NARROW}${unit}` : formatted;

  return (
    <div className={`min-h-[200px] w-full flex items-center ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`tabular-nums tracking-tight ${textAlign} leading-none`}
        style={{ fontSize: 'clamp(28px, 6vw, 56px)', fontWeight: 700 }}
        title={out}
      >
        {out}
      </div>
    </div>
  );
}
