import dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";

import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import subRoutes from "./routes/subs";
import miscRoutes from "./routes/misc";
import userRoutes from "./routes/users";

import trim from "./middlewares/trim";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path/posix";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);

app.use(express.static("public"));

app.use(trim);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/subs", subRoutes);
app.use("/api/misc", miscRoutes);
app.use("/api/users", userRoutes);

app.listen(process.env.PORT, async () => {
  console.log("Server Running");

  try {
    await createConnection();
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
});
