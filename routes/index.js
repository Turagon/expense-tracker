const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const tracker = require('./modules/tracker')
const auth = require('./modules/auth')

router.use('/auth', auth)
router.use('/', home)
router.use('/tracker', tracker)

module.exports = router