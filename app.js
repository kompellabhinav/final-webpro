// external modules
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
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    Company: {
        CompName: String,
        Address: {
            address1: String,
            city: String,
            state: String,
            country: String,
            zipcode: Number
        }
    },
    items: [{
        Name: String,
        Category: String,
        Date: String,
        Inventory: Number
    }]
}

var user_name

const User = new mongoose.model("User", userSchema)

// var userData =  new User({
//     firstName: "Subhash",
//     lastName: "Pathuri",
//     email: "subhash@gmail.com",
//     password: "subhash",
//     Company: {
//         CompName: "Healthier",
//         Address: 30302,
//         "Hours of Operation": "M-F: 10am to 5pm"
//     },
//     items: [{
//         Name: "Tomato",
//         Category: "Vegetable",
//         Date: "4/16",
//         Inventory: 9
//     }]
// })

// userData.save()

// Handling get request on home route.
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/home.html");
})

//--------------------
//     LOGIN
//--------------------


app.get("/login", function(req, res) {
    res.sendFile(__dirname + "/seller/login.html");
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
                        console.log(foundItems.items._id)
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
//     REGISTER
//--------------------

app.get("/register", function(req, res) {
    res.sendFile(__dirname + "/seller/register/register.html");
})

app.get("/registeri", function(req, res){
    res.sendFile(__dirname +"/seller/register/register.html")
})

app.post("/registeri", function(req, res){
    res.redirect("/registeri")
})

app.get("/newReg", function(req, res){
    res.sendFile(__dirname + "/seller/register/newReg.html")
})

app.post("/newReg", function(req, res){
    var fname = req.body.firstname;
    var lname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
      
    var compName = req.body.compName;
    var addressLine1 = req.body.address1;
    var city = req.body.city;
    var country = req.body.country;
    var state = req.body.state;
    var zip = req.body.zipcode;

    console.log(fname)
    console.log(lname)
    console.log(email)
      
    // Creating a new user with entered credentials.
    var newuser = new User({
        firstName: fname,
        lastName: lname,  
        email : email,
        password : password,
        Company: {
            CompName: compName,
            Address: {
                address1: addressLine1,
                city: city,
                state: state,
                country: country,
                zipcode: zip
            }
        }
    })

      
    // Saving the newuser.
    newuser.save();
    console.log("saved successfully");

    User.find()
        .then(function(foudIt){
            console.log(foudIt)
        })

    user_name = email
      
        // Sending the response that user
        // is saved successfully
    res.redirect("/dashboard")

})

app.post("/register", function(req, res){
    // console.log(req.body);
        
    // Getting the email and password entered
    // by the user
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var password = req.body.password;
      
    // Creating a new user with entered credentials.
    var newuser = new User({
        firstName: fname,
        lastName: lname,  
        email : email,
        password : password
    })

      
    // Saving the newuser.
    newuser.save();
    console.log("saved successfully");

    user_name = email
      
    // Sending the response that user
    // is saved successfully
    res.redirect("/info")
})

//--------------------
//     INFO
//--------------------
app.get("/info", function(req, res){
    res.sendFile(__dirname + "/seller/info.html");
})

app.post("/info", function(req, res){

    console.log("Reached info")
    var cName = req.body.cName;
    var zCode = req.body.zCode;
    var hours = req.body.hours;

    User.findOneAndUpdate({email: user_name}, {$set: {Company: 
        {
            CompName: cName,
            Address: zCode,
            "Hours of Operation": hours
        }}})
        .then(function(){
            console.log("Company details update Success")
        })
        .catch(function(err){
            console.log(err)
        })
    console.log(cName, zCode, user_name)
    res.redirect("/dashboard")  
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
    const newCategory = req.body.newCategory;
    const newDate = req.body.newDate;
    const newInventory =  req.body.newInventory;
    console.log(user_name +"from post dashboard")
    User.findOneAndUpdate({email: user_name}, { $addToSet: {items: {
        Name: newName, 
        Category: newCategory, 
        Date: newDate, 
        Inventory: newInventory
    }}})
        .then(function(){
            console.log("Update Success")
            res.redirect("/dashboard") 
        })
     
})

app.post("/dashboardDelete", function(req, res){
    const deleteitem = req.body.deleteButton
    
    User.findOneAndUpdate({email: user_name}, {$pull: {
        items: {
            Name: deleteitem
        }
    }})
        .then(function(dataFound){
            console.log(dataFound)
        })

    
    console.log(deleteitem)
    res.redirect("/dashboard")
})

app.post("/dashboardUpdate", function(req, res){

})

//--------------------
//       USER
//--------------------

app.get("/user", function(req, res){
    res.sendFile(__dirname +"/user/userSearch.html")
})

app.post("/user", function(req, res){
    res.redirect("/user")
})

app.post("/search", function(req, res){
    var zipcode = req.body.zipCode
    console.log(zipcode)

    User.find({'Company.Address.zipcode': zipcode})
        .then(function(found){
            console.log(found)
            res.render("searchResult", {companyItems: found});
        })
})

app.post("/userSelected", function(req, res){
    var user_n = req.body.company
    console.log(user_n)
    User.findOne({'Company.CompName': user_n})
        .then(function(found){
            console.log(found)
            res.render("userDash", {newListItems: found})
        })
})

User.findOne({firstName: 'Test3fn'})
.then(function(found){
    console.log(found.Company.Address.zipcode)
    
})

User.find({'Company.Address.zipcode': 30303})
.then(function(found){
    console.log(found)
    // res.render("searchResult", {companyItems: found});
})

// Allowing app to listen on port 3000

// User.findOne({'Company.CompName': 'Healthier'})
//         .then(function(found){
//             console.log(found.items)
//         })
        
app.listen(3000, function () {
	console.log("server started successfully");
})