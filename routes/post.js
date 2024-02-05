const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const postController = require('../controller/post')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', postController.getPostForm)
router.post('/', upload.single('image'), postController.createPost)
router.put('/addLike/:id', postController.addLike)
router.put('/addComment/:id', postController.addComment)


module.exports = router

