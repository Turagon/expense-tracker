const express = require('express')
const router = express.Router()

const record = require('../../models/recordSchema')
const categories = require('../../models/categorySchema')
const { iconSelect, totalAmount, formatNumber } = require('../../public/javascripts/listAndTotal')
const validator = require('../../public/javascripts/dataValidator')
const { ensureAuth, forwardAuth } = require('../../config/authentication')

router.use(ensureAuth)


router.get('/', (req, res) => {
  return res.render('add')
})

router.get('/calender?', (req, res) => {
  const userId = req.user._id
  const url = req.url
  let year = ''
  let month = ''
  if (url.indexOf("?") === -1) {
    const date = new Date()
    year = date.getFullYear()
    month = date.getMonth() + 1
  } else {
    const parameters = url.split("?")[1]
    year = Number(parameters.split("&")[0].split("=")[1])
    month = Number(parameters.split("&")[1].split("=")[1])
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
      const year = item.date.getFullYear()
      const month = item.date.getMonth() + 1
      const day = item.date.getDate()
      item.date = `${year}-${month}-${day}`
    })
    return res.json(datas)
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

router.post('/search', (req, res) => {
  const value = Number(req.body.filter)
  const userId = req.user._id
  Promise.all([record.find({category: value, userId}).lean(), categories.find({id: value}).lean()])
    .then(results => {
      const [records, icon] = results
      // records.forEach(item => item.icon = icon[0].icon)
      records.forEach(item => {
        item.icon = icon[0].icon
        const year = item.date.getFullYear()
        const month = item.date.getMonth() + 1
        const day = item.date.getDate()
        item.date = `${year}-${month}-${day}`
      })
      const amount = formatNumber(totalAmount(...records))
      res.render('index', {records, amount, value})
    })
    .catch(err => console.log(err))
})

router.post('/searchByMonth', (req, res) => {
  const month = Number(req.body.monthfilter)
  const year = 2021
  const userId = req.user._id
  const day = new Date(2021, month, 0)
  const dayNum = day.getDate()
  const lowerBoundary = new Date(`${year}-${month}-01` + 'UTC')
  const upperBoundary = new Date(`${year}-${month}-${dayNum}` + 'UTC')
  Promise.all([record.find({ date: { $gte: lowerBoundary, $lte: upperBoundary }, userId }).lean(), categories.find().lean()])
    .then(results => {
      const [records, categories] = results
      records.forEach(item => {
        item.icon = iconSelect(item, ...categories)
        const day = item.date.getDate()
        item.date = `${year}-${month}-${day}`
      })
      const amount = formatNumber(totalAmount(...records))
      res.render('index', { records, amount, month })
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
          record.date = update.date
          record.category = update.category
          record.amount = update.amount
          return record.save()
        } else {
          req.flash('error', 'Sorry, Data does not exist')
          res.redirect('/')
        }
      })
      .then(() => res.redirect(`/tracker/${_id}`))
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