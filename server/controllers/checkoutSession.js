export const setCheckoutSession = (req, res) => {
  const { productId, pickupDate, returnDate } = req.body;

  if (!productId || !pickupDate || !returnDate) {
    return res.json({ succes: false, message: "Data tidak lengkap." });
  }

  console.log("SESSION BEFORE SET:", req.session);
  req.session.checkoutData = {
    userId: req.user._id.toString(),
    productId: productId,
    pickupDate: pickupDate,
    returnDate: returnDate,
  };
  console.log("SESSION AFTER SET:", req.session);

  req.session.save((err) => {
    if (err) {
      return res.json({ succes: false, message: "Gagal menyimpan session." });
    }

    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    res.json({ succes: true, message: "Data sesi berhasil disimpan." });
  });
};

export const getCheckoutSession = (req, res) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  });

  const data = req.session.checkoutData;
  console.log("READ SESSION:", req.session);
  if (!data) {
    return res.json({
      succes: false,
      message: "Data checkout tidak ditemukan. Silakan ulangi.",
    });
  }

  if (data.userId.toString() !== req.user._id.toString()) {
    return res.json({ succes: false, message: "Akses data sesi tidak valid." });
  }

  res.json({ succes: true, data });
};

export const deleteCheckoutSession = (req, res) => {
  if (!req.session || !req.session.checkoutData) {
    return res.json({ succes: true, message: "Sesi checkout sudah kosong." });
  }

  delete req.session.checkoutData;

  req.session.save((err) => {
    if (err) {
      console.error("Error saving session after deletion:", err);
      return res.json({ succes: false, message: "Gagal menghapus session." });
    }

    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    res.json({ succes: true, message: "Sesi checkout berhasil dihapus." });
  });
};
