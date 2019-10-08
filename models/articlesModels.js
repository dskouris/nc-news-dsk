const knex = require('../connection');

//comments.belongs_to = article.title

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
