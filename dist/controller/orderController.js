"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const restaurent_1 = __importDefault(require("../model/restaurent"));
const order_1 = __importDefault(require("../model/order"));
const STRIPE = new stripe_1.default(process.env.STRIPE_API_KEY);
const FRONTEND_URL = process.env.CLIENT_ORIGIN;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.default.find({ user: req.userId })
            .populate("user")
            .populate("restaurent");
        res.json(orders);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
const stripeWebhookHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let event;
    try {
        const sig = req.headers["stripe-signature"];
        if (!req.rawBody) {
            return res.status(400).json({ message: "Raw body error" });
        }
        event = STRIPE.webhooks.constructEvent(req.rawBody, sig, STRIPE_WEBHOOK_SECRET);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }
    if (event.type === "checkout.session.completed") {
        const order = yield order_1.default.findById((_a = event.data.object.metadata) === null || _a === void 0 ? void 0 : _a.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found!" });
        }
        order.totalAmount = event.data.object.amount_total;
        order.status = "paid";
        yield order.save();
    }
    res.status(200).send();
});
const createCheckOutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkOutSessionRequest = req.body;
        const restaurent = yield restaurent_1.default.findById(checkOutSessionRequest.restaurentId);
        if (!restaurent) {
            throw new Error("Restaurent not found!");
        }
        const newOrder = new order_1.default({
            restaurent: restaurent._id,
            user: req.userId,
            status: "placed",
            deliveryDetails: checkOutSessionRequest.deliveryDetails,
            cartItems: checkOutSessionRequest.cartItems,
            createdAt: new Date(),
        });
        const lineItems = createLineItems(checkOutSessionRequest, restaurent.menuItems);
        const session = yield createSession(lineItems, newOrder._id.toString(), restaurent.deliveryPrice, restaurent._id.toString());
        if (!session.url) {
            return res.status(500).json({ message: "Error creating stripe season" });
        }
        yield newOrder.save();
        res.json({ url: session.url });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.raw.message });
    }
});
const createLineItems = (checkOutSessionRequest, menuItems) => {
    const lineItems = checkOutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item) => item._id.toString() === cartItem.menuItemId.toString());
        if (!menuItem) {
            throw new Error(`Menu item not found ${cartItem.menuItemId}`);
        }
        const lineItem = {
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
const createSession = (lineItems, orderId, deliveryPrice, restaurentId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield STRIPE.checkout.sessions.create({
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
});
exports.default = {
    getMyOrders,
    createCheckOutSession,
    stripeWebhookHandler,
};
