var express = require('express')
var app = express()
const bodyParser = require('body-parser');

var users = require('./controllers/users')

const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

app.use('/users', users)

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))



