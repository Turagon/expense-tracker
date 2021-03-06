const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/record"

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', () => {
  console.log('db connection fail')
})

db.once('open', () => {
  console.log('db on')
})

module.exports = db