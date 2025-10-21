-- KPI Meta table
create table if not exists kpi_meta (
  kpi_key text primary key,
  dashboard text not null,
  name text not null,
  variant text not null check (variant in ('numeric','gauge','line','bar','column','pie','heatmap','table','timeline','delta','sparkline')),
  x_axis text,
  y_axis text,
  unit text,
  config jsonb default '{}'::jsonb
);

-- KPI Timeseries table
create table if not exists kpi_timeseries (
  id bigserial primary key,
  kpi_key text references kpi_meta(kpi_key) on delete cascade,
  ts timestamptz not null,
  series text default 'value',
  value double precision not null,
  range_tag text default '1M',
  inserted_at timestamptz default now()
);
create index if not exists kpi_ts_idx on kpi_timeseries (kpi_key, range_tag, ts, series);

-- KPI Categories table
create table if not exists kpi_categories (
  id bigserial primary key,
  kpi_key text references kpi_meta(kpi_key) on delete cascade,
  snapshot_ts timestamptz not null default now(),
  category text not null,
  value double precision not null,
  series text default 'value'
);
create index if not exists kpi_cat_idx on kpi_categories (kpi_key, snapshot_ts);

-- KPI Heatmap table
create table if not exists kpi_heatmap (
  id bigserial primary key,
  kpi_key text references kpi_meta(kpi_key) on delete cascade,
  snapshot_ts timestamptz not null default now(),
  x_label text not null,
  y_label text not null,
  value double precision not null
);
create index if not exists kpi_heat_idx on kpi_heatmap (kpi_key, snapshot_ts);

-- KPI Table Rows
create table if not exists kpi_table_rows (
  id bigserial primary key,
  kpi_key text references kpi_meta(kpi_key) on delete cascade,
  snapshot_ts timestamptz not null default now(),
  row_data jsonb not null
);
create index if not exists kpi_tbl_idx on kpi_table_rows (kpi_key, snapshot_ts);

-- RPC Functions
create or replace function kpi_timeseries_bucketed(p_kpi_key text, p_range text)
returns table (bucket timestamptz, series text, value double precision) language sql as $$
  select ts as bucket, series, avg(value) as value
  from kpi_timeseries
  where kpi_key = p_kpi_key and range_tag = p_range
  group by ts, series
  order by bucket
$$;

create or replace function kpi_latest_categories(p_kpi_key text)
returns table(category text, series text, value double precision) language sql as $$
  with s as (select max(snapshot_ts) t from kpi_categories where kpi_key=p_kpi_key)
  select category, series, value from kpi_categories, s
  where kpi_key=p_kpi_key and snapshot_ts = s.t
$$;

create or replace function kpi_latest_heatmap(p_kpi_key text)
returns table(x_label text, y_label text, value double precision) language sql as $$
  with s as (select max(snapshot_ts) t from kpi_heatmap where kpi_key=p_kpi_key)
  select x_label, y_label, value from kpi_heatmap, s
  where kpi_key=p_kpi_key and snapshot_ts = s.t
$$;

create or replace function kpi_latest_table(p_kpi_key text)
returns table(row_data jsonb) language sql as $$
  with s as (select max(snapshot_ts) t from kpi_table_rows where kpi_key=p_kpi_key)
  select row_data from kpi_table_rows, s
  where kpi_key=p_kpi_key and snapshot_ts = s.t
  order by id
$$;

create or replace function get_kpi_payload(p_kpi_key text, p_range text)
returns jsonb language plpgsql as $$
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

-- Enable Row Level Security (public access for now)
alter table kpi_meta enable row level security;
alter table kpi_timeseries enable row level security;
alter table kpi_categories enable row level security;
alter table kpi_heatmap enable row level security;
alter table kpi_table_rows enable row level security;

-- Create policies for public read access
create policy "Allow public read on kpi_meta" on kpi_meta for select using (true);
create policy "Allow public read on kpi_timeseries" on kpi_timeseries for select using (true);
create policy "Allow public read on kpi_categories" on kpi_categories for select using (true);
create policy "Allow public read on kpi_heatmap" on kpi_heatmap for select using (true);
create policy "Allow public read on kpi_table_rows" on kpi_table_rows for select using (true);