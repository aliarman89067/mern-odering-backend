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
const restaurent_1 = __importDefault(require("../model/restaurent"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const mongoose_1 = __importDefault(require("mongoose"));
const order_1 = __importDefault(require("../model/order"));
const getMyRestaurent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findRestaurent = yield restaurent_1.default.findOne({ user: req.userId });
        if (!findRestaurent) {
            return res.status(404).json({ message: "Restaurent not found" });
        }
        res.status(200).send(findRestaurent);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while fetching restaurent data" });
    }
});
const createMyRestaurent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingRestaurent = yield restaurent_1.default.findOne({ user: req.userId });
        if (existingRestaurent) {
            return res.status(409).json({ message: "User restaurent already exist" });
        }
        const imageUrl = yield uploadToCloudinary(req.file);
        const restaurent = new restaurent_1.default(req.body);
        restaurent.imageUrl = imageUrl;
        restaurent.user = new mongoose_1.default.Types.ObjectId(req.userId);
        restaurent.lastUpdated = new Date();
        yield restaurent.save();
        res.status(201).send(restaurent);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
const updateMyRestaurent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurent = yield restaurent_1.default.findOne({ user: req.userId });
        if (!restaurent) {
            return res.status(404).json({ message: "Restaurent not found" });
        }
        restaurent.restaurentName = req.body.restaurentName;
        restaurent.city = req.body.city;
        restaurent.country = req.body.country;
        restaurent.deliveryPrice = req.body.deliveryPrice;
        restaurent.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
        restaurent.cuisines = req.body.cuisines;
        restaurent.menuItems = req.body.menuItems;
        restaurent.lastUpdated = new Date();
        if (req.file) {
            const imageUrl = yield uploadToCloudinary(req.file);
            restaurent.imageUrl = imageUrl;
        }
        yield restaurent.save();
        res.status(200).send(restaurent);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const base64Image = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64Image}`;
    const uploadResponse = yield cloudinary_1.default.v2.uploader.upload(dataURI);
    return uploadResponse.url;
});
const getMyRestaurentOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurent = yield restaurent_1.default.findOne({ user: req.userId });
        if (!restaurent) {
            return res.status(404).json({ message: "Restaurant not fount" });
        }
        const orders = yield order_1.default.find({ restaurent: restaurent._id })
            .populate("restaurent")
            .populate("user");
        res.json(orders);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = yield order_1.default.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        const restaurent = yield restaurent_1.default.findById(order.restaurent);
        if (((_a = restaurent === null || restaurent === void 0 ? void 0 : restaurent.user) === null || _a === void 0 ? void 0 : _a._id.toString()) !== req.userId) {
            res.status(401).send();
        }
        order.status = status;
        yield order.save();
        res.status(200).json(order);
    }
    catch (error) {
        console.log(error);
        throw new Error("Something went wrong");
    }
});
exports.default = {
    getMyRestaurentOrders,
    getMyRestaurent,
    createMyRestaurent,
    updateMyRestaurent,
    updateOrderStatus,
};
