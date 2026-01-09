const { StatusCodes } = require("http-status-codes");
const { hotelTax } = require("../helpers/data");
const Trip = require("../models/Trip");
const Order = require("../models/Order");
const Stripe = require("stripe");

const createStripeSession = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

    const { order, items, token } = req.body;

    if (!items?.length || !items[0]?.id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid items payload" });
    }

    const foundTrip = await Trip.findById(items[0].id);
    if (!foundTrip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    const adults = Number(items[0].adults ?? 0);
    const kids = Number(items[0].kids ?? 0);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: foundTrip.title },
            unit_amount:
              foundTrip.adultPrice * adults +
              foundTrip.youngPrice * kids +
              hotelTax,
          },
          quantity: 1,
        },
      ],
      success_url:
        process.env.NODE_ENV === "production"
          ? `${process.env.CLIENT_URL_PROD}/checkout-success`
          : `${process.env.CLIENT_URL_LOCAL}/checkout-success`,
      cancel_url:
        process.env.NODE_ENV === "production"
          ? `${process.env.CLIENT_URL_PROD}/checkout`
          : `${process.env.CLIENT_URL_LOCAL}/checkout`,
    });

    if (!token || !token.token) {
      await Order.create({ ...order, email: "guest@guest.com" });
    } else {
      await Order.create(order);
    }

    return res.status(StatusCodes.OK).json({ url: session.url });
  } catch (error) {
    console.log("createStripeSession error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = { createStripeSession };
