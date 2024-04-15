const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("/api/topics", () => {
    test("GET 200: returns array of topics with properties of 'slug' and 'description'", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            const { topics } = body;
            expect(topics.length).toBe(3);
            topics.forEach((topic) => {
                expect(typeof topic.slug).toBe("string")
                expect(typeof topic.description).toBe("string")
            })
        })
    })
     test("GET 400: If the endpoint is not found, responds with a status of 400 and 'not found'", () => {
        return request(app)
        .get("/api/not_northcoders")
        .expect(400)
        .then(({body}) => {
            const { message } = body;
            expect(message).toBe('not found')
        })
     })
})