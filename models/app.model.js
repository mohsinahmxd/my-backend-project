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

function getAllArticlesModel () {
    return db.query(`SELECT
    articles.author,
    title,
    articles.article_id,
    topic,
    articles.created_at,
    articles.votes,
    article_img_url,
    COUNT (comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY
    articles.author,
    title,
    articles.article_id,
    topic,
    articles.created_at,
    articles.votes,
    article_img_url
    ORDER BY created_at DESC`)
    .then(data => {
        return data.rows;
    })
}

module.exports = {getAllTopics, getArticleById, getAllArticlesModel}