const express = require("express")
const app = express();

// controller import
const { topicsController } = require("./controllers/app.controller.js")

// routing
app.get("/api/topics", topicsController)


module.exports = app;