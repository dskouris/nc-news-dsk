const {
  fetchArticle,
  amendArticle,
  fetchAllArticles
} = require('../models/articlesModels');
const { send400 } = require('../errors/index');

exports.getArticle = (req, res, next) => {
  const { id } = req.params;
  if (parseInt(id) >= -1) {
    fetchArticle(id)
      .then(article => res.status(200).send(article))
      .catch(next);
  } else {
    next({ status: 400, msg: 'bad request' });
  }
};

exports.updateArticle = (req, res, next) => {
  if (
    req.body.hasOwnProperty('inc_votes') &&
    Object.keys(req.body).length === 1
  ) {
    const id = req.params.id;
    const votes = req.body.inc_votes;
    if (!votes || typeof votes !== 'number') {
      next({ status: 400, msg: 'bad request' });
    }
    amendArticle(id, votes)
      .then(updatedArticle => res.status(200).send(updatedArticle))
      .catch(next);
  } else {
    next({ status: 400, msg: 'bad request' });
  }
};

exports.getAllArticles = (req, res, next) => {
  const sorter = req.query.sort_by;
  const { order, author, topic } = req.query;
  fetchAllArticles(sorter, order, author, topic)
    .then(articles => res.status(200).send(articles))
    .catch(next);
};
