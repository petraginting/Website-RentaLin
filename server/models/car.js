import mongoose from "mongoose";
import Product from "./products.js";

const Car = Product.discriminator(
  "Mobil",
  new mongoose.Schema(
    {
      transmission: {
        type: String,
        enum: ["Manual", "Automatic", "Semi-Automatic"],
        required: true,
      },
      seating_capacity: { type: Number, required: true },
      features: { type: [String], required: true },
    },
    { timestamps: true }
  )
);

export default Car;
