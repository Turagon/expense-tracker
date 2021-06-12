const db = require('../../config/mongoose')
const Category = require('../categorySchema')
const categoryData = require('../../category.json').category

db.once('open', () => {
  Category.create(categoryData)
    .then(() => {
      return db.close()
    })
    .then(() => {
      console.log('category data import done')
    })
    .catch(error => {
      console.error(error)
    })
})