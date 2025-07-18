begin;

alter table votes
  drop constraint if exists votes_user_id_fkey;

alter table votes
  add constraint votes_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

commit;