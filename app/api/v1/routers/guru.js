const express = require("express");
const router = express.Router();

const {
  getAll,
  create,
  getOne,
  update,
  destroy,
} = require("../controllers/guru");
const {
  authenticationAdmin,
  authorizeRoles,
} = require("../../../middleware/auth");

router.use(authenticationAdmin);
router.use(authorizeRoles("admin"));

router.get("/get-all", getAll);
router.get("/get-one/:id", getOne);
router.post("/create", create);
router.put("/update/:id", update);
router.delete("/destroy/:id", destroy);

module.exports = router;
