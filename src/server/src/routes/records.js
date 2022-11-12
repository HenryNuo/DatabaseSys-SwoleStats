var express = require('express');
var interviewRouter = express.Router();

//Other Dependencies
var cors = require('cors');

// Middleware
interviewRouter.use(express.urlencoded({ extended: true }));
interviewRouter.use(express.json());
interviewRouter.use(cors());

const { mySQL } = require("../utils/mySQL.js");






interviewRouter.get('/', async(req, res) => {
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




interviewRouter.post('/', async(req, res) => {
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




interviewRouter.get('/', async(req, res) => {
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




interviewRouter.put('/:InterviewID', async(req, res) => {
    console.log("PUT Interview");

    var sqlQuery = {
        text: `
            UPDATE 
                "Interview"
            SET 
                "ApplicationID" = $1,
                "InterviewTime" = $2,
                "InterviewStage" = $3,
                "InterviewVideo" = $4,
                "InterviewNotes" = $5,
                "InterviewScoreBehavioral" = $6,
                "InterviewScoreTechnical" = $7
            WHERE 
                "InterviewID"= $8
            RETURNING *`,
        values: [
            req.body.ApplicationID, 
            req.body.InterviewTime, 
            req.body.InterviewStage, 
            req.body.InterviewVideo,
            req.body.InterviewNotes, 
            req.body.InterviewScoreBehavioral,
            req.body.InterviewScoreTechnical,
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
})




interviewRouter.delete('/:InterviewID', async(req, res) => {
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









module.exports = interviewRouter;