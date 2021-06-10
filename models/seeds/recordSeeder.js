const db = require('../../config/mongoose')
const Record = require('../recordSchema')
const recordData = require('../../record.json').record

db.once('open', () => {
  Record.create(recordData)
    .then(() => {
      return db.close()
    })
    .then(() => {
      console.log('record data import done')
    })
})