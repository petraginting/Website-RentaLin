import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema(
  {
    owner: { type: ObjectId, ref: "User" },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    image: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true },
    fuel_type: { type: String, required: true },
    machine_capacity: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    isAvaliable: { type: Boolean, default: true },
  },
  { discriminatorKey: "type", timestamps: true }
);

const Product = mongoose.model("Kendaraan", productSchema);

export default Product;
