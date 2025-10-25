import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function KpiSelfTest() {
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('kpi_meta').select('kpi_key, variant').order('kpi_key');
      if (error) { 
        console.warn('[KPI] meta error', error); 
        return; 
      }
      console.info('[KPI] meta count:', data?.length || 0);
      console.info('[KPI] variants:', [...new Set(data?.map(k => k.variant))]);
    })();
  }, []);
  return null;
}
