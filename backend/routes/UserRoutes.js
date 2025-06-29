const express = require("express");

const router = express.Router();
const getUser = require("../middleware/getUser");
const { Signup, Login } = require("../controllers/UserController");

router.post("/signup", Signup);
router.post("/login", Login);

module.exports = router;
