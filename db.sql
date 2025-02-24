create schema api_general;
use api_general;
SET time_zone = '-05:00';

create table states (
  id_state int primary key,
  description varchar(50) NOT NULL
);

create table users (
  id_user int primary key auto_increment,
  fullname varchar(200) NOT NULL,
  user varchar(200) NOT NULL,
  email varchar(100) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  state_id int,
  foreign key (state_id) references states(id_state)
);

create table categories (
  id_category int primary key,
  title varchar(80) NOT NULL,
  slug varchar(80) NOT NULL,
  description varchar(500),
  state_id int,
  foreign key (state_id) references states(id_state)
);

create table items (
  id_item int primary key auto_increment,
  title varchar(200) NOT NULL,
  description varchar(500),
  score int NOT NULL,
  slug varchar(200) NOT NULL,
  category_id int,
  state_id int,
  foreign key (state_id) references states(id_state),
  foreign key (category_id) references categories(id_category)
);

create table products (
  id_product int primary key auto_increment,
  title varchar(200) NOT NULL,
  value int not null,
  description varchar(500),
  stock int not null,
  state_id int,
  foreign key (state_id) references states(id_state)
);

create table user_items (
  user_id int,
  item_id int,
  primary key (user_id, item_id),
  foreign key (user_id) references users(id_user),
  foreign key (item_id) references items(id_item)
);
