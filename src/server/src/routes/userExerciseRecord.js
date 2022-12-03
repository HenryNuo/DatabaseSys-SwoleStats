var express = require("express");
var userExerciseRecordRouter = express.Router();

//Other Dependencies
var cors = require("cors");

// Middleware
userExerciseRecordRouter.use(express.urlencoded({ extended: true }));
userExerciseRecordRouter.use(express.json());
userExerciseRecordRouter.use(cors());

const { mySQL } = require("../utils/mySQL.js");

userExerciseRecordRouter.get("/", async (req, res) => {
    console.log("GET ALL user_exercise_record");
    mySQL.query(
        `SELECT * FROM user_exercise_record`,
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

userExerciseRecordRouter.get("/:user_username", async (req, res) => {
    console.log("GET user_exercise_record by username");
    var sqlQuery = `
        SELECT *
        FROM 
            user_exercise_record
            JOIN exercise ON user_exercise_record.exercise_id = exercise.id
        WHERE 
            user_username = ?`;
    var sqlValues = [req.params.user_username];
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

userExerciseRecordRouter.post("/", async (req, res) => {
    console.log("POST user_exercise_record");
    var sqlQuery = `
        INSERT 
            INTO user_exercise_record
        (
            user_username,
            exercise_id,
            weight
        )
        VALUES
            ( ?,?,? )`;
    var sqlValues = [
        req.body.user_username,
        req.body.exercise_id,
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

userExerciseRecordRouter.put(
    "/:user_username/:exercise_id",
    async (req, res) => {
        console.log("POST user_exercise_record");
        var sqlQuery = `
        UPDATE 
            user_exercise_record
        SET 
            weight = ?
        WHERE
            user_username = ? && exercise_id = ?`;
        var sqlValues = [
            req.body.weight,
            req.params.user_username,
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
    }
);

userExerciseRecordRouter.delete(
    "/:user_username/:exercise_id",
    async (req, res) => {
        console.log("DELETE user_exercise_record");
        var sqlQuery = `
        DELETE 
            FROM user_exercise_record
        WHERE
            user_username = ? && exercise_id = ?`;
        var sqlValues = [req.params.user_username, req.params.exercise_id];
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
    }
);

module.exports = userExerciseRecordRouter;
