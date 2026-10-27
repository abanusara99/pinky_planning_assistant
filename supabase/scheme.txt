create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  plan_type text check (plan_type in ('wedding','birthday','community','big')) not null,
  plan_price numeric not null,
  event_date date not null,
  event_time time not null,
  created_at timestamptz default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  username text not null,
  image_url text,
  review text not null,
  created_at timestamptz default now()
);

create table if not exists availability (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  status text check (status in ('busy','free')) default 'free',
  created_at timestamptz default now()
);

alter table bookings enable row level security;
alter table reviews enable row level security;
alter table availability enable row level security;

create policy "allow all bookings" on bookings for all using (true) with check (true);
create policy "allow all reviews" on reviews for all using (true) with check (true);
create policy "allow all availability" on availability for all using (true) with check (true);

insert into reviews (name, username, image_url, review) values
('Sarah M.', '@sarahm', 'https://api.dicebear.com/9.x/adventurer/svg?seed=Sarah', 'Pinky made wedding planning so stress-free. The budget tracker kept us on target and the vendor checklist was a lifesaver!'),
('James K.', '@jamesk', 'https://api.dicebear.com/9.x/adventurer/svg?seed=James', 'Booked a birthday package for my daughter. The confirmation flow was smooth and the calendar made picking a date easy.'),
('Priya R.', '@priyar', 'https://api.dicebear.com/9.x/adventurer/svg?seed=Priya', 'We used the community event plan for our neighborhood festival. The timeline suggestions were spot on and saved us weeks of planning.'),
('Mike T.', '@miket', 'https://api.dicebear.com/9.x/adventurer/svg?seed=Mike', 'Loved the pink theme and how simple it was to see busy vs free days. Will definitely use again for our anniversary party.')
on conflict do nothing;