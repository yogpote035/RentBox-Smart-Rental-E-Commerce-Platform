const express = require("express");
const router = express.Router();
const {
  addReview,
  getReviewsForProduct,
  checkReviewedBatch,
} = require("../controllers/ReviewController");
const { getUser } = require("../middleware/getUser");

// POST: Add review
router.post("/add", getUser, addReview);

router.get("/:productId", getUser, getReviewsForProduct);

router.post("/check-reviewed-batch/",getUser, checkReviewedBatch);

module.exports = router;
