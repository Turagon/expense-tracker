const express = require('express')
const router = express.Router()

const record = require('../../models/recordSchema')
const { totalAmount, formatNumber } = require('../../public/javascripts/listAndTotal')

router.get('/', (req, res) => {
  res.render('add')
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  record.findById(id)
  .lean()
  .then(data => {
    res.render('edit', {id, data})
  })
  .catch(error => console.error(error))
})

router.post('/search', (req, res) => {
  const value = Number(req.body.filter)
  record.find({category: value})
    .lean()
    .then(records => {
      const amount = formatNumber(totalAmount(...records))
      res.render('index', {records, amount, value})
    })
    .catch(error => console.error(error))
})

router.post('/', (req, res) => {
  const data = req.body
  record.create({
    name: data.name,
    date: data.date,
    category: data.category,
    amount: data.amount
  })
  .then(() => {
    res.redirect('/')
  })
  .catch(error => console.error(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const update = req.body
  record.findById(id)
    .then(record => {
      record.name = update.name
      record.date = update.date
      record.category = update.category
      record.amount = update.amount
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  record.findById(id)
    .then(record => {
      return record.remove()
    })
    .then(() => {
      res.redirect('/')
    })
    .catch(error => console.error(error))
})

module.exports = router