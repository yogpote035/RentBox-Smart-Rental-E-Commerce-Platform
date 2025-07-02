const OrderModel = require("../model/orderModel");
const ProductModel = require("../model/productModel");

module.exports.createProduct = async (request, response) => {
  const userId = request.header("userId");

  const { name, description, price } = request.body;
  try {
    if (!name || !description || !price) {
      return response.status(406).json({ message: "All Fields Are Required" });
    }

    const newProduct = new ProductModel({
      name,
      description,
      price,
      image: request.file?.path,
      owner: userId,
    });

    await newProduct.save();
    return response
      .status(201)
      .json({ message: "Product Created Successfully", id: newProduct._id });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Upload Failed", error: error.message });
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    const allProducts = await ProductModel.find({}).populate(
      "owner",
      "name email"
    );
    res.status(200).json(allProducts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// Get one product by ID
module.exports.getOneProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await ProductModel.findById(productId)
      .populate("owner")
      .populate("orders");

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
      return response.status(406).json({ message: "All Fields Are Required" });
    }
    const updateData = { name, description, price };

    if (req.file) {
      updateData.image = req.file?.path;
    }

    const updated = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Update failed", error: err.message });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check ownership
    if (product.owner.toString() !== req.headers.userid) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this product" });
    }

    await ProductModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

module.exports.getMyProducts = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const products = await ProductModel.find({ owner: userId });
    if (!products) {
      return res.status(404).json({ message: "Nothing Added By You" });
    }
    res.json(products);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching user products" });
  }
};
