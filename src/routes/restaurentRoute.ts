import express from "express";
import { param } from "express-validator";
import restaurentController from "../controller/restaurentController";

const router = express.Router();
router.get(
  "/:restaurentId",
  param("restaurentId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Restaurent Id must be a valid string"),
  restaurentController.getRestaurent
);
router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must be a valid string."),
  restaurentController.searchRestaurent
);

export default router;
