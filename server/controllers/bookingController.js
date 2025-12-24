import Booking from "../models/booking.js";
import Product from "../models/products.js";

// fungsi untuk ketersediaan mobil pada tanggal tertentu
export const checkAvailability = async (product, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    product,
    status: { $in: ["Tertunda", "Dikonfirmasi"] },
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });

  return bookings.length === 0;
};

// Api untuk memeriksa ketersediaan produk pada tanggal dan lokasi yang diberikan
export const checkAvailabilityOfProduct = async (req, res) => {
  try {
    const { type, pickupDate, returnDate } = req.body;

    // Ambil semua produk yang tersedia untuk lokasi yang diberikan
    const product = await Product.find({ type, isAvaliable: true });

    // Periksa ketersediaan produk untuk rentang tanggal yang diberikan menggunakan promise
    const availableProductsPromises = product.map(async (product) => {
      const isAvaliable = await checkAvailability(
        product._id,
        pickupDate,
        returnDate
      );

      return { ...product._doc, isAvaliable: isAvaliable };
    });

    let availableProducts = await Promise.all(availableProductsPromises);
    availableProducts = availableProducts.filter(
      (product) => product.isAvaliable === true
    );

    res.json({ succes: true, availableProducts });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }
};

// Api untuk membuat booking
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { product, pickupDate, returnDate, phoneNumber, address } = req.body;

    const isAvaliable = await checkAvailability(
      product,
      pickupDate,
      returnDate
    );
    if (!isAvaliable) {
      return res.json({
        succes: false,
        message: "Tanggal tersebut sudah ada yang pesan",
      });
    }

    const productData = await Product.findById(product);

    const parseDateLocal = (str) => {
      const [Y, M, D] = str.split("-").map(Number);
      return new Date(Y, M - 1, D);
    };

    // Hitung harga berdasarkan pickupDate dan returnDate
    const picked = parseDateLocal(pickupDate);
    const returned = parseDateLocal(returnDate);

    if (!picked || !returned || picked >= returned)
      return res.json({
        succes: false,
        message: "Tanggal tidak valid atau rentang tanggal terbalik",
      });

    const noOfDays = Math.max(
      1,
      Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
    );
    const totalPrice = productData.pricePerDay * noOfDays;

    await Booking.create({
      product,
      owner: productData.owner,
      user: _id,
      pickupDate,
      returnDate,
      phoneNumber,
      address,
      price: totalPrice,
    });

    res.json({ succes: true, message: "Booking Created" });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const { _id } = req.user;

    if (!bookingId) {
      return res.json({
        succes: false,
        message: "ID Booking tidak ditemukan.",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.json({ succes: false, message: "Booking tidak ditemukan." });
    }

    if (!booking.user.equals(_id)) {
      return res.json({ succes: false, message: "Akses ditolak" });
    }

    await Booking.deleteOne({ _id: bookingId });

    res.json({ succes: true, message: "Booking berhasil dihapus." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: "Gagal membatalkan booking. Silakan coba lagi.",
    });
  }
};
