const mongoose = require("mongoose");
const Product = require("../models/productModels");

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({
      createdAt: -1,
    });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to find products",
    });
  }
};

const createProduct = async (req, res) => {
  const {
    productName,
    category,
    description,
    price,
    inventoryCount,
    supplier: { name, contactEmail, contactPhone, isVerified },
  } = req.body;

  try {
    const newProduct = await Product.create({
      productName,
      category,
      description,
      price,
      inventoryCount,
      supplier: {
        name,
        contactEmail,
        contactPhone,
        isVerified,
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message, error: "failed to create product" });
  }
};

// GET /api/products/:productId
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch product",
    });
  }
};

// PUT /api/products/:productId
const updateProduct = async (req, res) => {
  res.send("updateProduct");
};

// DELETE /api/products/:productId
const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(404).json({ message: "Product not found" });
  }
  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: productId });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
