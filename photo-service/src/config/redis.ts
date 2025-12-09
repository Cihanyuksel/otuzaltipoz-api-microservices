import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("❌ Redis Hatası:", err));
redisClient.on("connect", () => console.log("✅ Redis Bağlandı"));

(async () => {
  await redisClient.connect();
})();

export default redisClient;
