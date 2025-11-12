import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ImpactContext = 'my' | 'overall';

interface ImpactKpiCardProps {
  kpi_key: string;
  name: string;
  unit?: string;
  impact_value: number;
  impact_unit?: string;
  impact_summary?: string;
  product_sources?: string[];
  action_title?: string;
  action_cta_label?: string;
  context: ImpactContext;
}

export function ImpactKpiCard({
  kpi_key,
  name,
  unit,
  impact_value,
  impact_unit,
  impact_summary,
  product_sources,
  action_title,
  action_cta_label,
  context,
}: ImpactKpiCardProps) {

  return (
    <Card className="p-5 hover:shadow-lg transition-all">
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-base font-semibold leading-tight flex-1">
              {name}
            </h4>
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
            {impact_value.toFixed(2)} {impact_unit || unit || ''}
          </div>
          {impact_summary && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {impact_summary}
            </p>
          )}
          {action_title && action_cta_label && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-foreground mb-1">{action_title}</p>
              <p className="text-xs text-muted-foreground">{action_cta_label}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
