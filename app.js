if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
require('./config/mongoose')
const routes = require('./routes')
const port = process.env.PORT

const app = express()
const handlebars = require('handlebars')
const helper = require('just-handlebars-helpers')
helper.registerHelpers(handlebars)

// set helper to separate odd line & even line of records
handlebars.registerHelper('even', function(value, options) {
  return ('a' + value % 2)
})
// this helper is for edit page, allow the date column could be shown normally
handlebars.registerHelper('dateConvert', function (value) {
  if (value) {
    const date = value.toJSON().slice(0, 10)
    return date
  } else {
    return
  } 
})

app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride('_method'))

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

app.use(routes)

app.listen(port, () => {
  console.log('server on')
})