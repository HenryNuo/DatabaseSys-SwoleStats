var express = require("express");
var workoutRouter = express.Router();

//Other Dependencies
var cors = require("cors");

// Middleware
workoutRouter.use(express.urlencoded({ extended: true }));
workoutRouter.use(express.json());
workoutRouter.use(cors());

const { mySQL } = require("../utils/mySQL.js");

workoutRouter.get("/", async (req, res) => {
    console.log("GET ALL workout");
    mySQL.query(`SELECT * FROM workout`, function (err, data, fields) {
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

workoutRouter.post("/", async (req, res) => {
    console.log("POST workout");
    var sqlQuery = `
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
        VALUES
            ( ?,?,?,?,?,? )`;
    var sqlValues = [
        req.body.user_username,
        req.body.routine_id,
        req.body.date,
        req.body.start_time,
        req.body.end_time,
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

workoutRouter.post("/workout_exercise", async (req, res) => {
    console.log("POST workout with exercise");
    var sqlQuery = `
        CALL sp_createWorkoutWithExercises(
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )`;
    var sqlValues = [
        req.body.user_username,
        req.body.routine_id,
        req.body.date,
        req.body.start_time,
        req.body.end_time,
        req.body.weight,
        JSON.stringify(req.body.workout_exercises),
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

workoutRouter.put("/:id", async (req, res) => {
    console.log("POST workout");
    var sqlQuery = `
        UPDATE 
            workout
        SET 
            user_username = ?,
            routine_id = ?,
            date = ?,
            start_time = ?,
            end_time = ?,
            weight = ?
        WHERE
            id = ?`;
    var sqlValues = [
        req.body.user_username,
        req.body.routine_id,
        req.body.date,
        req.body.start_time,
        req.body.end_time,
        req.body.weight,
        req.params.id,
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

workoutRouter.delete("/:id", async (req, res) => {
    console.log("DELETE workout");
    var sqlQuery = `
        DELETE 
            FROM workout
        WHERE
            id = ?`;
    var sqlValues = [req.params.id];
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

module.exports = workoutRouter;
