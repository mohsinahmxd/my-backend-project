const { getAllArticles, articleController, getAllCommentsForArticle, postCommentToArticle, updateArticle } = require('../controllers/app.controller');

const articlesRouter = require('express').Router();

articlesRouter.get('/', getAllArticles);

articlesRouter.route('/:article_id')
    .get(articleController)
    .patch(updateArticle)

articlesRouter.route('/:article_id/comments')
    .get(getAllCommentsForArticle)
    .post(postCommentToArticle);

module.exports = articlesRouter;

