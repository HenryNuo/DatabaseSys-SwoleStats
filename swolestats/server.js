var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');

var connection = mysql.createConnection({
	host: '34.170.103.248',
	user: 'root',
	password: 'cs411jdon',
	database: 'SwoleStats'
});

connection.connect;

var app = express();

//set up ejs view engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

// Search for exercise by ID

app.post('/search', function (req, res) {
	var exerciseID = req.body.search;
	var sql = `SELECT exerciseID, exerciseName FROM Exercises WHERE exerciseID = ${exerciseID}`;
	console.log(exerciseID);
	connection.query(sql, function (err, result) {
		if (err) {
			res.render('index', {
				data: 'Exercise with that ID not found'
			});
			return;
		}
		res.render('index', {
			data: JSON.stringify(result)
		});
	}
	);
});

// Add exercise to the database
app.post('/add', function (req, res) {
	var sql = `INSERT INTO Exercises (exerciseID, exerciseName, exerciseBodyPart, exerciseEquipment, exerciseGIFURL) VALUES (2000, '5 Mile Run', 'cardio', 'body weight', 'https://media.tenor.com/V5Xzkz8e1VsAAAAM/run-running.gif')`;
	connection.query(sql, function (err, result) {
		if (err) {
			res.render('index', {
				data: 'Error, exercise already added'
			});
			return;
		}
		res.render('index', {
			data: JSON.stringify(result)
		});
	}
	);
});

// Delete exercise from the database
app.post('/delete', function (req, res) {
	var sql = `DELETE FROM Exercises WHERE exerciseID = 2000`;
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.render('index', {
				data: 'Error'
			});
			return;
		}
		console.log(result);
		res.render('index', {
			data: JSON.stringify(result)
		});
	}
	);
});

// Edit existing exercise from the database
app.post('/edit', function (req, res) {
	var sql = `UPDATE Exercises SET exerciseName = 'Ten Mile Run' WHERE exerciseID=2000`;
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.render('index', {
				data: 'Error'
			});
			return;
		}
		console.log(result);
		res.render('index', {
			data: JSON.stringify(result)
		});
	}
	);
});

// Highest PR for each workout
app.post('/highest-pr', function (req, res) {
	var sql =
		'SELECT exerciseName, MAX(prWeight) From Records NATURAL JOIN Exercises GROUP BY exerciseID ORDER BY exerciseName LIMIT 15;'
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.render('index', {
				data: 'Error'
			});
			return;
		}
		res.render('index', {
			data: JSON.stringify(result)
		});
	}
	);
});

// Users who go to the gym the most
app.post('/gym-most-often', function (req, res) {
	var sql =
		'SELECT userFirstName, userLastName, COUNT(SessionID) as NumberOfGymSessions FROM User NATURAL JOIN GymSession GROUP BY userUsername ORDER BY COUNT(SessionID) DESC LIMIT 15';
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.render('index', {
				data: 'Error'
			});
			return;
		}
		res.render('index', {
			data: JSON.stringify(result)
		});
	}
	);
});

app.get('/', function (req, res) {
	res.render('index', { data: '' });
});

app.listen(80, function () {
	console.log('Server has started up');
});
