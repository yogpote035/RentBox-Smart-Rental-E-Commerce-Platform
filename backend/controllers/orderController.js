const OrderModel = require("../model/orderModel");
const ProductModel = require("../model/productModel");
const { isBefore, isAfter, parseISO } = require("date-fns");

module.exports.placeOrder = async (req, res) => {
  try {
    const { productId, quantity, from, to } = req.body;
    const userId = req.headers.userid;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product and quantity are required." });
    }
    if (!from || !to) {
      return res.status(400).json({ message: "Renting Period is required." });
    }

    const newOrder = new OrderModel({
      product: productId,
      quantity,
      from: new Date(from),
      to: new Date(to),
      owner: userId,
    });

    await newOrder.save();

    await ProductModel.findByIdAndUpdate(productId, {
      $push: { orders: newOrder._id },
    });
    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.headers.userid;

    const orders = await OrderModel.find({ owner: userId }).populate("product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const orderId = req.params.id;
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this order" });
    }
    const productId = order.product._id;
    await ProductModel.findByIdAndUpdate(productId, {
      $pull: { orders: orderId },
    });
    await OrderModel.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order" });
  }
};

module.exports.checkProductAvailability = async (req, res) => {
  try {
    const { productId, from, to } = req.body;

    const orders = await OrderModel.find({ product: productId });

    const requestedFrom = new Date(from);
    const requestedTo = new Date(to);

    const conflict = orders.some((order) => {
      const orderFrom = new Date(order.from);
      const orderTo = new Date(order.to);

      return requestedFrom <= orderTo && requestedTo >= orderFrom;
    });

    if (conflict) {
      const allToDates = orders.map((o) => new Date(o.to));
      const latestToDate = new Date(Math.max(...allToDates));

      const nextAvailable = new Date(latestToDate);
      nextAvailable.setDate(nextAvailable.getDate() + 1);

      return res.status(208).json({
        message: "Product already rented during selected period",
        nextAvailable,
      });
    }

    return res.json({ available: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error checking availability" });
  }
};
