DROP TABLE IF EXISTS "public".entries;
DROP TABLE IF EXISTS "public".items;
DROP TABLE IF EXISTS "public".categories;
CREATE table "public".categories(
      id serial primary key,
      name VARCHAR
);
CREATE table "public".items(
      id serial primary key,
      name VARCHAR,
      category integer references categories(id) not null
);
CREATE table "public".entries(
      id serial primary key,
      value numeric,
      creation_date timestamptz,
      item integer references items(id) not null
);
