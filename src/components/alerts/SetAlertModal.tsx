import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ComparisonOperator, Frequency, KpiAlertRule } from '@/hooks/useKpiAlerts';

const OPERATORS: { value: ComparisonOperator; label: string; phrase: string }[] = [
  { value: 'gt', label: 'greater than', phrase: 'rises above' },
  { value: 'gte', label: 'greater than or equal to', phrase: 'is at or above' },
  { value: 'lt', label: 'less than', phrase: 'drops below' },
  { value: 'lte', label: 'less than or equal to', phrase: 'is at or below' },
  { value: 'eq', label: 'equal to', phrase: 'is equal to' },
  { value: 'neq', label: 'not equal to', phrase: 'is not equal to' },
];

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
];

interface SetAlertModalProps {
  open: boolean;
  onClose: () => void;
  kpiName: string;
  kpiKey: string;
  dashboardId: string;
  unit?: string;
  existingRule?: KpiAlertRule;
  onSave: (rule: Omit<KpiAlertRule, 'id' | 'created_at' | 'updated_at' | 'last_triggered_at'>) => Promise<void>;
  onUpdate?: (id: number, patch: Partial<KpiAlertRule>) => Promise<void>;
}

export function SetAlertModal({
  open,
  onClose,
  kpiName,
  kpiKey,
  dashboardId,
  unit,
  existingRule,
  onSave,
  onUpdate,
}: SetAlertModalProps) {
  const { toast } = useToast();
  const [operator, setOperator] = useState<ComparisonOperator>('gt');
  const [value, setValue] = useState('');
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [frequency, setFrequency] = useState<Frequency>('realtime');
  const [validationError, setValidationError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && existingRule) {
      setOperator(existingRule.comparison_operator);
      setValue(String(existingRule.threshold_value));
      setNotifyEmail(existingRule.notify_email);
      setNotifyInApp(existingRule.notify_in_app);
      setFrequency(existingRule.frequency);
    } else if (open && !existingRule) {
      setOperator('gt');
      setValue('');
      setNotifyEmail(false);
      setNotifyInApp(true);
      setFrequency('realtime');
    }
    setValidationError('');
  }, [open, existingRule]);

  const handleConfirm = async () => {
    setValidationError('');

    if (!notifyEmail && !notifyInApp) {
      setValidationError('Please select at least one notification method');
      return;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      setValidationError('Please enter a valid number');
      return;
    }

    setSaving(true);
    try {
      if (existingRule && onUpdate) {
        await onUpdate(existingRule.id, {
          comparison_operator: operator,
          threshold_value: numericValue,
          notify_email: notifyEmail,
          notify_in_app: notifyInApp,
          frequency,
          is_active: true,
        });
      } else {
        await onSave({
          kpi_key: kpiKey,
          dashboard_id: dashboardId,
          comparison_operator: operator,
          threshold_value: numericValue,
          notify_email: notifyEmail,
          notify_in_app: notifyInApp,
          frequency,
          is_active: true,
        });
      }

      const operatorPhrase = OPERATORS.find((o) => o.value === operator)?.phrase || operator;
      const unitText = unit ? ` ${unit}` : '';
      
      toast({
        title: existingRule ? 'Alert updated' : 'Alert created',
        description: `You'll be notified if ${kpiName} ${operatorPhrase} ${numericValue}${unitText}.`,
      });

      onClose();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to save alert',
        description: err?.message || 'Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Set Trigger Alert</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* IF row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metric">Metric</Label>
              <Input
                id="metric"
                value={kpiName}
                disabled
                className="bg-muted text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={operator} onValueChange={(v) => setOperator(v as ComparisonOperator)}>
                <SelectTrigger id="condition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPERATORS.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <div className="relative">
                <Input
                  id="value"
                  type="number"
                  step="any"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="0"
                  className="pr-12"
                />
                {unit && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                    {unit}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Notify Via */}
          <div className="space-y-3">
            <Label>Notify Via</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notify-email"
                  checked={notifyEmail}
                  onCheckedChange={(checked) => setNotifyEmail(checked === true)}
                />
                <label
                  htmlFor="notify-email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notify-inapp"
                  checked={notifyInApp}
                  onCheckedChange={(checked) => setNotifyInApp(checked === true)}
                />
                <label
                  htmlFor="notify-inapp"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  In-app notification
                </label>
              </div>
            </div>
            {validationError && (
              <p className="text-sm text-destructive">{validationError}</p>
            )}
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCIES.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={saving}>
            {saving ? 'Saving...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
