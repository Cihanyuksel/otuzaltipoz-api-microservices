import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRefreshToken extends Document {
  userId: Types.ObjectId;
  token: string;
  createdAt: Date;
}

const RefreshTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d",
  },
});

export default mongoose.model<IRefreshToken>(
  "RefreshToken",
  RefreshTokenSchema
);
