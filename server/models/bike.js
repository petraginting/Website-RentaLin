import mongoose from "mongoose";
import Product from "./products.js";

const Bike = Product.discriminator(
  "Motor",
  new mongoose.Schema(
    {
      transmission: {
        type: String,
        enum: ["Manual", "Metic", "Kopling"],
        required: true,
      },
    },
    { timestamps: true }
  )
);

export default Bike;
