const express = require("express");
const {
  getDashboardAdmin,
  getDashboardGuru,
  getDashboardSiswa,
  getDashboardOrangTua,
} = require("../controllers/dashboard");
const router = express.Router();

const {
  authenticationAdmin,
  authenticationGuru,
  authenticationSiswa,
  authenticationOrangTua,
  authorizeRoles,
} = require("../../../middleware/auth");

router.get(
  "/get-dashboard-admin",
  authenticationAdmin,
  authorizeRoles("admin"),
  getDashboardAdmin
);
router.get(
  "/get-dashboard-guru",
  authenticationGuru,
  authorizeRoles("guru"),
  getDashboardGuru
);
router.get(
  "/get-dashboard-siswa",
  authenticationSiswa,
  authorizeRoles("siswa"),
  getDashboardSiswa
);
router.get(
  "/get-dashboard-orangtua",
  authenticationOrangTua,
  authorizeRoles("orangtua"),
  getDashboardOrangTua
);

module.exports = router;
