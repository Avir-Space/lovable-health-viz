import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type ComparisonOperator = 'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'neq';
export type Frequency = 'realtime' | 'hourly' | 'daily';

export type KpiAlertRule = {
  id: number;
  kpi_key: string;
  dashboard_id: string;
  comparison_operator: ComparisonOperator;
  threshold_value: number;
  notify_email: boolean;
  notify_in_app: boolean;
  frequency: Frequency;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  last_triggered_at?: string;
};

export function useKpiAlerts(kpi_key: string, dashboard_id: string) {
  const { user } = useAuth();
  const [rules, setRules] = useState<KpiAlertRule[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRules = async () => {
    if (!user) {
      setRules([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await (supabase as any)
        .from('kpi_alert_rules')
        .select('*')
        .eq('kpi_key', kpi_key)
        .eq('dashboard_id', dashboard_id)
        .eq('user_id', user.id);

      if (error) {
        console.error('[useKpiAlerts] Load error:', error);
        setRules([]);
      } else {
        setRules((data as any[]) || []);
      }
    } catch (err) {
      console.error('[useKpiAlerts] Load exception:', err);
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, [kpi_key, dashboard_id, user?.id]);

  const createAlert = async (payload: Omit<KpiAlertRule, 'id' | 'created_at' | 'updated_at' | 'last_triggered_at'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await (supabase as any)
      .from('kpi_alert_rules')
      .insert([
        {
          user_id: user.id,
          kpi_key: payload.kpi_key,
          dashboard_id: payload.dashboard_id,
          comparison_operator: payload.comparison_operator,
          threshold_value: payload.threshold_value,
          notify_email: payload.notify_email,
          notify_in_app: payload.notify_in_app,
          frequency: payload.frequency,
          is_active: payload.is_active,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[useKpiAlerts] Create error:', error);
      throw error;
    }

    await loadRules();
    return data;
  };

  const updateAlert = async (id: number, patch: Partial<KpiAlertRule>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await (supabase as any)
      .from('kpi_alert_rules')
      .update({
        ...patch,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('[useKpiAlerts] Update error:', error);
      throw error;
    }

    await loadRules();
    return data;
  };

  const deleteAlert = async (id: number) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await (supabase as any)
      .from('kpi_alert_rules')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('[useKpiAlerts] Delete error:', error);
      throw error;
    }

    await loadRules();
  };

  return {
    rules,
    loading,
    createAlert,
    updateAlert,
    deleteAlert,
  };
}
