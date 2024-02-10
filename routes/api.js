const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const User = require('../model/User')
const router = require('express').Router()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

router.use(bodyParser.raw({ type: 'application/json' }))

const webhookSecret = process.env.WEBHOOK_SECRET

router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const rawBody = req.body; // Access raw request body

    let event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const checkoutSession = event.data.object;
            // Extract relevant information from the checkout session
            const { payment_status, metadata} = checkoutSession;
            const clientReferenceID = metadata.client_reference_id
            // Check if the payment is successful
            if (payment_status === 'paid') {
                try {
                    // Find the user being subscribed to using the client reference ID
                    const subscribedUser = await User.findById(clientReferenceID);

                    console.log(subscribedUser.stripeAccountId);

                    if (subscribedUser) {
                        // Transfer funds to the subscribed user's account
                        const transfer = await stripe.transfers.create({
                            amount: 500, // Amount to transfer (adjust as needed)
                            currency: 'usd',
                            destination: subscribedUser.stripeAccountId,
                            // Add any other transfer parameters as needed
                        });
                        // Handle transfer success or failure
                        console.log('Funds transferred successfully:', transfer);
                    } else {
                        console.error('Subscribed user not found');
                        res.status(404).send('Subscribed user not found');
                    }
                } catch (error) {
                    console.error('Error transferring funds:', error);
                    res.status(500).send('Error transferring funds');
                }
            } else {
                console.error('Payment not successful');
                res.status(400).send('Payment not successful');
            }
            break;
        // Add other event types you want to handle
        default:
            console.log(`Unhandled event type ${event.type}`);
            res.status(200).json({ received: true }); // Return a response to acknowledge receipt of the event
    }
});

  


module.exports = router
