begin;

create table if not exists polls (
  id serial primary key,
  title text not null unique,
  description text,
  created_by uuid references auth.users(id) not null,
  published boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists options (
  id serial primary key,
  poll_id integer references polls(id) on delete cascade,
  option_text text not null
);

create table if not exists votes (
  id serial primary key,
  poll_id integer references polls(id) on delete cascade,
  option_id integer references options(id) on delete cascade,
  user_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default now(),
  unique (poll_id, user_id)
);

-- Turn on security
alter table if exists polls enable row level security;
alter table if exists options enable row level security;
alter table if exists votes enable row level security;

-- Polls
-- Only authenticated users can read polls
create policy if not exists "Authenticated read polls"
on polls
for select
to authenticated
using (true);

-- Only authenticated users can create polls
create policy if not exists "Authenticated insert polls"
on polls
for insert
to authenticated
with check ((select auth.uid()) = created_by);

-- Only poll creator can update/delete their own polls
create policy if not exists "Poll owner update"
on polls
for update
to authenticated
using ((select auth.uid()) = created_by);

create policy if not exists "Poll owner delete"
on polls
for delete
to authenticated
using ((select auth.uid()) = created_by);

-- Options
-- Only authenticated users can read options
create policy if not exists "Authenticated read options"
on options
for select
to authenticated
using (true);

-- Only authenticated users can add options to their own, unpublished polls
create policy if not exists "Authenticated insert options"
on options
for insert
to authenticated
with check (
  exists (
    select 1 from polls
    where polls.id = options.poll_id
      and polls.created_by = (select auth.uid())
      and polls.published = false
  )
);

-- Only allow update/delete of options if poll is not published and user is poll owner
create policy if not exists "Authenticated update options if poll not published"
on options
for update
to authenticated
using (
  exists (
    select 1 from polls
    where polls.id = options.poll_id
      and polls.created_by = (select auth.uid())
      and polls.published = false
  )
);

create policy if not exists "Authenticated delete options if poll not published"
on options
for delete
to authenticated
using (
  exists (
    select 1 from polls
    where polls.id = options.poll_id
      and polls.created_by = (select auth.uid())
      and polls.published = false
  )
);

-- Votes
-- Only authenticated users can read votes
create policy if not exists "Authenticated read votes"
on votes
for select
to authenticated
using (true);

-- Only authenticated users can vote (insert)
create policy if not exists "Authenticated insert votes"
on votes
for insert
to authenticated
with check ((select auth.uid()) = user_id);

-- Only allow update/delete of own votes
create policy if not exists "Authenticated update own votes"
on votes
for update
to authenticated
using ((select auth.uid()) = user_id);

create policy if not exists "Authenticated delete own votes"
on votes
for delete
to authenticated
using ((select auth.uid()) = user_id);

commit;

-- select
--   options.id,
--   options.option_text,
--   count(votes.id) as vote_count
-- from options
-- left join votes on options.id = votes.option_id
-- where options.poll_id = :poll_id
-- group by options.id, options.option_text;