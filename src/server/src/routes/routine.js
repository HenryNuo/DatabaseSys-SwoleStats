var express = require("express");
var routineRouter = express.Router();

//Other Dependencies
var cors = require("cors");

// Middleware
routineRouter.use(express.urlencoded({ extended: true }));
routineRouter.use(express.json());
routineRouter.use(cors());

const { mySQL } = require("../utils/mySQL.js");

routineRouter.get("/", async (req, res) => {
    console.log("GET ALL routine");
    mySQL.query(`SELECT * FROM routine`, function (err, data, fields) {
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

routineRouter.post("/", async (req, res) => {
    console.log("POST routine");
    var sqlQuery = `
        INSERT 
            INTO routine
        (
            name
        )
        VALUES
            ( ? )`;
    var sqlValues = [req.body.name];
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

routineRouter.put("/:id", async (req, res) => {
    console.log("POST routine");
    var sqlQuery = `
        UPDATE 
            routine
        SET 
            name = ?,
        WHERE
            id = ?`;
    var sqlValues = [req.body.name, req.params.id];
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

routineRouter.delete("/:id", async (req, res) => {
    console.log("DELETE routine");
    var sqlQuery = `
        DELETE 
            FROM routine
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

module.exports = routineRouter;
