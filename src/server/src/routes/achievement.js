var express = require("express");
var achievementRouter = express.Router();

//Other Dependencies
var cors = require("cors");

// Middleware
achievementRouter.use(express.urlencoded({ extended: true }));
achievementRouter.use(express.json());
achievementRouter.use(cors());

const { mySQL } = require("../utils/mySQL.js");

achievementRouter.get("/", async (req, res) => {
    console.log("GET ALL achievement");
    mySQL.query(`SELECT * FROM achievement`, function (err, data, fields) {
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

achievementRouter.post("/", async (req, res) => {
    console.log("POST achievement");
    var sqlQuery = `
        INSERT 
            INTO achievement
        (
            title,
            description
        )
        VALUES
            ( ?,? )`;
    var sqlValues = [req.body.title, req.body.description];
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

achievementRouter.put("/:title", async (req, res) => {
    console.log("POST achievement");
    var sqlQuery = `
        UPDATE 
            achievement
        SET 
            description = ?
        WHERE
            title = ?`;
    var sqlValues = [req.body.description, req.params.title];
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

achievementRouter.delete("/:title", async (req, res) => {
    console.log("DELETE achievement");
    var sqlQuery = `
        DELETE 
            FROM achievement
        WHERE
            title = ?`;
    var sqlValues = [req.params.title];
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

module.exports = achievementRouter;
