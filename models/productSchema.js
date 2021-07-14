const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter the product title"],
      unique: true,
      trim: true,
      maxlength: [100, "Product title can not exceed 100 characters."],
    },
    quantity: {
      type: Number,
      default: 0,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("queue", {
  ref: "Order",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

module.exports = mongoose.model("Product", productSchema);
