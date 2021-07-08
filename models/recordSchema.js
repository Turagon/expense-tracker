const mongoose = require('mongoose')
const schema = mongoose.Schema

const recordSchema = new schema({
  name: {type: String, required: true},
  category: { type: Number, required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  merchant: { type: String, required: false },
  userId: {
    type: schema.Types.ObjectId,
    ref: 'users',
    index: true,
    required: true
  }
})

module.exports = mongoose.model('Record', recordSchema) 