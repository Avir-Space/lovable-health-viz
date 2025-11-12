import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ImpactContext = 'my' | 'overall';

interface ImpactKpiCardProps {
  kpi_key: string;
  name: string;
  unit?: string;
  chart_variant?: string;
  impact_value: number;
  product_sources?: string[];
  context: ImpactContext;
}

export function ImpactKpiCard({
  name,
  unit,
  chart_variant,
  impact_value,
  product_sources,
  context,
}: ImpactKpiCardProps) {
  // Generate a generic impact summary
  const impactSummary = `In the selected period, AVIR ${
    context === 'my' ? 'contributed to your' : 'achieved'
  } impact of ${impact_value.toFixed(2)}${unit ? ` ${unit}` : ''} on "${name}".`;

  return (
    <Card className="p-5 hover:shadow-lg transition-all">
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-base font-semibold leading-tight">
                {name}
              </h4>
              {chart_variant && (
                <p className="text-xs text-muted-foreground mt-1">
                  Type: {chart_variant}
                </p>
              )}
            </div>
            {product_sources && product_sources.length > 0 && (
              <div className="flex gap-1 flex-wrap shrink-0">
                {product_sources.map((source) => (
                  <Badge key={source} variant="outline" className="text-xs">
                    {source}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {context === 'my' ? 'My Impact:' : 'Overall Impact:'}
            </span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {impact_value.toFixed(2)} {unit || ''}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {impactSummary}
          </p>
        </div>
      </div>
    </Card>
  );
}
