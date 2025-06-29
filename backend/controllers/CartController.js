const CartModel = require("../model/cartModel");

// Add to Cart
exports.addToCart = async (req, res) => {
  const userId = req.headers.userid;
  const { productId, quantity } = req.body;

  try {
    let cart = await CartModel.findOne({ owner: userId });
    if (!cart) cart = new CartModel({ owner: userId, items: [] });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart" });
  }
};

// Get Cart
exports.getCart = async (req, res) => {
  const userId = req.headers.userid;
  try {
    const cart = await CartModel.findOne({ owner: userId }).populate("items.product");
    
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
  }
};

// Remove Item
exports.removeFromCart = async (req, res) => {
  const userId = req.headers.userid;
  const { productId } = req.body;

  try {
    const cart = await CartModel.findOne({ owner: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error removing from cart" });
  }
};
