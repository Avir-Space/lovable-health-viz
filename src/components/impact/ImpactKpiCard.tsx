import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ImpactContext = 'my' | 'overall';

interface ImpactKpiCardProps {
  kpi_key: string;
  name: string;
  unit?: string;
  chart_variant?: string;
  impact_value: number;
  impact_unit?: string;
  summary?: string;
  confidence_pct?: number;
  product_sources?: string[];
  context: ImpactContext;
}

export function ImpactKpiCard({
  name,
  unit,
  chart_variant,
  impact_value,
  impact_unit,
  summary,
  confidence_pct,
  product_sources,
  context,
}: ImpactKpiCardProps) {
  // Use provided summary or generate a generic one
  const displaySummary = summary || 
    `In the selected period, AVIR ${
      context === 'my' ? 'contributed to your' : 'achieved'
    } impact of ${impact_value.toFixed(2)}${impact_unit || unit ? ` ${impact_unit || unit}` : ''} on "${name}".`;

  // Use impact_unit if available, otherwise fall back to unit
  const displayUnit = impact_unit || unit || '';

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
              <div className="flex items-center gap-2 mt-1">
                {chart_variant && (
                  <p className="text-xs text-muted-foreground">
                    Type: {chart_variant}
                  </p>
                )}
                {confidence_pct !== undefined && confidence_pct !== null && (
                  <Badge variant="secondary" className="text-xs">
                    {confidence_pct}% confidence
                  </Badge>
                )}
              </div>
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
            {impact_value.toFixed(2)} {displayUnit}
          </div>
          {displaySummary && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {displaySummary}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
