import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ImpactContext = 'my' | 'overall';

interface ImpactKpiCardProps {
  kpi_key: string;
  name: string;
  variant: string;
  dashboard: string;
  unit?: string;
  impact_value: number;
  context: ImpactContext;
}

export function ImpactKpiCard({
  kpi_key,
  name,
  variant,
  dashboard,
  unit,
  impact_value,
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
            <Badge variant="secondary" className="text-xs shrink-0">
              {variant}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {context === 'my' ? 'My Impact (30d):' : 'Overall Impact (30d):'}
            </span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {impact_value.toFixed(2)} {unit || ''}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {context === 'my' 
              ? 'In the last 30 days, AVIR actions linked to your workspace contributed this impact on this KPI.'
              : 'In the last 30 days, AVIR-driven interventions have contributed this impact across the organization.'}
          </p>
        </div>
      </div>
    </Card>
  );
}
