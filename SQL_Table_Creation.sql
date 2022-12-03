CREATE TABLE user (
  username VARCHAR(20),
  password VARCHAR(20),
  first_name VARCHAR(20),
  last_name VARCHAR(20),
  gender VARCHAR(10),
  age INT,
  weight FLOAT,
  height FLOAT,
  PRIMARY KEY(username)
);

CREATE TABLE achievement (
  title VARCHAR(50),
  description VARCHAR(100),
  PRIMARY KEY(title)
);

CREATE TABLE user_achievement (
  user_username VARCHAR(20),
  achievement_title VARCHAR(50),
  date DATE,
  PRIMARY KEY (user_username, achievement_title),
  FOREIGN KEY (user_username)
    REFERENCES user(username),
  FOREIGN KEY (achievement_title)
    REFERENCES achievement(title)
);

CREATE TABLE exercise (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100),
  body_part VARCHAR(20),
  equipment VARCHAR(20),
  gif_url VARCHAR(100),
  PRIMARY KEY (id)
);

CREATE TABLE routine (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(20),
  PRIMARY KEY (id)
);

CREATE TABLE routine_exercise (
  routine_id INT,
  exercise_id INT,
  sets INT,
  reps INT,
  PRIMARY KEY (routine_id, exercise_id),
  FOREIGN KEY (routine_id)
    REFERENCES routine(id),
  FOREIGN KEY (exercise_id)
  REFERENCES exercise(id)
);

CREATE TABLE workout (
  id INT NOT NULL AUTO_INCREMENT,
  user_username VARCHAR(20),
  routine_id INT,
  date DATE,
  start_time TIME,
  end_time TIME,
  weight FLOAT,
  PRIMARY KEY (id),
  FOREIGN KEY (user_username)
    REFERENCES user(username),
  FOREIGN KEY (routine_id)
    REFERENCES routine(id)
);

CREATE TABLE workout_exercise (
  workout_id INT,
  exercise_id INT,
  reps INT,
  sets INT,
  weight INT,
  PRIMARY KEY(workout_id, exercise_id),
  FOREIGN KEY(workout_id)
    REFERENCES workout(id),
  FOREIGN KEY(exercise_id)
    REFERENCES exercise(id)
);

CREATE TABLE user_exercise_record (
  user_username VARCHAR(20),
  exercise_id INT,
  weight INT,
  PRIMARY KEY (user_username, exercise_id),
  FOREIGN KEY (user_username)
    REFERENCES user(username),
  FOREIGN KEY (exercise_id)
    REFERENCES exercise(id)
);