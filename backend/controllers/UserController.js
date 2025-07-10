const UserModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.Signup = async (request, response) => {
  const { name, email, phone, password } = request.body;
  console.log("signup request body", name, email, password, phone);
  if (!name || !email || !phone || !password) {
    return response.status(406).json({ message: "All Fields Are Required" });
  }

  const existingPhoneUser = await UserModel.findOne({
    $or: [{ phone }, { email }],
  });

  if (existingPhoneUser) {
    return response
      .status(208)
      .json({ message: "This Phone Number User Already Exists" });
  }

  const existingEmailUser = await UserModel.findOne({ email });

  if (existingEmailUser) {
    return response
      .status(208)
      .json({ message: "This Mail User Already Exists" });
  }
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    await newUser.save();
    console.log("New User is Created");
    const data = {
      user: {
        id: newUser.id,
      },
    };
    const token = jwt.sign(data, process.env.secret, { expiresIn: "7d" });
    console.log("Token is generated and sending response to frontend");
    return response.status(200).json({
      message: "Registration is Successfully Completed",
      token: token,
      userId: newUser._id,
      username: newUser.name,
    });
  } catch (error) {
    return response
      .status(500)
      .json({ message: `Something Went Wrong : ${error}` });
  }
};

module.exports.Login = async (request, response) => {
  const { email, phone, password } = request.body;

  console.log("Login request body", email ? email : phone, password);

  if ((!email && !phone) || !password) {
    return response.status(406).json({ message: "All Fields Are Required" });
  }
  try {
    let existingUser = null;
    if (phone) {
      existingUser = await UserModel.findOne({ phone });
      if (!existingUser) {
        return response
          .status(204)
          .json({ message: "User of This Phone Number Is Not Found" });
      }
    }

    if (!existingUser && email) {
      existingUser = await UserModel.findOne({ email });
      if (!existingUser) {
        return response
          .status(204)
          .json({ message: "User  of This Email Is Not Found" });
      }
    }

    let passwordCompare = await bcrypt.compare(password, existingUser.password);

    if (!passwordCompare) {
      return response
        .status(208)
        .json({ message: "Wrong password , check your credentials" });
    }
    const data = {
      user: {
        id: existingUser.id,
      },
    };

    const token = jwt.sign(data, process.env.secret, {
      expiresIn: "7d",
    });

    return response.status(200).json({
      message: "User Logged In successfully",
      token,
      userId: existingUser._id,
      username: existingUser.name,
    });
  } catch (error) {
    return response
      .status(500)
      .json({ message: `Something Went Wrong : ${error}` });
  }
};

module.exports.getUserAddress = async (req, res) => {
  try {
    const user = await UserModel.findById(req?.params?.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.updateUserAddress = async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
};
