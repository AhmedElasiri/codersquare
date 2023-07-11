CREATE TABLE users (
    id         VARCHAR PRIMARY KEY,
    firstName  VARCHAR NOT NULL,
    lastName   VARCHAR NOT NULL,
    userName   VARCHAR UNIQUE NOT NULL,
    email      VARCHAR UNIQUE NOT NULL ,
    createdAt  INTEGER NOT NULL,
    password   VARCHAR NOT NULL    
);

CREATE TABLE posts (
   id       VARCHAR PRIMARY KEY,S
   title    VARCHAR NOT NULL,
   url      VARCHAR UNIQUE NOT NULL,
   userId   VARCHAR NOT NULl,
   postedAt INTEGER NOT NULL,
   FOREIGN KEY (userId) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE comments (
   id                VARCHAR PRIMARY KEY,
   userId            VARCHAR NOT NULL,
   postId            VARCHAR NOT NULL,
   content           TEXT NOT NULL,
   createdAt         INTEGER NOT NULL,
   parent_comment_id INTEGER,
   FOREIGN key (userId) REFERENCES users (id) ON DELETE SET NULL,
   FOREIGN key (postId) REFERENCES posts (id) ON DELETE CASCADE,
   FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);