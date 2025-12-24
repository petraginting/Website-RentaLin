// const tahun = 2000

// function isValidVehicleYear(year) {
//   const y = Number(year);
//   const current = new Date().getFullYear();

//   return /^\d{4}$/.test(year) && y >= 1980 && y <= current;
// }

// console.log(isValidVehicleYear(tahun));

const kategori_segitiga = (a, b, c) => {
  const toleransi = 0.01

  const isMendekati = (x, y) => Math.abs(x - y) <= toleransi

  if (a <= 0 || b <= 0 || c <= 0) return "tidak ada segitiga dapat dibangun"
  
  //urutkan sisi yang diberikan, dari yang terkecil ke terbesar
  const sisi = [a, b, c].sort((x, y) => x - y)
  const [x, y, z] = sisi
  
  if (z >= x + y) return "tidak ada segitiga dapat dibangun"
  
  if (isMendekati(x, y) && isMendekati(y, z)) return "segitiga sama sisi"

  if (isMendekati(z * z, x * x + y * y)) return "segitiga siku-siku"

  if (isMendekati(x, y) || isMendekati(y, z) || isMendekati(x, z)) return "segitiga sama kaki"

  return "segitiga sembarang"
};

console.log(kategori_segitiga(3, 4, 5));
console.log(kategori_segitiga(2.99, 3.01, 3.00));
console.log(kategori_segitiga(3, 5, 5));
