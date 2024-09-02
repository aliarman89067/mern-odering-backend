"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const myRestaurentController_1 = __importDefault(require("../controller/myRestaurentController"));
const auth_1 = require("../middleware/auth");
const validations_1 = require("../middleware/validations");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
router.patch("/order/:orderId/status", auth_1.jwtCheck, auth_1.jwtParse, myRestaurentController_1.default.updateOrderStatus);
router.get("/orders", auth_1.jwtCheck, auth_1.jwtParse, myRestaurentController_1.default.getMyRestaurentOrders);
router.get("/", auth_1.jwtCheck, auth_1.jwtParse, myRestaurentController_1.default.getMyRestaurent);
router.post("/", upload.single("imageFile"), validations_1.validateMyRestaurentRequest, auth_1.jwtCheck, auth_1.jwtParse, myRestaurentController_1.default.createMyRestaurent);
router.put("/", upload.single("imageFile"), auth_1.jwtCheck, auth_1.jwtParse, myRestaurentController_1.default.updateMyRestaurent);
exports.default = router;
