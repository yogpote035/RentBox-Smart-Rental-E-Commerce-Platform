const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();
const { getUser } = require("../middleware/getUser");
const {
  createProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  searchProducts,
  getAverageRating,
} = require("../controllers/ProductController");

router.get("/search", searchProducts);
router.post("/create-product", getUser, upload.single("image"), createProduct);
router.get("/my-products", getUser, getMyProducts);
router.get("/average-rating/:id", getAverageRating);
router.get("/:id", getUser, getOneProduct);
router.get("/", getAllProducts);
router.put("/:id", getUser, upload.single("image"), updateProduct);
router.delete("/:id", getUser, deleteProduct);

module.exports = router;
