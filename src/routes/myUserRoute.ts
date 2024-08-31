import express from "express";
import myUserController from "../controller/myUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequests } from "../middleware/validations";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, myUserController.getCurrentUser);
router.post("/", jwtCheck, myUserController.createCurrentUser);
router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateMyUserRequests,
  myUserController.updateCurrentUser
);

export default router;
