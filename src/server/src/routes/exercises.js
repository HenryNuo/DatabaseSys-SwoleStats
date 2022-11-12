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
    conn.query(
        `SELECT * FROM "User"`, 
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
    console.log("POST Interview");

    var sqlQuery = {
        text: `
            INSERT 
                INTO "User"
            (
                "userUsername",
                "userPassword",
                "userFirstName",
                "userLastName",
                "userGender",
                "userAge",
                "userWeight",
                "userHeight"
            )
            VALUES
                ( ?,?,?,?,?,?,?,? )
            RETURNING *`,
        values: [
            req.body.userUsername, 
            req.body.userPassword, 
            req.body.userFirstName, 
            req.body.userLastName,
            req.body.userGender, 
            req.body.userAge,
            req.body.userWeight,
            req.body.userHeight
        ]
    };
    let output = await mySQL
        .query(sqlQuery)
        .catch(e => {
            console.error(e.stack);
            return res.status(400).json(
                {
                    message: `Error Occured while running Query`,
                    status: "Failed"
                }
            );
        });

    if (output.rowCount == 0) {
        return res.status(400).json(
            {
                message: `No row with ID=${req.params.InterviewID}`,
                status: "Failed"
            }
        );
    } else {
        return res.send(output.rows);
    }
});




exerciseRouter.get('/', async(req, res) => {
    console.log("GET Interview by ID");

    var sqlQuery = {
        text: `
            SELECT * 
            FROM "Interview"
            WHERE "InterviewID" = $1`,
        values: [
            req.params.InterviewID
        ]
    };
    let output = await mySQL
        .query(sqlQuery)
        .catch(e => {
            console.error(e.stack);
            return res.status(400).json(
                {
                    message: `Error Occured while running Query`,
                    status: "Failed"
                }
            );
        });

    if (output.rowCount == 0) {
        return res.status(400).json(
            {
                message: `No row with ID=${req.params.InterviewID}`,
                status: "Failed"
            }
        );
    } else {
        return res.send(output.rows);
    }
});




exerciseRouter.put('/:exerciseID', async(req, res) => {
    var sqlQuery = `
        SELECT * 
        FROM Exercises 
        WHERE 
            exerciseID = ?`;
    var sqlVars = [req.body.search];
    connection.query(sql, function (err, result) {
            if (err) {
                    res.render('index', {
                            data: 'Error, exercise with that ID not found'
                    });
                    return;
            }
            console.log(result);
            res.render('index', {
                    data: JSON.stringify(result)
            });
    }
    );
})




exerciseRouter.delete('/:InterviewID', async(req, res) => {
    console.log("DELETE Interview by ID");

    var sqlQuery = {
        text: `
            DELETE FROM 
                "Interview" 
            WHERE 
                "InterviewID"= $1
            RETURNING *`,
        values: [
            req.params.InterviewID
        ]
    };
    var output = await mySQL
        .query(sqlQuery)
        .catch(e => {
            console.error(e.stack);
            return res.status(400).json(
                {
                    message: `Error Occured while running Query`,
                    status: "Failed"
                }
            );
        });

    if (output.rowCount == 0) {
        return res.status(400).json(
            {
                message: `No row with ID=${req.params.InterviewID}`,
                status: "Failed"
            }
        );
    } else {
        return res.send(output.rows);
    }
});









module.exports = exerciseRouter;