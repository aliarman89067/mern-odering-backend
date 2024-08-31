import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationsError = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateMyUserRequests = [
  body("name").isString().notEmpty().withMessage("name must be a string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("addressLine1 must be a string"),
  body("city").isString().notEmpty().withMessage("city must be a string"),
  body("country").isString().notEmpty().withMessage("country must be a string"),
  handleValidationsError,
];
export const validateMyRestaurentRequest = [
  body("restaurentName").notEmpty().withMessage("Restaurent name is required"),
  body("city").notEmpty().withMessage("city name is required"),
  body("country").notEmpty().withMessage("country name is required"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("Delivery Price is must be a string"),
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage("Estimated delivery time is must be a positive number"),
  body("cuisines")
    .isArray()
    .withMessage("Cuisines is must be a array")
    .not()
    .isEmpty()
    .withMessage("Cuisines array cannot be empty"),
  body("menuItems").isArray().withMessage("Menu items must be a array"),
  body("menuItems.*.name")
    .notEmpty()
    .withMessage("Menu items name is required"),
  body("menuItems.*.price")
    .isFloat({ min: 0 })
    .withMessage("Menu items price must be a positive number"),
  handleValidationsError,
];
