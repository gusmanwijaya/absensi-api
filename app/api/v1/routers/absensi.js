const express = require("express");
const {
  create,
  getMataPelajaran,
  getSiswa,
  getAbsensiToday,
  getPertemuan,
  getAllAbsensi,
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
  authenticationGuru,
  authorizeRoles("guru"),
  getAbsensiToday
);
router.get(
  "/get-pertemuan/:id",
  authenticationGuru,
  authorizeRoles("guru"),
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

module.exports = router;
