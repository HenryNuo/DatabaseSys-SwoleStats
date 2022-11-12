var express = require('express');
var exerciseRouter = express.Router();

//Other Dependencies
var cors = require('cors');

// Middleware
exerciseRouter.use(express.urlencoded({ extended: true }));
exerciseRouter.use(express.json());
exerciseRouter.use(cors());

const { mySQL } = require("../utils/mySQL.js");






exerciseRouter.get('/', async(req, res) => {
    mySQL.query(
        `SELECT * FROM Exercises`, 
        function (err, data, fields) {
            if (err) {
                return next(new AppError(err))
            } else {
                return res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
                });
            }
        }
    );
});




exerciseRouter.post('/', async(req, res) => {
    console.log("POST Exercises");
    var sqlQuery = `
        INSERT 
            INTO Exercises
        (
            exerciseID,
            exerciseName,
            exerciseBodyPart,
            exerciseEquipment,
            exerciseGIFURL
        )
        VALUES
            ( (SELECT max(exerciseID)+1 FROM (SELECT exerciseID FROM Exercises) as k),?,?,?,? )`;
    var sqlValues = [
        req.body.exerciseName, 
        req.body.exerciseBodyPart, 
        req.body.exerciseEquipment, 
        req.body.exerciseGIFURL
    ];
    mySQL.query(
        sqlQuery, sqlValues, 
        function (err, data, fields) {
            if (err) {
                return res.status(500).json({
                    status: "failure",
                    length: err?.length,
                    data: err
                })
            } else {
                return res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
                });
            }
        }
    );
});




exerciseRouter.put('/:exerciseID', async(req, res) => {
    console.log("POST Exercises");
    var sqlQuery = `
        UPDATE 
            Exercises
        SET 
            exerciseName = ?,
            exerciseBodyPart = ?,
            exerciseEquipment = ?,
            exerciseGIFURL = ?
        WHERE
            exerciseID = ?`
    var sqlValues = [
        req.body.exerciseName, 
        req.body.exerciseBodyPart, 
        req.body.exerciseEquipment, 
        req.body.exerciseGIFURL,
        req.params.exerciseID
    ];
    mySQL.query(
        sqlQuery, sqlValues, 
        function (err, data, fields) {
            if (err) {
                return res.status(500).json({
                    status: "failure",
                    length: err?.length,
                    data: err
                })
            } else {
                return res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
                });
            }
        }
    );
})




exerciseRouter.delete('/:exerciseID', async(req, res) => {
    console.log("DELETE Exercises");
    var sqlQuery = `
        DELETE 
            FROM Exercises
        WHERE
            exerciseID = ?`;
    var sqlValues = [
            req.params.exerciseID, 
            req.body.exerciseBodyPart, 
            req.body.exerciseEquipment, 
            req.body.exerciseGIFURL
    ];
    mySQL.query(
        sqlQuery, sqlValues, 
        function (err, data, fields) {
            if (err) {
                return res.status(500).json({
                    status: "failure",
                    length: err?.length,
                    data: err
                })
            } else {
                return res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
                });
            }
        }
    );
});





exerciseRouter.get('/highestPRs', async(req, res) => {
    console.log("GET highestPRs Exercises");
    var sqlQuery = `
        SELECT 
            exerciseName, MAX(prWeight)
        FROM
            Records
            NATURAL JOIN Exercises
        GROUP BY exerciseID
        ORDER BY exerciseName
        LIMIT 15`;
    mySQL.query(
        sqlQuery, 
        function (err, data, fields) {
            if (err) {
                return res.status(500).json({
                    status: "failure",
                    length: err?.length,
                    data: err
                })
            } else {
                return res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
                });
            }
        }
    );
});





exerciseRouter.get('/searchByBodyPart/:exerciseBodyPart', async(req, res) => {
    console.log("GET searchByBodyPart Exercises");
    var sqlQuery = `
        SELECT *
        FROM Exercises
        WHERE
            exerciseBodyPart LIKE "%${decodeURIComponent(req.params.exerciseBodyPart)}%"`;
    mySQL.query(
        sqlQuery,
        function (err, data, fields) {
            if (err) {
                return res.status(500).json({
                    status: "failure",
                    length: err?.length,
                    data: err
                })
            } else {
                return res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
                });
            }
        }
    );
});









module.exports = exerciseRouter;