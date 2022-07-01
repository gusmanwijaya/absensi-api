const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  loginGuru,
  loginSiswa,
  loginOrangTua,
  ubahPasswordAdmin,
  ubahPasswordGuru,
  ubahPasswordSiswa,
  ubahPasswordOrangTua,
} = require("../controllers/auth");
const router = express.Router();

const {
  authenticationAdmin,
  authenticationGuru,
  authenticationSiswa,
  authenticationOrangTua,
  authorizeRoles,
} = require("../../../middleware/auth");

router.post("/register-admin", registerAdmin);
router.put(
  "/ubah-password-admin/:id",
  authenticationAdmin,
  authorizeRoles("admin"),
  ubahPasswordAdmin
);
router.put(
  "/ubah-password-guru/:id",
  authenticationGuru,
  authorizeRoles("guru"),
  ubahPasswordGuru
);
router.put(
  "/ubah-password-siswa/:id",
  authenticationSiswa,
  authorizeRoles("siswa"),
  ubahPasswordSiswa
);
router.put(
  "/ubah-password-orangtua/:id",
  authenticationOrangTua,
  authorizeRoles("orangtua"),
  ubahPasswordOrangTua
);
router.post("/login-admin", loginAdmin);
router.post("/login-guru", loginGuru);
router.post("/login-siswa", loginSiswa);
router.post("/login-orangtua", loginOrangTua);

module.exports = router;
