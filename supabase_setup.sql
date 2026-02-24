-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create stock_items table
create table stock_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  content jsonb not null,
  last_updated bigint not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table stock_items enable row level security;

-- Create policies for stock_items
create policy "Users can view their own stock items" on stock_items
  for select using (auth.uid() = user_id);

create policy "Users can insert their own stock items" on stock_items
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own stock items" on stock_items
  for update using (auth.uid() = user_id);

create policy "Users can delete their own stock items" on stock_items
  for delete using (auth.uid() = user_id);


-- Create transactions table
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  content jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table transactions enable row level security;

-- Create policies for transactions
create policy "Users can view their own transactions" on transactions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own transactions" on transactions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own transactions" on transactions
  for update using (auth.uid() = user_id);

create policy "Users can delete their own transactions" on transactions
  for delete using (auth.uid() = user_id);


-- Storage Bucket Setup (Run this in SQL Editor or create manually in Storage dashboard)
insert into storage.buckets (id, name, public) values ('products', 'products', true);

-- Storage Policies
create policy "Public Access" on storage.objects for select using ( bucket_id = 'products' );
create policy "Authenticated users can upload" on storage.objects for insert with check ( bucket_id = 'products' and auth.role() = 'authenticated' );
create policy "Users can update own images" on storage.objects for update using ( bucket_id = 'products' and auth.uid() = owner );
create policy "Users can delete own images" on storage.objects for delete using ( bucket_id = 'products' and auth.uid() = owner );
