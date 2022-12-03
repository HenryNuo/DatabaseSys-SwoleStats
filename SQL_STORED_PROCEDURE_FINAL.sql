--  Create a stored procedure which runs a transaction. The stored procedure will take in all the information
--  a new workout and workout_exercises in an array of json objects. It will then have a 
--  trigger that loops over the array and it will create for them attached to the workout
--    Isolation Level:
--      For the transaction I will be using an Isolation Level of Read Committed. This is because Read uncommited
--      is not suitable for the route as we are updating the database, as well as repeatable reads and serialzable
--      reads are not required. Repeatable and Serializable are not required because we do not not need to hold a 
--      lock on read items and it would provide no benefit. Outside of what we are inserting (which would already 
--      have locks no matter what), the only reads happening are from the routine and routine_workout tables. 
--      These only happen once so there is no real purpose of having a lock that stays until the end of the transaction.
DROP PROCEDURE IF EXISTS sp_createWorkoutWithExercises;

DELIMITER $$
CREATE PROCEDURE sp_createWorkoutWithExercises(
  IN user_username VARCHAR(20),
  IN routine_id INT,
  IN date DATE,
  IN start_time TIME,
  IN end_time TIME,
  IN weight FLOAT,
  IN workout_exercises JSON
)
BEGIN
  -- Delcaring all variables which I will be using
  DECLARE varNewWorkoutID INT; 	-- WorkoutID of the new workout that is created
  DECLARE varJSONRowID INT;		-- Cur Fetched
  DECLARE varExerciseID INT;	-- Cur Fetched
  DECLARE varReps INT;			-- Cur Fetched
  DECLARE varSets INT;			-- Cur Fetched
  DECLARE varWeight INT;		-- Cur Fetched
  -- Setup Cursor Variables to go through the workout_exercise JSON ARRAY
  DECLARE cur_empty BOOLEAN default FALSE;
  DECLARE cur CURSOR FOR (
      SELECT *
      FROM
        JSON_TABLE(
          workout_exercises,
          "$[*]" COLUMNS(
            json_row_id FOR ORDINALITY,
            exercise_id INT PATH "$.exercise_id" 
                  ERROR ON EMPTY 
                  ERROR ON ERROR,
            reps INT PATH "$.reps" 
                  ERROR ON EMPTY 
                  ERROR ON ERROR,
            sets INT PATH "$.sets" 
                  ERROR ON EMPTY 
                  ERROR ON ERROR,
            weight INT PATH "$.weight" 
                  ERROR ON EMPTY 
                  ERROR ON ERROR
          )
        ) AS tt
  );
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET cur_empty = TRUE;
  -- Declaring Rollback if transaction fails
  -- If a creation of a workout_exercise or anything fails
  -- the whole thing will get rolled back and won't just have
  -- an outstanding workout
  DECLARE EXIT HANDLER FOR SQLEXCEPTION 
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  -- Starting Transaction of queries
  SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
  START TRANSACTION;
    -- First Create workout
    INSERT 
      INTO workout
    (
        user_username,
        routine_id,
        date,
        start_time,
        end_time,
        weight
    )
    VALUES ( 
      user_username,
      routine_id,
      date,
      start_time,
      end_time,
      weight
    );
    -- Get ID of just created workout
    SET varNewWorkoutID = LAST_INSERT_ID();

    -- Loop Through Cursor To go through each workout_exercise element
    OPEN cur;
    cur_loop: LOOP
      -- Fetching each value to be used later
      FETCH cur INTO 
        varJSONRowID,
        varExerciseID,
        varReps,
        varSets,
        varWeight;
      -- Checking if Cur is empty to leave loop
      IF cur_empty THEN
        LEAVE cur_loop;
      END IF;
      -- For each workout_exercise inserting into database
      INSERT INTO
        workout_exercise
      VALUES (
        varNewWorkoutID,
        varExerciseID,
        varReps,
        varSets,
        varWeight
      );
    -- Close Loop
    END LOOP cur_loop;
    CLOSE cur;
    -- Lastly Check:
    --   If there is no already assigned routine_id to the workout,
    --   check if there is there is a routine that has the same exercises as the new workout and add it to
    --   the workout.
    IF routine_id is null THEN
      UPDATE 
        workout
      SET 
        routine_id = (
          -- routine_id of 1 routine that has the same formed json
          SELECT routines.routine_id
            FROM 
              -- Checks all routines and selects what has the same exercises, sets, and reps through
              -- checking if the json are the same. Inner joined because we only want where they are the
              -- same
              (
                -- All the routines with id as well as their exercises in json form
                SELECT 
                  yet_more_json.routine_id, 
                  CONCAT('[', better_result, ']') AS routine_exercises 
                FROM (
                  SELECT 
                    more_json.routine_id, 
                    GROUP_CONCAT('{', my_json, '}' ORDER BY exercise_id SEPARATOR ',') AS better_result 
                  FROM (
                    SELECT 
                      routine_exercise.routine_id,
                      exercise_id,
                      CONCAT (
                        '"exercise_id":', '"', exercise_id, '"', ','
                        '"reps":', '"', reps, '"', ','
                        '"sets":'  , sets
                      ) AS my_json
                    FROM routine_exercise
                  ) AS more_json
                  GROUP BY more_json.routine_id
                ) AS yet_more_json
              ) AS routines
              INNER JOIN (
                -- The newly created workout with their exercises in json formatted like 
                -- routine's (does not have weight)
                SELECT 
                  CONCAT('[', better_result, ']') AS workout_exercises
                FROM (
                  SELECT 
                    GROUP_CONCAT('{', my_json, '}' ORDER BY exercise_id SEPARATOR ',') AS better_result 
                  FROM (
                    SELECT 
                      exercise_id,
                      CONCAT (
                        '"exercise_id":', '"', exercise_id, '"', ','
                        '"reps":', '"', reps, '"', ','
                        '"sets":'  , sets
                      ) AS my_json
                    FROM 
                      workout_exercise
                    WHERE workout_id = varNewWorkoutID
                  ) AS more_json
                ) AS workouts_with_json
              ) AS new_workout ON new_workout.workout_exercises = routines.routine_exercises
        )
      WHERE id = varNewWorkoutID
      LIMIT 1;
    END IF;
  -- End Transaction as long as everything is alright
  COMMIT;
  -- RETURNS all workout information with a json array of all workout_exercises
  SELECT 
    workout.*, CONCAT('[', better_result, ']') AS workout_exercises 
  FROM (
    SELECT 
      GROUP_CONCAT('{', my_json, '}' SEPARATOR ',') AS better_result 
    FROM (
      SELECT 
        CONCAT (
          '"workout_id":'   , '"', workout_id   , '"', ',' 
          '"exercise_id":', '"', exercise_id, '"', ','
          '"reps":', '"', reps, '"', ','
          '"sets":', '"', sets, '"', ','
          '"weight":'  , weight
        ) AS my_json
      FROM 
        workout_exercise
      WHERE 
        workout_id = varNewWorkoutID
    ) AS more_json
  ) AS yet_more_json
  JOIN (SELECT * FROM workout WHERE id = varNewWorkoutID) as workout;
END$$
DELIMITER ;




CALL sp_createWorkoutWithExercises(
  'username',
  NULL,
  CURDATE(),
  NOW() - INTERVAL 1 HOUR,
  NOW(),
  150.5,
  '[
    {"exercise_id": 1, "reps": 2, "sets": 2, "weight": 3}, 
    {"exercise_id": 3, "reps": 1, "sets": 3, "weight": 4}, 
    {"exercise_id": 5, "reps": 4, "sets": 9, "weight": 8}
  ]'
)
