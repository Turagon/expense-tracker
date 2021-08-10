const express = require('express')
const router = express.Router()

const record = require('../../models/recordSchema')
const categories = require('../../models/categorySchema')
const validator = require('../../public/javascripts/dataValidator')
const { ensureAuth, forwardAuth } = require('../../config/authentication')

router.use(ensureAuth)


router.get('/', (req, res) => {
  return res.render('add')
})

router.get('/calender?', (req, res) => {
  const userId = req.user._id
  let { year, month } = req.query
  if (!year) {
    const date = new Date()
    year = date.getFullYear()
    month = date.getMonth() + 1
  } 
  const day = new Date(year, month, 0)
  const dayNum = day.getDate()
  const lowerBoundary = new Date(`${year}-${month}-01` + 'UTC')
  const upperBoundary = new Date(`${year}-${month}-${dayNum}` + 'UTC')
  record.find({ userId, date:{ $gte: lowerBoundary, $lte: upperBoundary } })
    .lean()
    .then(datas => {
      datas.push(year)
      datas.push(month)
      return res.json(datas)
    })
    .catch(err => console.log(err))
})

router.get('/daily/:id', (req, res) => {
  const date = new Date(req.params.id + 'UTC')
  const userId = req.user._id
  record.find({userId, date})
  .lean()
  .then(datas => {
    datas.forEach(item => {
      item.date = item.date.toJSON().slice(0, 10)
    })
    return res.json(datas)
  })
  .catch(err => console.log(err))
})

router.get('/search', (req, res) => {
  const {month, category} = req.query
  const year = 2021
  const userId = req.user._id
  let lowerBoundary = ''
  let upperBoundary = ''
  if (month === 'All') {
    lowerBoundary = new Date(`${year}-01-01` + 'UTC')
    upperBoundary = new Date(`${year}-12-31` + 'UTC')
  } else {
    let monthValue = Number(month)
    const day = new Date(2021, monthValue, 0)
    const dayNum = day.getDate()
    lowerBoundary = new Date(`${year}-${monthValue}-01` + 'UTC')
    upperBoundary = new Date(`${year}-${monthValue}-${dayNum}` + 'UTC')
  }
  const categoryValue = category === 'All'? [1, 2, 3, 4, 5]: [Number(category)]
  Promise.all([record.find({ date: { $gte: lowerBoundary, $lte: upperBoundary }, category: { $in: categoryValue }, userId }).lean(), categories.find({ id: { $in: categoryValue } }).lean()])
  .then(results => {
    res.json(results)
  })
  .catch(err => console.log(err))
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
        return res.redirect('/')
      }
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
    req.flash('error', 'Invalid post message')
    res.redirect('/tracker')
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
          record.date = Number(new Date(update.date))
          record.category = update.category
          record.amount = update.amount
          record.merchant = update.merchant
          return record.save()
        } else {
          req.flash('error', 'Sorry, Data does not exist')
          res.redirect('/')
        }
      })
      .then(() => res.redirect(`/`))
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