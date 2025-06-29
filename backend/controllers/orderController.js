const OrderModel = require("../model/orderModel");

module.exports.placeOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.headers.userid;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product and quantity are required." });
    }

    const newOrder = new OrderModel({
      product: productId,
      quantity,
      owner: userId,
    });

    await newOrder.save();
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

    await OrderModel.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order" });
  }
};
