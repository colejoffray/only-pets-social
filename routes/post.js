const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const postController = require('../controller/post')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', ensureAuth, postController.getPostForm)
router.post('/', upload.single('image'), postController.createPost)
router.put('/addLike/:id', ensureAuth, postController.addLike)
router.put('/addComment/:id',ensureAuth, postController.addComment)
router.put('/delete/:id', ensureAuth, postController.deletePost)


module.exports = router

