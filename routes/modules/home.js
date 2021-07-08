const express = require('express')
const router = express.Router()

const record = require('../../models/recordSchema')
const category = require('../../models/categorySchema')
const { iconSelect, totalAmount, formatNumber } = require('../../public/javascripts/listAndTotal')
const { ensureAuth, forwardAuth } = require('../../config/authentication')

router.use(ensureAuth)

router.get('/', (req, res) => {
  const userId = req.user._id
  Promise.all([record.find({ userId }).lean(), category.find().lean()])
    .then(results => {
      const [records, categories] = results
      records.forEach(item => {
        item.icon = iconSelect(item, ...categories)
      })
      const amount = formatNumber(totalAmount(...records))
      res.render('index', {records, amount})
    })
    .catch(err => {
      next(err)
    })
})

router.get('/data', (req, res) => {
  const userId = req.user._id
  Promise.all([record.find({ userId }).lean(), category.find().sort({id: 1}).lean()])
    .then(results => {
      const [records, categories] = results
      res.json([records, categories])
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router