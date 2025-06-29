const express = require("express");
const router = express.Router();
const {getUser} = require("../middleware/getUser");
const {
  placeOrder,
  getUserOrders,
  deleteOrder,
} = require("../controllers/orderController");

router.post("/", getUser, placeOrder);
router.get("/my-orders", getUser, getUserOrders);
router.delete("/:id", getUser, deleteOrder);

module.exports = router;
