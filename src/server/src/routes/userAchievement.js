var express = require("express");
var userAchievementRouter = express.Router();

//Other Dependencies
var cors = require("cors");

// Middleware
userAchievementRouter.use(express.urlencoded({ extended: true }));
userAchievementRouter.use(express.json());
userAchievementRouter.use(cors());

const { mySQL } = require("../utils/mySQL.js");

userAchievementRouter.get("/", async (req, res) => {
    console.log("GET ALL user_achievement");
    mySQL.query(`SELECT * FROM user_achievement`, function (err, data, fields) {
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

userAchievementRouter.post("/", async (req, res) => {
    console.log("POST user_achievement");
    var sqlQuery = `
        INSERT 
            INTO user_achievement
        (
            user_username,
            achievement_title,
            date
        )
        VALUES
            ( ?,?,? )`;
    var sqlValues = [
        req.body.user_username,
        req.body.achievement_title,
        req.body.date,
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

userAchievementRouter.get("/:user_username", async (req, res) => {
    console.log("GET user_achievement by user_username");
    var sqlQuery = `
        SELECT *
        FROM 
            user_achievement
            JOIN achievement ON user_achievement.achievement_title = achievement.title
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

userAchievementRouter.put(
    "/:user_username/:achievement_title",
    async (req, res) => {
        console.log("POST user_achievement");
        var sqlQuery = `
        UPDATE 
            user_achievement
        SET 
            date = ?
        WHERE
            user_username = ? && achievement_title = ?`;
        var sqlValues = [
            req.body.date,
            req.params.user_username,
            req.params.achievement_title,
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

userAchievementRouter.delete(
    "/:user_username/:achievement_title",
    async (req, res) => {
        console.log("DELETE user_achievement");
        var sqlQuery = `
        DELETE 
            FROM user_achievement
        WHERE
            user_username = ? && achievement_title = ?`;
        var sqlValues = [
            req.params.user_username,
            req.params.achievement_title,
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

module.exports = userAchievementRouter;
