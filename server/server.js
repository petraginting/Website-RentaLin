import express from "express";
import "dotenv/config";
import cors from "cors";
import MongoStore from "connect-mongo";
import session from "express-session";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js";
import ownerRouter from "./routes/ownerRouter.js";
import bookingRouter from "./routes/bookingRouter.js";

//variable
const PORT = process.env.PORT || 3205;

//inisialisasi express app
const app = express();

//connected database
await connectDB();

app.set("trust proxy", 1);

//middleware
app.use(
  cors({
    origin: `${process.env.VITE_URL}`, // ip react
    credentials: true, // supaya cookie dikirim
  })
);
app.use(express.json());

app.use(
  session({
    secret: "rayap_besi",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // harus sama dengan DB kamu
      ttl: 60 * 60 * 24, // 1 hari
    }),
    cookie: {
      httpOnly: true,
      secure: false, // ubah ke true jika memakai HTTPS / deployment
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.get("/", (req, res) => {
  res.send("server sedang jalan.....");
});

app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
