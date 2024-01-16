const {getAllTopics, getArticleById, getAllArticlesModel} = require("../models/app.model")
const allEndpoints = require("../endpoints.json")


function topicsController(request, response, next) {
    return getAllTopics().then((data) => {
        return response.status(200).send({topics : data});
    })
}

function apiController(request, response, next) {
    response.status(200).send(allEndpoints);
}

function articleController(request, response, next) {
    const chosenArticleId = request.params.article_id

    return getArticleById(chosenArticleId).then(data => {
        response.status(200).send({article : data})
    }).catch(err => {
        next(err);
    }) 
}

function getAllArticles(request, response, next) {
    return getAllArticlesModel().then(data => {
        // console.log(data);
        response.status(200).send({articles : data});
    }).catch(err => {
        // console.log(err);
    })
}

module.exports = {topicsController, apiController, articleController, getAllArticles}

