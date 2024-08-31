"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const myUserController_1 = __importDefault(require("../controller/myUserController"));
const auth_1 = require("../middleware/auth");
const validations_1 = require("../middleware/validations");
const router = express_1.default.Router();
router.get("/", auth_1.jwtCheck, auth_1.jwtParse, myUserController_1.default.getCurrentUser);
router.post("/", auth_1.jwtCheck, myUserController_1.default.createCurrentUser);
router.put("/", auth_1.jwtCheck, auth_1.jwtParse, validations_1.validateMyUserRequests, myUserController_1.default.updateCurrentUser);
exports.default = router;
