const express = require("express");
var app = express();

//Dependencies
var cors = require("cors");
var path = require("path");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Global Variables
const PORT = process.env.EXPRESS_PORT ? process.env.EXPRESS_PORT : 80;

/******************************
 *
 * Express Routing
 *     Modularizing code to have each table's routes in own file
 *
 ******************************/
var achievement = require("./routes/achievement.js");
var exercise = require("./routes/exercise.js");
var routine = require("./routes/routine.js");
var routineExercise = require("./routes/routineExercise.js");
var user = require("./routes/user.js");
var userAchievement = require("./routes/userAchievement.js");
var userExerciseRecord = require("./routes/userExerciseRecord.js");
var workout = require("./routes/workout.js");
var workoutExercise = require("./routes/workoutExercise.js");

app.use("/api/achievement", achievement);
app.use("/api/exercise", exercise);
app.use("/api/routine", routine);
app.use("/api/routineExercise", routineExercise);
app.use("/api/user", user);
app.use("/api/userAchievement", userAchievement);
app.use("/api/userExerciseRecord", userExerciseRecord);
app.use("/api/workout", workout);
app.use("/api/workoutExercise", workoutExercise);

/******************************
 *
 *  Serving React Project
 *
 ******************************/
//Static file declaration
app.use(express.static(path.join(__dirname, "/public")));
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
    if (!error) {
        console.log(
            "Server is Successfully Running, and App is listening on port " +
                PORT
        );
    } else {
        console.log("Error occured, server can't start", error);
    }
});
