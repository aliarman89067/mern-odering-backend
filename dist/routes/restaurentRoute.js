"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const restaurentController_1 = __importDefault(require("../controller/restaurentController"));
const router = express_1.default.Router();
router.get("/:restaurentId", (0, express_validator_1.param)("restaurentId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Restaurent Id must be a valid string"), restaurentController_1.default.getRestaurent);
router.get("/search/:city", (0, express_validator_1.param)("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must be a valid string."), restaurentController_1.default.searchRestaurent);
exports.default = router;
