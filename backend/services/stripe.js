const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a customer
const createCustomer = async (user) => {
  try {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user._id.toString()
      }
    });
    return customer;
  } catch (error) {
    throw new Error('Failed to create Stripe customer: ' + error.message);
  }
};

// Create a subscription
const createSubscription = async (customerId, priceId) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
    return subscription;
  } catch (error) {
    throw new Error('Failed to create subscription: ' + error.message);
  }
};

// Create a payment intent for one-time payments
const createPaymentIntent = async (amount, currency = 'usd', customerId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent;
  } catch (error) {
    throw new Error('Failed to create payment intent: ' + error.message);
  }
};

// Get subscription details
const getSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    throw new Error('Failed to retrieve subscription: ' + error.message);
  }
};

// Cancel subscription
const cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    throw new Error('Failed to cancel subscription: ' + error.message);
  }
};

// Update subscription
const updateSubscription = async (subscriptionId, priceId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: priceId,
      }],
    });
    return updatedSubscription;
  } catch (error) {
    throw new Error('Failed to update subscription: ' + error.message);
  }
};

// Create checkout session for subscription
const createCheckoutSession = async (customerId, priceId, successUrl, cancelUrl) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return session;
  } catch (error) {
    throw new Error('Failed to create checkout session: ' + error.message);
  }
};

// Handle webhook events
const handleWebhook = async (event) => {
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        // Handle subscription creation
        console.log('Subscription created:', event.data.object.id);
        break;
      case 'customer.subscription.updated':
        // Handle subscription updates
        console.log('Subscription updated:', event.data.object.id);
        break;
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        console.log('Subscription cancelled:', event.data.object.id);
        break;
      case 'invoice.payment_succeeded':
        // Handle successful payment
        console.log('Payment succeeded:', event.data.object.id);
        break;
      case 'invoice.payment_failed':
        // Handle failed payment
        console.log('Payment failed:', event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    throw new Error('Failed to handle webhook: ' + error.message);
  }
};

// Get available plans
const getPlans = async () => {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });
    return prices.data;
  } catch (error) {
    throw new Error('Failed to retrieve plans: ' + error.message);
  }
};

module.exports = {
  createCustomer,
  createSubscription,
  createPaymentIntent,
  getSubscription,
  cancelSubscription,
  updateSubscription,
  createCheckoutSession,
  handleWebhook,
  getPlans
}; 