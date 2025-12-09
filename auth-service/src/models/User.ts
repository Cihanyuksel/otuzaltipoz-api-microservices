import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  fullname: string;
  role: "user" | "admin" | "moderator";
  is_active: boolean;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
  profile_img: string;
  bio?: string;
  username_change_count: number;
  last_ai_usage_date: Date;
  daily_ai_usage_count: number;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    profile_img: { type: String, default: "default.jpg" },
    bio: { type: String, default: "" },
    is_verified: { type: Boolean, default: false },
    is_active: { type: Boolean, default: false },
    username_change_count: { type: Number, default: 0 },
    last_ai_usage_date: { type: Date },
    daily_ai_usage_count: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
