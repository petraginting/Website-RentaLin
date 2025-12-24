export const dateLocale = (date) => {
  const dateObj = new Date(date);

  return dateObj.toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
