import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import orderController from "../controller/orderController";

const router = express.Router();
router.get("/", jwtCheck, jwtParse, orderController.getMyOrders);
router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  orderController.createCheckOutSession
);
router.post("/checkout/webhook", orderController.stripeWebhookHandler);
export default router;
