const express = require('express')
const router = express.Router()
const accountController = require('../controller/account')


router.get('/', accountController.getAccountDetails)


module.exports = router