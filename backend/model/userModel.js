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
});

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: [addressSchema],
});

const UserModel = mongoose.model("UserModel", UserSchema);
module.exports = UserModel;
