const { Schema, default: mongoose } = require("mongoose");

const addressSchema = new Schema({
  buildingName: {
    type: String,
  },
  laneNo: {
    type: String,
  },
  landmark: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  pincode: {
    type: Number,
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
    unique: true,
    sparse: true // optional(if exists then true)
  },
  isFirebaseUser: {
    type: Boolean,
    default: false,
  },
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true // optional(if exists then true)
  },
  password: {
    type: String,
  },
  address: [addressSchema],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const UserModel = mongoose.model("UserModel", UserSchema);
module.exports = UserModel;
