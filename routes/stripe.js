const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const mainController = require('../controller/main')


router.get('/create-account', mainController.getStripeAccountCreateForm)

router.post('/create-account', async(req, res) => {
    try{


    }catch(err){
        console.error('Error creating stripe account', err.message)
        res.status(500).json({ err: 'Internal service error'})
    }
})


router.get('/connect-payment', async (req, res) => {
  res.render('stripe/connectpayment')
})


module.exports = router