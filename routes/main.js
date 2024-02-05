const express = require('express')
const router = express.Router()
const authController = require('../controller/auth')
const mainController = require('../controller/main')
const passport = require('passport')
const Post = require('../model/Post')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', ensureGuest, authController.getLoginPage)
router.get('/signup', authController.getSignupPage)
router.post('/signup', authController.postSignup)
router.post('/login',  authController.postLogin)
router.get('/logout', ensureAuth, authController.logoutUser)
router.get('/feed', ensureAuth, mainController.getFeed)



module.exports = router