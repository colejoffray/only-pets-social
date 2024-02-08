const cloudinary = require('../middleware/cloudinary')
const Post = require('../model/Post')
const User = require('../model/User')


module.exports = {
    getPostForm: (req, res) => {
        res.render('post/add', { layout: 'login'})
    },
    createPost: async (req,res,next) => {
        try{
            const result = await cloudinary.uploader.upload(req.file.path, {
                width: 1080,
                height: 1080,
                crop: "fill",
            })

            await Post.create({
                title: req.body.title,
                image: result.secure_url,
                cloudinaryId: result.public_id,
                caption: req.body.caption,
                user: req.user.id,
                createdBy: req.user.userName,
                likes: 0,
            })
            console.log('Post has been added!')
            res.redirect('/feed')

        }catch(err){
            console.log(err)
        }
    },
    addLike: async (req, res) => {
        try{
            console.log(req.body)
            await Post.findByIdAndUpdate(req.body.id, 
                { $inc: { likes: 1 } }, // Increment likes count by 1
                { new: true }) // Return the updated document)
            res.json({ msg: 'Like added'})
        }catch(err){
            console.error(err)
        }
    },
    getEditProfile: async (req, res) => {
        try{
            const user = await User.findById(req.params.id).lean()
            res.render('editprofile', user)
        }catch(err){
            console.error(err)
        }
        
    },
    addComment: async (req,res) => {
        try{
            const user = await User.findById(req.user.id)


            const commentData = {
                user: req.user.id,
                userName: user.userName,
                text: req.body.comment
            }


            await Post.findByIdAndUpdate(req.params.id, {
                $push: { comments: commentData}
            })


            res.json({ msg: 'Comment Added'})

        }catch(err){
            console.error(err)
        }
    },
    deletePost: async (req, res) => {
        try{
            await Post.findByIdAndUpdate(req.params.id, {
                deleted: true
            })

            res.redirect('/profile')

        }catch(err){
            console.error(err)
        }
    }
}