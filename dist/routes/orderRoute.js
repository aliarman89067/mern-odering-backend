"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const orderController_1 = __importDefault(require("../controller/orderController"));
const router = express_1.default.Router();
router.post("/checkout/create-checkout-session", auth_1.jwtCheck, auth_1.jwtParse, orderController_1.default.createCheckOutSession);
router.post("/checkout/webhook", orderController_1.default.stripeWebhookHandler);
exports.default = router;
