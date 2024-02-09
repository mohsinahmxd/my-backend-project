const db = require("../db/connection.js");
const {
  convertTimestampToDate,
  createRef,
  formatComments,
  checkExists,
} = require("../db/seeds/utils.js");

function getAllTopics() {
  return db.query(`SELECT * FROM topics`).then((data) => {
    return data.rows;
  });
}

function getArticleById(chosenId) {
  return db
    .query(
      `
    SELECT
    articles.author,
    title,
    articles.article_id,
    topic,
    articles.created_at,
    articles.votes,
    article_img_url,
    articles.body,
    COUNT (comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.author,
    title,
    articles.article_id,
    topic,
    articles.created_at,
    articles.votes,
    article_img_url,
    articles.body`,
      [chosenId]
    )
    .then((data) => {
      if (data.rows.length < 1) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${chosenId}`,
        });
      } else {
        // convert comment count to number before sending
        data.rows.forEach((row) => {
          row.comment_count = Number(row.comment_count);
        });
      }
      return data.rows;
    });
}

async function getAllArticlesModel(
  topicToFilter,
  columnToSortBy = "created_at",
  chosenOrder = "DESC"
) {
  let topics = await db.query(`SELECT slug FROM topics`);
  let columns = await db.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'articles';
    `);

  topics = topics.rows.map((topic) => topic.slug);
  topics.push(undefined);
  columns = columns.rows.map((column) => column.column_name);
  columns.push("comment_count");

  if (!topics.includes(topicToFilter)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid topic, unable to filter",
    });
  }

  if (!columns.includes(columnToSortBy)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!["ASC", "DESC"].includes(chosenOrder)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryValues = [];
  let queryStr = `SELECT
    articles.author,
    title,
    articles.article_id,
    topic,
    articles.created_at,
    articles.votes,
    article_img_url,
    COUNT (comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`;

  // checking for optional query value
  if (topicToFilter) {
    queryValues.push(topicToFilter);
    queryStr += ` WHERE topic = $1`;
  }

  queryStr += ` GROUP BY
    articles.author,
    title,
    articles.article_id,
    topic,
    articles.created_at,
    articles.votes,
    article_img_url
    ORDER BY ${columnToSortBy} ${chosenOrder}`;

  let queryResult = await db.query(queryStr, queryValues);
  // convert count to number
  queryResult.rows.forEach((row) => {
    row.comment_count = Number(row.comment_count);
  });
  return queryResult.rows;
}

async function getAllCommentsForArticleModel(chosenId) {
  let queryResult = await db.query(
    `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
    [chosenId]
  );

  if (queryResult.rows.length > 0) {
    return queryResult.rows;
  }

  let result = await checkExists("articles", "article_id", chosenId);

  if (result === "resource exists") {
    return queryResult.rows;
  } else {
    // resource does not exist
    return Promise.reject({
      status: 404,
      msg: `No article found for article_id: ${chosenId}`,
    });
  }
}

async function postCommentToArticleModel(givenComment, chosenId) {
  let result = await db.query(
    `INSERT INTO comments (body, article_id, author, votes) VALUES ($1, $2, $3, $4) RETURNING *`,
    [givenComment.body, chosenId, givenComment.username, 0]
  );

  return result.rows;
}

async function updateArticleModel(inc_votes, chosenId) {
  const queryResult = await db.query(
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
    [inc_votes, chosenId]
  );

  if (queryResult.rows.length > 0) {
    return queryResult.rows;
  }

  let result = await checkExists("articles", "article_id", chosenId);

  if (result === "resource exists") {
    return queryResult.rows;
  } else {
    // resource does not exist
    return Promise.reject({
      status: 404,
      msg: `No article found for article_id: ${chosenId}`,
    });
  }
}

async function deleteCommentModel(chosenId) {
  const queryResult = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *`,
    [chosenId]
  );

  if (queryResult.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No comment found for comment_id: ${chosenId}`,
    });
  } else {
    return queryResult.rows;
  }
}

async function getAllUsersModel() {
  const queryResult = await db.query(`SELECT * FROM users`);

  return queryResult.rows;
}

async function getUserByUsernameModel(chosenUsername) {
  const queryResult = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [chosenUsername]
  );

  if (queryResult.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No user found for username: ${chosenUsername}`,
    });
  } else {
    return queryResult.rows;
  }
}

module.exports = {
  getAllTopics,
  getArticleById,
  getAllArticlesModel,
  getAllCommentsForArticleModel,
  postCommentToArticleModel,
  updateArticleModel,
  deleteCommentModel,
  getAllUsersModel,
  getUserByUsernameModel,
};
