const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const stripeService = require('../services/stripe');
const User = require('../models/user');
const Subscription = require('../models/subscription');

// Get available plans (public route)
router.get('/plans', async (req, res) => {
  try {
    const plans = await stripeService.getPlans();
    res.json({
      success: true,
      plans
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Failed to get plans' });
  }
});

// Handle webhook (public route - must be before auth middleware)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Use stripeService to construct event instead of undefined 'stripe'
    event = await stripeService.constructWebhookEvent(req.body, sig);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await stripeService.handleWebhook(event);
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({ error: 'Webhook handling failed' });
  }
});

// Apply auth middleware to all routes below
router.use(auth);

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId } = req.body;
    
    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }
    
    // Get or create Stripe customer
    let user = await User.findById(req.user._id);
    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripeService.createCustomer(user);
      customerId = customer.id;
      await User.findByIdAndUpdate(req.user._id, { stripeCustomerId: customerId });
    }

    const session = await stripeService.createCheckoutSession(
      customerId,
      priceId,
      `${process.env.FRONTEND_URL}/dashboard?success=true`,
      `${process.env.FRONTEND_URL}/dashboard?canceled=true`
    );

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Get user subscription
router.get('/subscription', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });
    res.json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

// Cancel subscription
router.post('/cancel-subscription', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });
    
    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    await stripeService.cancelSubscription(subscription.stripeSubscriptionId);
    
    // Update local subscription
    subscription.status = 'cancelled';
    subscription.cancelAtPeriodEnd = true;
    await subscription.save();

    // Update user premium status
    await User.findByIdAndUpdate(req.user._id, { 
      premium: false,
      subscriptionStatus: 'cancelled'
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Create payment intent for one-time payments
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }
    
    let user = await User.findById(req.user._id);
    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripeService.createCustomer(user);
      customerId = customer.id;
      await User.findByIdAndUpdate(req.user._id, { stripeCustomerId: customerId });
    }

    const paymentIntent = await stripeService.createPaymentIntent(amount, currency, customerId);

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Get payment history
router.get('/payment-history', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.stripeCustomerId) {
      return res.json({
        success: true,
        payments: []
      });
    }

    const payments = await stripeService.getPaymentHistory(user.stripeCustomerId);
    
    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ error: 'Failed to get payment history' });
  }
});

// Update payment method
router.post('/update-payment-method', async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    
    if (!paymentMethodId) {
      return res.status(400).json({ error: 'Payment method ID is required' });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: 'No customer found' });
    }

    await stripeService.updatePaymentMethod(user.stripeCustomerId, paymentMethodId);
    
    res.json({
      success: true,
      message: 'Payment method updated successfully'
    });
  } catch (error) {
    console.error('Update payment method error:', error);
    res.status(500).json({ error: 'Failed to update payment method' });
  }
});

module.exports = router;