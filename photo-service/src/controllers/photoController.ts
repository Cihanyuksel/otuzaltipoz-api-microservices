import { Request, Response, NextFunction } from "express";
import Photo from "../models/Photo";
import AppError from "../utils/AppError";
import { AuthRequest } from "../middleware/auth-middleware";
import redisClient from "../config/redis";

//--------- CREATE PHOTO --------//
export const createPhoto = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      return next(new AppError("Lütfen bir fotoğraf yükleyin.", 400));
    }

    const {
      title,
      description,
      categories,
      tags,
      username,
      fullname,
      profile_img,
    } = req.body;

    const userId = req.user?.userId;
    if (!userId) {
      return next(new AppError("Yetkisiz erişim. Lütfen giriş yapın.", 401));
    }

    let parsedCategories = categories;
    let parsedTags = tags;

    try {
      if (typeof categories === "string") {
        parsedCategories = categories.startsWith("[")
          ? JSON.parse(categories)
          : [categories];
      }
    } catch (e) {
      parsedCategories = [categories];
    }

    try {
      if (typeof tags === "string") {
        parsedTags = tags.startsWith("[") ? JSON.parse(tags) : [tags];
      }
    } catch (e) {
      parsedTags = [tags];
    }

    const newPhoto = await Photo.create({
      user_id: userId,
      photo_url: req.file.path,
      title,
      description,
      categories: parsedCategories,
      tags: parsedTags,
      user_summary: {
        username: username || "unknown",
        fullname: fullname || "Unknown User",
        profile_img: profile_img || "default.jpg",
      },
    });

    const keys = await redisClient.keys("photos:page:*");

    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log("🧹 Yeni fotoğraf yüklendi, Cache temizlendi!");
    }

    res.status(201).json({
      success: true,
      message: "Fotoğraf başarıyla yüklendi!",
      photo: newPhoto,
    });
  } catch (error) {
    next(error);
  }
};

//--------- GET ALL PHOTOS --------//
export const getAllPhotos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `photos:page:${page}:limit:${limit}`;

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("⚡️ Veri Redis Cache'den geldi!");
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    console.log("🐢 Veri MongoDB'den çekiliyor...");

    const photos = await Photo.find()
      .populate("categories", "name slug")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Photo.countDocuments();

    const responseData = {
      success: true,
      count: photos.length,
      total,
      page,
      photos,
    };

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData));

    res.status(200).json(responseData);
  } catch (error) {
    next(new AppError("Fotoğraflar yüklenirken bir hata oluştu.", 500));
  }
};

//--------- GET PHOTO --------//
export const getPhotoById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const photo = await Photo.findById(req.params.id).populate(
      "categories",
      "name slug"
    );

    if (!photo) {
      return next(new AppError("Fotoğraf bulunamadı.", 404));
    }

    res.status(200).json({
      success: true,
      photo,
    });
  } catch (error) {
    next(error);
  }
};
