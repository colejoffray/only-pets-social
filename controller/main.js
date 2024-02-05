const User = require('../model/User')
const Post = require('../model/Post')

module.exports = {
    getFeed: async (req, res) => {
        try{
            const posts = await Post.find().sort({ createdAt: 'desc'}).lean()
            res.render('feed', {posts: posts} )
        }catch(err){
            console.log(err)
        }
    }
}