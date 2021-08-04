if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const Record = require('../recordSchema')
const user = require('../userSchema')
const recordData = require('../../record.json').record
const seedUser = require('../../user.json').users
const bcrypt = require('bcryptjs')

db.once('open', () => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(seedUser[0].password, salt, (err, hash) => {
        user.create({
          name: seedUser[0].name,
          email: seedUser[0].email,
          password: hash
        })
        .then(user => {
          const refId = user._id
          for (let i of recordData) {
            Record.create({
                ...i, userId: refId
              })
          }
        })
    })
  })
  console.log('done')
})