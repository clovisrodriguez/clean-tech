const app = require("./server");
const dotenv = require("dotenv");
const connectDatabase = require("./utils/database");
const ErrorHandler = require("./utils/errorHandler");

//Config environment
dotenv.config({ path: "./.env" });

//Connect to Database
connectDatabase();

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.error(`ERROR: ${err.message}`);
  console.error("Shutting down due to uncaught exception");
  process.exit(1);
});

//Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(
    `Server Starting on server ${PORT} on ${process.env.NODE_ENV} mode.`
  );
});

// Handling Unahndled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  console.error(`Shutting down the server due to unhandled promise rejection.`);
  server.close(() => {
    process.exit(1);
  });
});
