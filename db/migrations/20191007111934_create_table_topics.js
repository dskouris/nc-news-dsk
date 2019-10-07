exports.up = function(knex) {
  console.log('CREATING TOPICS TABLE');
  return knex.schema.createTable('topics', topicsTable => {
    topicsTable.string('slug');
  });
};

exports.down = function(knex) {
  console.log('REMOVING TOPICS TABLE');
};
