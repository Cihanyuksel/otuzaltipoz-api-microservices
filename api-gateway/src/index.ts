import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import proxy from "express-http-proxy";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/v1/auth", proxy("http://127.0.0.1:3001"));
app.use(
  "/api/v1/photos",
  proxy("http://127.0.0.1:3002", {
    limit: "10mb",
  })
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "API Gateway  Çalışıyor" });
});

app.listen(PORT, () => {
  console.log(`Gateway ${PORT} portunda`);
});
