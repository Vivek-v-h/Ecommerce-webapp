import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"
import userRoute from "./routes/users.js"
import authRoute from "./routes/auth.js"
import productRoute from "./routes/product.js"
import cartRoute from "./routes/cart.js"
import orderRoute from "./routes/order.js"
import stripeRoute from "./routes/stripe.js"

const app = express();
app.use(cors());

dotenv.config();

mongoose
  .connect(
    process.env.MONGOURL
  )
  .then(() => console.log("Db connected"))
  .catch((err) => {
    console.log(err);
});

app.use(express.json())

app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/products",productRoute)
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});
