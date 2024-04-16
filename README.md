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

### /api/topics
#### GET
Responds with an array of topic objects, each of which should have the following properties:
    slug
    description
