import { Request, Response } from "express";
import Category from "../models/Category";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Bu kategori zaten mevcut." });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Kategoriler getirilemedi." });
  }
};
