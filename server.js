const express = require('express');
const app = express();
const dotenv = require('dotenv');
var bodyParser = require("body-parser");


dotenv.config();
const connection = require("./config/db");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");


// create view page
app.get('/', (req, res) =>{
    res.redirect("create.html")
});


// Submit user data
app.post('/submitCreate', (req, res) =>{
    // console.log(req.body);
        const name = req.body.name;
        const email = req.body.email;
    try {
        connection.query("INSERT into user (name,email) values(?,?)", [name,email], (err, rows)=>{
            if (err) {
                console.log(err);
            } else {
                res.redirect("allUser");
            }
        });
    } catch (error) {
        console.error(error);
    }
});



// Read
app.get("/allUser", (req,res) =>{
    connection.query("select * from user", (err, rows) =>{
        if (err) {
            console.log(err);
        } else {
            res.render("read.ejs", {rows});
        }
    })
});



// Delete
app.get("/delete-data", (req, res) =>{
    const deleteQuery = "delete from user where id=?";
    connection.query(deleteQuery, [req.query.id], (err, rows) =>{
        if(err){
            console.log(err);
        } else {
            res.redirect('/allUser');
        }
    })
});


// edit user
app.get("/edit-data", (req, res) =>{
    connection.query("select * from user where id=?", [req.query.id], (err, eachRow) =>{
        if(err){
            console.log(err);
        } else {
            result =JSON.parse(JSON.stringify(eachRow[0]));
            console.log(result);
            res.render("edit.ejs",result);
        }
    })
});



// update user data
app.post('/updateUser', (req, res) =>{
    // console.log(req.body);
        const id = req.body.id;
        const name = req.body.name;
        const email = req.body.email;
    try {
        connection.query("update user set name=?, email=? where id=?", [name, email, id], (err, rows)=>{
            if (err) {
                console.log(err);
            } else {
                res.redirect("allUser");
            }
        });
    } catch (error) {
        console.error(error);
    }
});
app.listen(process.env.PORT || 4000, (error) =>{
    if(error) throw error;
    console.log(`Server running on ${process.env.PORT}`);
    
});