const knex = require('../connection');

exports.fetchArticle = ({ id }) => {
  return knex('articles')
    .select('*')
    .where({ article_id: id })
    .then(article => {
      article = { article: article[0] };
      let commentsQuery = knex('comments')
        .select('*')
        .where({ article_id: article.article.article_id });
      return Promise.all([article, commentsQuery]);
    })
    .then(([article, comments]) => {
      article.article.comment_count = comments.length;
      return article;
    });
};

exports.amendArticle = (id, votes) => {
  return knex('articles')
    .where({ article_id: id })
    .increment('votes', votes)
    .returning('*')
    .then(article => {
      return { article: article[0] };
    });
};
