process.env.NODE_ENV = 'test';

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-sorted'));
const app = require('../app');
const connection = require('../connection');

describe('app', () => {
  beforeEach(() => connection.seed.run());
  after(() => {
    return connection.destroy();
  });
  describe('/api', () => {
    describe.only('GET / 200', () => {
      it('returns an object', () => {
        return request(app)
          .get('/api')
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.an('object');
          });
      });
      it('describes the different endpoints available on the api', () => {
        return request(app)
          .get('/api')
          .expect(200)
          .then(({ body }) => {
            expect(body).to.haveOwnProperty('GET /api/topics');
          });
      });
    });
    describe('GET / 200', () => {
      it('ERROR / 404 handles invalid route', () => {
        return request(app)
          .get('/api/commmments')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Route not found');
          });
      });
    });
  });
  describe('/topics', () => {
    describe('GET / 200', () => {
      it('returns object containing an array of topics objects', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.an('object');
            expect(body.topics[0]).to.haveOwnProperty('slug');
          });
      });
    });
  });
  describe('/users/:username', () => {
    describe('GET / 200', () => {
      it('returns a user object with username, avatar_url and name properties', () => {
        return request(app)
          .get('/api/users/butter_bridge')
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.an('object');
            expect(body.user.username).to.equal('butter_bridge');
          });
      });
      it('ERROR / 404 returns a 404 when given a non-existent username', () => {
        return request(app)
          .get('/api/users/hello')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('User not found');
          });
      });
    });
  });
  describe('/articles/:article_id', () => {
    describe('GET / 200', () => {
      it('returns an article object with an author property', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.an('object');
            expect(body.article).to.haveOwnProperty('author');
          });
      });
      it('returns an article object with a comment_count property', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.haveOwnProperty('comment_count');
            expect(body.article.comment_count).to.equal(13);
          });
      });
      it('ERROR / 400 when given an invalid article_id', () => {
        return request(app)
          .get('/api/articles/dog')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('bad request');
          });
      });
      it('ERROR / 404 when given a valid article_id which does not exist on database', () => {
        return request(app)
          .get('/api/articles/9999')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('no article found with id: 9999');
          });
      });
    });
    describe('PATCH / 200', () => {
      it('responds with the article object of a given article_id', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.be.an('object');
          });
      });
      it('updates the amount of votes as specified in the patch request', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(110);
          });
      });
      it('ERROR / 400 when given a request body without inc_votes', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ body: 'hello' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('bad request');
          });
      });
      it('ERROR / 400 when inc_votes is not a number', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 'cheese' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('bad request');
          });
      });
      it('ERROR / 400 when request body has other properties than inc_votes', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 10, body: 'ham' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('bad request');
          });
      });
    });
  });
  describe('/articles/:article_id/comments', () => {
    describe('POST / 201', () => {
      it('returns the newly posted comment body', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({
            username: 'butter_bridge',
            body: 'what an amazing article!!!!!!'
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.new_comment).to.be.an('object');
            expect(body.new_comment.body).to.equal(
              'what an amazing article!!!!!!'
            );
            expect(body.new_comment).to.haveOwnProperty('comment_id');
          });
      });
      it('ERROR / 400 when trying to post to column which does not exist', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({ person: 'butter_bridge', body: 'nice article' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('bad request');
          });
      });
    });
    describe('GET / 200', () => {
      it('returns an object containing an array of comment objects', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments[0]).to.haveOwnProperty('comment_id');
          });
      });
      it('can handle query for sort_by, defaulted to created_at', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy('created_at', {
              descending: true
            });
          });
      });
      it('can handle query for sort_by when specified to author', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=author')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy('author', {
              descending: true
            });
          });
      });
      it('sorts comments in descending order by default', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=author')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy('author', {
              descending: true
            });
          });
      });
      it('handles query to sort in ascending order', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=author&order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy('author', {
              ascending: true
            });
          });
      });
    });
  });
  describe('/articles', () => {
    describe('GET / 200', () => {
      it('responds with an object containing array of articles', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
          });
      });
      it('each article object has a comment_count property', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.haveOwnProperty('comment_count');
          });
      });
      it('can handle query for sort_by, defaulted to created_at', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy('created_at', {
              descending: true
            });
          });
      });
      it('can handle query for sort_by when specified as article_id', () => {
        return request(app)
          .get('/api/articles?sort_by=article_id')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy('article_id', {
              descending: true
            });
          });
      });
      it('sorts articles in descending order by default', () => {
        return request(app)
          .get('/api/articles?sort_by=article_id')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy('article_id', {
              descending: true
            });
          });
      });
      it('can handle query to sort in ascending order', () => {
        return request(app)
          .get('/api/articles?sort_by=article_id&order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy('article_id', {
              ascending: true
            });
          });
      });
      it('can handle an author query to filter articles by author', () => {
        return request(app)
          .get('/api/articles?author=butter_bridge')
          .expect(200)
          .then(({ body }) => {
            expect(
              body.articles.every(article => article.author === 'butter_bridge')
            ).to.be.true;
          });
      });
      it('can handle a topic query to filter articles by topic', () => {
        return request(app)
          .get('/api/articles?topic=cats')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.every(article => article.topic === 'cats')).to
              .be.true;
          });
      });
      it('ERROR / 400 when given a sort_by query for nonexistent column', () => {
        return request(app)
          .get('/api/articles?sort_by=bad_column')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('bad request');
          });
      });
      it('ERROR orders by default (descending) when given an order query that is not asc or desc', () => {
        return request(app)
          .get('/api/articles?sort_by=article_id&order=bad')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy('article_id', {
              descending: true
            });
          });
      });
      it('ERROR / 404 throws 404 when querying topic / author not in db', () => {
        return request(app)
          .get('/api/articles?topic=lemondrizzlecake')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('not found');
          });
      });
      it('ERROR / 404 when querying valid author with no results', () => {
        return request(app)
          .get('/api/articles?author=lurker')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('not found');
          });
      });
    });
    describe('ERROR / 405', () => {
      it('returns method not allowed when attempting delete on this endpoint', () => {
        return request(app)
          .delete('/api/articles')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('method not allowed');
          });
      });
      it('returns method not allowed when attempting post on this endpoint', () => {
        return request(app)
          .post('/api/articles')
          .send({ test: 'test' })
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('method not allowed');
          });
      });
      it('returns method not allowed when attempting patch on this endpoint', () => {
        return request(app)
          .patch('/api/articles')
          .send({ test: 'test' })
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('method not allowed');
          });
      });
    });
  });
  describe('/comments/:comment_id', () => {
    describe('PATCH / 200', () => {
      it('updates the votes of a comment and returns the updated comment', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 20 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.equal(36);
          });
      });
      it('ERROR / 400 returns when sent an invalid inc_votes value', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 'rubbish' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad request');
          });
      });
      it('ERROR / 400 returns when given an invalid comment_id', () => {
        return request(app)
          .patch('/api/comments/badID')
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad request');
          });
      });
    });
    describe('DELETE / 204', () => {
      it('deletes a comment of the given comment_id', () => {
        return request(app)
          .delete('/api/comments/1')
          .expect(204);
      });
      it('ERROR / 404  returns when given a comment_id which does not exist', () => {
        return request(app)
          .delete('/api/comments/9999')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Comment not found');
          });
      });
    });
  });
});
