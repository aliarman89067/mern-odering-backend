import { Request, Response } from "express";
import Stripe from "stripe";
import Restaurent, { MenuItemTypes } from "../model/restaurent";
import Order from "../model/order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.CLIENT_ORIGIN;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

type CheckOutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurentId: string;
};

const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;
  try {
    const sig = req.headers["stripe-signature"];
    if (!req.rawBody) {
      return res.status(400).json({ message: "Raw body error" });
    }

    event = STRIPE.webhooks.constructEvent(
      req.rawBody,
      sig as string,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }
    order.totalAmount = event.data.object.amount_total;
    order.status = "paid";
    await order.save();
  }
  res.status(200).send();
};

const createCheckOutSession = async (req: Request, res: Response) => {
  try {
    const checkOutSessionRequest: CheckOutSessionRequest = req.body;
    const restaurent = await Restaurent.findById(
      checkOutSessionRequest.restaurentId
    );
    if (!restaurent) {
      throw new Error("Restaurent not found!");
    }
    const newOrder = new Order({
      restaurent: restaurent._id,
      user: req.userId,
      status: "placed",
      deliveryDetails: checkOutSessionRequest.deliveryDetails,
      cartItems: checkOutSessionRequest.cartItems,
      createdAt: new Date(),
    });
    const lineItems = createLineItems(
      checkOutSessionRequest,
      restaurent.menuItems
    );
    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurent.deliveryPrice,
      restaurent._id.toString()
    );
    if (!session.url) {
      return res.status(500).json({ message: "Error creating stripe season" });
    }
    await newOrder.save();
    res.json({ url: session.url });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.raw.message });
  }
};

const createLineItems = (
  checkOutSessionRequest: CheckOutSessionRequest,
  menuItems: MenuItemTypes[]
) => {
  const lineItems = checkOutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );
    if (!menuItem) {
      throw new Error(`Menu item not found ${cartItem.menuItemId}`);
    }
    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "USD",
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };
    return lineItem;
  });
  return lineItems;
};
const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurentId: string
) => {
  const session = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice,
            currency: "USD",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
      restaurentId,
    },
    success_url: `${FRONTEND_URL}/order/status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restaurentId}?cancelled=true`,
  });
  return session;
};

export default {
  createCheckOutSession,
  stripeWebhookHandler,
};
