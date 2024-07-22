//library
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

//files
import ConnectDB from "./Database/connectDb.js";
import userRoutes from "./Routes/userRoutes.js";
import postRoutes from "./Routes/postRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import { app, server } from "./Socket/socket.js";
import path from "path";
import job from "./Cron/cron.js";

//env config
dotenv.config();

//mongodb connection
ConnectDB();

//cron job
job.start();

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

//writing middleware : middleware is function which runs between request and respond

app.use(express.json({ limit: "10mb" })); //to parse json data in the request data

app.use(express.urlencoded({ extended: true, limit: "10mb" })); // to parse form data into request body

app.use(cookieParser()); // get the cookie from the request and set the cookie inside response

//routes

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

//for running both backend and frontend at same url = localhost 5000

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/Frontend/dist")));

  // react app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
