const express = require("express");
const router = express.Router();
const { getUser } = require("../middleware/getUser");
const {
  placeOrder,
  getUserOrders,
  deleteOrder,
  checkProductAvailability,
  receiptGenerate,
} = require("../controllers/orderController");

router.post("/", getUser, placeOrder);
router.get("/my-orders", getUser, getUserOrders);
router.get("/generate-receipt", receiptGenerate);
router.delete("/:id", getUser, deleteOrder);
router.post("/check-availability", getUser, checkProductAvailability);

module.exports = router;
