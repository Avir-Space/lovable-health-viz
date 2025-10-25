-- Fix Maintenance Health Overview KPI variants to render proper charts

-- Line charts for time-series data
UPDATE kpi_meta SET variant = 'line'
WHERE kpi_key IN (
  'maintenance-health-overview:aog_events_count_minutes',
  'maintenance-health-overview:aog_events_count_and_minutes',
  'maintenance-health-overview:mean_time_to_repair_mttr',
  'maintenance-health-overview:repeat_defects_30_90d',
  'maintenance-health-overview:unscheduled_removals_30_90d',
  'maintenance-health-overview:tech_delay_minutes'
);

-- Gauge for percentage metrics
UPDATE kpi_meta SET variant = 'gauge'
WHERE kpi_key = 'maintenance-health-overview:fleet_airworthiness_percent';

-- Bar charts for categorical breakdowns
UPDATE kpi_meta SET variant = 'bar'
WHERE kpi_key IN (
  'maintenance-health-overview:deferral_aging',
  'maintenance-health-overview:work_order_backlog_aging',
  'maintenance-health-overview:work_packages_due_next_7_30d'
);

-- Pie chart for proportional splits
UPDATE kpi_meta SET variant = 'pie'
WHERE kpi_key = 'maintenance-health-overview:scheduled_vs_unscheduled';

-- Keep tables only for actual list views
UPDATE kpi_meta SET variant = 'table'
WHERE kpi_key IN (
  'maintenance-health-overview:airworthiness_status_by_aircraft',
  'maintenance-health-overview:deferral_count',
  'maintenance-health-overview:mel_cdl_items_open',
  'maintenance-health-overview:spare_induced_delays_pct',
  'maintenance-health-overview:work_orders_awaiting_part'
);