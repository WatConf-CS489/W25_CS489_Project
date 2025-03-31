UPDATE "user"
SET is_moderator = TRUE
WHERE username = '{{USERNAME}}';

SELECT username, is_moderator FROM "user" WHERE username = '{{USERNAME}}';