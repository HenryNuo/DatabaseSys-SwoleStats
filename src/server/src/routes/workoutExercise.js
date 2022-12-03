var express = require("express");
var workoutExerciseRouter = express.Router();

//Other Dependencies
var cors = require("cors");

// Middleware
workoutExerciseRouter.use(express.urlencoded({ extended: true }));
workoutExerciseRouter.use(express.json());
workoutExerciseRouter.use(cors());

const { mySQL } = require("../utils/mySQL.js");

workoutExerciseRouter.get("/", async (req, res) => {
    console.log("GET ALL workout_exercise");
    mySQL.query(`SELECT * FROM workout_exercise`, function (err, data, fields) {
        if (err) {
            return next(new AppError(err));
        } else {
            return res.status(200).json({
                status: "success",
                length: data.length,
                data: data,
            });
        }
    });
});

workoutExerciseRouter.get("/:username", async (req, res) => {
    console.log("GET a user's user_exercise_record");
    mySQL.query(
        `SELECT 
            start_time, end_time, date, name, reps, sets, workout_exercise.weight
        FROM 
            workout 
            JOIN workout_exercise 
                ON (workout.id = workout_exercise.workout_id) 
            JOIN exercise 
                ON (workout_exercise.exercise_id = exercise.id)
        WHERE user_username = ?`,
        [req.params.username],
        function (err, data, fields) {
            if (err) {
                return next(new AppError(err));
            } else {
                return res.status(200).json({
                    status: "success",
                    length: data.length,
                    data: data,
                });
            }
        }
    );
});

workoutExerciseRouter.post("/", async (req, res) => {
    console.log("POST workout_exercise");
    var sqlQuery = `
        INSERT 
            INTO workout_exercise
        (
            workout_id,
            exercise_id,
            reps,
            sets,
            weight
        )
        VALUES
            ( ?,?,?,?,? )`;
    var sqlValues = [
        req.body.workout_id,
        req.body.exercise_id,
        req.body.reps,
        req.body.sets,
        req.body.weight,
    ];
    mySQL.query(sqlQuery, sqlValues, function (err, data, fields) {
        if (err) {
            return res.status(500).json({
                status: "failure",
                length: err.length,
                data: err,
            });
        } else {
            return res.status(200).json({
                status: "success",
                length: data.length,
                data: data,
            });
        }
    });
});

workoutExerciseRouter.put("/:workout_id/:exercise_id", async (req, res) => {
    console.log("POST workout_exercise");
    var sqlQuery = `
        UPDATE 
            workout_exercise
        SET 
            reps = ?,
            sets = ?,
            weight = ?
        WHERE
            workout_id = ? && exercise_id = ?`;
    var sqlValues = [
        req.body.reps,
        req.body.sets,
        req.body.weight,
        req.params.workout_id,
        req.params.exercise_id,
    ];
    mySQL.query(sqlQuery, sqlValues, function (err, data, fields) {
        if (err) {
            return res.status(500).json({
                status: "failure",
                length: err.length,
                data: err,
            });
        } else {
            return res.status(200).json({
                status: "success",
                length: data.length,
                data: data,
            });
        }
    });
});

workoutExerciseRouter.delete("/:workout_id/:exercise_id", async (req, res) => {
    console.log("DELETE workout_exercise");
    var sqlQuery = `
        DELETE 
            FROM workout_exercise
        WHERE
            workout_id = ? && exercise_id = ?`;
    var sqlValues = [req.params.workout_id, req.params.exercise_id];
    mySQL.query(sqlQuery, sqlValues, function (err, data, fields) {
        if (err) {
            return res.status(500).json({
                status: "failure",
                length: err.length,
                data: err,
            });
        } else {
            return res.status(200).json({
                status: "success",
                length: data.length,
                data: data,
            });
        }
    });
});

module.exports = workoutExerciseRouter;
