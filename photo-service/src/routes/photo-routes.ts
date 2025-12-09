import { Router } from "express";
import { upload } from "../config/cloudinary";
import {
  createPhoto,
  getAllPhotos,
  getPhotoById,
} from "../controllers/photoController";
import {
  createCategory,
  getAllCategories,
} from "../controllers/categoryController";
import { protect, restrictTo } from "../middleware/auth-middleware";

const router = Router();

router.post(
  "/categories",
  protect,
  restrictTo("admin", "moderator"),
  createCategory
);
router.get("/categories", getAllCategories);

router.get("/", getAllPhotos);
router.post("/", protect, upload.single("image"), createPhoto);
router.get("/:id", getPhotoById);

export default router;
