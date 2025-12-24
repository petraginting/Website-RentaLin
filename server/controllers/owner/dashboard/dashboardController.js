import Booking from "../../../models/booking.js";
import Product from "../../../models/products.js";
import User from "../../../models/user.js";

// api to get dashboar data
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({ succes: false, message: "Unauthorized" });
    }

    const prodcuts = await Product.find({ owner: _id });
    const user = await User.find({ role: "user" });
    const bookings = await Booking.find({ owner: _id })
      .populate("product")
      .sort({ createdAt: -1 });

    const pendingBookings = await Booking.find({
      owner: _id,
      status: "Tertunda",
    });
    const confirmBookings = await Booking.find({
      owner: _id,
      status: "Dikonfirmasi",
    });

    // Hitung pendapatan bulanan dari pemesanan yang statusnya dikonfirmasi
    const monthlyRevenue = bookings
      .slice()
      .filter((booking) => booking.status === "Dikonfirmasi")
      .reduce((acc, booking) => acc + booking.price, 0);

    const dashboardData = {
      totalUsers: user.length,
      totalProducts: prodcuts.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      confirmBookings: confirmBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    res.json({ succes: true, dashboardData });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }
};
