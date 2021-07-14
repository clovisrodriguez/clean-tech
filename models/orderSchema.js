const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  dueDate: {
    type: Date,
    default: Date.now(),
  },
  quantity: {
    type: Number,
    required: [true, "Please include a quantity for the order."],
    min: [1, "Please enter 1 unit at least"],
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
  isExecuted: {
    type: Boolean,
    default: false,
  },
  orderType: {
    type: String,
    required: [true, "Please provide the order type"],
    enum: {
      values: ["Purchase", "Sale"],
      message: "Please select a valid option for orderType",
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
