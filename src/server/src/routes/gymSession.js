var express = require('express');
var recruiterRouter = express.Router();

//Other Dependencies
var cors = require('cors');

// Middleware
recruiterRouter.use(express.urlencoded({ extended: true }));
recruiterRouter.use(express.json());
recruiterRouter.use(cors());

const { mySQL } = require("../utils/mySQL.js");





recruiterRouter.get('/', async(req, res) => {
    console.log("GET Recruiter");

    var sqlQuery = 'SELECT * FROM "Recruiter"';
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

    return res.send(output.rows);
});




recruiterRouter.get('/:RecruiterID', async(req, res) => {
    console.log("GET Recruiter by ID");

    var sqlQuery = {
        text: `
            SELECT * 
            FROM "Recruiter"
            WHERE "RecruiterID" = $1`,
        values: [
            req.params.RecruiterID
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
                message: `No row with ID=${req.params.RecruiterID}`,
                status: "Failed"
            }
        );
    } else {
        return res.send(output.rows);
    }
});




recruiterRouter.post('/', async(req, res) => {
    console.log("CREATE Recruiter");

    var sqlQuery = {
        text: `
            INSERT 
                INTO "Recruiter"
            (
                "RecruiterNameFirst", 
                "RecruiterNameLast", 
                "RecruiterEmail", 
                "RecruiterDiscipline"
            )
            VALUES
                ( $1,$2,$3,$4 )
            RETURNING *`,
        values: [
            req.body.RecruiterNameFirst, 
            req.body.RecruiterNameLast, 
            req.body.RecruiterEmail,
            req.body.RecruiterDiscipline
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
                message: `No row with ID=${req.params.RecruiterID}`,
                status: "Failed"
            }
        );
    } else {
        return res.send(output.rows);
    }
});




recruiterRouter.put('/:RecruiterID', async(req, res) => {
    console.log("UPDATE recruiter");

    var sqlQuery = {
        text: `
            UPDATE 
                "Recruiter"
            SET 
                "RecruiterNameFirst" = $1, 
                "RecruiterNameLast" = $2,
                "RecruiterEmail" = $3,
                "RecruiterDiscipline" = $4
            WHERE 
                "RecruiterID"= $5
            RETURNING *`,
        values: [
            req.body.RecruiterNameFirst, 
            req.body.RecruiterNameLast, 
            req.body.RecruiterEmail,
            req.body.RecruiterDiscipline,
            req.params.RecruiterID
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
                message: `No row with ID=${req.params.RecruiterID}`,
                status: "Failed"
            }
        );
    } else {
        return res.send(output.rows);
    }
})




recruiterRouter.delete('/:RecruiterID', async(req, res) => {
    console.log("DELETE Recruiter by ID");

    var sqlQuery = {
        text: ` 
            DELETE FROM 
                "Recruiter" 
            WHERE 
                "RecruiterID"= $1
            RETURNING *`,
        values: [
            req.params.RecruiterID
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
                message: `No row with ID=${req.params.RecruiterID}`,
                status: "Failed"
            }
        );
    } else {
        return res.send(output.rows);
    }
});







module.exports = recruiterRouter;