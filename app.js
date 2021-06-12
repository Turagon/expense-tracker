const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const chart = require('chart.js')
require('./config/mongoose')
const routes = require('./routes')
const port = process.env.PORT || 3000

const app = express()
const handlebars = require('handlebars')
const helper = require('just-handlebars-helpers')
helper.registerHelpers(handlebars)


app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(routes)

app.listen(port, () => {
  console.log('server on')
})