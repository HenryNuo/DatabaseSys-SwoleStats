var express = require("express");
var exerciseRouter = express.Router();

//Other Dependencies
var cors = require("cors");

// Middleware
exerciseRouter.use(express.urlencoded({ extended: true }));
exerciseRouter.use(express.json());
exerciseRouter.use(cors());

const { mySQL } = require("../utils/mySQL.js");

exerciseRouter.get("/", async (req, res) => {
    console.log("GET ALL exercise");
    mySQL.query(`SELECT * FROM exercise`, function (err, data, fields) {
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

exerciseRouter.get("/names", async (req, res) => {
    console.log("GET ALL exerciseNames");
    mySQL.query(`SELECT name, id FROM exercise`, function (err, data, fields) {
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

exerciseRouter.post("/", async (req, res) => {
    console.log("POST exercise");
    var sqlQuery = `
        INSERT 
            INTO exercise
        (
            name,
            body_part,
            equipment,
            gif_url
        )
        VALUES
            ( ?,?,?,? )`;
    var sqlValues = [
        req.body.name,
        req.body.body_part,
        req.body.equipment,
        req.body.gif_url,
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

exerciseRouter.put("/:id", async (req, res) => {
    console.log("POST exercise");
    var sqlQuery = `
        UPDATE 
            exercise
        SET 
            name = ?,
            body_part = ?,
            equipment = ?,
            gif_url = ?
        WHERE
            id = ?`;
    var sqlValues = [
        req.body.name,
        req.body.body_part,
        req.body.equipment,
        req.body.gif_url,
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

exerciseRouter.delete("/:id", async (req, res) => {
    console.log("DELETE exercise");
    var sqlQuery = `
        DELETE 
            FROM exercise
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

exerciseRouter.get("/highestPRs", async (req, res) => {
    console.log("GET highestPRs exercise");
    var sqlQuery = `
    SELECT  exercise.name, MAX(workout_exercise.weight) as max_weight
    FROM workout JOIN workout_exercise ON (workout.id = workout_exercise.workout_id) JOIN exercise ON (exercise.id = workout_exercise.exercise_id)
    GROUP BY exercise_id
    ORDER BY exercise_id`;
    mySQL.query(sqlQuery, function (err, data, fields) {
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

exerciseRouter.get("/searchByBodyPart/:body_part", async (req, res) => {
    console.log("GET searchByBodyPart exercise");
    var sqlQuery = `
        SELECT *
        FROM exercise
        WHERE
            body_part LIKE "%${decodeURIComponent(req.params.body_part)}%"`;
    mySQL.query(sqlQuery, function (err, data, fields) {
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

module.exports = exerciseRouter;
