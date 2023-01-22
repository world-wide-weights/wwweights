-- UP migration file for migration 1674411468-image-user-table 

CREATE TABLE user_image_lookup(
    fk_user_id int,
    image_hash TEXT
);

-- Define combination as pk, as it should be unqiue
ALTER TABLE user_image_lookup ADD PRIMARY KEY (fk_user_id, image_hash);

