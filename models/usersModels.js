const knex = require('../connection');

exports.fetchUser = ({ user }) => {
  return knex('users')
    .select('*')
    .where({ username: user })
    .then(userObj => {
      if (userObj.length === 0) {
        return Promise.reject({ status: 404, msg: 'User not found' });
      } else {
        return userObj;
      }
    });
};
