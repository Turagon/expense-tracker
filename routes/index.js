const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const tracker = require('./modules/operate')
const auth = require('./modules/auth')

router.use('/', home)
router.use('/tracker', tracker)
router.use('/auth', auth)

module.exports = router