import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/auth-db");
    console.log("✅ Auth Servisi MongoDB'ye bağlandı");
  } catch (error) {
    console.error("❌ MongoDB bağlantı hatası:", error);
    process.exit(1);
  }
};

export default connectDB;
