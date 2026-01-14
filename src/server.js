import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors()); 
app.use(express.json());

app.get("/", (req, res) => res.send("API OK ✅"));

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("🚀 Server running:", process.env.PORT || 5000);
});
