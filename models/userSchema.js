const mongoose = require('mongoose')
const schema = require('mongoose').Schema
const bcrypt = require('bcryptjs')

const userSchema = new schema({
  name: {
    type: String, 
    required: [true, 'Sorry, name is mandatory!']
  },
  email: {
    type: String, 
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(v)
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String, 
    validate: {
      validator: function (v) {
        return /^.*(?=.{6,12})(?=.*\d)(?=.*[A-Z]{1,})(?=.*[a-z]{1,}).*$/.test(v)
      },
      message: props => `${props.value} is not a valid password!`
    }
  }
})

userSchema.pre('save', async function (next) {
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(Math.random().toString(20).slice(9), salt)
  }
  next();
});

const user = mongoose.model('user', userSchema)

module.exports = user