-- Fix search_path security issues for all KPI functions

create or replace function kpi_timeseries_bucketed(p_kpi_key text, p_range text)
returns table (bucket timestamptz, series text, value double precision) 
language sql
stable
security definer
set search_path = public
as $$
  select ts as bucket, series, avg(value) as value
  from kpi_timeseries
  where kpi_key = p_kpi_key and range_tag = p_range
  group by ts, series
  order by bucket
$$;

create or replace function kpi_latest_categories(p_kpi_key text)
returns table(category text, series text, value double precision) 
language sql
stable
security definer
set search_path = public
as $$
  with s as (select max(snapshot_ts) t from kpi_categories where kpi_key=p_kpi_key)
  select category, series, value from kpi_categories, s
  where kpi_key=p_kpi_key and snapshot_ts = s.t
$$;

create or replace function kpi_latest_heatmap(p_kpi_key text)
returns table(x_label text, y_label text, value double precision) 
language sql
stable
security definer
set search_path = public
as $$
  with s as (select max(snapshot_ts) t from kpi_heatmap where kpi_key=p_kpi_key)
  select x_label, y_label, value from kpi_heatmap, s
  where kpi_key=p_kpi_key and snapshot_ts = s.t
$$;

create or replace function kpi_latest_table(p_kpi_key text)
returns table(row_data jsonb) 
language sql
stable
security definer
set search_path = public
as $$
  with s as (select max(snapshot_ts) t from kpi_table_rows where kpi_key=p_kpi_key)
  select row_data from kpi_table_rows, s
  where kpi_key=p_kpi_key and snapshot_ts = s.t
  order by id
$$;

create or replace function get_kpi_payload(p_kpi_key text, p_range text)
returns jsonb 
language plpgsql
stable
security definer
set search_path = public
as $$
declare meta jsonb;
begin
  select jsonb_build_object(
    'kpi_key', m.kpi_key,
    'name', m.name,
    'variant', m.variant,
    'xAxis', m.x_axis,
    'yAxis', m.y_axis,
    'unit', m.unit,
    'config', m.config
  ) into meta
  from kpi_meta m where m.kpi_key = p_kpi_key;

  if meta is null then raise exception 'Unknown KPI %', p_kpi_key; end if;

  case meta->>'variant'
    when 'line' then
      return meta || jsonb_build_object(
        'data', (select jsonb_agg(jsonb_build_object('bucket', bucket,'series',series,'value',value))
                 from kpi_timeseries_bucketed(p_kpi_key, p_range))
      );
    when 'timeline' then
      return meta || jsonb_build_object(
        'data', (select jsonb_agg(jsonb_build_object('bucket', bucket,'series',series,'value',value))
                 from kpi_timeseries_bucketed(p_kpi_key, p_range))
      );
    when 'sparkline' then
      return meta || jsonb_build_object(
        'data', (select jsonb_agg(jsonb_build_object('bucket', bucket,'series',series,'value',value))
                 from kpi_timeseries_bucketed(p_kpi_key, p_range))
      );
    when 'numeric' then
      return meta || jsonb_build_object(
        'data', (select jsonb_agg(jsonb_build_object('bucket', bucket,'series',series,'value',value))
                 from kpi_timeseries_bucketed(p_kpi_key, p_range))
      );
    when 'gauge' then
      return meta || jsonb_build_object(
        'data', (select jsonb_agg(jsonb_build_object('bucket', bucket,'series',series,'value',value))
                 from kpi_timeseries_bucketed(p_kpi_key, p_range))
      );
    when 'delta' then
      return meta || jsonb_build_object(
        'data', (select jsonb_agg(jsonb_build_object('bucket', bucket,'series',series,'value',value))
                 from kpi_timeseries_bucketed(p_kpi_key, p_range))
      );
    when 'bar' then
      return meta || jsonb_build_object(
        'data', (select jsonb_agg(jsonb_build_object('category',category,'series',series,'value',value))
                 from kpi_latest_categories(p_kpi_key))
      );
    when 'column' then
      return meta || jsonb_build_object(
        'data', (select jsonb_agg(jsonb_build_object('category',category,'series',series,'value',value))
                 from kpi_latest_categories(p_kpi_key))
      );
    when 'pie' then
      return meta || jsonb_build_object(
        'data', (select jsonb_agg(jsonb_build_object('category',category,'series',series,'value',value))
                 from kpi_latest_categories(p_kpi_key))
      );
    when 'heatmap' then
      return meta || jsonb_build_object(
        'data', (select jsonb_agg(jsonb_build_object('x',x_label,'y',y_label,'value',value))
                 from kpi_latest_heatmap(p_kpi_key))
      );
    when 'table' then
      return meta || jsonb_build_object(
        'rows', (select jsonb_agg(row_data) from kpi_latest_table(p_kpi_key))
      );
    else
      return meta;
  end case;
end$$;