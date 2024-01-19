const { getAllUsers } = require('../controllers/app.controller');

const usersRouter = require('express').Router();

usersRouter.get('/', getAllUsers)
usersRouter.get('/:username', )

module.exports = usersRouter