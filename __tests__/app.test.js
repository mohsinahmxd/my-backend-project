const db = require("../db/connection.js")
const app = require("../app.js")
const request = require("supertest")
const seed = require("../db/seeds/seed.js")
const testData = require("../db/data/test-data/index.js")

// console.log(testData)

beforeEach(() => {
    return seed(testData);
})

afterAll(() => {
    return db.end();
})

describe('testing /api/topics', () => {
    test('should respond with a 200 status code', () => {
        return request(app).get("/api/topics")
        .expect(200)
    });
    test('should respond with the correct response body', () => {
        return request(app).get("/api/topics")
        .then(response => {
            // console.log(response._body);
            response._body.forEach((topic => {
                expect(typeof topic.description).toBe("string")
                expect(typeof topic.slug).toBe("string");
            }))
        })
    });
});

/*
what errors can occur with this endpoint 
then test 4 them, execpt 500 errors

come back to this, do the model with the get then test 4 errors and error handle
*/
