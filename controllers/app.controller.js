const {getAllTopics} = require("../models/app.model")
const allEndpoints = require("../endpoints.json")


function topicsController(request, response, next) {
    return getAllTopics().then((data) => {
        return response.status(200).send(data);
    })
    .catch(err => {
        next(err);
    })
}

function apiController(request, response, next) {
    response.status(200).send(allEndpoints);
}

module.exports = {topicsController, apiController}

