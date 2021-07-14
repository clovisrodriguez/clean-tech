const Order = require("../models/orderSchema");
const Product = require("../models/productSchema");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

TIME_THRESHOLD = 1000 * -10; // ten seconds lag
MAX_TIME_ORDER_PLACEMENT = 1000 * 60 * 60 * 24 * 15; // 15 days
MAX_AMOUNT_ALLOWED_PER_PRODUCT = 30;

const getQuantityForDueDate = async (product, serverTimeStamp, dueDate) => {
  let { quantity, queue } = await Product.findById(product._id).populate({
    path: "queue",
    select: "dueDate quantity isExecuted orderType",
    match: { dueDate: { $lte: dueDate }, isExecuted: false },
  });
  let newProductQuantity = quantity;

  for (const order of queue) {
    if (!order.isExecuted) {
      order.orderType === "Purchase"
        ? (quantity = quantity + order.quantity)
        : (quantity = quantity - order.quantity);
      if (new Date(order.dueDate).getTime() < serverTimeStamp) {
        await Order.findByIdAndUpdate(order._id, { isExecuted: true });
        newProductQuantity = quantity;
      }
    }
  }

  return { quantity, newProductQuantity };
};

const getDates = (req) => {
  const { dueDate } = req.body;
  const dueDateInMillis = new Date(dueDate).getTime() || Date.now();
  const serverTimeStamp = Date.now();
  const timeDifference = dueDateInMillis - serverTimeStamp;

  return { dueDateInMillis, serverTimeStamp, timeDifference };
};

// Create a new purchase => api/v1/purchase
exports.createPurchase = catchAsyncErrors(async (req, res, next) => {
  const {
    dueDate,
    quantity,
    product: { title },
  } = req.body;
  const { dueDateInMillis, serverTimeStamp, timeDifference } = getDates(req);

  // Check that we are provided with a valid date
  if (timeDifference < TIME_THRESHOLD)
    return next(
      new ErrorHandler(
        "Your order can't be added, please try with a current date or something in the future.",
        400
      )
    );

  if (timeDifference > MAX_TIME_ORDER_PLACEMENT)
    return next(
      new ErrorHandler(
        "Your order can't be added, all orders must be placed within 15 days.",
        400
      )
    );

  let product = await Product.findOne({ title });
  const isExecuted = dueDateInMillis <= serverTimeStamp;

  // If the product doesn't exist, we create it in our DB
  if (!product) {
    if (timeDifference > 0)
      return next(
        new ErrorHandler(
          "For creating an order with a new product, you should send it without a date.",
          400
        )
      );
    product = await Product.create({
      title,
      quantity,
    });
  } else {
    const { quantity: dueDateQuantity, newProductQuantity } =
      await getQuantityForDueDate(product, serverTimeStamp, dueDateInMillis);

    if (dueDateQuantity + quantity >= MAX_AMOUNT_ALLOWED_PER_PRODUCT)
      return next(
        new ErrorHandler(
          `Order was not created. the Max amount allow in inventory is ${MAX_AMOUNT_ALLOWED_PER_PRODUCT}, with your order would be ${
            dueDateQuantity + quantity
          }`,
          400
        )
      );

    product.quantity = newProductQuantity + quantity;
    product.save();
  }

  const order = await Order.create({
    dueDate,
    quantity,
    product: product._id,
    isExecuted,
    orderType: "Purchase",
  });

  return res.status(200).json({ success: true, data: order });
});

// Create a new sale => /api/v1/sale
exports.createSale = catchAsyncErrors(async (req, res, next) => {
  const {
    dueDate,
    quantity,
    product: { title },
  } = req.body;
  const { dueDateInMillis, serverTimeStamp, timeDifference } = getDates(req);

  // Check that we are provided with a valid date
  if (timeDifference < TIME_THRESHOLD)
    return next(
      new ErrorHandler(
        "Your order can't be added, please try with a current date or something in the future.",
        400
      )
    );

  if (timeDifference > MAX_TIME_ORDER_PLACEMENT)
    return next(
      new ErrorHandler(
        "Your order can't be added, all orders must be placed within 15 days.",
        400
      )
    );

  let product = await Product.findOne({ title });
  const isExecuted = dueDateInMillis <= serverTimeStamp;

  if (product) {
    const { quantity: dueDateQuantity, newProductQuantity } =
      await getQuantityForDueDate(product, serverTimeStamp, dueDateInMillis);

    if (dueDateQuantity >= 0 && dueDateQuantity >= quantity) {
      const order = await Order.create({
        dueDate,
        quantity,
        product: product._id,
        isExecuted,
        orderType: "Sale",
      });

      product.quantity = newProductQuantity - quantity;
      product.save();

      return res.status(200).json({ success: true, data: order });
    }

    return next(
      new ErrorHandler(
        `Your order was not created. by your orders time the available max supply is ${dueDateQuantity}`,
        400
      )
    );
  }

  return next(new ErrorHandler("Product was not found.", 400));
});
