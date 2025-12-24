import Booking from "../../models/booking.js";

// Api untuk mendapatkan pemesanan pemilik
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ succes: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("product owner")
      .select("-user.password")
      .sort({ crearedAt: -1 });

    res.json({ succes: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }
};

// Api untuk owner mengubah status pesanan user
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ succes: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ succes: true, message: "Status Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }
};
