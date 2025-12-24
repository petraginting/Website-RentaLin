import Booking from "../../models/booking.js";

// Api untuk mencantumkan pemesanan pengguna
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id })
      .populate("product")
      .sort({ createdAt: -1 });

    res.json({ succes: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }
};

export const getUnavailableDates = async (req, res) => {
  try {
    const { productId } = req.params;

    // Ambil semua booking aktif untuk produk itu
    const bookings = await Booking.find({
      product: productId,
      status: { $ne: "Dibatalkan" }, // jangan hitung yang dibatalkan
    });

    // Ambil semua rentang tanggal dari booking
    let unavailableDates = [];

    bookings.forEach((t) => {
      const start = new Date(t.pickupDate);
      const end = new Date(t.returnDate);

      // generate semua tanggal dalam range (termasuk hari awal dan akhir)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        unavailableDates.push(new Date(d));
      }
    });

    res.json({
      succes: true,
      unavailableDates,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }
};
