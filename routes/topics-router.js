const { topicsController } = require("../controllers/app.controller");

const topicsRouter = require('express').Router();

topicsRouter.get('/', topicsController)

module.exports = topicsRouter