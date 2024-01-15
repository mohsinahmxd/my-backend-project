const db = require("../db/connection.js")

function getAllTopics() {
    return db.query(`SELECT * FROM topics`).then(data => {
        return data.rows
    })
}

module.exports = {getAllTopics}