const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const tracker = require('./modules/operate')

router.use('/', home)
router.use('/tracker', tracker)

module.exports = router