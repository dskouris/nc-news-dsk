const { fetchArticle } = require('../models/articlesModels');

exports.getArticle = (req, res, next) => {
  fetchArticle(req.params)
    .then(article => res.status(200).send(article))
    .catch(next);
};
