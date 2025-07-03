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


exports.hasUserReviewed = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.headers.userid;

    const existing = await ReviewModel.findOne({
      order: orderId,
      owner: userId,
    });

    res.json({ reviewed: !!existing });
  } catch (error) {
    res.status(500).json({ message: "Failed to check review", error: error.message });
  }
};
