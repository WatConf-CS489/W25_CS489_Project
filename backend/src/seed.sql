\c postgres;

DO $$ 
DECLARE 
    user1_id UUID;
    user2_id UUID;
    mod_id UUID;
BEGIN
    INSERT INTO "user" (id, username, password_hash, is_admin, is_banned, is_moderator, ticket)
    VALUES 
        (gen_random_uuid(), 'alice', '$argon2id$v=19$m=65536,t=3,p=4$examplehash1', false, false, false, 'ticket123'),
        (gen_random_uuid(), 'bob', '$argon2id$v=19$m=65536,t=3,p=4$examplehash2', false, false, false, 'ticket456'),
        (gen_random_uuid(), 'mod', '$argon2id$v=19$m=65536,t=3,p=4$examplehashmod', false, false, true, 'ticket789')
    ON CONFLICT (username) DO NOTHING;

    SELECT id INTO user1_id FROM "user" WHERE username = 'alice' LIMIT 1;
    SELECT id INTO user2_id FROM "user" WHERE username = 'bob' LIMIT 1;
    SELECT id INTO mod_id FROM "user" WHERE username = 'mod' LIMIT 1;

    IF user1_id IS NULL OR user2_id IS NULL OR mod_id IS NULL THEN
        RAISE NOTICE 'One or more users not found. Seeding aborted.';
    ELSE
        INSERT INTO posts (content, created_at, user_id, vote_count)
        VALUES 
            ('I love the French Vanilla at C&D!', now() - INTERVAL '1 year', user1_id, 3),
            ('I might drop out any second.', now() - INTERVAL '1 month', user2_id, 5),
            ('Who else is struggling with DB setup?', now(), user1_id, 2)
        ON CONFLICT DO NOTHING;

        RAISE NOTICE 'Seeding completed: Users, Moderator, and Posts inserted successfully.';
    END IF;
END $$;