import { Request, Response, Express } from "express";
import Restaurent from "../model/restaurent";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

const getMyRestaurent = async (req: Request, res: Response) => {
  try {
    const findRestaurent = await Restaurent.findOne({ user: req.userId });
    if (!findRestaurent) {
      return res.status(404).json({ message: "Restaurent not found" });
    }
    res.status(200).send(findRestaurent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while fetching restaurent data" });
  }
};

const createMyRestaurent = async (req: Request, res: Response) => {
  try {
    const existingRestaurent = await Restaurent.findOne({ user: req.userId });
    if (existingRestaurent) {
      return res.status(409).json({ message: "User restaurent already exist" });
    }
    const imageUrl = await uploadToCloudinary(req.file as Express.Multer.File);
    const restaurent = new Restaurent(req.body);
    restaurent.imageUrl = imageUrl;
    restaurent.user = new mongoose.Types.ObjectId(req.userId);
    restaurent.lastUpdated = new Date();
    await restaurent.save();
    res.status(201).send(restaurent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const updateMyRestaurent = async (req: Request, res: Response) => {
  try {
    const restaurent = await Restaurent.findOne({ user: req.userId });
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
      const imageUrl = await uploadToCloudinary(
        req.file as Express.Multer.File
      );
      restaurent.imageUrl = imageUrl;
    }
    await restaurent.save();
    res.status(200).send(restaurent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
const uploadToCloudinary = async (file: Express.Multer.File) => {
  const base64Image = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${file.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};
export default {
  getMyRestaurent,
  createMyRestaurent,
  updateMyRestaurent,
};
