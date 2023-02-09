-- Aggregate migrations after milestones
-- Only meant for local docker compose
-- ADD migration_state table
CREATE TABLE IF NOT EXISTS migration_state(version integer);

-- UP migration file for migration 1670610831-init 

CREATE TABLE users(
	pk_user_id int  GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	username VARCHAR(24) NOT NULL,
	email VARCHAR(128) NOT NULL,
	password TEXT,
	status VARCHAR(16) NOT NULL DEFAULT 'unverified',
	role VARCHAR(16) NOT NULL DEFAULT 'user',
	last_login TIMESTAMPTZ
);

ALTER TABLE users ADD CONSTRAINT username_unique UNIQUE(username);
ALTER TABLE users ADD CONSTRAINT email_unique UNIQUE(email);

-- Set migrations as applied
INSERT INTO migration_state(version) VALUES (1670610831);

-- UP migration file for migration 1674411468-image-user-table 

CREATE TABLE user_image_lookup(
    fk_user_id int,
    image_hash TEXT
);

-- Define combination as pk, as it should be unqiue
ALTER TABLE user_image_lookup ADD PRIMARY KEY (fk_user_id, image_hash);

INSERT INTO migration_state(version) VALUES (1674411468);