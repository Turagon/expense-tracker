const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
require('./config/mongoose')
const routes = require('./routes')
const port = process.env.PORT || 3000

const app = express()
const handlebars = require('handlebars')
const helper = require('just-handlebars-helpers')
helper.registerHelpers(handlebars)

// set helper to separate odd line & even line of records
handlebars.registerHelper('even', function(value, options) {
  return ('a' + value % 2)
})

app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(routes)

// express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// Passport middleware
require('./config/passport')(passport)
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash())
app.use((req, res, next) => {
  res.locals.msg = req.flash('msg')
  res.locals.error = req.flash('error')
  next()
})

app.listen(port, () => {
  console.log('server on')
})