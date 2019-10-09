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
  describe('/topics', () => {
    it('GET / 200 returns object containing an array of topics objects', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('object');
          expect(body.topics[0]).to.haveOwnProperty('slug');
        });
    });
  });
  describe('/users/:username', () => {
    it('GET / 200 returns a user object with username, avatar_url and name properties', () => {
      return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('object');
          expect(body.user.username).to.equal('butter_bridge');
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
    });
  });
  describe.only('/comments/:comment_id', () => {
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
    });
    describe('DELETE / 204', () => {
      it('deletes a comment of the given comment_id', () => {
        return request(app)
          .delete('/api/comments/1')
          .expect(204);
      });
    });
  });
});
