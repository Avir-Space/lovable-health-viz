-- Ensure the main RPC can be called by the client safely
alter function public.get_kpi_payload(text, text) security definer;
alter function public.get_kpi_payload(text, text) set search_path = public;
grant execute on function public.get_kpi_payload(text, text) to anon, authenticated;

-- Also permit reading the KPI tables (RLS must allow read; if RLS is ON, make sure policies exist)
grant select on public.kpi_meta, public.kpi_timeseries, public.kpi_categories, public.kpi_table_rows, public.kpi_heatmap to anon, authenticated;