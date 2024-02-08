const User = require('../model/User')

module.exports = {
    getAccountDetails: async(req, res) => {
        try{
            const user = await User.findById(req.user.id).lean()
            console.log(user)
            res.render('accountsettings', { user: user})
        }catch(err){
            console.error(err)
        }
      
    }
}