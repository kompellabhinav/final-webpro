const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://abhinavkompella502:abhi1289@cluster1.d4hjtfo.mongodb.net/?retryWrites=true&w=majority";


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect(uri)
    .then(function(){
        console.log("Connection successful")
    })
    .catch(function(err){
        console.log(err)
    })

//--------------------
//     SCHEMA
//--------------------

const userSchema = {
    fullName: String,
    email: String,
    password: String,
    dates: String,
    workout: [{
        name: String, 
        body: String,
        sets: Number,
        maxWeight: Number
    }]
}

var user_name;

const User = new mongoose.model("Records", userSchema)

//-------------------------------------
//      CREATING INITIAL USER
//-------------------------------------

// var userData = new User({
//     fullName: "John Doe",
//     email: "johndoe@gmail.com",
//     password: "john",
//     date: "7/20/2023",     
//     workout: [{
//         name: "Bench Press",
//         body: "Chest",
//         sets: 4,
//         maxWeight: 185 
//     }]
// })

// var userData = new User({
//     fullName: "Web Programming",
//     email: "demouser",
//     password: "ThisIsForWPClass",
//     date: "7/21/2023",     
//     workout: [{
//         name: "Deadlifts",
//         body: "Back",
//         sets: 4,
//         maxWeight: 245 
//     }]
// })

// userData.save()

//--------------------
//     HOMEPAGE
//--------------------

app.get("/", function(req, res){
    res.sendFile(__dirname + "/home.html");
})

//--------------------
//     LOGIN
//--------------------

app.get("/login", function(req, res) {
    res.sendFile(__dirname + "/signup/login.html");
})

app.post("/login", function(req, res) {
    console.log(req.body);
       
    // Getting the email and password entered
    // by the user
    var emailEntered = req.body.username;
    var passwordEntered = req.body.password;
    user_name = emailEntered  
    // Checking if the email entered exists
    // in database or not.
    User.findOne({email : user_name})
                 // function(err, data){
        .then(function(data){
            // The email exists in the database.
           console.log(data);
              
           /* checking if the password entered 
           is matching the original password */
           if(data.password == passwordEntered){
                // res.sendFile(__dirname + "/seller/dashboard.html")
                User.findOne({email: emailEntered})
                    .then(function(foundItems){
                        console.log("Password correct");
                        // console.log(foundItems.workout._id);
                        // console.log(foundItems.items._id)
                        res.render("dashboard", {newListItems: foundItems});
        })
           }
           else {
  
                // Password is incorrect.
                // res.sendFile(__dirname + "/seller/dashboard.html")
                // console.log(data.password, passwordEntered, emailEntered)
                // res.send("Password wrong")
                res.redirect("/login")
            }
       })
       .catch(function(err){

            console.log(err)
       })
})

//--------------------
//     REQ PAGES
//--------------------

app.get("/about", function(req, res){
    res.sendFile(__dirname + "/about.html")
})

app.get("/description", function(req, res){
    res.sendFile(__dirname + "/description.html")
})

app.get("/checklist", function(req, res){
    res.sendFile(__dirname + "/checklist.html")
})

//--------------------
//     REGISTER
//--------------------


app.get("/register", function(req, res){
    res.sendFile(__dirname + "/signup/register.html")
})

app.post("/register", function(req, res){
    var fullName = req.body.fullName;
    var email = req.body.email;
    var password = req.body.password;

    // Creating new user
    var newUser = new User({
        fullName: fullName,
        email: email,
        password: password
    })
    newUser.save();
    console.log("Saved Successfully");
    user_name = email;

    res.redirect("/dashboard");
})

//--------------------
//     DASHBOARD
//--------------------

app.get("/dashboard", function(req, res){

    console.log(user_name)
    User.findOne({email: user_name})
            .then(function(foundItems){
                console.log(user_name)
                console.log(foundItems)
                res.render("dashboard", {newListItems: foundItems});
            })
            .catch(function(err){
                console.log(err)
            })
})

app.post("/dashboard", function(req, res){
    const newName = req.body.newName;
    const newBody = req.body.newBody;
    const newSet = req.body.newSet;
    const newWeight =  req.body.newWeight;

    console.log(user_name + " from post dashboard");
    User.findOneAndUpdate({email: user_name}, { $addToSet: {workout: {
        name: newName,
        body: newBody,
        sets: newSet,
        maxWeight: newWeight
    }}})
        .then(function(){
            console.log("Update Success");
            res.redirect("/dashboard");
        })
})

// app.post("/dashboardDelete", function(req, res){
//     const deleteItem = req.body.deleteButton;

//     User.findOneAndUpdate({email: user_name}, {$pull: {
//         date: {
//             workout: {
//                 name: deleteItem
//             }
//         }
//     }})
//         .then(function(dataFound){
//             console.log(dataFound)
//         })
// })

let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}

app.listen(port, function () {
    console.log("server started successfully");
})