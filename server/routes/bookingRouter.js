import express from "express";

import {
  checkAvailabilityOfProduct,
  createBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import {
  changeBookingStatus,
  getOwnerBookings,
} from "../controllers/owner/ownerBooking.js";

import { protect } from "../middleware/auth.js";
import {
  getUnavailableDates,
  getUserBookings,
} from "../controllers/user/userBooking.js";
import {
  deleteCheckoutSession,
  getCheckoutSession,
  setCheckoutSession,
} from "../controllers/checkoutSession.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityOfProduct);
bookingRouter.post("/create", protect, createBooking);
bookingRouter.post("/checkout/set-data", protect, setCheckoutSession);
bookingRouter.post("/change-status", protect, changeBookingStatus);
bookingRouter.post("/delete-session", protect, deleteCheckoutSession);
bookingRouter.post("/delete", protect, deleteBooking);
bookingRouter.get("/checkout/get-data", protect, getCheckoutSession);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/unavailable-dates/:productId", getUnavailableDates);
bookingRouter.get("/owner", protect, getOwnerBookings);

export default bookingRouter;
