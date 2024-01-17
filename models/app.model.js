const db = require("../db/connection.js")
const {convertTimestampToDate, createRef, formatComments, checkExists} = require("../db/seeds/utils.js")


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
        // convert count to number
        data.rows.forEach(row => {
            row.comment_count = Number(row.comment_count);
        })
        return data.rows;
    })
}

async function getAllCommentsForArticleModel (chosenId) {
    let queryResult = await db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [chosenId])

    if (queryResult.rows.length < 1) {
        let result = await checkExists("articles", "article_id", chosenId)
        if (result === "resource exists") {
            return queryResult.rows;
        } else if (result === "resource does not exist") {
            return Promise.reject({
                status: 404,
                msg: `No article found for article_id: ${chosenId}`
            })
        }
    } else {
        return queryResult.rows;

    }
}

async function postCommentToArticleModel (givenComment, chosenId) {
    let result = await db.query(`INSERT INTO comments (body, article_id, author, votes) VALUES ($1, $2, $3, $4) RETURNING *`, [givenComment.body, chosenId, givenComment.username, 0])

    return result;
}

module.exports = {getAllTopics, getArticleById, getAllArticlesModel, getAllCommentsForArticleModel, postCommentToArticleModel}