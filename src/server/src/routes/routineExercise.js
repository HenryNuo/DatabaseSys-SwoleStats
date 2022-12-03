var express = require("express");
var routineExerciseRouter = express.Router();

//Other Dependencies
var cors = require("cors");

// Middleware
routineExerciseRouter.use(express.urlencoded({ extended: true }));
routineExerciseRouter.use(express.json());
routineExerciseRouter.use(cors());

const { mySQL } = require("../utils/mySQL.js");

routineExerciseRouter.get("/", async (req, res) => {
    console.log("GET ALL routine_exercise");
    mySQL.query(`SELECT * FROM routine_exercise`, function (err, data, fields) {
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

routineExerciseRouter.post("/", async (req, res) => {
    console.log("POST routine_exercise");
    var sqlQuery = `
        INSERT 
            INTO routine_exercise
        (
            routine_id,
            exercise_id,
            sets,
            reps
        )
        VALUES
            ( ?,?,?,? )`;
    var sqlValues = [
        req.body.routine_id,
        req.body.exercise_id,
        req.body.sets,
        req.body.reps,
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

routineExerciseRouter.put("/:routine_id/:exercise_id", async (req, res) => {
    console.log("POST routine_exercise");
    var sqlQuery = `
        UPDATE 
            routine_exercise
        SET 
            sets = ?,
            reps = ?
        WHERE
            routine_id = ? && exercise_id = ?`;
    var sqlValues = [
        req.body.sets,
        req.body.reps,
        req.params.routine_id,
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

routineExerciseRouter.delete("/:routine_id/:exercise_id", async (req, res) => {
    console.log("DELETE routine_exercise");
    var sqlQuery = `
        DELETE 
            FROM routine_exercise
        WHERE
            routine_id = ? && exercise_id = ?`;
    var sqlValues = [req.params.routine_id, req.params.exercise_id];
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

module.exports = routineExerciseRouter;
