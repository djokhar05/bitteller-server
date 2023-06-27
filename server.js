//Set up
let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let cors = require("cors");



app.use(express.static(__dirname + '/uploads'));;

app.use(bodyParser.urlencoded({extended: true})); //Parses urlencoded bodies
app.use(bodyParser.json()); //Send JSON responses

let contact = require("./routes/contact");
let uploadData = require("./uploadData");

//enables cors
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));



app.use("/", contact);
app.use("/", uploadData);


app.listen(process.env.PORT || 5000);
console.log("Bitteller Server Started, listening on port 5000");

module.exports = app;
