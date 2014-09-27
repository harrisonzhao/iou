#USE iouuomeA14Hvih1b;

#DROP DATABASE iouuomeA14Hvih1b;

#DROP TABLE IF EXISTS Users;
CREATE TABLE IF NOT EXISTS users (
  user_id INT NOT NULL AUTO_INCREMENT UNIQUE,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  email VARCHAR(45) NOT NULL UNIQUE,
  password_hash VARCHAR(60) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id)
);

#DROP TABLE IF EXISTS rooms;
CREATE TABLE IF NOT EXISTS rooms (
  room_id INT NOT NULL AUTO_INCREMENT UNIQUE,
  name VARCHAR(40) NOT NULL,
  is_empty BOOLEAN NOT NULL DEFAULT 0,
  graph BLOB,
  PRIMARY KEY (room_id)
);

#DROP TABLE IF EXISTS user_id_room_id;
CREATE TABLE IF NOT EXISTS user_id_room_id (
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  PRIMARY KEY (user_id, room_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

#DROP TABLE IF EXISTS invites;
CREATE TABLE IF NOT EXISTS invites (
  room_id INT NOT NULL AUTO_INCREMENT UNIQUE,
  receiver_id INT NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (room_id, receiver_id),
  FOREIGN KEY (room_id) REFERENCES rooms(room_id),
  FOREIGN KEY (receiver_id) REFERENCES users(user_id)
);

#DROP TABLE IF EXISTS transactions;
CREATE TABLE IF NOT EXISTS transactions (
  transaction_id INT NOT NULL AUTO_INCREMENT,
  room_id INT NOT NULL,
  created_time DATETIME NOT NULL,
  approved_time DATETIME DEFAULT NULL,
  source_id INT NOT NULL,
  sink_id INT NOT NULL,
  value INT NOT NULL,
  reason VARCHAR(140),
  PRIMARY KEY (transaction_id),
  FOREIGN KEY (source_id) REFERENCES users(user_id),
  FOREIGN KEY (sink_id) REFERENCES users(user_id),
  FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);
