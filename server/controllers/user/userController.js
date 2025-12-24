import User from "../../models/user.js";
import bcrypt from "bcrypt";
import Product from "../../models/products.js";

//register user
export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, username, email, password } = req.body;

    if (
      !first_name ||
      !last_name ||
      !username ||
      !email ||
      !password ||
      password.length < 8
    ) {
      return res.json({ succes: false, message: "Semua field wajib diisi" });
    }

    const userEmailExist = await User.findOne({ email });
    const usernameExist = await User.findOne({ username });
    if (usernameExist && userEmailExist) {
      return res.json({ succes: false, message: "User sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
    });

    req.session.userId = user._id.toString();

    req.session.save(() => {
      res.json({ succes: true, user });
    });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }
};

//login user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ succes: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ succes: false, message: "Invalide Credentials" });
    }

    req.session.userId = user._id.toString();

    req.session.save(() => {
      res.json({ succes: true, user });
    });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }
};

//get user data using session
export const getUserData = async (req, res) => {
  try {
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    if (!req.session.userId) {
      return res.status(401).json({ succes: false, message: "Unauthorized" });
    }
    const user = await User.findById(req.session.userId).select("-password");

    res.json({ succes: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    res.json({ succes: true, message: "Logout berhasil" });
  });
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvaliable: true });
    res.json({ succes: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, message: error.message });
  }
};

export const updateProfileUser = async (req, res) => {
  try {
    const { first_name, last_name, username, email } = req.body;

    if (!first_name || !last_name || !username || !email) {
      return res.json({ succes: false, message: "Semua field wajib diisi" });
    }

    const userEmailExist = await User.findOne({ email });
    const usernameExist = await User.findOne({ username });
    if (
      usernameExist &&
      userEmailExist &&
      usernameExist._id.toString() !== req.user._id.toString() &&
      userEmailExist._id.toString() !== req.user._id.toString()
    ) {
      return res.json({ succes: false, message: "User sudah terdaftar" });
    }

    const user = await User.findById(req.user._id);

    user.first_name = first_name;
    user.last_name = last_name;
    user.username = username;
    user.email = email;
    await user.save();

    res.json({ succes: true, message: "Profile updated", user });
  } catch (error) {
    console.log(error);
    res.json({ succes: false, message: error.message });
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword || newPassword.length < 8) {
      return res.json({ succes: false, message: "Invalid input" });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.json({ succes: false, message: "Password lama salah" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ succes: true, message: "Password berhasil diubah" });
  } catch (error) {
    console.log(error);
    res.json({ succes: false, message: error.message });
  }
};
