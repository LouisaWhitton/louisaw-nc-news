const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const endpoints = require("../endpoints.json");

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
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
  test("GET 400: If the endpoint is not found, responds with a status of 400 and 'invalid request'", () => {
    return request(app)
      .get("/api/not_northcoders")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid request");
      });
  });
});

describe("/api", () => {
  test("GET 200: responds with an object detailing all the other available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ endpoints });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: when sent a valid article_id, responds with an 'article' object containing all required properties", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        const article = body.article[0];
        const expected = {
          author: "rogersop",
          title: "UNCOVERED: catspiracy to bring down democracy",
          article_id: 5,
          body: "Bastet walks amongst us, and the cats are taking arms!",
          topic: "cats",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        expect(typeof article.created_at).toBe("string");
        expect(article).toEqual(expect.objectContaining(expected));
      });
  });
  test("GET 400: when sent an article_id that is not a number, responds with 'invalid request'", () => {
    return request(app)
      .get("/api/articles/not_a_number")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid request");
      });
  });

  test("GET 404: when sent an article_id that is a number but does not match a valid article, responds with 'article not found'", () => {
    return request(app)
      .get("/api/articles/14")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("article not found");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: returns array of articles with the specified properties (there should be no 'body' property)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.body).toBe("undefined");
        });
      });
  });
  test("GET 200: 'comment_count' should be total count of all comments with this article_id", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          if (article.article_id === 1) {
            expect(Number(article.comment_count)).toBe(11);
          }
          if (article.article_id === 2) {
            expect(Number(article.comment_count)).toBe(0);
          }
        });
      });
  });
  test("GET 200: articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });    
  }) 
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: returns an array of comments for the given article_id with the specified properties", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(2)
        const expected = {
          votes: 20,
          author: "icellusedkars",
          body: "The owls are not what they seem.",
          article_id: 9
        };
        comments.forEach((comment) => {
          if(comment.comment_id === 17){
            expect(comment).toEqual(expect.objectContaining(expected));
          }
          expect(typeof comment.created_at).toBe("string");
        })
      });
  });
  test("GET 404: if no comments are found for the given article_id, returns 'no comments yet!'", () => {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(404)
    .then(({ body }) => {
      const { message } = body;
      expect(message).toBe("no comments yet!");
    })
  })
  test("GET 404: if no article is found for the given article_id, returns 'article not found'", () => {
    return request(app)
    .get("/api/articles/14/comments")
    .expect(404)
    .then(({ body }) => {
      const { message } = body;
      expect(message).toBe("article not found");
    })
  })
})