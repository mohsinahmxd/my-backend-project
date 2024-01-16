const db = require("../db/connection.js")
const app = require("../app.js")
const request = require("supertest")
const seed = require("../db/seeds/seed.js")
const testData = require("../db/data/test-data/index.js")
const allEndpoints = require("../endpoints.json")



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
    test('should respond with an array of topic objects, with the correct properties', () => {
        return request(app).get("/api/topics")
        .then(response => {
            expect(response._body.topics.length > 0).toEqual(true); // check for empty arr
            response._body.topics.forEach((topic => {
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

describe('testing GET /api', () => {
    test('should respond with a 200 status code', () => {
        return request(app).get("/api")
        .expect(200)
    });
    test('should respond with an object describing all the available endpoints on the API', () => {
        return request(app).get("/api")
        .then(response => {
            expect(allEndpoints).toEqual(response._body);
        })
    });
});


describe('testing GET /api/articles/:article_id', () => {
    test('should respond with a 200 status code', () => {
        return request(app).get("/api/articles/1")
        .expect(200);
    });
    test('should respond with an article object based on the given id', () => { 
        const expected = {article : [{   
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          }]}

        return request(app).get("/api/articles/2")
        .then(data => {
            expect(data._body).toEqual(expected);
        })
    });
    test('should return error 404 and a not found message when passed an id that does not contain a resource', () => {
        return request(app).get("/api/articles/999999999")
        .expect(404)
        .then((data) => {
            expect(data._body.msg).toBe("No article found for article_id: 999999999");
        })
    });
    test('should return error 400 and a message when passed an invalid id', () => {
        return request(app).get("/api/articles/notAnId")
        .expect(400)
        .then(data => {
            expect(data._body.msg).toBe("Invalid input: 400 Bad Request");
        })
    });
});

describe('testing GET /api/articles', () => {
    test('should respond with status 200 and an articles array of all article objects each with the required properties', () => {

        // make sure body property is not included in final list of objects

        return request(app).get("/api/articles")
        .expect(200)
        .then(response => {
            expect(response._body.articles.length > 0).toEqual(true); // check for empty arr
            response._body.articles.forEach((article => {
                expect(typeof article.author).toBe("string")
                expect(typeof article.title).toBe("string")
                expect(typeof article.article_id).toBe("number")
                expect(typeof article.topic).toBe("string")
                expect(typeof article.created_at).toBe("string")
                expect(typeof article.votes).toBe("number")
                expect(typeof article.article_img_url).toBe("string")
                // will test for comment_count in next test
            }))
        })
    });
    test.skip('count up and return the correct amount of comments for each article_id. Do this for all article objects, then add the total comment_count to each object, and then return an array of all the modified article objects', () => {

        // just do assertions for first 3 rows, we can then assume rest is correct
        

        
    });
    test.skip('should be sorted by date in descending order', () => {
        // do a loop, check in each one the date is not before each other
    });
});
