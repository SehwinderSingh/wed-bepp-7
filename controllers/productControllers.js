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
  res.send("getProductById");
};

// PUT /api/products/:productId
const updateProduct = async (req, res) => {
  res.send("updateProduct");
};

// DELETE /api/products/:productId
const deleteProduct = async (req, res) => {
  res.send("deleteProduct");
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
