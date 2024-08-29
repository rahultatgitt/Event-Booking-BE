// Initialize variables
// var mongoose = require('mongoose');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var morgan = require('morgan');

// Import the cors package
var cors = require('cors');

// DB Config
var db = require("./config/keys");
var conn = require('./db/conn').getmongoConn(db.mongoURI);
var User = require("./models/User");
var config = "";

const configuration = require("./config/configuration");



//Express Cache

// var cache = require('express-redis-cache')({
//     host: db.redisHost, //Redis Host
//     port: db.redisPort //Redis Port
//   });


//Router
// const users = require("./routes/api/users");
var router = require("./routes/index");

// Passport config
require("./config/passport")(passport, config, conn, User);

var app = express();


// Apply CORS middleware to allow requests from other origins
app.use(cors({
  origin: '*', // You can replace '*' with specific origins if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(morgan());


// Passport middleware
app.use(passport.initialize());
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  })
);
app.use(bodyParser.json({limit: '50mb'}));


//Cors
// app.use(cors());
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});


// Routes
app.get("/", function (req, res) {
  res.json({ message: "Success!" });
});

router.addAPI("/api/v0", app, passport, conn);
// app.use("/api/users", users);



// const port = process.env.PORT || 5004;
const port = process.env.PORT || configuration.port;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));