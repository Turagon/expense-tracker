const mongoose = require('mongoose')
const schema = mongoose.Schema

const categorySchema = new schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  icon: { type: String, required: true }
})

module.exports = mongoose.model('Category', categorySchema)