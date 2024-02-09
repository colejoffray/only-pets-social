const User = require('../model/User')
const Post = require('../model/Post')
const cloudinary = require('../middleware/cloudinary')

module.exports = {
    getProfile: async(req, res, next) => {
        try{
            const userPosts = await Post.find({ user: req.user.id, deleted: false }).lean()

            const userProf = await User.findById(req.user.id).lean()

            res.render('profile', { 
                posts: userPosts, user: userProf})

        }catch(err){
            console.log(err)
        }
        
    },
    getEditProfile: async (req, res, next) => {
        const user = await User.findById(req.user.id).lean()
        res.render('editprofile', { 
            user })
    },
    editProfile: async(req,res) => {
        console.log(req)
        try{
            let profilePicURL
            let cloudinaryString

            if(req.file){
                const result = await cloudinary.uploader.upload(req.file.path)
                profilePicURL = result.secure_url
                cloudinaryString = result.public_id

            }else {
                const user = await User.findById(req.params.id);
                profilePicUrl = user.profilePic;
                cloudinaryString = user.cloudinaryId
            }

            await User.findByIdAndUpdate(req.params.id, {
                cloudinaryId: cloudinaryString,
                profilePic: profilePicURL,
                bio: req.body.bio,
                userName: req.body.username
            })

            req.url === `/edit/${req.user.id}` ? res.redirect('/profile') : res.redirect('/account')

        }catch(err){
            console.error(err)
             res.status(500).send('Internal Server Error');
        }
    },
    getCommenterProfile: async(req,res) => {
        try{
            //user sending the request
            const activeUser = req.user.id

            //user who is being displayed
            const user = await User.findById(req.params.id).lean()

            //user who is being displayed's posts
            const userPosts = await Post.find({ user: req.params.id, deleted: false}).lean()

            //user who is being displayed's id
            const userID = user._id.toString()

            if(req.user.id === userID){
                res.redirect('/profile')
            }
        
            const following = []
            user.followedBy.forEach(account => following.push(account.user.toString()))

            res.render('userprofile',{
                user, userPosts, following, activeUser
            } )



        }catch(err){
            console.error(err)
        }
    },
    followUser: async (req, res) => {
        try {
            const userBeingFollowed = req.params.id;
            const userDoingTheFollowing = await User.findById(req.user.id).lean();
    
            const data = {
                user: userDoingTheFollowing._id,
                userName: userDoingTheFollowing.userName
            };
    
            const targetUser = await User.findById(userBeingFollowed);
    
            if (targetUser.followedBy.some(follower => follower.user.equals(userDoingTheFollowing._id))) {
                // User is already being followed, unfollow
                await User.findByIdAndUpdate(userBeingFollowed, {
                    $pull: { followedBy: { user: userDoingTheFollowing._id } }
                });
                res.json({ msg: 'You just unfollowed someone!' });
            } else {
                // User is not being followed, follow
                await User.findByIdAndUpdate(userBeingFollowed, {
                    $push: { followedBy: data }
                });
                res.json({ msg: 'You just followed someone!' });
            }
    
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    deactivateUser : async (req, res) => {
        try{ 
            await Post.updateMany({ user: req.params.id }, { $set: { deleted: true } });
            await User.findByIdAndDelete(req.params.id)

            console.log('User Successfully Deleted')

            res.redirect('/')

        }catch (err){
            // Handle errors
            console.error(err);
            res.status(500).send('Error deactivating user.');
        }
    }
}