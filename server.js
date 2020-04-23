var express = require('express')
var app = express()
const bodyParser = require('body-parser');

var users = require('./controllers/users')

const hostname = '127.0.0.1';
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

app.use('/users', users)

app.listen(process.env.PORT || port, hostname, () => {
  console.log(`Server running at http://${hostname}:${process.env.PORT || port}/`);
});



