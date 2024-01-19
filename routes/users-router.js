const { getAllUsers } = require('../controllers/app.controller');

const usersRouter = require('express').Router();

usersRouter.get('/', getAllUsers)

module.exports = usersRouter