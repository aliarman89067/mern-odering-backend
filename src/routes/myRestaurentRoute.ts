import express from "express";
import multer from "multer";
import myRestaurentController from "../controller/myRestaurentController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurentRequest } from "../middleware/validations";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get("/", jwtCheck, jwtParse, myRestaurentController.getMyRestaurent);

router.post(
  "/",
  upload.single("imageFile"),
  validateMyRestaurentRequest,
  jwtCheck,
  jwtParse,
  myRestaurentController.createMyRestaurent
);

router.put(
  "/",
  upload.single("imageFile"),
  jwtCheck,
  jwtParse,
  myRestaurentController.updateMyRestaurent
);

export default router;
