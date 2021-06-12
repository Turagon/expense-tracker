const express = require('express')
const router = express.Router()

const record = require('../../models/recordSchema')
const category = require('../../models/categorySchema')
const { iconSelect, totalAmount, formatNumber } = require('../../public/javascripts/listAndTotal')

router.get('/', (req, res) => {
  Promise.all([record.find().lean(), category.find().lean()])
    .then(results => {
      const [records, categories] = results
      records.forEach(item => {
        item.icon = iconSelect(item, ...categories)
      })
      const amount = formatNumber(totalAmount(...records))
      res.render('index', {records, amount})
    })
})

router.get('/data', (req, res) => {
  Promise.all([record.find().lean(), category.find().sort({id: 1}).lean()])
    .then(results => {
      const [records, categories] = results
      res.json([records, categories])
    })
    .catch(error => console.error(error))
})

module.exports = router