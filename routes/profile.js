const express = require('express')
const router = express.Router()
const profileController = require('../controller/profile')
const upload = require('../middleware/multer')
const passport = require('passport')
const Post = require('../model/Post')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const multerMiddleware = upload.single('image')

router.get('/', ensureAuth, profileController.getProfile)
router.get('/edit/:id', ensureAuth, profileController.getEditProfile)
router.get('/:id', ensureAuth, profileController.getCommenterProfile)
router.put('/follow/:id', ensureAuth, profileController.followUser)
router.post('/edit/:id', ensureAuth, (req,res,next) => {
    if(req.file){
        multerMiddleware(req,res,next)
    }
    next()
}, profileController.editProfile)
router.put('/test', ensureAuth, profileController.test)



module.exports = router