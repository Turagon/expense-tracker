const mongoose = require('mongoose')
const mongoose2 = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/record'
const MONGODB_URI2 = process.env.MONGODB_URI || 'mongodb://localhost:27017/category'

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose2.connect(MONGODB_URI2, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection
const db2 = mongoose2.connection

db.on('error', () => {
  console.log('db connection fail')
})

db2.on('error', () => {
  console.log('db2 connection fail')
})

db.once('open', () => {
  console.log('db on')
})

db2.once('open', () => {
  console.log('db2 on')
})

module.exports = {
  db,
  db2
}