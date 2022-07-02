const express = require("express");
const {
  create,
  getMataPelajaran,
  getSiswa,
  getAbsensiToday,
  getPertemuan,
  getAllAbsensi,
  qrCode,
} = require("../controllers/absensi");
const router = express.Router();

const {
  authenticationGuru,
  authenticationSiswa,
  authorizeRoles,
} = require("../../../middleware/auth");

router.get(
  "/get-mata-pelajaran",
  [authenticationGuru, authenticationSiswa],
  authorizeRoles("guru", "siswa"),
  getMataPelajaran
);
router.get(
  "/get-siswa/:id",
  authenticationGuru,
  authorizeRoles("guru"),
  getSiswa
);
router.get(
  "/get-absensi-today/:id",
  [authenticationGuru, authenticationSiswa],
  authorizeRoles("guru", "siswa"),
  getAbsensiToday
);
router.get(
  "/get-pertemuan/:id",
  [authenticationGuru, authenticationSiswa],
  authorizeRoles("guru", "siswa"),
  getPertemuan
);
router.get(
  "/get-all-absensi/:id",
  authenticationGuru,
  authorizeRoles("guru"),
  getAllAbsensi
);
router.post(
  "/create",
  [authenticationGuru, authenticationSiswa],
  authorizeRoles("guru", "siswa"),
  create
);
router.get("/qr-code", authenticationSiswa, authorizeRoles("siswa"), qrCode);

module.exports = router;
