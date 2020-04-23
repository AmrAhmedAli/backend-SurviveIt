var express = require('express')
var app = express()
const bodyParser = require('body-parser');

var admin = require("firebase-admin");

var serviceAccount = require("./firebaseutils/surviveit-8bd20-firebase-adminsdk-2ghk2-bb0dbd88a3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://surviveit-8bd20.firebaseio.com"
});

var users = require('./controllers/users')
var auth = require('./controllers/auth')

const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

app.use('/users', users)
app.use('/auth', auth)

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))



