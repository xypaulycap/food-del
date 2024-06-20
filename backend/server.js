import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

console.log('Environment Variables:', process.env.PORT, process.env.MONGO_URI);

//app config
const app = express();
const port = process.env.PORT || 4000;

console.log('Starting server...');
console.log('Port:', process.env.PORT);


//middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

//Api endpoint
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
