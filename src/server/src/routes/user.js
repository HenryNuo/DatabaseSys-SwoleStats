var express = require("express");
var userRouter = express.Router();

//Other Dependencies
var cors = require("cors");

// Middleware
userRouter.use(express.urlencoded({ extended: true }));
userRouter.use(express.json());
userRouter.use(cors());

const { mySQL } = require("../utils/mySQL.js");

userRouter.get("/", async (req, res) => {
    console.log("GET All user");
    mySQL.query(`SELECT * FROM user`, function (err, data, fields) {
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

userRouter.post("/", async (req, res) => {
    console.log("POST user");
    var sqlQuery = `
            INSERT 
                INTO user
            (
                username,
                password,
                first_name,
                last_name,
                gender,
                age,
                weight,
                height
            )
            VALUES
                ( ?,?,?,?,?,?,?,? )`;
    var sqlValues = [
        req.body.username,
        req.body.password,
        req.body.first_name,
        req.body.last_name,
        req.body.gender,
        req.body.age,
        req.body.weight,
        req.body.height,
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

userRouter.post("/login", async (req, res) => {
    console.log("Post user login");
    var sqlQuery = `
        SELECT *
        FROM user
        WHERE
            username = ? and password = ?`;
    var sqlValues = [req.body.username, req.body.password];
    mySQL.query(sqlQuery, sqlValues, function (err, data, fields) {
        if (err) {
            return res.status(500).json({
                status: "failure",
                length: err.length,
                data: err,
            });
        } else {
            if (data.length == 0) {
                return res.status(401).json({
                    status: "failed login",
                    length: data.length,
                    data: data,
                });
            } else {
                return res.status(200).json({
                    status: "success",
                    length: data.length,
                    data: data,
                });
            }
        }
    });
});

userRouter.put("/:username", async (req, res) => {
    console.log("PUT user");
    var sqlQuery = `
        UPDATE 
            user
        SET 
            password = ?,
            first_name = ?,
            last_name = ?,
            gender = ?,
            age = ?,
            weight = ?,
            height = ?
        WHERE
            username = ?`;
    var sqlValues = [
        req.body.password,
        req.body.first_name,
        req.body.last_name,
        req.body.gender,
        req.body.age,
        req.body.weight,
        req.body.height,
        req.params.username,
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

userRouter.delete("/:username", async (req, res) => {
    console.log("DELETE user");
    var sqlQuery = `
        DELETE 
            FROM user
        WHERE
            username = ?`;
    var sqlValues = [req.params.username];
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

userRouter.get("/mostActive", async (req, res) => {
    console.log("GET mostActive user");
    var sqlQuery = `
    SELECT user.first_name, user.last_name, COUNT(workout.id) as number_of_workouts
    FROM user LEFT JOIN workout ON (user.username = workout.user_username)
    GROUP BY user.username
    ORDER BY COUNT(workout.id) DESC
    LIMIT 15;`;
    mySQL.query(sqlQuery, function (err, data, fields) {
        console.log("data" + data);
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

userRouter.get("/:username", async (req, res) => {
    console.log("GET user by userName");
    var sqlQuery = `
        SELECT *
            FROM user
        WHERE 
            username = ?`;
    var sqlValues = [req.params.username];
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

module.exports = userRouter;
