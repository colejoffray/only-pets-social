const User = require('../model/User')
const Post = require('../model/Post')

module.exports = {
    getFeed: async (req, res) => {
        try{
            const posts = await Post.find({ deleted: false}).sort({ createdAt: 'desc'}).lean()
            const users = await users.find().lean(
            
            )
        }catch(err){
            console.log(err)
        }
    },
    searchUsers: async(req, res) => {
        try{
            const query = req.query.query
            const results = await User.find({ userName: {$regex: new RegExp(query, 'i')}})
            res.json(results)
        }catch(err){
            console.error(err)
        }
    },
    getStripeAccountCreateForm: async(req, res) => {
        try{
            res.render('stripe/createaccount')

        }catch(err){
            console.error(err)
            res.status(500).json({ error: 'Internal Server Error'})
        }
    }
}