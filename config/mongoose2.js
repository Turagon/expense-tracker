const mongoose2 = require('mongoose')
const MONGODB_URI2 = process.env.MONGODB_URI || 'mongodb://localhost:27017/category'

mongoose2.connect(MONGODB_URI2, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db2 = mongoose2.connection

db2.on('error', () => {
  console.log('db2 connection fail')
})

db2.once('open', () => {
  console.log('db2 on')
})

module.exports = db2