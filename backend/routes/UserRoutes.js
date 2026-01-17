const express = require("express");

const router = express.Router();
const getUser = require("../middleware/getUser");
const {
  Signup,
  Login,
  getUserAddress,
  updateUserAddress,
  generateRefreshToken,
} = require("../controllers/UserController");
router.get("/:id", getUserAddress);
router.put("/:id", updateUserAddress);
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/refresh-token", generateRefreshToken);

module.exports = router;
