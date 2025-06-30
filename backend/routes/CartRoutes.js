const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  removeFromCart,
} = require("../controllers/CartController");
const { getUser } = require("../middleware/getUser");

router.post("/add", getUser, addToCart);
router.post("/remove", getUser, removeFromCart);
router.get("/", getUser, getCart);

module.exports = router;
