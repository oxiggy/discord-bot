create table public.words
(
    id    uuid primary key default gen_random_uuid(),
    content text not null unique
);