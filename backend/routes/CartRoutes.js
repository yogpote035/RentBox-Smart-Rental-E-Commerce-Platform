const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  removeFromCart,
} = require("../controllers/CartController");

router.post("/add", addToCart);
router.get("/", getCart);
router.post("/remove", removeFromCart);

module.exports = router;
