import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db";
import errorHandler from "./middleware/errorHandler";
import authRouter from "./routes/auth-routes";
import cookieParser from "cookie-parser"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Auth Service Buradasın! 👋" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Auth Service ${PORT} portunda çalışıyor 🔒`);
});
