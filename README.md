# Northcoders News API

## Creating environment variables

Before commencing development, create two files to contain the environment variables:

.env.development
.env.test

These files should contain an entry to define the relevant test or dev database to use, eg:

PGDATABASE=my_test_database

## Endpoints
### endpoint not found
If the endpoint is not found, responds with a status of 404 and "not found"

### server error
If a server error is encountered, responds with a status of 500 and "internal server error"

### /api
Responds with a json representation of all the available endpoints of the api

### /api/articles
#### GET
Responds with an array of article objects, each of which should have the following properties:
    author
    title
    article_id
    topic
    created_at
    votes
    article_img_url
    comment_count

'comment_count' is a count of all the comments with this 'article_id'

The articles are sorted by 'create_at' date descending

### /api/articles/:article_id
#### GET
Responds with an article object for the requested article_id with the following properties:
    author
    title
    article_id
    body
    topic
    created_at
    votes
    article_img_url

If 'article_id' is not a number, responds with 400 and 'invalid request'

If no article exists for the requested article_id, responds with 404 and 'article not found'

#### PATCH
When passed an object containing an 'inc_votes' property with a positive or negative integer value, adjusts the 'votes' on the requested article_id by the specified value 

Responds with an 'article' object representing the updated article

If no article exists for the requested article_id, responds with 404 and 'article not found'

If an invalid object is passed, responds with 400 and 'invalid input'

### /api/articles/:article_id/comments
#### GET
Responds with an array of comments objects for the requested article_id with the following properties:
    comment_id
    votes
    created_at
    author
    body
    article_id

If 'article_id' is not a number, responds with 400 and 'invalid request'

If no article exists for the requested article_id, responds with 404 and 'article not found'

If no comments exist for the requested article_id, responds with 404 and 'no comments yet!'

#### POST
When passed an object containing 'username' and 'body' properties, adds a comment with the requested article_id

Responds with a 'comments' object representing the inserted comment

If no article exists for the requested article_id, responds with 404 and 'article not found'

If an invalid object is passed, responds with 400 and 'invalid input'

### /api/topics
#### GET
Responds with an array of topic objects, each of which should have the following properties:
    slug
    description
