import { KpiRange } from '@/hooks/useKpiData';
import { Button } from './button';

interface RangeChipsProps {
  selected: KpiRange;
  onChange: (range: KpiRange) => void;
}

const RANGES: KpiRange[] = ['1D', '1W', '2W', '1M', '6M', '1Y'];

export function RangeChips({ selected, onChange }: RangeChipsProps) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Time range selection">
      {RANGES.map((range) => (
        <Button
          key={range}
          size="sm"
          variant={selected === range ? 'default' : 'outline'}
          onClick={() => onChange(range)}
          className="h-7 px-2 text-[11px] font-medium"
          aria-pressed={selected === range}
          aria-label={`Select ${range} range`}
        >
          {range}
        </Button>
      ))}
    </div>
  );
}
