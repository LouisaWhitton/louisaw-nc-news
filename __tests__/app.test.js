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
  test("GET 404: If the endpoint is not found, responds with a status of 404 and 'not found'", () => {
    return request(app)
      .get("/api/not_northcoders")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("not found");
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
  test("GET 200: FEATURE REQUEST - article response object should also include 'comment_count'", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        const article = body.article[0];
        expect(article.comment_count).toBe("2");
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
          expect(typeof article.comment_count).toBe("string");
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
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: returns an array of comments for the given article_id with the specified properties", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("GET 200: if no comments are found for the given article_id, returns 'no comments yet!'", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("no comments yet!");
      });
  });
  test("GET 404: if no article is found for the given article_id, returns 'article not found'", () => {
    return request(app)
      .get("/api/articles/14/comments")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("article not found");
      });
  });
  test("POST 201: adds a comment for the given article_id and responds with the posted comment", () => {
    const commentToAdd = {
      username: "butter_bridge",
      body: "This is a test comment",
    };
    const expectedComment = {
      comment_id: 19,
      votes: 0,
      author: "butter_bridge",
      body: "This is a test comment",
      article_id: 5,
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(commentToAdd)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(expect.objectContaining(expectedComment));
        expect(typeof comment.created_at).toBe("string");
      });
  });
  test("POST 400: returns an error of 'invalid input' when an invalid object is sent", () => {
    const commentToAdd = {
      constant_name: "pi",
      constant_value: 3.14159,
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(commentToAdd)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid input");
      });
  });
  test("POST 404: if no article is found for the given article_id, returns 'article not found'", () => {
    const commentToAdd = {
      username: "butter_bridge",
      body: "This is a test comment",
    };
    return request(app)
      .post("/api/articles/14/comments")
      .send(commentToAdd)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("article not found");
      });
  });
  test("PATCH 201: when sent a valid 'inc_votes' object, increments the given article's vote property by the specified amount", () => {
    const incVotes = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/5")
      .send(incVotes)
      .expect(201)
      .then(({ body }) => {
        const article = body.article;
        const expected = {
          author: "rogersop",
          title: "UNCOVERED: catspiracy to bring down democracy",
          article_id: 5,
          body: "Bastet walks amongst us, and the cats are taking arms!",
          topic: "cats",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        expect(typeof article.created_at).toBe("string");
        expect(article).toEqual(expect.objectContaining(expected));
      });
  });
  test("PATCH 400: returns an error of 'invalid input' when an invalid object is sent", () => {
    const incVotes = { constant_name: "pi" };
    return request(app)
      .patch("/api/articles/5")
      .send(incVotes)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid input");
      });
  });
  test("PATCH 404: if no article is found for the given article_id, returns 'article not found'", () => {
    const incVotes = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/14")
      .send(incVotes)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("article not found");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE 204: deletes the comment with the given comment_id", () => {
    return request(app).del("/api/comments/16").expect(204);
  });

  test("DELETE 404: if no comment is found for the given comment_id, returns 'comment not found'", () => {
    return request(app)
      .del("/api/comments/19")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("comment not found");
      });
  });
});

describe("/api/users", () => {
  test("GET 200: returns an array of user objects with the specified properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
  test("GET 404: if no users are found, returns 'no users found", () => {
    return request(app)
      .get("/api/users?test_no_users=y")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("no users found");
      });
  });
});

describe("/api/articles (topic query)", () => {
  test("GET 200: returns an array of articles for the requested topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
        });
      });
  });
  test("GET 404: if queried topic is not found, returns 'topic not found'", () => {
    return request(app)
      .get("/api/articles?topic=unicorns")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("topic not found");
      });
  });
});
