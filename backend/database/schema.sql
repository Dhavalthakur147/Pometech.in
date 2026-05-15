-- Pomegranate Technology Backend Schema
-- Run this in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create type admin_role as enum ('super_admin', 'admin', 'editor');
create type client_status as enum ('lead', 'active', 'inactive', 'completed');
create type payment_status_type as enum ('pending', 'paid', 'failed', 'refunded');
create type order_status_type as enum ('new', 'pending', 'completed', 'cancelled');
create type message_status_type as enum ('unread', 'read', 'archived');
create type site_content_type as enum ('text', 'textarea', 'url', 'image');

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password text not null,
  role admin_role not null default 'editor',
  reset_token text,
  reset_token_expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text,
  image text,
  price numeric(12,2),
  created_at timestamptz not null default now()
);

create table if not exists portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  image text,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists demo_work (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  image text,
  link text,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_name text,
  phone text,
  email text,
  service text,
  status client_status not null default 'lead',
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  service text not null,
  amount numeric(12,2) not null default 0,
  payment_status payment_status_type not null default 'pending',
  order_status order_status_type not null default 'new',
  delivery_date date,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  reply text,
  status message_status_type not null default 'unread',
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  amount numeric(12,2) not null default 0,
  payment_method text not null,
  transaction_id text,
  payment_status payment_status_type not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists site_content (
  key text primary key,
  label text,
  value text not null,
  type site_content_type not null default 'text',
  updated_by uuid references admin_users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_services_title on services using gin (to_tsvector('english', title || ' ' || description));
create index if not exists idx_portfolio_category on portfolio(category);
create index if not exists idx_demo_work_category on demo_work(category);
create index if not exists idx_clients_status on clients(status);
create index if not exists idx_orders_client on orders(client_id);
create index if not exists idx_orders_status on orders(order_status, payment_status);
create index if not exists idx_messages_status on messages(status);
create index if not exists idx_payments_client on payments(client_id);
create index if not exists idx_site_content_type on site_content(type);

alter table admin_users enable row level security;
alter table services enable row level security;
alter table portfolio enable row level security;
alter table demo_work enable row level security;
alter table clients enable row level security;
alter table orders enable row level security;
alter table messages enable row level security;
alter table payments enable row level security;
alter table site_content enable row level security;

-- Backend uses the Supabase service role key. RLS remains enabled for browser safety.
-- Public read policies for website content:
drop policy if exists "Public can read services" on services;
create policy "Public can read services" on services for select using (true);

drop policy if exists "Public can read portfolio" on portfolio;
create policy "Public can read portfolio" on portfolio for select using (true);

drop policy if exists "Public can read demo work" on demo_work;
create policy "Public can read demo work" on demo_work for select using (true);

drop policy if exists "Public can read site content" on site_content;
create policy "Public can read site content" on site_content for select using (true);

insert into site_content (key, label, value, type)
values
  ('home.hero.eyebrow', 'Home hero eyebrow', 'Pomegranate Technology', 'text'),
  ('home.hero.title', 'Home hero title', 'All Digital Solutions For Your Business', 'textarea'),
  ('home.hero.tagline', 'Home hero tagline', 'Innovate Transform Grow', 'text'),
  ('home.hero.copy', 'Home hero copy', 'We Design, We Develop, We Grow Your Brand', 'textarea'),
  ('site.footer.copy', 'Footer copy', 'Pomegranate Technology helps businesses innovate, transform, and grow through modern digital solutions.', 'textarea')
on conflict (key) do nothing;

-- Supabase Storage:
insert into storage.buckets (id, name, public)
values ('pomotech-uploads', 'pomotech-uploads', true)
on conflict (id) do nothing;

drop policy if exists "Public can read pomotech uploads" on storage.objects;
create policy "Public can read pomotech uploads"
on storage.objects for select
using (bucket_id = 'pomotech-uploads');
