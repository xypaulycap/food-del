import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://imafidon001:owYRTDM6cIAJuz0J@cluster0.zwtlvha.mongodb.net/food-del').then(()=>console.log("DB connected"))
}