// File: backend/index.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./connection.js";
import userRouter from "./router/userRouter.js";
import websiteRouter from "./router/websiteRouter.js";
import bugRouter from "./router/bugRouter.js"; 
import cors from "cors";


const app = express();

const corsOptions = {
  origin: 'https://bughead-green.vercel.app', 
  optionsSuccessStatus: 200 
};

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRouter);
app.use("/user", userRouter);
app.use("/api/websites", websiteRouter);
app.use("/api/bugs", bugRouter); 
app.get("/", (req, res) => {
  res.send("Welcome to the Bughead API");
});

app.use(express.static("static"));

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
