const mongoose = require('mongoose')
const schema = require('mongoose').Schema

const userSchema = new schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true}
})

module.exports = mongoose.model('user', userSchema)