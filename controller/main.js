const User = require('../model/User')
const Post = require('../model/Post')
const axios = require('axios')

module.exports = {
    getFeed: async (req, res) => {
        try{
            const posts = await Post.find({ deleted: false}).sort({ createdAt: 'desc'}).lean()
            res.render('feed', { posts: posts})
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
    getShop: async(req, res) => {
        try{
            const params = {
                api_key: "48A1EC4CD0EE47E9B583E22256616E97",
                  type: "bestsellers",
                  amazon_domain: "amazon.com",
                  category_id: "bestsellers_pet_supplies",
                  language: "en_US"
                }

            let result = await axios.get('https://api.rainforestapi.com/request', { params })

            result = result.data.bestsellers

             console.log('Success')

            res.render('shop', {result})
        }catch(err){
            console.error(err)
        }
    }
} 