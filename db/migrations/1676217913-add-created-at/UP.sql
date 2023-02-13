-- UP migration file for migration 1676217913-add-created-at 
ALTER TABLE users ADD COLUMN created_at timestamptz DEFAULT NOW()::timestamptz;