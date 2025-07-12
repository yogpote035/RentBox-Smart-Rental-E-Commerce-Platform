const { Schema, default: mongoose } = require("mongoose");

const cartSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "ProductModel",
        required: true,
      },
      quantity: {
        type: Number,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CartModel = mongoose.model("CartModel", cartSchema);
module.exports = CartModel;
