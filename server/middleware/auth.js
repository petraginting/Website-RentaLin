import User from "../models/user.js";

export const protect = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ succes: false, message: "Not authorized" });
    }

    const user = await User.findById(req.session.userId).select("-password");

    if (!user) {
      return res.status(401).json({ succes: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ succes: false, message: "Server error" });
  }
};
