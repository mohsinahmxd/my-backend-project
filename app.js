const express = require("express")
const app = express();

// controller import
const { topicsController, apiController } = require("./controllers/app.controller.js")

// routing
app.get("/api/topics", topicsController)
app.get("/api", apiController)


module.exports = app;