const {
  fetchArticle,
  amendArticle,
  fetchAllArticles
} = require('../models/articlesModels');

exports.getArticle = (req, res, next) => {
  fetchArticle(req.params)
    .then(article => res.status(200).send(article))
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  const id = req.params.id;
  const votes = req.body.inc_votes;
  amendArticle(id, votes)
    .then(updatedArticle => res.status(200).send(updatedArticle))
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const sorter = req.query.sort_by;
  const { order, author, topic } = req.query;
  fetchAllArticles(sorter, order, author, topic)
    .then(articles => res.status(200).send(articles))
    .catch(next);
};
