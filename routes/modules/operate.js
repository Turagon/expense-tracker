const express = require('express')
const { NativeError } = require('mongoose')
const router = express.Router()

const record = require('../../models/recordSchema')
const { totalAmount, formatNumber } = require('../../public/javascripts/listAndTotal')
const validator = require('../../public/javascripts/dataValidator')

router.get('/', (req, res) => {
  res.render('add')
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  record.exists({_id: id})
    .then(doc => {
      if (doc) {
        record.findById(id)
        .lean()
        .then(data => {
          res.render('edit', {id, data})
        })
        .catch(err => {
          next(err)
        })
      } else {
        res.send('request not exist')
      }
    })
    .catch(err => {
      return next(err)
    })
})

router.post('/search', (req, res) => {
  const value = Number(req.body.filter)
  record.exists({category: value})
    .then(doc => {
      if (doc) {
        record.find({category: value})
          .lean()
          .then(records => {
            const amount = formatNumber(totalAmount(...records))
            res.render('index', {records, amount, value})
          })
          .catch(err => {
            next(err)
          })
      } else {
        res.send('invalid data request')
      }
    })
    .catch(err => {
      return next(err)
    })
})

router.post('/', (req, res) => {
  const data = req.body
  if (validator(data)) {
    record.create({
      name: data.name,
      date: data.date,
      category: data.category,
      amount: data.amount
    })
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
    record.exists({_id: id})
      .then(doc => {
        if (doc) {
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
          res.send('request not exist')
        }
      })
      .catch(err => {
        return next(err)
      })
  } else {
    res.send('invalid data post')
  }
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  record.exists({_id: id})
    .then(doc => {
      if (doc) {
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
      } else {
        res.send('can not find data')
      }
    })
    .catch(err => {
      return next(err)
    })
})

module.exports = router