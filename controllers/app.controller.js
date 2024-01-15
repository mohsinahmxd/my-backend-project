const {getAllTopics} = require("../models/app.model")


function topicsController(request, response, next) {
    return getAllTopics().then((data) => {
        return response.status(200).send(data);
    })
    .catch(err => {
        next(err);
    })
}

module.exports = {topicsController}

