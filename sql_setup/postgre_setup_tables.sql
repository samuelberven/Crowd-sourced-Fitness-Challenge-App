CREATE TABLE badges (
  id bigint primary key generated always as identity,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(500) NOT NULL
);

CREATE TABLE difficulty (
  id bigint primary key generated always as identity,
  name VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE challenges (
  id bigint primary key generated always as identity,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(500) NOT NULL,
  difficulty VARCHAR(10) NOT NULL,
  FOREIGN KEY (difficulty) REFERENCES difficulty(name) ON DELETE CASCADE
);

CREATE TABLE goals (
  id bigint primary key generated always as identity,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(300) NOT NULL
);

-- The following adds the Supabase UUID and username
-- But I had to keep the username nullable for now, until I either insert values to all the users or completely reenter all data for all tables.
CREATE TABLE users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) UNIQUE NOT NULL,
  registration_date TIMESTAMP DEFAULT NOW(),
  uuid uuid DEFAULT gen_random_uuid() NOT NULL,  -- Supabase Auth UUID, nullable.  Todo: add UNIQUE
  username VARCHAR(50) UNIQUE NOT NULL  -- New username field   NOTE: I 
);

-- Previous table
-- CREATE TABLE users (
--   id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--   name VARCHAR(50) UNIQUE NOT NULL,
--   registration_date TIMESTAMP DEFAULT NOW(),
--   uuid uuid,  -- Supabase Auth UUID, nullable.  Todo: add UNIQUE
--   username VARCHAR(50) UNIQUE NOT NULL  -- New username field   NOTE: I 
-- );

CREATE TABLE tags (
  id bigint primary key generated always as identity,
  name VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE challenge_goals (
  id bigint primary key generated always as identity,
  challenge_id bigint NOT NULL,
  FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
  goal_id bigint NOT NULL,
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

CREATE TABLE challenge_tags (
  id bigint primary key generated always as identity,
  challenge_id INT,
  FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
  tag_id INT,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE users_badges (
    id bigint primary key generated always as identity,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    badge_id INT,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);
