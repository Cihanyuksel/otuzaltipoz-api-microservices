import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, "Kategori adı zorunludur."],
    trim: true,
    unique: true,
    maxlength: [50, "Kategori adı en fazla 50 karakter olabilir."],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, "Açıklama en fazla 200 karakter olabilir."],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

categorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }
  this.updated_at = new Date();
});

const Category = model<ICategory>("Category", categorySchema);

export default Category;
