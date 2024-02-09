const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const User = require('../model/User')
require('dotenv').config()

module.exports = {
    getConnectPaymentPrompt: async (req, res) => {
        res.render('stripe/connectpayment')
      },
    getAccountCreateForm: async( req, res) => {
        res.render('stripe/createaccount', {
            layout: 'login'
        })
    },
    createStripeAccountandUrl: async (req, res, next) => {
        try {
            let accountId = req.user.stripeAccountId;
    
            if (!accountId) {
                // User does not have a Stripe account, create one
                await User.findByIdAndUpdate(req.user.id, {
                    firstName: req.body.firstname,
                    lastName: req.body.lastname,
                    fullName: `${req.body.firstname} ${req.body.lastname}`,
                    country: req.body.country,
                });
    
                // Create a new Stripe account
                const accountParams = {
                    type: 'express',
                    country: req.body.country || undefined,
                    email: req.user.email || undefined,
                    business_type: req.body.accountType || 'individual',
                };
    
                if (accountParams.business_type === 'company') {
                    accountParams.company = {
                        name: req.user.businessName || undefined
                    };
                } else {
                    accountParams.individual = {
                        first_name: req.body.firstName || undefined,
                        last_name: req.body.lastName || undefined,
                        email: req.user.email || undefined
                    };
                }
    
                const account = await stripe.accounts.create(accountParams);
                accountId = account.id;
    
                // Update the user's Stripe account ID
                req.user.stripeAccountId = accountId;
                await req.user.save();
            }
    
            // Generate an account link for the user's Stripe account
            const accountLink = await stripe.accountLinks.create({
                account: accountId,
                refresh_url: process.env.PUBLIC_DOMAIN + '/stripe/authorize',
                return_url: process.env.PUBLIC_DOMAIN + '/stripe/onboarded',
                type: 'account_onboarding'
            });
    
            // Render the template with the account link
            res.render('stripe/connectpayment', { accountLink });
        } catch (err) {
            console.error('Failed to create or fetch Stripe account.');
            console.error(err);
            res.status(500).send('Internal Error: Could not create or fetch Stripe account');
        }
    }
    ,
    onboardUser: async (req, res) => {
        try{
            const account = await stripe.account.retrieve(req.user.stripeAccountId)

            if(account.details_submitted){
                await User.findByIdAndUpdate(req.user.id, {
                    onboardedComplete: true,
                })

                res.redirect('/feed')
            }else{
                console.log('The onboarding process was not complete')
                res.redirect('/onboarded-false')
            }

        }catch(err){
`              `
        }
    },
    getOnboardedFalse: async (req, res) => {
        res.render('stripe/onboardedfalse')
    }
}