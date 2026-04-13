const express = require("express");
const router = express.Router();

const { payFine } = require("../controller/transactionController"); // ✅ correct path

router.put("/pay-fine/:id", payFine);

module.exports = router;