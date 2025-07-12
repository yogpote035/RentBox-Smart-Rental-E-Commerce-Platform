const { Schema, default: mongoose } = require("mongoose");

const addressSchema = new Schema({
  buildingName: {
    type: String,
    required: true,
  },
  laneNo: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
});

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
    type: String,
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
  categories: [
    {
      type: String,
      enum: [
        "electric",
        "furniture",
        "books",
        "bike",
        "vehicle",
        "tools",
        "clothing",
        "gadgets",
        "other",
        "sports",
        "property",
      ],
      required: true,
    },
  ],
  address: [addressSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductModel = mongoose.model("ProductModel", productSchema);
module.exports = ProductModel;
