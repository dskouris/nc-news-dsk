const knex = require('../connection');

exports.fetchUser = ({ user }) => {
  return knex('users')
    .select('*')
    .where({ username: user });
};
