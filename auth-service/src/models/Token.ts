import mongoose, { Schema, Document, Types } from "mongoose";

export interface IToken extends Document {
  userId: Types.ObjectId;
  token: string;
  type: "emailVerification" | "passwordReset";
  expiresAt: Date;
}

const TokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["emailVerification", "passwordReset"],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: "0s" },
  },
});

export default mongoose.model<IToken>("Token", TokenSchema);
