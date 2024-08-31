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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMyRestaurentRequest = exports.validateMyUserRequests = void 0;
const express_validator_1 = require("express-validator");
const handleValidationsError = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
});
exports.validateMyUserRequests = [
    (0, express_validator_1.body)("name").isString().notEmpty().withMessage("name must be a string"),
    (0, express_validator_1.body)("addressLine1")
        .isString()
        .notEmpty()
        .withMessage("addressLine1 must be a string"),
    (0, express_validator_1.body)("city").isString().notEmpty().withMessage("city must be a string"),
    (0, express_validator_1.body)("country").isString().notEmpty().withMessage("country must be a string"),
    handleValidationsError,
];
exports.validateMyRestaurentRequest = [
    (0, express_validator_1.body)("restaurentName").notEmpty().withMessage("Restaurent name is required"),
    (0, express_validator_1.body)("city").notEmpty().withMessage("city name is required"),
    (0, express_validator_1.body)("country").notEmpty().withMessage("country name is required"),
    (0, express_validator_1.body)("deliveryPrice")
        .isFloat({ min: 0 })
        .withMessage("Delivery Price is must be a string"),
    (0, express_validator_1.body)("estimatedDeliveryTime")
        .isInt({ min: 0 })
        .withMessage("Estimated delivery time is must be a positive number"),
    (0, express_validator_1.body)("cuisines")
        .isArray()
        .withMessage("Cuisines is must be a array")
        .not()
        .isEmpty()
        .withMessage("Cuisines array cannot be empty"),
    (0, express_validator_1.body)("menuItems").isArray().withMessage("Menu items must be a array"),
    (0, express_validator_1.body)("menuItems.*.name")
        .notEmpty()
        .withMessage("Menu items name is required"),
    (0, express_validator_1.body)("menuItems.*.price")
        .isFloat({ min: 0 })
        .withMessage("Menu items price must be a positive number"),
    handleValidationsError,
];
