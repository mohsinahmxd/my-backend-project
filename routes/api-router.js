const apiRouter = require('express').Router();
const { apiController } = require('../controllers/app.controller');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');

apiRouter.use('/articles', articlesRouter)
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/comments', commentsRouter)
apiRouter.use('/users', usersRouter)

apiRouter.get('/', apiController)

module.exports = apiRouter;