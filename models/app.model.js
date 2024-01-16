const db = require("../db/connection.js")

function getAllTopics() {
    return db.query(`SELECT * FROM topics`).then(data => {
        return data.rows
    })
}

function getArticleById (chosenId) {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [chosenId]).then(data => {
        if (data.rows.length < 1) {
            return Promise.reject({
                status: 404,
                msg: `No article found for article_id: ${chosenId}`
            })
        }
        return data.rows;
    })
}

module.exports = {getAllTopics, getArticleById}