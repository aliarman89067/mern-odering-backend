"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const myUserRoute_1 = __importDefault(require("./routes/myUserRoute"));
const myRestaurentRoute_1 = __importDefault(require("./routes/myRestaurentRoute"));
const cloudinary_1 = require("cloudinary");
const restaurentRoute_1 = __importDefault(require("./routes/restaurentRoute"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
mongoose_1.default
    .connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log("Database connected!"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = (0, express_1.default)();
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
if (!CLIENT_ORIGIN) {
    console.log("Client origin not found!");
}
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "*" }));
app.use("/api/order/checkout/webhook", express_1.default.raw({ type: "*/*" }));
app.use("/api/my/user", myUserRoute_1.default);
app.use("/api/my/restaurent", myRestaurentRoute_1.default);
app.use("/api/restaurent", restaurentRoute_1.default);
app.use("/api/order", orderRoute_1.default);
app.get("/test", (req, res) => {
    res.send("Hello World");
});
app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});
