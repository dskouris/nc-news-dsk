# NC News Back-end API (be-nc-news)

Northcoders News is a social news aggregation, web content rating, and discussion website.

This repo relates to the back end API, built using Node/Express with PostgreSQL.

Available routes:

GET /api

GET /api/topics

GET /api/articles

GET /api/articles/:article_id

PATCH /api/articles/:article_id

GET /api/articles/:article_id/comments

POST /api/articles/:article_id/comments

DELETE /api/comments/:comment_id

PATCH /api/comments/:comment_id

GET /api/users/:username

To run locally:

- Clone/download this repo
- NPM install
- NPM start

Links:

View the hosted back end on Heroku: https://nc-news-dsk.herokuapp.com/api/

View the full project hosted on Netlify: https://dsk-nc-news.netlify.com

View the front-end repository: https://github.com/dskouris/fe-dsk-nc-news
