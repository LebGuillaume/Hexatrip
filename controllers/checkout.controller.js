const { StatusCodes } = require("http-status-codes");
const { hotelTax } = require("../helpers/data");
const Trip = require("../models/Trip");
const Order = require("../models/Order");
const strip = require("stripe");

const createStripeSession = async (req, res) => {
  try {
    // Init session stripe
    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

    //Import everything sent by the client :

    const order = req.body.order;
    const items = req.body.items;
    const token = req.body.token;

    // Fetch trip sold in the transaction from the db
    const foundTrip = await Trip.findById(items[0].id);

    // Do the transaction/payment via stripe:
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items.map((item) => {
        return {
          price_data: {
            currency: "euro",
            product_data: {
              name: foundTrip.title,
            },
            unit_amount:
              foundTrip.adultPrice * items[0].adults +
              foundTrip.youngPrice * items[0].kids +
              hotelTax,
          },
          quantity: item.quantity,
        };
      }),
      success_url:
        process.env.NODE.ENV === "production"
          ? `${process.env.CLIENT_URL_PRODUCTION}/checkout-sucess`
          : `${process.env.CLIENT_URL_LOCAL}/checkout-sucess`,

      cancel_url:
        process.env.NODE.ENV === "production"
          ? `${process.env.CLIENT_URL_PRODUCTION}/checkout`
          : `${process.env.CLIENT_URL_LOCAL}/checkout`,
    });

    //Normally , the order should be places into the DB proof of strip pauyment success
    if (!token.token) {
      await Order.create({ ...order, email: "guest@guest.com" });
    }
    await Order.create(order);

    return res.status(StatusCodes.OK).json({ url: session.url });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
module.exports = { createStripeSession };
