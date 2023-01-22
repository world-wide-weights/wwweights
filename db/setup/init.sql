-- Aggregate migrations after milestones
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
