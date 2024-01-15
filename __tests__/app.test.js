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
            response._body.forEach((topic => {
                expect(typeof topic.description).toBe("string")
                expect(typeof topic.slug).toBe("string");
            }))
        })
    });
    test('status:404, should respond with 404 when passed a route that does not exist ', () => {
        return request(app).get("/api/randomstuff4")
        .expect(404)
    });
});