const express = require('express')
const router = express.Router()

const record = require('../../models/recordSchema')
const categories = require('../../models/categorySchema')
const { totalAmount, formatNumber } = require('../../public/javascripts/listAndTotal')
const validator = require('../../public/javascripts/dataValidator')

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
    .catch(err => {
      next(err)
    })
})

router.post('/search', (req, res) => {
  const value = Number(req.body.filter)
  Promise.all([record.find({category: value}).lean(), categories.find({id: value}).lean()])
    .then(results => {
      const [records, icon] = results
      records.forEach(item => item.icon = icon[0].icon);
      const amount = formatNumber(totalAmount(...records))
      res.render('index', {records, amount, value})
    })
    .catch(err => {
      next(err)
    })
})

router.post('/', (req, res) => {
  const data = req.body
  if (validator(data)) {
    record.create(data)
      .then(() => {
        res.redirect('/')
      })
      .catch(err => {
        next(err)
      })
  } else {
    res.send('invalid data post')
  }
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const update = req.body
  if (validator(update)) {
    record.findById(id)
      .then(record => {
        record.name = update.name
        record.date = update.date
        record.category = update.category
        record.amount = update.amount
        return record.save()
      })
      .then(() => res.redirect('/'))
      .catch(err => {
        next(err)
      })
  } else {
    res.send('invalid data post')
  }
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
    .catch(err => {
      next(err)
    })
})

module.exports = router