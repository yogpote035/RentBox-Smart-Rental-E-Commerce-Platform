const { Schema, default: mongoose } = require("mongoose");

const orderSchema = new Schema({
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "ProductModel",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OrderModel = mongoose.model("OrderModel", orderSchema);
module.exports = OrderModel;
