process.env.NODE_ENV = 'test';

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
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
  describe.only('/articles/:article_id', () => {
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
  });
});
