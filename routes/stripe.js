const express = require('express')
const router = express.Router()
const stripeController = require('../controller/stripe')
const { ensureAuth } = require('../middleware/auth')


router.get('/connect-payment', ensureAuth, stripeController.getConnectPaymentPrompt)

router.get('/account-create', ensureAuth, stripeController.getAccountCreateForm)

router.get('/onboarded', ensureAuth, stripeController.onboardUser)

router.get('/onboarded-false', ensureAuth, stripeController.getOnboardedFalse)

router.post('/authorize', ensureAuth, stripeController.createStripeAccountandUrl)


module.exports = router