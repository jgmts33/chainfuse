/* eslint-disable */
const express = require("express");
const app = express();
const cors = require("cors");
const Web3 = require("web3");
const sockets = require("./socket.js");
const http = require("http").Server(app);

const stripe = require("stripe")("sk_test_YuZkAhkFBX33A5b9XSXtqK57");
const endpointSecret = "whsec_dVpaXgc35UI3lteL1G5wgKK1pOcrzrxr";

app.use(express.static("public"));
app.use(
  "/webhook",
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.json());
app.use(cors());

// Create socket server.
sockets.createSocketServer(http);

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

const chargeCustomer = async (customerId) => {
  // Lookup the payment methods available for the customer
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });
  try {
    // Charge the customer and payment method immediately
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethods.data[0].id,
      off_session: true,
      confirm: true,
    });
  } catch (err) {
    // Error code will be authentication_required if authentication is needed
    console.log("Error code is: ", err.code);
    const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(
      err.raw.payment_intent.id
    );
    console.log("PI retrieved: ", paymentIntentRetrieved.id);
  }
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Alternatively, set up a webhook to listen for the payment_intent.succeeded event
  // and attach the PaymentMethod to a new Customer
  const customer = await stripe.customers.create();

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    customer: customer.id,
    setup_future_usage: "off_session",
    amount: calculateOrderAmount(items),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.post("/webhook", (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.log("Error!", err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    // Occurs when a PaymentIntent has successfully completed payment.
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded

      console.log("paymentIntent", paymentIntent);

      // Mint NFT
      // Store NFT in wallet
      // Send email to customer
      // Send email to admin
      // Send email to artist
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 res to acknowledge receipt of the event
  res.status(200).send({ received: true });
});

app.get("/api/web3/getBalance", async (req, res) => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://rinkeby.infura.io/v3/8bbec9c2dcc14a7586bed7395f375726"
    )
  );

  const balance = await web3.eth.getBalance(req.body.address);

  res.status(200).send({
    balance: web3.utils.fromWei(balance, "ether"),
  });
});

http.listen(8080, () => console.log("Node server listening on port 8080!"));
