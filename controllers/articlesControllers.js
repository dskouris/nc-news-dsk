const { fetchArticle, amendArticle } = require('../models/articlesModels');

exports.getArticle = (req, res, next) => {
  fetchArticle(req.params)
    .then(article => res.status(200).send(article))
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  const id = req.params.id;
  const votes = req.body.inc_votes;
  amendArticle(id, votes).then(updatedArticle => {
    res.status(200).send(updatedArticle);
  });
};
