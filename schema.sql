-- Enable Row Level Security (RLS)
-- This ensures users can only access their own data

-- 1. PROFILES TABLE
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  ideal_sleep_start time,
  ideal_wake_up time,
  peak_alertness_time time, -- Representing slider position 10 PM - 6 AM
  long_term_goal text,
  focus_mode_preference text check (focus_mode_preference in ('Dim', 'Distraction-Free', 'Hardcore')),
  email_notifications boolean default false,
  sound_effects boolean default true,
  is_lamp_on boolean default false, -- Persist lamp state
  updated_at timestamptz default now(),
  created_at timestamptz default now(),
  last_username_change timestamptz
);

alter table profiles enable row level security;

create policy "Users can view their own profile."
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile."
  on profiles for update
  using ( auth.uid() = id );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

-- 2. TASKS TABLE
create table tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  title text not null,
  notes text,
  energy_required integer check (energy_required >= 1 and energy_required <= 5),
  estimated_duration integer, -- in minutes
  actual_focus_time integer default 0, -- in minutes
  scheduled_at timestamptz,
  status text check (status in ('Pending', 'In Progress', 'Completed')) default 'Pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table tasks enable row level security;

create policy "Users can view their own tasks."
  on tasks for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own tasks."
  on tasks for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own tasks."
  on tasks for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own tasks."
  on tasks for delete
  using ( auth.uid() = user_id );

-- 3. AUTOMATIC UPDATED_AT TRIGGER
-- Simple function to update the updated_at timestamp
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profiles_updated
  before update on profiles
  for each row execute procedure handle_updated_at();

create trigger on_tasks_updated
  before update on tasks
  for each row execute procedure handle_updated_at();

-- 4. HANDLE NEW USER CREATION (Optional but recommended)
-- Automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url, is_lamp_on)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url', false);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
