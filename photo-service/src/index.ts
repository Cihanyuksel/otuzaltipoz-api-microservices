import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import errorHandler from "./middleware/error-handler";
import photoRouter from "./routes/photo-routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
connectDB();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ message: "Photo Service: Sistem aktif ve çalışıyor!" });
});

app.use("/", photoRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Photo Service ${PORT} portunda çalışıyor 📸`);
});
