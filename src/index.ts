import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import myUserRoute from "./routes/myUserRoute";
import myRestaurentRoute from "./routes/myRestaurentRoute";
import { v2 as cloudinary } from "cloudinary";
import restaurentRoute from "./routes/restaurentRoute";
import orderRoute from "./routes/orderRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Database connected!"));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
if (!CLIENT_ORIGIN) {
  console.log("Client origin not found!");
}
app.use(cors({ origin: CLIENT_ORIGIN }));

app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));

app.use(express.json());
app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurent", myRestaurentRoute);
app.use("/api/restaurent", restaurentRoute);
app.use("/api/order", orderRoute);

app.get("/test", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});
