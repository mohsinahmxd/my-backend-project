const express = require("express");
const app = express();
const {
  handleCustomError,
  handlePsqlErrors,
  handleInternalServerError,
} = require("./errors/index.js");
const apiRouter = require("./routes/api-router.js");
const cors = require("cors");

// routing / middleware
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

// errors
app.use(handleCustomError);
app.use(handlePsqlErrors);
app.use(handleInternalServerError);

module.exports = app;
