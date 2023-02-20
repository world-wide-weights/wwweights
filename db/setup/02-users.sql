--- Insert users for submission
INSERT INTO users(
		pk_user_id,
		username,
		email,
		password,
		status,
		role,
		last_login,
		created_at
	)
VALUES (
		1,
		'GoodGradeGiver',
		'serious@business.com',
		'$2b$10$0DefPSo66iP32JfcsnAydO4pYjkZHLEjUoc3imgy9dgwpfhhl31qi',
		'unverified',
		'user',
		'2023-02-20 11:15:18.627+00',
		'2023-02-20 11:15:18.614+00'
	),
	(
		2,
		'AdditionalUser',
		'i.create.mock.data@entertaiment.com',
		'$2b$10$1e5zMPXwMHN/MXzyooEH9e5L1ShuAj6sMgMkR3bNnG9QdPQCAtrp6',
		'unverified',
		'user',
		'2023-02-20 11:37:38.282+00',
		'2023-02-20 11:37:38.265+00'
	);