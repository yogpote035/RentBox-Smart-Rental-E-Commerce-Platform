const { default: mongoose } = require("mongoose");
const OrderModel = require("../model/orderModel");
const ProductModel = require("../model/productModel");
const ReviewModel = require("../model/reviewModel");
const { isBefore, startOfDay } = require("date-fns");

module.exports.createProduct = async (request, response) => {
  const userId = request.header("userId");

  try {
    const address = JSON.parse(request.body.address);
    const categories = JSON.parse(request.body.categories);
    const { name, description, price } = request.body;

    if (!name || !description || !price || !address || !categories) {
      return response.status(406).json({ message: "All Fields Are Required" });
    }

    const newProduct = new ProductModel({
      name,
      description,
      price,
      image: request.file?.path,
      owner: userId,
      address: [address],
      categories,
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

const cleanOldBookingsFromProducts = async () => {
  try {
    const today = startOfDay(new Date());
    const allProducts = await ProductModel.find().populate("orders");

    for (const product of allProducts) {
      const validOrderIds = [];

      if (Array.isArray(product.orders)) {
        for (const order of product.orders) {
          if (!order || !order.to) continue;

          const toDate = startOfDay(new Date(order.to));
          if (!isBefore(toDate, today)) {
            validOrderIds.push(order._id);
          }
        }
      }

      await ProductModel.findByIdAndUpdate(product._id, {
        orders: validOrderIds,
      });
    }

    console.log("✅ Old bookings cleaned from all products.");
  } catch (error) {
    console.error("❌ Error cleaning old bookings:", error.message);
  }
};

// Get all products
module.exports.getAllProducts = async (req, res) => {
  try {
    await cleanOldBookingsFromProducts();

    const allProducts = await ProductModel.find({})
      .populate("owner", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get one product by ID
module.exports.getOneProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.findById(id)
      .populate("owner")
      .populate({
        path: "orders",
        populate: {
          path: "owner",
          select: "name _id",
        },
      });

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
    const address = JSON.parse(req.body.address || "null");
    const categories = JSON.parse(req.body.categories || "null");

    if (!name || !description || !price || !address || !categories) {
      return res.status(406).json({ message: "All Fields Are Required" });
    }

    const updateData = {
      name,
      description,
      price,
      address: [address], // stored as array
      categories,
    };

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

module.exports.searchProducts = async (req, res) => {
  const { query } = req.query;
  console.log(query);
  try {
    const products = await ProductModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { categories: { $elemMatch: { $regex: query, $options: "i" } } },
        { "address.city": { $regex: query, $options: "i" } },
        { "address.state": { $regex: query, $options: "i" } },
      ],
    }).populate("owner", "name email");

    res.json(products);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};

// check is rating
module.exports.getAverageRating = async (req, res) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;

    const { id } = req.params;
    if (!id) {
      return res.status(208).json({ message: "Id Not Found For Rating" });
    }
    const result = await ReviewModel.aggregate([
      {
        $match: {
          product: new ObjectId(id),
        },
      },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0 });
    }

    res.json({
      averageRating: result[0].averageRating,
      totalReviews: result[0].totalReviews,
    });
  } catch (error) {
    console.error("Error getting average rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.LimitedProducts = async (request, response) => {
  const { id, categories } = request.body;

  try {
    const limitedProducts = await ProductModel.find({
      _id: { $ne: id },
      categories: { $in: categories },
    }).limit(3);

    response.status(200).json(limitedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};
