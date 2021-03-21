//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { url } = require("inspector");
const { json } = require("body-parser");

const app = express();

// it will allow our private css and image to show on server as they are private
//it stores all static files
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
// requesting to get our html page on server
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
// getting values from server inside variable
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    
    
    //this is javascript 
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
        // converting our javascript data into string that is in the format of JSON
        const jsonData = JSON.stringify(data);

        const url = "https://us1.api.mailchimp.com/3.0/lists/d8730215b7";
        
        const Options ={
            method: "POST",
            auth: "Gaurav:b62cead0f363c1c2515fe42409c4950f-us1"
        }
        //making request and storing in const to send it to mailchimp server
    const request = https.request(url, Options, function(response){
            if(response.statusCode === 200){
                res.sendFile(__dirname + "/sucess.html");
            }
            else{
                res.sendFile(__dirname + "/failure.html");
            }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);//passing json data to mailchimp server
    //
    request.end();//when we are done with the request
});

    //if failed to sucess then redirecting user to main page giving same name that was used in form action
    app.post("/failure", function(req, res){
        res.redirect("/")
    })
 
app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000");
});


//api key-b62cead0f363c1c2515fe42409c4950f-us1

//list id-d8730215b7