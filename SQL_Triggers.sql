-- Trigger to update personal records (max weight) for every exercise of a user
-- Wanting to keep track of a users max in any exercise like bench. This runs 
-- whenever a workout_exercise is created (means a user did an exercise), and
-- checks if the user has done or if it is the most weight they have done on 
-- the exercise. If so we add it to their record. If not it does nothing
DELIMITER $$
CREATE TRIGGER workout_exercise_trigger_for_records
  BEFORE INSERT 
    ON workout_exercise
      FOR EACH ROW
  BEGIN
    SET @username = (
      SELECT user.username
      FROM user
        JOIN workout 
          ON workout.user_username = user.username AND workout.id = NEW.workout_id
    );
    SET @user_current_max_of_exercise = (
      SELECT weight
      FROM user_exercise_record
      WHERE
        user_username = @username AND exercise_id = NEW.exercise_id
    );
    IF @user_current_max_of_exercise IS NULL THEN 
      INSERT 
        INTO user_exercise_record
      (
        user_username,
        exercise_id,
        weight
      )
      VALUES
        ( @username,NEW.exercise_id, NEW.weight);
    ELSEIF NEW.weight > @user_current_max_of_exercise THEN
      UPDATE
        user_exercise_record
      SET 
        weight = NEW.weight
      WHERE 
        user_username = @username AND exercise_id = NEW.exercise_id;
    END IF;
END$$
DELIMITER ;


-- Trigger to automatically give user achievements relevant to a workout_exercise
-- Having user acheivements we want to automatically give them if certain criteria is met.
DELIMITER $$
CREATE TRIGGER workout_exercise_trigger_for_user_achievements
  BEFORE INSERT 
    ON workout_exercise
      FOR EACH ROW
  BEGIN
    SET @username = (
      SELECT user.username
      FROM user
        JOIN workout 
          ON workout.user_username = user.username AND workout.id = NEW.workout_id
    );
    -- Achievement: Lift over 210 pounds in any exercise
    IF NEW.weight >= 210 THEN
      -- INSERT if user does not already have achievement
      INSERT IGNORE 
      INTO user_achievement 
        (user_username, achievement_title, date) 
      VALUES 
        (@username, "210 Club", CURDATE());
    END IF;
    -- Squatter: user did a squat
    IF EXISTS(SELECT id FROM exercise WHERE id = NEW.exercise_id AND name LIKE "%squat%") THEN
      INSERT IGNORE 
      INTO user_achievement 
        (user_username, achievement_title, date) 
      VALUES 
        (@username, "How Dare You Squat In My House", CURDATE());
    END IF;
    -- Hard worker: exercise has more than 12 reps
    IF NEW.reps >= 12 THEN
      INSERT IGNORE 
      INTO user_achievement 
        (user_username, achievement_title, date) 
      VALUES 
        (@username, "Hard Worker", CURDATE());
    END IF;
END$$
DELIMITER ;