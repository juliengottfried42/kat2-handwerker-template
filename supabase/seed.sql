-- Site Config
create table site_config (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text not null,
  type text not null default 'text'
);

-- Services
create table services (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  icon text not null default '🔧',
  price_from integer,
  sort_order integer not null default 0
);

-- Chat Flow
create table chat_flow (
  id uuid default gen_random_uuid() primary key,
  step_order integer not null,
  question text not null,
  options jsonb not null default '[]',
  next_step integer,
  show_upload boolean not null default false,
  show_calendar boolean not null default false
);

-- Inquiries
create table inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  email text not null,
  message text,
  answers jsonb not null default '{}',
  photos text[] not null default '{}',
  preferred_date date,
  status text not null default 'neu',
  notes text,
  created_at timestamptz not null default now()
);

-- Gallery Items
create table gallery_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  before_image text not null,
  after_image text not null,
  sort_order integer not null default 0
);

-- Seed: Example Maler data
insert into site_config (key, value, type) values
  ('hero_title', 'Ihr Maler in Zürich und Umgebung', 'text'),
  ('hero_subtitle', 'Professionelle Malerarbeiten mit Herzblut. Von der Wohnungsrenovation bis zur Fassadengestaltung.', 'text'),
  ('company_name', 'Malermeister Brunner', 'text'),
  ('phone', '076 123 45 67', 'text'),
  ('email', 'info@maler-brunner.ch', 'text'),
  ('whatsapp', '41761234567', 'text'),
  ('about_title', 'Malermeister mit Leidenschaft', 'text'),
  ('about_text', 'Seit 2008 verschönern wir Zürich — Wohnung für Wohnung, Fassade für Fassade. Als Familienbetrieb stehen wir für persönliche Betreuung und handwerkliche Qualität.', 'text'),
  ('about_years', '15+', 'text'),
  ('about_projects', '800+', 'text'),
  ('google_reviews_cache', '{}', 'json');

insert into services (title, description, icon, price_from, sort_order) values
  ('Innenanstrich', 'Wände, Decken, Türen und Fensterrahmen — frische Farbe für Ihr Zuhause.', '🎨', 800, 1),
  ('Fassadengestaltung', 'Wetterfeste Anstriche und kreative Fassadengestaltung.', '🏠', 3500, 2),
  ('Tapezierarbeiten', 'Von klassisch bis modern — wir tapezieren mit Präzision.', '✨', 600, 3),
  ('Spachtelarbeiten', 'Glatte Wände, perfekte Oberflächen.', '🔨', 500, 4),
  ('Holzschutz', 'Lasuren, Lacke und Öle für Ihre Holzflächen.', '🪵', 400, 5),
  ('Gewerbe & Büro', 'Professionelle Malerarbeiten für Geschäftsräume.', '🏢', null, 6);

insert into chat_flow (step_order, question, options, next_step, show_upload, show_calendar) values
  (1, 'Hallo! Was können wir für Sie tun?',
   '[{"label":"Innenanstrich","value":"innenanstrich"},{"label":"Fassade","value":"fassade"},{"label":"Tapezieren","value":"tapezieren"},{"label":"Anderes","value":"anderes"}]',
   2, false, false),
  (2, 'Wie gross ist die Fläche ungefähr?',
   '[{"label":"1-2 Zimmer","value":"1-2"},{"label":"3-4 Zimmer","value":"3-4"},{"label":"5+ Zimmer","value":"5+"},{"label":"Weiss ich nicht","value":"unbekannt"}]',
   3, false, false),
  (3, 'Haben Sie Fotos? Das hilft uns bei der Einschätzung.',
   '[{"label":"Fotos hochladen","value":"upload"},{"label":"Überspringen","value":"skip"}]',
   4, true, false),
  (4, 'Wann soll''s losgehen?',
   '[]',
   5, false, true),
  (5, 'Fast geschafft! Wie erreichen wir Sie?',
   '[]',
   null, false, false);
