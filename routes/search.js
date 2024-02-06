const User = require('../model/User')
const Post = require('../model/Post')
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const router = require('express').Router()
const mainController = require('../controller/main')

router.get('/users', ensureAuth, mainController.searchUsers)

module.exports = router