import { Schema, model, Types, Document } from "mongoose";

interface IPhoto extends Document {
  user_id: Types.ObjectId;
  photo_url: string;
  title: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  tags?: string[];
  categories: Types.ObjectId[];
  user_summary: {
    username: string;
    fullname: string;
    profile_img: string;
  };
}

const photoSchema = new Schema<IPhoto>({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  user_summary: {
    username: { type: String, required: true },
    fullname: { type: String, required: true },
    profile_img: { type: String, default: "default.jpg" },
  },
  photo_url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Başlık en az 3 karakter olmalıdır."],
    maxlength: [50, "Başlık en fazla 50 karakter olmalıdır."],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [400, "Açıklama en fazla 400 karakter olmalıdır."],
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    default: [],
  },
  categories: {
    type: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    required: [true, "En az bir kategori seçmelisiniz."],
    validate: {
      validator: function (v: Types.ObjectId[]) {
        return v && v.length >= 1 && v.length <= 3;
      },
      message: "Her fotoğraf en az 1, en fazla 3 kategori içermelidir.",
    },
  },
});

photoSchema.pre("save", async function () {
  this.updated_at = new Date();
});

photoSchema.pre("findOneAndUpdate", async function () {
  this.set({ updated_at: new Date() });
});

photoSchema.index({ user_id: 1, created_at: -1 });
photoSchema.index({ categories: 1 });
photoSchema.index({ title: "text" });

const Photo = model<IPhoto>("Photo", photoSchema);

export default Photo;
