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
            expect(data._body.msg).toBe("400 Bad Request: Invalid input");
        })
    });
});

describe('testing GET /api/articles', () => {
    test('should respond with status 200 and an articles array of all article objects each with the required properties', () => {

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
                expect(typeof article.comment_count).toBe("number")
            }))
        })
    });
    test('should be sorted by date in descending order', () => {
        return request(app).get("/api/articles")
        .then(data => {
            let resultArr = data._body.articles; 
            expect(resultArr.length > 0).toEqual(true); // check for empty arr
            expect(resultArr).toBeSortedBy('created_at', { descending: true });
        })
    });
    test('count up and return the correct amount of comments for each article_id. Do this for all article objects, then add the total comment_count to each object, and then return an array of all the modified article objects', () => {

        return request(app).get("/api/articles")
        .then(data => {
            const expect1 = {
                author: 'icellusedkars',
                title: 'Eight pug gifs that remind me of mitch',
                article_id: 3,
                topic: 'mitch',
                created_at: "2020-11-03T09:12:00.000Z",
                votes: 0,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: 2
            }
            const expect2 = {
                author: 'icellusedkars',
                title: 'A',
                article_id: 6,
                topic: 'mitch',
                created_at: "2020-10-18T01:00:00.000Z",
                votes: 0,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: 1
            }

            expect(data._body.articles[0]).toEqual(expect1);
            expect(data._body.articles[1]).toEqual(expect2);
        })
    });
    test('should return status code 200 and only the articles that meet the given topic filter', () => {
        const expected = {
            articles: [{
                article_id: 5,
                title: "UNCOVERED: catspiracy to bring down democracy",
                topic: "cats",
                author: "rogersop",
                created_at: "2020-08-03T13:14:00.000Z",
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                comment_count: 2,
                votes: 0
            }]
        }

        return request(app).get("/api/articles?topic=cats") 
        .expect(200)
        .then(data => {
            expect(data._body).toEqual(expected);
        })
    });
    test('should return status code 400 and a message when passed an invalid topic for filtering', () => {
        return request(app).get("/api/articles/?topic=adsafasdfa")
        .expect(400)
        .then(data => {
            expect(data._body.msg).toEqual("Invalid topic, unable to filter");
        })
    });
});

describe('testing GET /api/articles/:article_id/comments', () => {
    test('should return status code 200 and an array of comments for the given article_id', () => {

        const expected = {comments : [
            {
                comment_id: 11,
                body: 'Ambidextrous marsupial',
                article_id: 3,
                author: 'icellusedkars',
                votes: 0,
                created_at: "2020-09-19T23:10:00.000Z"
              },
                {
                comment_id: 10,
                body: 'git push origin master',
                article_id: 3,
                author: 'icellusedkars',
                votes: 0,
                created_at: "2020-06-20T07:24:00.000Z"
              }
        ]}

        return request(app).get("/api/articles/3/comments") // expect for id = 3
        .expect(200)
        .then(data => {
            expect(data._body).toEqual(expected); // expect 2 comments
        })
    });
    test('should return error 404 and a not found message when passed an id that does not contain a resource', () => {
        return request(app).get("/api/articles/999999999/comments")
        .expect(404)
        .then((data) => {
            expect(data._body.msg).toBe("No article found for article_id: 999999999");
        })
    });
    test('should return error 400 and a message when passed an invalid id', () => {
        return request(app).get("/api/articles/notAnId/comments")
        .expect(400)
        .then(data => {
            expect(data._body.msg).toBe("400 Bad Request: Invalid input");
        })
    });
    test('should be sorted by date in descending order', () => {
        return request(app).get("/api/articles/1/comments") // using article id 1 it has more comments
        .then(data => {
            let resultArr = data._body.comments;
            expect(resultArr).toBeSortedBy('created_at', { descending: true });

        })
    });
    test('should respond with a 200 status code and an empty array IF the id is valid but there are no comments for that given id', () => {
        return request(app).get("/api/articles/2/comments") // article id 2 has 0 comments
        .expect(200)
        .then(data => {
            const expected = {
                comments : []
            }

            expect(data._body).toEqual(expected);
        })
    });
});

describe('testing POST /api/articles/:article_id/comments', () => {
    test('should post the comment and should respond with a 201 status code and the posted comment', () => {
        
        let currentCount;
        // use article id 2
        return request(app).get("/api/articles/2/comments")
        .then(data => {
            // get current comment count before doing anything
            currentCount = data._body.comments.length;
        })
        .then(() => {

            const reqBodyObj = {
                username : "lurker",
                body : "just commenting on article id 2!"
            }

            return request(app).post("/api/articles/2/comments")
            .send(reqBodyObj)
            .expect(201)
        })
        .then(response => {
            // check it responded with correct comment
            expect(typeof response._body.comment[0].comment_id).toBe("number")
            expect(typeof response._body.comment[0].votes).toBe("number")
            expect(typeof response._body.comment[0].created_at).toBe("string")
            expect(response._body.comment[0].author).toBe("lurker");
            expect(response._body.comment[0].body).toBe("just commenting on article id 2!");
        })
        .then(() => {
            return request(app).get("/api/articles/2/comments")
        })
        .then((data) => {
            // checking the amount of comments have increased since the start
            expect(currentCount < data._body.comments.length).toEqual(true);
        })

    });
    test('if passed no body, respond with 400 Bad Request: malformed body / missing required fields', () => {
        const reqBodyObj = {
            username : "lurker"
        }

        return request(app).post("/api/articles/2/comments")
        .send(reqBodyObj)
        .expect(400)
        .then(response => {
            expect(response._body.msg).toEqual("400 Bad Request: malformed body / missing required fields");
        })
    });
    test('if passed an invalid ID, respond with 400 Bad Request: Invalid input', () => {
        const reqBodyObj = {
            username : "lurker",
            body : "just commenting on article id 2!"
        }

        return request(app).post("/api/articles/notAnId/comments") // invalid id
        .send(reqBodyObj)
        .expect(400)
        .then(response => {
            expect(response._body.msg).toEqual("400 Bad Request: Invalid input");
        })
    });
    test('if passed a username that does NOT exist, respond with 404 Not Found', () => {
        const reqBodyObj = {
            username : "massiveman", // username does not exist
            body : "just commenting on article id 2!"
        }

        return request(app).post("/api/articles/2/comments")
        .send(reqBodyObj)
        .expect(404)
        .then(response => {
            expect(response._body.msg).toEqual('404 Not Found');
        })
    });
    test('if passed an id tha does exist / not existent article id, respond with 404 Not Found', () => {
        const reqBodyObj = {
            username : "lurker",
            body : "random comment"
        }

        return request(app).post("/api/articles/99999999/comments") // article id does not exist
        .send(reqBodyObj)
        .expect(404)
        .then(response => {
            expect(response._body.msg).toEqual('404 Not Found');
        })
    });
});

describe('testing PATCH /api/articles/:article_id', () => {
    test('should update the article via id, and should respond with a 200 status code and the updated article', () => {
        
        const expected = {article : [
            {
                article_id : 4,
                title: "Student SUES Mitch!",
                topic: "mitch",
                author: "rogersop",
                body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                created_at: "2020-05-06T01:14:00.000Z",
                votes: 50, // currently votes is at 0, expect it to be 50 after this
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            }]
        }

        const reqBodyObj = {
            inc_votes: 50
        }

        return request(app).patch("/api/articles/4") // chose article id 4
        .send(reqBodyObj)
        .expect(200)
        .then(response => {
            expect(response._body).toEqual(expected);
        })

    })
    test('when passing a NEGATIVE amount of votes, should decrement / update the article via id, and should respond with a 200 status code and the updated article', () => {
        const expected = {article : [
            {
                article_id : 4,
                title: "Student SUES Mitch!",
                topic: "mitch",
                author: "rogersop",
                body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                created_at: "2020-05-06T01:14:00.000Z",
                votes: -25, // currently votes is at 0
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            }]
        }

        const reqBodyObj = {
            inc_votes: -25
        }

        return request(app).patch("/api/articles/4") // chose article id 4
        .send(reqBodyObj)
        .expect(200)
        .then(response => {
            expect(response._body).toEqual(expected);
        })

    })
    test('if passed object does not contain anything, respond with error 400 bad request', () => {
        const reqBodyObj = {}


        return request(app).patch("/api/articles/4")
        .send(reqBodyObj)
        .expect(400)
        .then(response => {
            expect(response._body.msg).toEqual("400 Bad Request: malformed body / missing required fields");
        })
    });
    test('if passed an invalid vote value, respond with 400 Bad Request: Invalid input', () => {
        const reqBodyObj = {
            inc_votes: "randomstr" // invalid
        }

        return request(app).patch("/api/articles/4")
        .send(reqBodyObj)
        .expect(400)
        .then(response => {
            expect(response._body.msg).toEqual("400 Bad Request: Invalid input");
        })
    });
    test('if passed a id that does NOT exist / non existent, respond with 404 Not Found', () => {
        const reqBodyObj = {
            inc_votes: 25
        }

        return request(app).patch("/api/articles/99999999") // invalid
        .send(reqBodyObj)
        .expect(404)
        .then(response => {
            expect(response._body.msg).toEqual('No article found for article_id: 99999999');
        })
    });
    test('if an invalid id, respond with 400 bad request', () => {
        const reqBodyObj = {
            inc_votes: 25
        }

        return request(app).patch("/api/articles/randomid") // invalid
        .send(reqBodyObj)
        .expect(400)
        .then(response => {
            expect(response._body.msg).toEqual('400 Bad Request: Invalid input');
        })
    });
});

describe('testing DELETE /api/comments/:comment_id', () => {
    test('should delete the comment and respond with status code 204 no content and nothing else', () => {
        return request(app).delete("/api/comments/4").expect(204)
    });
    test('if passed a id that does NOT exist / non existent, respond with 404 Not Found', () => {

        return request(app).delete("/api/comments/99999999") // invalid
        .expect(404)
        .then(response => {
            expect(response._body.msg).toEqual('No comment found for comment_id: 99999999');
        })
    });
    test('if an invalid id, respond with 400 bad request', () => {

        return request(app).delete("/api/comments/randomid") // invalid
        .expect(400)
        .then(response => {
            expect(response._body.msg).toEqual('400 Bad Request: Invalid input');
        })
    });
});

describe('test GET /api/users', () => {
    test('should return status code 200 and all the users, should be an array of objects and each object should have the correct properties', () => {
        return request(app).get("/api/users")
        .expect(200)
        .then(response => {
            expect(response._body.users.length > 0).toEqual(true); // check for empty arr
            response._body.users.forEach((user => { // each arr item is an obj
                expect(typeof user.username).toBe("string")
                expect(typeof user.name).toBe("string")
                expect(typeof user.avatar_url).toBe("string")
            }))
        })
    })
    test('status:404, should respond with 404 when passed a route that does not exist ', () => {
        return request(app).get("/api/randomstuff4")
        .expect(404)
    });
});