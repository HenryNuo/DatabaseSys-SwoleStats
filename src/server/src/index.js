const express = require('express');
var app = express();

//Dependencies
var cors = require('cors');
var path = require('path')

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Global Variables
const PORT = process.env.EXPRESS_PORT ? process.env.EXPRESS_PORT : 5000;





/******************************
 * 
 *  Import Environment Variables
 *      checks to make sure you are in local environment and then
 *      loads environment variables
 * 
 ******************************/
// if (!process.env.ENV_TYPE || process.env.ENV_TYPE == "local") { 
//     const dotenv = require("dotenv").config( { path: '../../../.env' } );
  
//     // Checks if dotenv failed to parse information
//     if (dotenv.error) {
//         console.log("Cannot Parse from .env file")
//         throw dotenv.error
//     }
// }





/******************************
 * 
 * Express Routing
 *     Modularizing code to have each table's routes in own file
 * 
 ******************************/
var achievements = require('./routes/achievements.js');
var achieves = require('./routes/achieves.js');
var contains = require('./routes/contains.js');
var exercises = require('./routes/exercises.js');
var gymSession = require('./routes/gymSession.js');
var includes = require('./routes/includes.js');
var records = require('./routes/records.js');
var routine = require('./routes/routine.js');
var user = require('./routes/user.js');

app.use('/api/achievements', achievements);
app.use('/api/achieves', achieves);
app.use('/api/contains', contains);
app.use('/api/exercises', exercises);
app.use('/api/gymSession', gymSession);
app.use('/api/includes', includes);
app.use('/api/records', records);
app.use('/api/routine', routine);
app.use('/api/user', user);




/******************************
 * 
 *  Serving React Project
 * 
 ******************************/
//Static file declaration
app.use(express.static(path.join(__dirname, '/public')));
//production mode
// if(process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'client/build'))); 
//     app.get('*', (req, res) => {    
//         res.sendfile(path.join(__dirname = 'client/build/index.html'));  
//     })
// }
// // build mode
// app.get('*', (req, res) => {  
//     res.sendFile(path.join(__dirname+'/client/public/index.html'));
// })




/******************************
 * 
 *  Generic Error Handling
 *      - Instead of handling errors within each route they would call next(err) which would send the express route to 
 *      this endpoint. This would decrease the ammount of code which is repeated throughout the codebase. However, never
 *      got around to it
 *      - For futher context to how I planned on implementing this look at (https://scoutapm.com/blog/express-error-handling)
 *  @author Duane Groves
 * 
 ******************************/
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).send(JSON.stringify(error, null, 4));
});




app.listen(PORT, (error) => {
    if(!error) {
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    } else {
        console.log("Error occured, server can't start", error);
    }
});
