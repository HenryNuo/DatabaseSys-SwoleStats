const mysql = require("mysql2");

// Connecting to the Database
const mySQL = mysql.createConnection({
    host: "35.222.158.27",
    user: "root",
    password: "cs411jdon",
    database: "swolestats",
});

// open the MySQL connection
mySQL.connect((error) => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

module.exports = {
    mySQL,
};
