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

exports.fetchAllArticles = (sortBy = 'created_at', order = 'desc') => {
  return knex('articles')
    .select('articles.*')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count({ comment_count: 'comments.article_id' })
    .orderBy(sortBy, order)
    .then(articles => {
      return { articles };
    });
};
