const express = require("express")
const app = express();
const {handleCustomError, handlePsqlErrors, handleInternalServerError} = require("./errors/index.js")
const apiRouter = require("./routes/api-router.js");

// routing / middleware
app.use(express.json());
app.use('/api', apiRouter)

// errors
app.use(handleCustomError)
app.use(handlePsqlErrors)
app.use(handleInternalServerError)

module.exports = app;