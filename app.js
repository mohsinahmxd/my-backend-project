const express = require("express")
const app = express();
const {handleCustomError, handlePsqlErrors, handleInternalServerError} = require("./errors/index.js")

// controller import
const { topicsController, apiController, articleController} = require("./controllers/app.controller.js")

// routing
app.get("/api/topics", topicsController)
app.get("/api", apiController)
app.get("/api/articles/:article_id", articleController)

// errors
app.use(handleCustomError)
app.use(handlePsqlErrors)
app.use(handleInternalServerError)

module.exports = app;