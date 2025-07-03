const express = require("express");
const router = express.Router();
const {
  addReview,
  getReviewsForProduct,
  hasUserReviewed,
} = require("../controllers/ReviewController");
const { getUser } = require("../middleware/getUser");

// POST: Add review
router.post("/add", getUser, addReview);

router.get("/:productId", getUser, getReviewsForProduct);

router.get("/check-reviewed/:orderId", hasUserReviewed);

module.exports = router;
