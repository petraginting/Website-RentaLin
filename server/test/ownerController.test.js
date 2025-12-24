import { beforeEach, describe, expect, it, vi } from "vitest";
import Product from "../models/products";
import { deleteProduct, toggleProductAvailability } from "../controllers/owner/ownerController";

vi.mock("../configs/imageKit.js", () => ({
  default: {},
}));

describe("unit test toggleProductAvailability", () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();
    res = {
      json: vi.fn(),
    };
  });

  it("harus berhasil mengubah status ketersediaan (Toggle)", async () => {
    const idOwner = "user123";
    const mockSave = vi.fn();

    req = {
      body: { productId: "mobil-1" },
      user: { _id: idOwner },
    };

    Product.findById = vi.fn().mockResolvedValue({
      _id: "mobil-1",
      owner: idOwner,
      isAvaliable: true,
      save: mockSave,
    });

    await toggleProductAvailability(req, res);

    const product = await Product.findById("mobil-1");
    expect(product.isAvaliable).toBe(false);

    expect(mockSave).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      succes: true,
      message: "Availability Toggled",
    });
  });

  it("harus menolak jika dilakukan oleh bukan owner", async () => {
    const idOwnerAsli = "owner-asli";
    const idPencuri = "pencuri-123";

    req = {
      body: { productId: "mobil-1" },
      user: { _id: idPencuri },
    };

    Product.findById = vi.fn().mockResolvedValue({
      _id: "mobil-1",
      owner: idOwnerAsli,
      isAvaliable: true,
      save: vi.fn(),
    });

    await toggleProductAvailability(req, res);

    expect(res.json).toHaveBeenCalledWith({
      succes: false,
      message: "Akses ditolak",
    });

    // Pastikan save tidak pernah dipanggil
    const product = await Product.findById("mobil-1");
    expect(product.save).not.toHaveBeenCalled();
  });
});

describe("unit test deleteProductOwner", () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();
    res = {
      json: vi.fn(),
    };
  });

  it("harus menolak akses jika user bukan owner", async () => {
    const userOwner = "owner";
    const bukanOwner = "bukan-owner";

    req = {
      body: { productId: "kendaraan1" },
      user: { _id: bukanOwner },
    };

    Product.findById = vi.fn().mockResolvedValue({
      _id: "kendaraan1",
      owner: userOwner,
      save: vi.fn(),
    });

    await deleteProduct(req, res);

    expect(res.json).toHaveBeenCalledWith({
      succes: false,
      message: "Akses ditolak",
    });

    expect((Product.deleteOne = vi.fn())).not.toHaveBeenCalled();
  });

  it("harus berhasil jika user adalah owner", async () => {
    const idOwner = "owner-123";
    const mockSave = vi.fn();

    req = {
      body: { productId: "kendaraan1" },
      user: { _id: idOwner },
    };

    Product.findById = vi.fn().mockResolvedValue({
      _id: "kendaraan1",
      owner: idOwner,
      isAvaliable: true,
      save: mockSave,
    });

    await deleteProduct(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      succes: true,
      message: "Product Removed",
    });
  });
});
