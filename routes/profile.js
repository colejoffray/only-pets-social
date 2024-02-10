const express = require('express')
const router = express.Router()
const profileController = require('../controller/profile')
const upload = require('../middleware/multer')
const passport = require('passport')
const Post = require('../model/Post')
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const methodOverride = require('method-override')

router.use(methodOverride('_method'))

const multerMiddleware = upload.single('image')

router.get('/', ensureAuth, profileController.getProfile)
router.get('/edit/:id', ensureAuth, profileController.getEditProfile)
router.get('/:id', ensureAuth, profileController.getCommenterProfile)
router.put('/follow/:id', ensureAuth, profileController.followUser)
router.post('/subscribe/:id', ensureAuth, profileController.subscribeToUser)
router.post('/edit/:id', ensureAuth, multerMiddleware,  profileController.editProfile)
router.post('/account/edit/:id', ensureAuth, multerMiddleware, profileController.editProfile)
router.delete('/deactivate/:id', ensureAuth, profileController.deactivateUser)



module.exports = router