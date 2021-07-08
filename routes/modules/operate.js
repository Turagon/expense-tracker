const express = require('express')
const router = express.Router()

const record = require('../../models/recordSchema')
const categories = require('../../models/categorySchema')
const { totalAmount, formatNumber } = require('../../public/javascripts/listAndTotal')
const validator = require('../../public/javascripts/dataValidator')
const { ensureAuth, forwardAuth } = require('../../config/authentication')

router.use(ensureAuth)

router.get('/', (req, res) => {
  res.render('add')
})

router.get('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  record.findOne({_id, userId})
    .lean()
    .then(data => {
      if (data) {
        res.render('edit', {_id, data})
      } else {
        req.flash('error', 'Sorry, data does not exist')
        res.redirect('/')
      }
    })
    .catch(err => console.log(err))
})

router.post('/search', (req, res) => {
  const value = Number(req.body.filter)
  const userId = req.user._id
  Promise.all([record.find({category: value, userId}).lean(), categories.find({id: value}).lean()])
    .then(results => {
      const [records, icon] = results
      records.forEach(item => item.icon = icon[0].icon);
      const amount = formatNumber(totalAmount(...records))
      res.render('index', {records, amount, value})
    })
    .catch(err => console.log(err))
})

router.post('/', (req, res) => {
  const data = req.body
  data.userId = req.user._id
  if (validator(data)) {
    record.create(data)
      .then(() => {
        res.redirect('/')
      })
      .catch(err => console.log(err))
  } else {
    res.send('invalid data post')
  }
})

router.put('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const update = req.body
  if (validator(update)) {
    record.findOne({_id, userId})
      .then(record => {
        if (record) {
          record.name = update.name
          record.date = update.date
          record.category = update.category
          record.amount = update.amount
          return record.save()
        } else {
          req.flash('error', 'Sorry, Data does not exist')
          res.redirect('/')
        }
      })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  } else {
    res.send('Invalid data post')
  }
})

router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  record.findOne({_id, userId})
    .then(records => {
      if (records) {
        return records.remove()
      } else {
        req.flash('error', 'Sorry, data does not exist')
        res.redirect('/')
      }
    })
    .then(() => {
      res.redirect('/')
    })
    .catch(err => console.log(err))
})

module.exports = router