const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/errors");
const ErrorHandler = require("./utils/errorHandler");
const { createPurchase, createSale } = require("./controllers/appController");

const API_BASE = "/api/v1";

// Setup JSON parseurl
app.use(express.json());

app.route(`${API_BASE}/purchase`).post(createPurchase);

app.route(`${API_BASE}/sale`).post(createSale);

app.all("*", (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found.`, 404));
});

// Middleware to handle errors
app.use(errorMiddleware);

// Export app before start listening
module.exports = app;
