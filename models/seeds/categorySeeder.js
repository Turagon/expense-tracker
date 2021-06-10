const db2 = require('../../config/mongoose2')
const Category = require('../categorySchema')
const categoryData = require('../../category.json').category

db2.once('open', () => {
  Category.create(categoryData)
    .then(() => {
      return db2.close()
    })
    .then(() => {
      console.log('category data import done')
    })
})