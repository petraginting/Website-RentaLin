export const formatPriceIDR = (amount, locale = "id-ID") => {
  if (typeof amount !== "number") return String(amount);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
