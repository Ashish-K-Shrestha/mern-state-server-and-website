 import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Conneted to MongoDB");
 }).catch((err) => {
    console.log("Error:"+err);
 });


 const app = express();

 app.listen(3000, () => {
    console.log("Server is running on port 3000 !!");
 }); 

 app.get("/", (req, res) => {
   res.send("Hello World");
 });
