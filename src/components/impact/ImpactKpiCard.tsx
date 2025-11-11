import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ImpactContext = 'my' | 'overall';

interface ImpactKpiCardProps {
  kpi_key: string;
  name: string;
  variant: string;
  dashboard: string;
  unit?: string;
  product_sources?: string[];
  impact_value?: number;
  current_value?: number;
  previous_value?: number;
  impact_percentage?: number;
  impact_trend?: string;
  context: ImpactContext;
}

export function ImpactKpiCard({
  kpi_key,
  name,
  variant,
  dashboard,
  unit,
  product_sources = [],
  impact_value,
  current_value,
  previous_value,
  impact_percentage,
  impact_trend,
  context,
}: ImpactKpiCardProps) {
  const getTrendIcon = () => {
    if (!impact_trend) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (impact_trend === 'improvement') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (impact_trend === 'decline') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendLabel = () => {
    if (!impact_trend) return 'No change';
    if (impact_trend === 'improvement') return 'Improvement';
    if (impact_trend === 'decline') return 'Decline';
    return 'No change';
  };

  return (
    <Card className="p-5 hover:shadow-lg transition-all">
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-base font-semibold leading-tight flex-1">
              {name}
            </h4>
            <Badge variant="secondary" className="text-xs shrink-0">
              {variant}
            </Badge>
          </div>

          {/* Product Sources */}
          {product_sources.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product_sources.map((source: string) => (
                <span
                  key={source}
                  className="text-white text-xs font-semibold rounded-full px-2.5 py-0.5 shadow-sm"
                  style={{
                    backgroundColor:
                      source.toLowerCase() === 'amos' ? '#1F49B6' :
                      source.toLowerCase() === 'trax' ? '#E6A323' :
                      source.toLowerCase() === 'sap' ? '#32C365' :
                      source.toLowerCase() === 'ramco' ? '#B273F6' :
                      source.toLowerCase() === 'aims' ? '#D84969' :
                      source.toLowerCase() === 'jeppesen' ? '#1F49B6' :
                      '#294BDB',
                  }}
                >
                  {source}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content based on context */}
        {context === 'my' ? (
          <div className="space-y-3 pt-2 border-t">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">My Impact (30d):</span>
            </div>
            {impact_value !== undefined ? (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {impact_value} {unit || ''}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  In the last 30 days, AVIR actions linked to your workspace contributed this impact on this KPI.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No impact data available yet.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3 pt-2 border-t">
            {current_value !== undefined && previous_value !== undefined ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Current</div>
                    <div className="text-lg font-semibold">{current_value} {unit || ''}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Previous</div>
                    <div className="text-lg font-semibold">{previous_value} {unit || ''}</div>
                  </div>
                </div>
                
                {impact_percentage !== undefined && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      {getTrendIcon()}
                      <span className="text-sm font-medium">{getTrendLabel()}</span>
                    </div>
                    <div className="text-lg font-bold">
                      {impact_percentage > 0 ? '+' : ''}{impact_percentage.toFixed(1)}%
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No impact data available yet.
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
