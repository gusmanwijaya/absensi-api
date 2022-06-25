const express = require("express");
const { create } = require("../controllers/absensi");
const router = express.Router();

const {
  authenticationGuru,
  authenticationSiswa,
  authorizeRoles,
} = require("../../../middleware/auth");

router.post(
  "/create",
  [authenticationGuru, authenticationSiswa],
  authorizeRoles("guru", "siswa"),
  create
);

module.exports = router;
