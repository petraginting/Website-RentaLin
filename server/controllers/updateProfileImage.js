import imageKit from "../configs/imageKit.js";
import User from "../models/user.js";
import fs from "fs";

// Api untuk update profile image
export const updateProfileImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;

    // upload image to imagekit
    const fileBuffer = fs.createReadStream(imageFile.path);
    const response = await imageKit.files.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    // optimization through imagekit url transformation
    const optimizedImageUrl = imageKit.helper.buildSrc({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      src: response.filePath,
      transformation: [
        { width: "400" }, // width resizing
        { quality: "auto" }, // auto compression
        { format: "webp" }, // convert to modern format
      ],
    });

    const image = optimizedImageUrl;
    await User.findByIdAndUpdate(_id, { image });

    res.json({ succes: true, message: "Image Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }
};
