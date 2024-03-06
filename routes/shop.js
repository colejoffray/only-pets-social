const express = require('express')
const router = express.Router()
const mainController = require('../controller/main')

router.get('/', mainController.getShop)


module.exports = router