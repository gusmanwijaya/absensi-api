const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  loginGuru,
  loginSiswa,
  loginOrangTua,
} = require("../controllers/auth");
const router = express.Router();

router.post("/register-admin", registerAdmin);
router.post("/login-admin", loginAdmin);
router.post("/login-guru", loginGuru);
router.post("/login-siswa", loginSiswa);
router.post("/login-orang-tua", loginOrangTua);

module.exports = router;
