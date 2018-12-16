-- ****************** SqlDBM: MySQL ******************;
-- ***************************************************;
use hgjvhowcs9snx6dw;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS bands;
DROP TABLE IF EXISTS bandsevents;
DROP TABLE IF EXISTS bandmates;

-- ************************************** `users`

CREATE TABLE `users`
(
 `id`        integer auto_increment NOT NULL ,
 `username`  varchar(45) NOT NULL ,
 `password`  varchar(500) NOT NULL ,
 `email`     varchar(100) NOT NULL ,
 `userimage` varchar(500) ,
 `createdAt` timestamp NOT NULL ,
PRIMARY KEY (`id`),
CONSTRAINT UC_User UNIQUE (username, email)
);






-- ************************************** `events`

CREATE TABLE `events`
(
 `id`               integer auto_increment NOT NULL ,
 `createdAt`        timestamp NOT NULL ,
 `eventname`        varchar(200) NOT NULL ,
 `eventdescription` varchar(500) ,
 `date`             time NOT NULL ,
 `eventlocation`    varchar(100) NOT NULL ,
PRIMARY KEY (`id`)
);






-- ************************************** `bands`

CREATE TABLE `bands`
(
 `id`          integer auto_increment NOT NULL ,
 `bandname`    varchar(200) NOT NULL ,
 `createdAt`   timestamp NOT NULL ,
 `bandimage`   varchar(500) ,
 `genre`       varchar(50) ,
 `description` varchar(500) ,
 `ownerid`     integer NOT NULL ,
PRIMARY KEY (`id`),
KEY `fkIdx_19` (`ownerid`),
CONSTRAINT `FK_19` FOREIGN KEY `fkIdx_19` (`ownerid`) REFERENCES `users` (`id`)
);






-- ************************************** `bandsevents`

CREATE TABLE `bandsevents`
(
 `id`        integer auto_increment NOT NULL ,
 `bandsid`   integer NOT NULL ,
 `eventsid`  integer NOT NULL ,
 `createdAt` timestamp NOT NULL ,
PRIMARY KEY (`id`),
KEY `fkIdx_43` (`bandsid`),
CONSTRAINT `FK_43` FOREIGN KEY `fkIdx_43` (`bandsid`) REFERENCES `bands` (`id`) ON DELETE CASCADE,
KEY `fkIdx_46` (`eventsid`),
CONSTRAINT `FK_46` FOREIGN KEY `fkIdx_46` (`eventsid`) REFERENCES `events` (`id`) ON DELETE CASCADE
);






-- ************************************** `bandmates`

CREATE TABLE `bandmates`
(
 `id`        integer auto_increment NOT NULL ,
 `createdAt` timestamp NOT NULL ,
 `usersid`   integer NOT NULL ,
 `bandsid`   integer NOT NULL ,
PRIMARY KEY (`id`),
KEY `fkIdx_26` (`usersid`),
CONSTRAINT `FK_26` FOREIGN KEY `fkIdx_26` (`usersid`) REFERENCES `users` (`id`) ON DELETE CASCADE,
KEY `fkIdx_29` (`bandsid`),
CONSTRAINT `FK_29` FOREIGN KEY `fkIdx_29` (`bandsid`) REFERENCES `bands` (`id`) ON DELETE CASCADE
);





