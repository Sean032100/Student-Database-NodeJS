const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 12316;
const bodyParser = require('body-parser');
var path = require("path");


app.use(express.urlencoded());
app.use(bodyParser.urlencoded({extended: false}));

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",

});

// app.get("/", (req, res) => {
//   res.send("Hello GHuyszzzzzzzzzz!");
// });

app.get("/view", (req, res) => {
  console.log(req.query);
  // connect to database
  // query list all users
  // with placeholder
  connection.query("SELECT * FROM `users` ",[req.query.id],
    function (err, results) {
      console.log(results);
      // first check if there are results
      try {
        for (let i = 0; i < results.length; i++){
            var users = `TUPC ID: ${results[i].tupid} \n - First Name: ${results[i].firstname} \n - Last Name: ${results[i].lastname} \n - Phone Number: ${results[i].phone} \n - Address: ${results[i].address} \n - Email: ${results[i].email} \n\n`
            res.write(users);
        }
        res.end()
      } catch (err) {
        res.send(`Error: ${err}!`);
      }
    }
  );
  // if(results) -> response all users
  // if(!results) -> response error message
});

// main page
app.get('/', function(req,res){
  res.sendFile(path.join(__dirname,'./index.html'));
});

// Insert student
app.post('/add', function(req,res){
  connection.query('INSERT INTO users(tupid,firstname,lastname,phone,address,email) VALUES(?,?,?,?,?,?)', [req.body.tupid, req.body.first_name, req.body.last_name, req.body.phone_number, req.body.address, req.body.email_address], 
  function(err, ) {
    if (err) {
      res.send("Student Unsuccessfully added");
      return console.log(err.message);
    }
    console.log("New student added");
    res.send("New student has been added into the database with TUPC ID = "+ req.body.tupid + " and Name = " + req.body.first_name);
  });
});

//Update student
app.post('/update', function(req,res){
  connection.query("SELECT * FROM users WHERE tupid = ?;",[req.body.tupid], 
  function(err, result, field){
    if(result.length === 0){
       //if not exist
      res.send("Student does not exist");
    }else{  
      //existing student, update data
      connection.query('UPDATE users SET firstname = ?,lastname = ?,phone = ?,address = ?,email = ? WHERE tupid = ? ;', [req.body.first_name, req.body.last_name, req.body.phone_number, req.body.address, req.body.email_address, req.body.tupid], 
      function(err){
        if(err){
          res.send("Error encountered while updating or Student does not exist");
        }
        res.send("Student with TUPC ID NUMBER "+ req.body.tupid + " is updated successfully");
        console.log("Entry updated successfully");
      });
    }
  });
});

//DELETE
app.post('/delete', function(req,res){
  connection.query("SELECT * FROM users WHERE tupid = ?;",[req.body.tupid], 
  function(err, result, field){
    if(result.length === 0){
       //if not exist
      res.send("Student does not exist");
    }else{  
      //existing student, delete data
      connection.query('DELETE FROM users WHERE tupid = ?;', [req.body.tupid], 
      function(err) {
        if (err) {
          res.send("Error encountered while deleting");
          return console.error(err.message);
        }
        res.send("Student has been deleted");
        console.log(req.body.tupid);
        console.log("Student has been deleted");
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});