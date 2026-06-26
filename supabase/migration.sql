-- ============================================================
--  Meow612 — Supabase Migration
--  Run this once in the Supabase SQL Editor:
--  Dashboard → SQL Editor → New Query → paste → Run
-- ============================================================

-- ── Categories ───────────────────────────────────────────────
create table if not exists categories (
  id   serial primary key,
  slug text unique not null
);

-- ── Products ─────────────────────────────────────────────────
create table if not exists products (
  id             serial primary key,
  name           text           not null,
  category_slug  text           references categories(slug) on delete set null,
  price          numeric(10,2)  not null,
  original_price numeric(10,2),
  emoji          text,
  color          text,
  badge          text,
  rating         numeric(3,1)   default 0,
  reviews        integer        default 0,
  description    text,
  features       text[],
  stock          integer        default 99,
  created_at     timestamptz    default now()
);

-- ── Row Level Security ───────────────────────────────────────
-- Products and categories are publicly readable (no auth needed)
alter table products   enable row level security;
alter table categories enable row level security;

drop policy if exists "Public read products"   on products;
drop policy if exists "Public read categories" on categories;

create policy "Public read products"
  on products for select using (true);

create policy "Public read categories"
  on categories for select using (true);

-- ── Seed: Categories ─────────────────────────────────────────
insert into categories (slug) values
  ('parallets'),
  ('apparel'),
  ('accessories')
on conflict (slug) do nothing;

-- ── Seed: Products ───────────────────────────────────────────
insert into products
  (id, name, category_slug, price, original_price, emoji, color, badge, rating, reviews, description, features)
values
  (
    1,
    'Pro Wooden Parallets',
    'parallets',
    89.99, 119.99,
    '🪵',
    'linear-gradient(135deg, #2d1b0e, #4a2f1a)',
    'Best Seller',
    4.9, 247,
    'Premium birch wood parallets with non-slip rubber base. Perfect for handstands, L-sits, and planche progressions.',
    ARRAY['Birch hardwood', '1200lb load rated', 'Non-slip grip', 'Portable']
  ),
  (
    2,
    'Elite Steel Parallets',
    'parallets',
    129.99, 159.99,
    '🔩',
    'linear-gradient(135deg, #1a1a2e, #16213e)',
    'New',
    4.8, 98,
    'Heavy-duty powder-coated steel parallets with adjustable height system. Built to last a lifetime.',
    ARRAY['Powder-coated steel', 'Height adjustable', '2000lb load rated', 'Rust-resistant']
  ),
  (
    3,
    'Mini Travel Parallets',
    'parallets',
    54.99, null,
    '✈️',
    'linear-gradient(135deg, #0d2137, #1a3a5c)',
    null,
    4.7, 134,
    'Compact folding parallets designed for athletes on the go. Fits in any bag.',
    ARRAY['Foldable design', 'Aluminum alloy', '400lb rated', 'Carry bag included']
  ),
  (
    4,
    'Meow612 Tee',
    'apparel',
    34.99, null,
    '👕',
    'linear-gradient(135deg, #111827, #1f2937)',
    null,
    4.6, 312,
    'Ultra-soft cotton blend tee with our signature logo. Train in style.',
    ARRAY['95% cotton', 'Moisture-wicking', 'Pre-shrunk', 'Unisex fit']
  ),
  (
    5,
    'Beast Mode Hoodie',
    'apparel',
    64.99, 79.99,
    '🥷',
    'linear-gradient(135deg, #1a0a2e, #2d1b4e)',
    'Sale',
    4.9, 189,
    'Premium heavyweight hoodie designed for outdoor training in any weather.',
    ARRAY['400g fleece', 'Kangaroo pocket', 'Drawstring hood', 'Embroidered logo']
  ),
  (
    6,
    'Gymnastic Chalk Block',
    'accessories',
    14.99, null,
    '🧊',
    'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
    null,
    4.8, 541,
    'Professional magnesium carbonate chalk for maximum grip. Used by elite gymnasts.',
    ARRAY['Pure MgCO3', '4-pack included', 'Long-lasting', 'Competition grade']
  ),
  (
    7,
    'Resistance Band Set',
    'accessories',
    29.99, 39.99,
    '🎯',
    'linear-gradient(135deg, #0a2e1a, #1a4f2e)',
    'Sale',
    4.7, 276,
    'Complete set of 5 resistance bands for assisted and resisted calisthenics progressions.',
    ARRAY['5 resistance levels', 'Natural latex', 'Carry bag', 'Exercise guide']
  ),
  (
    8,
    'Pull-Up Grips',
    'accessories',
    19.99, null,
    '🤸',
    'linear-gradient(135deg, #2e1a0a, #4f3a1a)',
    null,
    4.5, 198,
    'Pro-grade leather pull-up grips to protect your palms during intense training sessions.',
    ARRAY['Genuine leather', 'Velcro wrist wrap', '3 sizes available', 'Wrist support']
  )
on conflict (id) do nothing;
