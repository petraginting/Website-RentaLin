import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema(
  {
    product: { type: ObjectId, ref: "Kendaraan", required: true },
    owner: { type: ObjectId, ref: "User", required: true },
    user: { type: ObjectId, ref: "User", required: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ["Tertunda", "Dikonfirmasi", "Dibatalkan"],
      default: "Tertunda",
    },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Pemesanan", bookingSchema);

export default Booking;
