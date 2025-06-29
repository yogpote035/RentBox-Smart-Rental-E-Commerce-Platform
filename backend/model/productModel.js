const { Schema, default: mongoose } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "OrderModel",
    },
  ],
});

const ProductModel = mongoose.model("ProductModel", productSchema);
module.exports = ProductModel;
