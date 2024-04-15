# Northcoders News API

## Creating environment variables

Before commencing development, create two files to contain the environment variables:

.env.development
.env.test

These files should contain an entry to define the relevant test or dev database to use, eg:

PGDATABASE=my_test_database

## Endpoints
### endpoint not found
If the endpoint is not found, responds with a status of 400 and "not found"

### server error
If a server error is encountered, responds with a status of 500 and "internal server error"

### /api
Responds with a json representation of all the available endpoints of the api

### /api/topics
#### GET
Responds with an array of topic objects, each of which should have the following properties:
    slug
    description
