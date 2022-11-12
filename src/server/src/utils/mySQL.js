const mysql = require('mysql2');




// Connecting to the Database
const mySQL = mysql.createConnection({
  host: '34.170.103.248',
  user: 'root',
  password: 'cs411jdon',
  database: 'SwoleStats'
});

// open the MySQL connection
mySQL.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});




module.exports = {
  mySQL
};