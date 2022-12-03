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
    -- Lastly Check if there is a routine that has the same exercises as the new workout
    -- if so add the routine_id to the workout
    UPDATE 
      workout
    SET 
      routine_id = (
        SELECT routine_id
          FROM 
            (
              SELECT 
                routine_id, 
                CONCAT('[', better_result, ']') AS routine_exercises 
              FROM (
                SELECT 
                  routine_id, 
                  GROUP_CONCAT('{', my_json, '}' ORDER BY exercise_id SEPARATOR ',') AS better_result 
                FROM (
                  SELECT 
                    routine_id,
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
    WHERE id = varNewWorkoutID;
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

--------------------------------------------------------
--------------------------------------------------------
--------------------------------------------------------
[{"exercise_id":"1","reps":"2","sets":2},{"exercise_id":"3","reps":"1","sets":3},{"exercise_id":"5","reps":"4","sets":9}]
[{"exercise_id":"1","reps":"2","sets":2},{"exercise_id":"3","reps":"1","sets":3},{"exercise_id":"5","reps":"4","sets":9}]
[{"workout_id":"1024","exercise_id":"1","reps":"2","sets":"2","weight":150.5},{"workout_id":"1024","exercise_id":"3","reps":"1","sets":"3","weight":150.5},{"workout_id":"1024","exercise_id":"5","reps":"4","sets":"9","weight":150.5}]

, 
[{"reps": "2", "sets": 2, "exercise_id": "1"}, {"reps": "1", "sets": 3, "exercise_id": "3"}, {"reps": "4", "sets": 9, "exercise_id": "5"}], 
[{"reps": "2", "sets": 2, "exercise_id": "1"}, {"reps": "1", "sets": 3, "exercise_id": "3"}, {"reps": "4", "sets": 9, "exercise_id": "5"}]

------------------------
UPDATE 
  workout
SET 
  routine_id = (
    SELECT routine_id
      FROM (
        SELECT 
          routine_id, 
          CONCAT('[', better_result, ']') AS routine_exercises 
        FROM (
          SELECT 
            routine_id, 
            GROUP_CONCAT('{', my_json, '}' ORDER BY exercise_id SEPARATOR ',') AS better_result 
          FROM (
            SELECT 
              routine_id,
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
    WHERE (
      routines.routine_exercises = (
        SELECT 
          CONCAT('[', better_result, ']') AS workout_exercises_json
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
            WHERE workout_id = 1020
          ) AS more_json
        ) AS workouts_with_json
        LIMIT 1
      )
    )
  )
WHERE id = 1020;
    
SELECT * FROM workout WHERE id = 1020;




-------
-------
-------
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
  -- Going to use these two variables to loop through workout_exercises and make a copy
  -- where the weights are removed so we can compare them to exercises of a routine.
  -- With weights removed a matching routine should have same json.
  DECLARE workout_exercises_copy JSON DEFAULT workout_exercises;
  DECLARE workout_exercises_loop_idx INT DEFAULT 0;
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
    -- Lastly Check if there is a routine that has the same exercises as the new workout
    -- if so add the routine_id to the workout
    -- First remove weights from workout_exercises so that it can match a json from routine_exercises
    WHILE workout_exercises_loop_idx < JSON_LENGTH(workout_exercises_copy) DO
      SELECT JSON_REMOVE(workout_exercises_copy, CONCAT('$[',workout_exercises_loop_idx,'].weight')) INTO workout_exercises_copy;
      SELECT workout_exercises_loop_idx + 1 INTO workout_exercises_loop_idx;
    END WHILE; 
    -- Now update workout to be part of a routine if there is a matching routine
    UPDATE 
      workout
    SET 
      routine_id = (
        SELECT routine_id
        FROM (
          SELECT 
            routine_id, CONCAT('[', better_result, ']') AS routine_exercises 
          FROM (
            SELECT 
              routine_id, GROUP_CONCAT('{', my_json, '}' ORDER BY exercise_id SEPARATOR ',') AS better_result 
            FROM (
              SELECT 
                routine_id,
                      exercise_id,
                CONCAT (
                  '"exercise_id":', '"', exercise_id, '"', ','
                  '"reps":', '"', reps, '"', ','
                  '"sets":'  , sets
                ) AS my_json
              FROM 
                routine_exercise
            ) AS more_json
              GROUP BY more_json.routine_id
          ) AS yet_more_json
        ) AS routines
      WHERE workout_exercises_copy = routines.routine_exercises
      LIMIT 1
    )
    WHERE id = varNewWorkoutID;
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

--------------------------------------------------------
--------------------------------------------------------
--------------------------------------------------------

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
  -- OUT sucess BOOLEAN
)
BEGIN
  -- Delcaring all variables which I will be using
  DECLARE varWorkoutID INT; 	-- WorkoutID of workout created
  DECLARE varJSONRowID INT;		-- When making json into table we set a table id
  DECLARE varExerciseID INT;	
  DECLARE varReps INT;
  DECLARE varSets INT;
  DECLARE varWeight INT;
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
  DECLARE EXIT HANDLER FOR SQLEXCEPTION 
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  -- Starting Transaction of queries
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
    SET varWorkoutID = LAST_INSERT_ID();

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
        varWorkoutID,
        varExerciseID,
        varReps,
        varSets,
        varWeight
      );
    -- Close Loop
    END LOOP cur_loop;
    CLOSE cur;
    -- Check if everything was created alright and fine with all information
  -- End Transaction as long as everything is alright
  COMMIT;
  -- Lastly Check if there is a routine that has the same exercises as the workout
  -- if so add the routine_id to the workout
  -- FIRST QUERY getting all routines with a string list of all their exercise's id's
  -- SELECT 
  --   routine.id, 
  --   GROUP_CONCAT(routine_exercise.exercise_id ORDER BY routine_exercise.exercise_id) AS exercises
  -- FROM 
  --   routine
  --   JOIN routine_exercise
  --     ON routine.id = routine_exercise.routine_id
  -- GROUP BY routine.id
  -- ORDER BY routine.id

  -- SELECT 
  --   GROUP_CONCAT(routine_exercise.exercise_id ORDER BY routine_exercise.exercise_id) AS exercises
  -- FROM
  --   workout
  --   JOIN workout_exercise
  --     ON workout.id = workout_exercise.workout_id
  -- WHERE 
  --   workout.id = varWorkoutID
  -- GROUP BY workout.id
  -- ORDER BY wokrout.id
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
        workout_id = varWorkoutID
    ) AS more_json
  ) AS yet_more_json
  JOIN (SELECT * FROM workout WHERE id = varWorkoutID) as workout;
END$$
DELIMITER ;




--  Transaction:
--    - requirements:
--        A complete and functioning transaction with the correct and justified 
--        isolation level, involves at least two advanced queries, involves 
--        looping and control (e.g., IF statements) structures, and provides 
--        useful functionality to the application.
--    - Idea:
--        + Create a transaction that builds a routine or gym session. That means it
--        makes each includes or contains then creates the gym session or routine. 
--        Meaning if it fails at creating a includes or contains (an exercise) then
--        then the whole thing is not created
--        (THIS DOES NOT INVOLVE LOOPS)

 
--  Stored Procedure
--    - requirements: 
--        A complete and functioning stored procedure, involves at least 
--        two advanced queries, uses cursors, involves looping and control (e.g., IF 
--        statements) structures, provides useful functionality to the application. 
--    - Idea:
--        + Top 10% of certain exercise: Involves a loop over all 
--        + Has Max for the exercises
--          is recorded we check if it is a new PR or something
--        + Create a stored procedure which runs a transaction. The stored procedure will take in all the information
--          a new workout and workout_exercises in an array of json objects. It will then have a 
--          trigger that loops over the array and it will create for them attached to the workout
--          This transaction will fail if anywhere a long the way there is a failed insert. 
--              HAS: Trigger, Transaction, Looping, and Control. Can use one advanced query in the control where it
--              checks if the routine was properly created with the exercises. At the end check if a routine has all
--              the workouts
--        + Creates a stored procedure which runs at the end of every day. This stored procedure will calculate
--          previous day's bests and create it in a new table
--        + Something with top lifters of the day cursor over that advanced query
--        + Every day runs a stored procedure which for the previous day gets the users that pushed the most weight in 
--          a rep and how often they worked out for the past week. This would involves a cursor on an advanced query
--          which gets the top lifters of the day. For each lifter we would then go through and have another query which
--          gets how often they worked out in the past week. 
DELIMITER //
CREATE PROCEDURE sp_GetMovies()
  BEGIN
      select title,description,release_year,rating from film;
  END //
DELIMITER ;
 
--  Trigger:
--    - requirements
--        A complete and functioning trigger, involving event, condition (IF statement), 
--        and action (Update, Insert or Delete), provides useful functionality to the 
--        application. 
--    - Idea:
--        + Make the trigger for the Stored Procedure. Every single time a exercise (includes)
--        + Make a stored procedure which runs on every added exercise and checks if it is the 
--          user's personal record
--              
CREATE TRIGGER agecheck 
  BEFORE INSERT ON people 
    FOR EACH ROW 
  
  IF NEW.age < 0 THEN 
    SET NEW.age = 0; 
  END IF;


DELIMITER $$
CREATE PROCEDURE CheckWithdrawal(
    fromAccountId INT,
    withdrawAmount DEC(10,2)
)
BEGIN
    DECLARE balance DEC(10,2);
    DECLARE withdrawableAmount DEC(10,2);
    DECLARE message VARCHAR(255);

    -- get current balance of the account
    SELECT amount 
    INTO balance
    FROM accounts
    WHERE accountId = fromAccountId;
    
    -- Set minimum balance
    SET withdrawableAmount = balance - 25;

    IF withdrawAmount > withdrawableAmount THEN
        SET message = CONCAT('Insufficient amount, the maximum withdrawable is ', withdrawableAmount);
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = message;
    END IF;
END$$
DELIMITER ;


SELECT *
FROM
	JSON_TABLE(
    	'[{"name": "sam", "job":"SWE"}, {"name": "sab", "job":"PE"}, {"name": "kjm", "job":"ME"}]',
    	"$[*]" COLUMNS(
    		rowid FOR ORDINALITY,
    		name VARCHAR(100) PATH "$.name" 
          		ERROR ON EMPTY 
          		ERROR ON ERROR,
    		job JSON PATH "$.job" 
          		ERROR ON EMPTY 
          		ERROR ON ERROR
    	)
    ) AS tt;

SELECT *
FROM
	JSON_TABLE(
    	'[
      		{"exercise_id": 1, "reps": 2, "sets": 2, "weight": 3}, 
      		{"exercise_id": 1, "reps": 1, "sets": 3, "weight": 4}, 
      		{"exercise_id": 5, "reps": 4, "sets": 9, "weight": 8}
      	]',
    	"$[*]" COLUMNS(
    		rowid FOR ORDINALITY,
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
    ) AS tt;




-- -----------------------------
DELIMITER $$
CREATE PROCEDURE sp_createWorkoutWithExercises(
  IN user_username VARCHAR(20),
  IN routine_id INT,
  IN date DATE,
  IN start_time TIME,
  IN end_time TIME,
  IN weight FLOAT,
  IN workout_exercises JSON
  -- OUT sucess BOOLEAN
)
BEGIN
  -- Delcaring all variables which I will be using
  DECLARE varWorkoutID INT;
  DECLARE varExerciseID INT;
  DECLARE varReps INT;
  DECLARE varSets INT;
  DECLARE varWeight INT;
  -- Setup Cursor Variables to go through the workout_exercise JSON ARRAY
  DECLARE cur_empty BOOLEAN default FALSE;
  DECLARE cur CURSOR FOR (
      SELECT *
      FROM
        JSON_TABLE(
          workout_exercises,
          "$[*]" COLUMNS(
            rowid FOR ORDINALITY,
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
  DECLARE EXIT HANDLER FOR SQLEXCEPTION 
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  -- Starting Transaction of queries
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
    SET varWorkoutID = (SELECT LAST_INSERT_ID());

    -- Loop Through Cursor To go through each workout_exercise element
    OPEN cur;
    cur_loop: LOOP
      -- Fetching each value to be used later
      FETCH cur INTO 
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
        varWorkoutID,
        varExerciseID,
        varReps,
        varSets,
        varWeight
      );
    -- Close Loop
    END LOOP cur_loop;
    CLOSE cur;
    -- Check if everything was created alright and fine with all information
  -- End Transaction as long as everything is alright
  COMMIT;
  -- Lastly Check if there is a routine that has the same exercises as the workout
  -- if so add the routine_id to the workout
  -- FIRST QUERY getting all routines with a string list of all their exercise's id's
  -- SELECT 
  --   routine.id, 
  --   GROUP_CONCAT(routine_exercise.exercise_id ORDER BY routine_exercise.exercise_id) AS exercises
  -- FROM 
  --   routine
  --   JOIN routine_exercise
  --     ON routine.id = routine_exercise.routine_id
  -- GROUP BY routine.id
  -- ORDER BY routine.id

  -- SELECT 
  --   GROUP_CONCAT(routine_exercise.exercise_id ORDER BY routine_exercise.exercise_id) AS exercises
  -- FROM
  --   workout
  --   JOIN workout_exercise
  --     ON workout.id = workout_exercise.workout_id
  -- WHERE 
  --   workout.id = varWorkoutID
  -- GROUP BY workout.id
  -- ORDER BY wokrout.id
END$$
DELIMITER ;






-- -----------------------------
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
  -- OUT sucess BOOLEAN
)
BEGIN
  -- Delcaring all variables which I will be using
  DECLARE varWorkoutID INT; 	-- WorkoutID of workout created
  DECLARE varJSONRowID INT;		-- When making json into table we set a table id
  DECLARE varExerciseID INT;	
  DECLARE varReps INT;
  DECLARE varSets INT;
  DECLARE varWeight INT;
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
  DECLARE EXIT HANDLER FOR SQLEXCEPTION 
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  -- Starting Transaction of queries
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
    SET varWorkoutID = LAST_INSERT_ID();

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
        varWorkoutID,
        varExerciseID,
        varReps,
        varSets,
        varWeight
      );
    -- Close Loop
    END LOOP cur_loop;
    CLOSE cur;
    -- Check if everything was created alright and fine with all information
  -- End Transaction as long as everything is alright
  COMMIT;
  -- Lastly Check if there is a routine that has the same exercises as the workout
  -- if so add the routine_id to the workout
  UPDATE 
    workout
  SET 
    routine_id = (
      SELECT id
      FROM routine
      WHERE
        
      LIMIT 1
    )
  WHERE
    id = varWorkoutID
  -- RETURNS all workout information with a json array of all workout_exercises
  SELECT 
    workout.*, CONCAT('[', better_result, ']') AS workout_exercises 
  FROM (
    SELECT 
      workout_id, GROUP_CONCAT('{', my_json, '}' SEPARATOR ',') AS better_result 
    FROM (
      workout_id,
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
        workout_id = varWorkoutID
    ) AS more_json
  ) AS yet_more_json
  LEFT JOIN workout ON workout.id = yet_more_json.workout_id;
END$$
DELIMITER ;



CALL sp_createWorkoutWithExercises(
  username,
  NULL,
  CURDATE(),
  NOW() - INTERVAL 1 HOUR,
  NOW(),
  150.5
  '[
    {"exercise_id": 1, "reps": 2, "sets": 2, "weight": 3}, 
    {"exercise_id": 1, "reps": 1, "sets": 3, "weight": 4}, 
    {"exercise_id": 5, "reps": 4, "sets": 9, "weight": 8}
  ]'
)






DROP PROCEDURE IF EXISTS sp_testing;

DELIMITER $$
CREATE PROCEDURE sp_testing(
  IN workout_exercises JSON
)
BEGIN
  SET @j = workout_exercises;
  SET @i = 0;
  WHILE @i < JSON_LENGTH(@j) DO
      SELECT JSON_REMOVE(@j,CONCAT('$[',@i,'].weight'));
      SELECT @i + 1 INTO @i;
  END WHILE;
  SELECT @j;
END$$
DELIMITER ;

CALL sp_testing(
  '[
    {"exercise_id": 1, "reps": 2, "sets": 2, "weight": 3}, 
    {"exercise_id": 1, "reps": 1, "sets": 3, "weight": 4}, 
    {"exercise_id": 5, "reps": 4, "sets": 9, "weight": 8}
  ]'
)



DECLARE new_json JSON;
  DECLARE i INT DEFAULT 0;
  SELECT workout_exercises INTO new_json;
  WHILE @i < JSON_LENGTH(new_json) DO
      -- SELECT JSON_REMOVE(new_json,CONCAT('$[',@i,'].weight'));
      SELECT JSON_REMOVE(new_json,'$[1].weight');
      SELECT @i + 1 INTO @i;
  END WHILE;
  SELECT new_json;



SELECT 
  CONCAT('[', better_result, ']') AS workout_exercises 
FROM (
  SELECT 
    GROUP_CONCAT('{', my_json, '}' SEPARATOR ',') AS better_result 
  FROM (
    SELECT 
      CONCAT (
        '"exercise_id":', '"', exercise_id, '"', ','
        '"reps":', '"', reps, '"', ','
        '"sets":', '"', sets, '"', ','
        '"weight":'  , weight
      ) AS my_json
    FROM 
      routine_exercise
    WHERE 
      workout_id = varNewWorkoutID
  ) AS more_json
) AS yet_more_json





SELECT 
	CONCAT('[', better_result, ']') AS routine_exercises 
FROM (
	SELECT 
		GROUP_CONCAT('{', my_json, '}' ORDER BY exercise_id SEPARATOR ',') AS better_result 
	FROM (
		SELECT 
			workout_id,
            exercise_id,
			CONCAT (
				'"exercise_id":', '"', exercise_id, '"', ','
				'"reps":', '"', reps, '"', ','
				'"sets":'  , sets
			) AS my_json
		FROM 
			workout_exercise
	) AS more_json
    GROUP BY more_json.workout_id
) AS yet_more_json
























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
  -- OUT sucess BOOLEAN
)
BEGIN
  -- Delcaring all variables which I will be using
  DECLARE varNewWorkoutID INT; 	-- WorkoutID of the new workout that is created
  DECLARE varJSONRowID INT;		-- Cur Fetched
  DECLARE varExerciseID INT;	-- Cur Fetched
  DECLARE varReps INT;			-- Cur Fetched
  DECLARE varSets INT;			-- Cur Fetched
  DECLARE varWeight INT;		-- Cur Fetched
  -- Going to use these two variables to loop through workout_exercises and make a copy
  -- where the weights are removed so we can compare them to exercises of a routine.
  -- With weights removed a matching routine should have same json.
  DECLARE workout_exercises_copy JSON DEFAULT workout_exercises;
  DECLARE workout_exercises_loop_idx INT DEFAULT 0;
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
  DECLARE EXIT HANDLER FOR SQLEXCEPTION 
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  -- Starting Transaction of queries
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
    -- Lastly Check if there is a routine that has the same exercises as the new workout
    -- if so add the routine_id to the workout
    -- First remove weights from workout_exercises so that it can match a json from routine_exercises
    WHILE workout_exercises_loop_idx < JSON_LENGTH(workout_exercises_copy) DO
		SELECT JSON_REMOVE(workout_exercises_copy, CONCAT('$[',workout_exercises_loop_idx,'].weight')) INTO workout_exercises_copy;
		SELECT workout_exercises_loop_idx + 1 INTO workout_exercises_loop_idx;
	END WHILE; 
    -- Now update workout for matching
    UPDATE 
      workout
    SET 
      routine_id = (
        SELECT routine_id
        FROM (
			SELECT 
				yet_more_json.routine_id AS routine_id,
                CONCAT('[', yet_more_json.better_result, ']') AS routine_exercises 
			FROM (
				SELECT 
					more_json.routine_id AS routine_id, 
                    GROUP_CONCAT('{', more_json.my_json, '}' ORDER BY more_json.exercise_id SEPARATOR ',') AS better_result 
				FROM (
					SELECT 
						routine_id,
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
        WHERE workout_exercises_copy = routines.routine_exercises
        LIMIT 1
      )
    WHERE
      id = varWorkoutID;
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










UPDATE 
  workout
SET 
  routine_id = (
    SELECT routine_id
      FROM (
        SELECT 
          routine_id, 
          CONCAT('[', better_result, ']') AS routine_exercises 
        FROM (
          SELECT 
            routine_id, 
            GROUP_CONCAT('{', my_json, '}' ORDER BY exercise_id SEPARATOR ',') AS better_result 
          FROM (
            SELECT 
              routine_id,
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
    WHERE (
      routines.routine_exercises = (
        SELECT 
          CONCAT('[', better_result, ']') AS workout_exercises_json
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
            WHERE workout_id = 1020
          ) AS more_json
        ) AS workouts_with_json
        LIMIT 1
      )
    )
  )
WHERE id = 1020;
    
SELECT * FROM workout WHERE id = 1020;

[{"exercise_id":"1","reps":"2","sets":2},{"exercise_id":"3","reps":"3","sets":1},{"exercise_id":"5","reps":"9","sets":4}]
[{"exercise_id":"1","reps":"2","sets":2},{"exercise_id":"3","reps":"1","sets":3},{"exercise_id":"5","reps":"4","sets":9}]

[{"exercise_id":"1","reps":"2","sets":2},{"exercise_id":"3","reps":"1","sets":3},{"exercise_id":"5","reps":"4","sets":9}]
[{"exercise_id":"1","reps":"2","sets":2},{"exercise_id":"3","reps":"1","sets":3},{"exercise_id":"5","reps":"4","sets":9}]



UPDATE 
  workout
SET 
  routine_id = (
    SELECT routine_id
      FROM 
        (
          SELECT 
            routine_id, 
            CONCAT('[', better_result, ']') AS routine_exercises 
          FROM (
            SELECT 
              routine_id, 
              GROUP_CONCAT('{', my_json, '}' ORDER BY exercise_id SEPARATOR ',') AS better_result 
            FROM (
              SELECT 
                routine_id,
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
              WHERE workout_id = 1020
            ) AS more_json
          ) AS workouts_with_json
        ) AS new_workout ON new_workout.workout_exercises = routines.routine_exercises
  )
WHERE id = 1020;
    
SELECT * FROM workout WHERE id = 1020;