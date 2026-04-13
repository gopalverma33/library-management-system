const express = require("express");
const router = express.Router();

const {
  addMembership,
  getMembership,
  extendMembership,
  cancelMembership,
} = require("../controller/membershipController");

router.post("/add", addMembership);
router.get("/:id", getMembership);
router.put("/extend/:id", extendMembership);
router.put("/cancel/:id", cancelMembership);

module.exports = router;