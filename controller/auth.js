const passport = require('passport')
const User = require('../model/User')
const validator = require('validator')

module.exports = {
    getLoginPage: (req,res,next) => {
        res.render('login', {layout: 'login'})
    },
    postLogin: (req, res, next) => {
      // Using middleware to authenticate with the 'local' strategy
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          return next(err); // Pass any errors to the next middleware
        }
    
        // If no user is found or if authentication fails
        if (!user) {
          req.flash('error', { msg: 'Invalid username or password.' });
          return res.redirect('/'); // Redirect to login page on failure
        }
    
        // If authentication is successful, log in the user
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          // Redirect to the user's profile page
          res.redirect('/feed')
        });
      })(req, res, next);
    },
    getSignupPage: (req,res,next) => {
        res.render('signup', {layout: 'login'})
    },
    postSignup: async (req,res,next) => {
        try{
            // const validationErrors = [];
            // if (!validator.isEmail(req.body.email))
            //   validationErrors.push({ msg: "Please enter a valid email address." });
            // if (!validator.isLength(req.body.password, { min: 8 }))
            //   validationErrors.push({
            //     msg: "Password must be at least 8 characters long",
            //   });
            // if (req.body.password !== req.body.confirmPassword)
            //   validationErrors.push({ msg: "Passwords do not match" });
          
            // if (validationErrors.length) {
            //   console.log(validationErrors)
            //   req.flash("errors", validationErrors);
            //   res.redirect("/signup");
            // }

            const user = new User({
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                fullName: `${req.body.firstname} ${req.body.lastname}`,
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
              });

              try {
                const existingUser = await User.findOne({
                  $or: [{ email: req.body.email }, { userName: req.body.userName }]
                });
              
                if (existingUser) {
                  req.flash('errors', { msg: 'Account with that email address or username already exists.' });
                  res.redirect('/signup');
                }
              } catch (err) {
                next(err);
              }

             try{
                await user.save()
             }catch(err){
                console.error(err)
             }

             req.logIn(user, (err) => {
                if (err) {
                  return next(err);
                }
                res.redirect('/stripe/connect-payment');
              })
            

        }catch(err){
            console.error(err)

        }
    },
    logoutUser: (req, res) => {
      req.logout(function(err){
          if(err) return (next(err))
          res.redirect('/')
      })
  }
}