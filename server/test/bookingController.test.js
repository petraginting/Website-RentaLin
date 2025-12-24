import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  checkAvailability,
  createBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import Booking from "../models/booking.js";
import Product from "../models/products.js";

vi.mock("../models/booking.js", () => ({
  default: {
    create: vi.fn(),
    find: vi.fn(),
  },
}));

vi.mock("../models/products.js", () => ({
  default: {
    find: vi.fn(),
    findById: vi.fn(),
  },
}));

describe("unit test checkAvailability", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("harus mengembalikan true jika tidak ada booking yang bentrok (Mobil Tersedia)", async () => {
    Booking.find.mockResolvedValue([]); // Simulasikan tidak ada booking yang bentrok

    const isAvaliable = await checkAvailability(
      "productId123",
      new Date("2024-07-10"),
      new Date("2024-07-14")
    );

    expect(isAvaliable).toBe(true);
  });

  it("harus mengembalikan false jika ada booking yang bentrok (Mobil Tidak Tersedia)", async () => {
    Booking.find.mockResolvedValue([{ _id: "ada-data" }]); // Simulasikan ada booking yang bentrok

    const isAvaliable = await checkAvailability(
      "productId123",
      new Date("2024-07-10"),
      new Date("2024-07-14")
    );

    expect(isAvaliable).toBe(false);
  });
});

describe("unit test createBooking", () => {
  let res, req;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      user: { _id: "user1" },
      body: {
        product: "kendaraan1",
        pickupDate: "2024-07-01",
        returnDate: "2024-07-03",
        phoneNumber: "0812345",
        address: "Jl. Merdeka",
      },
    };

    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
  });

  it("harus berhasil membuat booking dengan perhitungan harga yang benar", async () => {
    Product.findById.mockResolvedValue({
      _id: "kendaran1",
      pricePerDay: 100000,
      owner: "marsep",
    });

    Booking.find.mockResolvedValue([]); //kendaraan lagi tersedia

    await createBooking(req, res);

    expect(Booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        user: "user1",
        price: 200000,
        product: "kendaraan1",
      })
    );

    expect(res.json).toHaveBeenCalledWith({
      succes: true,
      message: "Booking Created",
    });
  });

  it("harus gagal jika tanggal pickup lebih besar dari returnDate", async () => {
    req.body.pickupDate = "2024-07-10";
    req.body.returnDate = "2024-07-05";

    Product.findById.mockResolvedValue({ pricePerDay: 100000 });
    Booking.find.mockResolvedValue([]);

    await createBooking(req, res);

    expect(res.json).toHaveBeenCalledWith({
      succes: false,
      message: "Tanggal tidak valid atau rentang tanggal terbalik",
    });
  });

  it("harus gagal jika mobil sudah dipesan", async () => {
    Booking.find.mockResolvedValue([{ _id: "kendaraanTersedia" }]);

    await createBooking(req, res);

    expect(res.json).toHaveBeenCalledWith({
      succes: false,
      message: "Tanggal tersebut sudah ada yang pesan",
    });

    expect(Booking.create).not.toHaveBeenCalled();
  });
});

describe("unit test deleteBooking", () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
  });

  it("harus gagal jika bookingId tidak dikirim", async () => {
    req = { body: {}, user: { _id: "user1" } };

    await deleteBooking(req, res);

    expect(res.json).toHaveBeenCalledWith({
      succes: false,
      message: "ID Booking tidak ditemukan.",
    });
  });

  it("harus gagal jika user mencoba menghapus booking milik orang lain", async () => {
    const userAsli = "user-asli";
    const userPencuri = "user-pencuri";

    req = {
      body: { bookingId: "booking1" },
      user: { userId: userPencuri },
    };

    Booking.findById = vi.fn().mockResolvedValue({
      _id: "booking1",
      user: {
        equals: (id) => id === userAsli,
      },
    });

    await deleteBooking(req, res);

    expect(res.json).toHaveBeenCalledWith({
      succes: false,
      message: "Akses ditolak",
    });

    expect((Booking.deleteOne = vi.fn())).not.toHaveBeenCalled();
  });

  it("harus berhasil menghapus jika user adalah pemilik booking", async () => {
    const userId = "userPemilik";
    req = {
      body: { bookingId: "booking1" },
      user: { _id: userId },
    };

    Booking.findById = vi.fn().mockResolvedValue({
      _id: "booking1",
      user: {
        equals: (id) => id === userId,
      },
    });

    Booking.deleteOne = vi.fn().mockResolvedValue({ deleteCount: 1 });

    await deleteBooking(req, res);

    expect(Booking.deleteOne).toHaveBeenCalledWith({
      _id: "booking1",
    });
    expect(res.json).toHaveBeenCalledWith({
      succes: true,
      message: "Booking berhasil dihapus.",
    });
  });
});
