import imageKit from "../../configs/imageKit.js";
import Car from "../../models/car.js";
import Product from "../../models/products.js";
import fs from "fs";

// api list product
export const addProduct = async (req, res) => {
  try {
    const { _id } = req.user;
    let product = JSON.parse(req.body.productData);
    const imageFile = req.file;

    // upload image to imagekit
    const fileBuffer = fs.createReadStream(imageFile.path);
    const response = await imageKit.files.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/products",
    });

    // optimization through imagekit url transformation
    const optimizedImageUrl = imageKit.helper.buildSrc({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      src: response.filePath,
      transformation: [
        { width: "1280" }, // width resizing
        { quality: "auto" }, // auto compression
        { format: "webp" }, // convert to modern format
      ],
    });

    const image = optimizedImageUrl;
    let Model;

    if (product.type === "Mobil") {
      const { transmission } = product;
      const seating_capacity = Number(req.body.seating_capacity);
      const features = JSON.parse(req.body.features);

      Model = (await import("../../models/car.js")).default;

      await Model.create({
        ...product,
        owner: _id,
        image,
        transmission,
        seating_capacity,
        features,
      });
    } else if (product.type === "Motor") {
      const { transmission } = product;
      Model = (await import("../../models/bike.js")).default;

      await Model.create({
        ...product,
        owner: _id,
        image,
        transmission,
      });
    } else {
      await Product.create({ ...product, owner: _id, image });
    }

    console.log(image);
    res.json({ succes: true, message: "Product added" });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }

  console.log("req.body:", req.body);
  console.log("req.file:", req.file);
};

// api to list product
export const getProduct = async (req, res) => {
  try {
    const { _id } = req.user;
    const products = await Product.find({ owner: _id });

    res.json({ succes: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }
};

//api get kendaraan by id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    res.json({ succes: true, product });
  } catch (error) {
    console.log(error);
    res.json({ succes: false, message: error.message });
  }
};

// api to toggle product availability
export const toggleProductAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { productId } = req.body;
    const product = await Product.findById(productId);

    // checking is prodcut belongs to user
    if (product.owner.toString() !== _id.toString()) {
      return res.json({ succes: false, message: "Akses ditolak" });
    }

    product.isAvaliable = !product.isAvaliable;
    await product.save();

    res.json({ succes: true, message: "Availability Toggled" });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }
};

//api edit kendaraan
export const editProduct = async (req, res) => {
  try {
    const { _id } = req.user;
    const { id: productId } = req.params;
    const updatedData = JSON.parse(req.body.updatedData);

    const product = await Product.findById(productId);
    if (!product) {
      return res.json({ succes: false, message: "Product not found" });
    }

    if (product.owner.toString() !== _id.toString()) {
      return res.json({ succes: false, message: "Unauthorized" });
    }

    // Upload image jika ada
    if (req.file) {
      const fileBuffer = fs.createReadStream(req.file.path);
      const response = await imageKit.files.upload({
        file: fileBuffer,
        fileName: req.file.originalname,
        folder: "/products",
      });

      updatedData.image = imageKit.helper.buildSrc({
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        src: response.filePath,
        transformation: [
          { width: "1280" },
          { quality: "auto" },
          { format: "webp" },
        ],
      });
    }

    let updatedProduct;

    if (product.type === "Mobil") {
      updatedProduct = await Car.findByIdAndUpdate(
        productId,
        { $set: updatedData },
        { new: true, runValidators: true }
      );
    } else {
      updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: updatedData },
        { new: true, runValidators: true }
      );
    }

    res.json({
      succes: true,
      message: "Product Updated",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.json({ succes: false, message: error.message });
  }
};

// api to delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { _id } = req.user;
    const { productId } = req.body;
    const product = await Product.findById(productId);

    // checking is prodcut belongs to user
    if (product.owner.toString() !== _id.toString()) {
      return res.json({ succes: false, message: "Akses ditolak" });
    }

    // Soft delete (deactivate product)
    product.owner = null;
    product.isAvaliable = false;
    product.save();

    res.json({ succes: true, message: "Product Removed" });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }
};
