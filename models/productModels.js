const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    productName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    inventoryCount: { type: Number, required: true },
    supplier: {
      name: { type: String, required: true },
      contactEmail: { type: String, required: true },
      contactPhone: { type: String, required: true },
      isVerified: { type: Boolean, default: false },
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Product", productSchema);