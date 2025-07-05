const { Schema, default: mongoose } = require("mongoose");

const reviewSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "ProductModel",
    required: true,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "OrderModel",
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    mx: 5,
  },
});

const ReviewModel = mongoose.model("ReviewModel", reviewSchema);

module.exports = ReviewModel;
