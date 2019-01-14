use hgjvhowcs9snx6dw;




-- INSERT INTO users (username, email, password)
-- VALUES ('nate', 'natebecker11@gmail.com', 'abc123'),
-- ('nathan', 'ngolba@gmail.com', 'abc123'),
-- ('dusty', 'dusty@codes.com', 'abc123'),
-- ('hayley', 'hayley@gmail.com', 'abc123'),
-- ('karol', 'karol@gmail.com', 'abc123');

-- INSERT INTO bands (bandname, ownerid)
-- VALUES ('Led Zeppelin', 1),
-- ('Fujiya And Miyagi', 1),
-- ('Slayer', 3),
-- ('Alt-J', 2);


-- INSERT INTO events (eventname, date, time, eventlocation)
-- VALUES ('Pitchfork', '2019-08-08', '17:30:00', 'Union Park, Chicago, IL'),
-- ('Slayer Plays The Rock Hall', '2019-02-22', '20:30:00', 'Rock and Roll Hall Of Fame, Cleveland, OH'),
-- ('A Chill Ass Show', '2020-06-15', '12:30:00', 'Blossom, Cuyahoga Falls, OH');

-- INSERT INTO bandsevents (bandsid, eventsid)
-- VALUES 
-- (2, 4),
-- (3, 4),
-- (4, 4),
-- (3, 5),
-- (2, 6),
-- (3, 6);


-- INSERT INTO bandmates (usersid, bandsid)
-- VALUES
-- (1, 1)
-- (1, 2),
-- (1, 3),
-- (2, 4),
-- (3, 3),
-- (4, 1),
-- (4, 4),
-- (5, 1),
-- (5, 3);

-- INSERT INTO bandsgenres (bandsid, genre)
-- VALUES
-- (6, 1),
-- (6, 2);



-- select * from users;
select * from events;
-- select * from notes;
-- select * from bands;
-- select * from bandmates;
-- select * from bandsevents;
-- select * from bandmates;
-- select * from bandsgenres;