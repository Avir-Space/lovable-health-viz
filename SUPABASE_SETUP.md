# AVIR Supabase Integration Setup

## Database Schema Created ✅

The following tables and functions have been created in your Supabase project:

### Tables
- `kpi_meta` - KPI metadata (name, variant, axes, config)
- `kpi_timeseries` - Time-series data with range tags (1D/1W/2W/1M/6M/1Y)
- `kpi_categories` - Categorical data (bar, pie charts)
- `kpi_heatmap` - Heatmap cell data
- `kpi_table_rows` - Table row data (JSON)

### RPC Functions
- `get_kpi_payload(p_kpi_key, p_range)` - Main function to fetch KPI data
- `kpi_timeseries_bucketed(p_kpi_key, p_range)` - Get bucketed timeseries
- `kpi_latest_categories(p_kpi_key)` - Get latest category snapshot
- `kpi_latest_heatmap(p_kpi_key)` - Get latest heatmap snapshot
- `kpi_latest_table(p_kpi_key)` - Get latest table rows

## Seeding Data

### Step 1: Access SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** → **New Query**
3. Reference the uploaded file: `AVIR_Supabase_Full_Exhaustive_Prompt_v2.txt`

### Step 2: Run Seed SQL

The seed file contains 28,755 lines of INSERT statements organized as:

**Lines 143-263**: KPI metadata inserts (all 7 dashboards)
```sql
insert into kpi_meta (kpi_key,dashboard,name,variant,x_axis,y_axis,unit,config) values ...
```

**Lines 267-28567**: KPI data inserts (timeseries, categories, heatmaps, tables)
```sql
insert into kpi_timeseries (kpi_key,ts,series,value,range_tag) values ...
insert into kpi_categories (kpi_key,snapshot_ts,category,value,series) values ...
insert into kpi_heatmap (kpi_key,snapshot_ts,x_label,y_label,value) values ...
insert into kpi_table_rows (kpi_key,snapshot_ts,row_data) values ...
```

### Step 3: Run in Batches

Because the file is large, run the SQL in sections:

1. **First:** Run all kpi_meta inserts (lines 143-263)
2. **Then:** Run kpi_timeseries inserts in batches of ~5000 lines
3. **Then:** Run kpi_categories, kpi_heatmap, kpi_table_rows

**Tip:** Copy sections from the uploaded text file and paste into SQL Editor.

## Visual Config Patches (Optional Enhancement)

After seeding, run these updates to enhance specific KPI visualizations:

```sql
-- AOG dual-axis configuration
update kpi_meta
set config = coalesce(config,'{}'::jsonb) || jsonb_build_object(
  'dualAxis', jsonb_build_object(
    'seriesMap', jsonb_build_object('count', 0, 'minutes_7d', 1),
    'rightAxisName', 'AOG Minutes (7d)'
  ),
  'colors', jsonb_build_object('count','#3B82F6','minutes_7d','#F59E0B')
)
where lower(name) like '%aog%';

-- Heatmap enhancements
update kpi_meta
set config = coalesce(config,'{}'::jsonb) || jsonb_build_object(
  'heatmap', jsonb_build_object(
    'useVisualMap', true,
    'legend', 'hidden'
  )
)
where lower(name) like '%aging%' or lower(variant) = 'heatmap';

-- Donut (pie) chart config
update kpi_meta
set config = coalesce(config,'{}'::jsonb) || jsonb_build_object(
  'pie', jsonb_build_object(
    'radiusInner', '55%',
    'radiusOuter', '75%',
    'legend', 'bottom',
    'labelFormatter', '{b}: {d}% ({c})'
  )
)
where lower(name) like '%scheduled%' or lower(variant) = 'pie';

-- Bar chart proportional scaling
update kpi_meta
set config = coalesce(config,'{}'::jsonb) || jsonb_build_object(
  'bars', jsonb_build_object('proportional', true, 'normalize', false)
)
where lower(name) like '%backlog%' or lower(name) like '%deferral%';

-- Table enhancements
update kpi_meta
set config = coalesce(config,'{}'::jsonb) || jsonb_build_object(
  'table', jsonb_build_object('sortable', true, 'stickyHeader', true, 'numericAlign', 'right')
)
where lower(variant) = 'table';
```

## Frontend Integration

### Current Implementation

The system is now backend-driven with:
- **SWR** for data fetching and caching
- **useKpiData** hook for fetching individual KPIs
- **useDashboardKpis** hook for fetching all KPIs for a dashboard

### Enabling Live Data

To enable Supabase integration for a dashboard, set `useLiveData={true}` on KpiCard:

```tsx
<KpiCard
  kpiKey="maintenance-health-overview:kpi_-_fleet_airworthiness_%"
  useLiveData={true}  // ← Enable Supabase fetching
  defaultRange="1M"
  ranges={["1D","1W","2W","1M","6M","1Y"]}
  sources={[{ name: "AMOS" }, { name: "TRAX" }]}
  lastSyncedAt="Synced a few seconds ago"
  // Other props become optional when useLiveData=true
  // as they'll be fetched from Supabase
/>
```

### Time Range Support

All timeseries KPIs support 6 time ranges:
- **1D**: Last 24 hours
- **1W**: Last 7 days
- **2W**: Last 14 days
- **1M**: Last 30 days
- **6M**: Last 6 months
- **1Y**: Last 12 months

Clicking range chips automatically fetches filtered data via `kpi_timeseries_bucketed`.

### Sync Now Functionality

The "Sync Now" button:
1. Shows a spinner for 1 second
2. Calls SWR's `mutate()` to refresh data
3. Enters 60-second cooldown
4. Shows countdown in tooltip: "Try again in {N}s"

## Dashboard KPI Keys

Each dashboard has KPIs with standardized keys:

### Maintenance & Health Overview
- `maintenance-health-overview:kpi_-_fleet_airworthiness_%`
- `maintenance-health-overview:kpi_-_aog_events_(count_&_minut`
- `maintenance-health-overview:kpi_-_work_order_backlog_aging`
- ... (15 KPIs total)

### Inventory & Spares Visibility
- `inventory-spares-visibility:inv_-_%_of_aircraft_grounded_du`
- `inventory-spares-visibility:inv_-_critical_stock_levels_(pe`
- ... (11 KPIs total)

### Compliance & Airworthiness
- `compliance-airworthiness:comp_-_%_aircraft_airworthy_vs.`
- `compliance-airworthiness:comp_-_mel_compliance_status`
- ... (13 KPIs total)

### Ops & Dispatch Reliability
- `ops-dispatch-reliability:ops_-_dispatch_reliability_%`
- `ops-dispatch-reliability:ops_-_technical_dispatch_delays`
- ... (13 KPIs total)

### Fuel & Efficiency
- `fuel-efficiency:fuel_-_fuel_burn_per_flight_hour`
- `fuel-efficiency:fuel_-_apu_run_time_%`
- ... (16 KPIs total)

### Financial & Procurement
- `financial-procurement:fin_-_total_maintenance_spend_(`
- `financial-procurement:fin_-_fuel_purchase_cost_($)`
- ... (27 KPIs total)

### Crew & Duty Snapshot
- `crew-duty-snapshot:crew_-_crew_availability_%`
- `crew-duty-snapshot:crew_-_fatigue_risk_index`
- ... (19 KPIs total)

## Testing the Integration

After seeding data:

1. **Test a single KPI**:
```sql
SELECT * FROM get_kpi_payload(
  'maintenance-health-overview:kpi_-_fleet_airworthiness_%',
  '1M'
);
```

2. **Test dashboard KPIs**:
```sql
SELECT * FROM kpi_meta 
WHERE dashboard = 'maintenance-health-overview';
```

3. **Verify timeseries ranges**:
```sql
SELECT DISTINCT range_tag FROM kpi_timeseries 
WHERE kpi_key LIKE 'maintenance-health-overview%';
```

## Security

- **RLS Enabled**: All tables have Row Level Security
- **Public Read**: Current policies allow public read access
- **Production**: Update policies to restrict access based on auth.uid() if needed

## Next Steps

1. ✅ Database schema created
2. ✅ RPC functions deployed
3. ✅ Security policies configured
4. ⏳ **Seed data** (run SQL from uploaded file)
5. ⏳ Enable `useLiveData={true}` on dashboard KpiCards
6. ⏳ Test time range switching
7. ⏳ Test Sync Now functionality

## Troubleshooting

### No data showing
- Verify data seeded: `SELECT COUNT(*) FROM kpi_meta;`
- Check console for RPC errors
- Verify kpi_key matches exactly (case-sensitive)

### Time ranges not working
- Check range_tag values in kpi_timeseries
- Verify kpi_timeseries_bucketed function returns data
- Check for SQL errors in browser console

### Slow performance
- Ensure indexes created (automatic via migration)
- Check query performance in Supabase Dashboard → Database → Query Performance
- Consider adding composite indexes for frequently filtered columns

## Support

For issues or questions:
- Check Supabase logs: Dashboard → Logs
- Review function logs: Dashboard → Functions
- SQL queries: Dashboard → SQL Editor → History
