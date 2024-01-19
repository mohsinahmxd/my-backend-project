const { deleteComment } = require('../controllers/app.controller');

const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', deleteComment)

module.exports = commentsRouter