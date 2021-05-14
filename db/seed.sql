create table helo_users (
  user_id SERIAL PRIMARY KEY,
  username varchar(20) not null,
  password varchar(20) not null,
  profile_pic varchar(500)
);

create table helo_posts (
  post_id SERIAL PRIMARY KEY,
  title varchar(45) not null,
  content varchar(2000),
  img varchar(500),
  author_id int references helo_users(user_id),
  date_created timestamp
);

