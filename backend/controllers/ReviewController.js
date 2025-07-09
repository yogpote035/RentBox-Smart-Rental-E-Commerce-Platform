const ReviewModel = require("../model/reviewModel");
const OrderModel = require("../model/orderModel");

exports.addReview = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const { product, order, message, rating } = req.body;

    //Check: Order exists & belongs to user
    const validOrder = await OrderModel.findOne({ _id: order, owner: userId });
    if (!validOrder) {
      return res
        .status(400)
        .json({ message: "Invalid order or access denied." });
    }

    //  Check: Already reviewed for same order
    const alreadyReviewed = await ReviewModel.findOne({ order, owner: userId });
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You already reviewed this order." });
    }

    const review = await ReviewModel.create({
      product: product,
      order: order,
      owner: userId,
      message,
      rating,
    });

    res.status(201).json({ message: "Review submitted", review });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding review", error: error.message });
  }
};

exports.getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ReviewModel.find({ product: productId })
      .populate("owner order", "name email")
      .populate({ path: "order", select: "from to" })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};

exports.checkReviewedBatch = async (req, res) => {
  try {
    const { orderIds } = req.body;
    const userId = req.headers.userid;

    if (!Array.isArray(orderIds)) {
      return res.status(400).json({ message: "orderIds must be an array" });
    }

    const reviews = await ReviewModel.find({
      order: { $in: orderIds },
      owner: userId,
    }).select("order");

    const reviewedMap = {};
    orderIds.forEach((id) => {
      reviewedMap[id] = reviews.some((r) => r.order.toString() === id);
    });

    res.json(reviewedMap);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to check reviews in batch",
        error: error.message,
      });
  }
};
