const {getAllTopics, getArticleById, getAllArticlesModel, getAllCommentsForArticleModel, postCommentToArticleModel, updateArticleModel, deleteCommentModel, getAllUsersModel} = require("../models/app.model")
const allEndpoints = require("../endpoints.json")


function topicsController(request, response, next) {
    return getAllTopics()
    .then((data) => {
        return response.status(200).send({topics : data});
    })
}

function apiController(request, response, next) {
    response.status(200).send(allEndpoints);
}

function articleController(request, response, next) {
    const chosenArticleId = request.params.article_id

    return getArticleById(chosenArticleId)
    .then(data => {
        response.status(200).send({article : data})
    }).catch(err => {
        next(err);
    }) 
}

function getAllArticles(request, response, next) {
    const {topic, sort_by, order} = request.query // get topic to filter by

    return getAllArticlesModel(topic, sort_by, order)
    .then(data => {
        response.status(200).send({articles : data});
    }).catch(err => {
        next(err);
    })
}

function getAllCommentsForArticle(request, response, next) {
    const chosenArticleId = request.params.article_id

    return getAllCommentsForArticleModel(chosenArticleId)
    .then(data => {
        response.status(200).send({comments : data})
    }).catch(err => {
        next(err);
    }) 
}

function postCommentToArticle (request, response, next) {
    const givenComment = request.body
    const chosenArticleId = request.params.article_id
    return postCommentToArticleModel(givenComment, chosenArticleId).then(data => {
        response.status(201).send({comment : data})
    }).catch(err => {
        next(err);
    })
}

function updateArticle (request, response, next) {
    const {inc_votes} = request.body
    const chosenArticleId = request.params.article_id

    return updateArticleModel(inc_votes, chosenArticleId)
    .then(data => {
        response.status(200).send({article : data})
    }).catch(err => {
        next(err);
    })
}

function deleteComment (request, response, next) {
    const chosenCommentId = request.params.comment_id

    return deleteCommentModel(chosenCommentId)
    .then(data => {
        response.status(204).send();
    }).catch(err => {
        next(err);
    })
}

function getAllUsers (request, response, next) {
    return getAllUsersModel()
    .then(data => {
        response.status(200).send({users : data})
    }).catch(err => {
        next(err);
    })
}

module.exports = {topicsController, apiController, articleController, getAllArticles, getAllCommentsForArticle, postCommentToArticle, updateArticle, deleteComment, getAllUsers}

