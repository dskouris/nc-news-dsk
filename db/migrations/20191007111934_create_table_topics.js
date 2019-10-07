exports.up = function(knex) {
  console.log('CREATING TOPICS TABLE');
  return knex.schema.createTable('topics', topicsTable => {
    topicsTable.string('slug').primary();
    topicsTable.string('description');
  });
};

exports.down = function(knex) {
  console.log('REMOVING TOPICS TABLE');
  return knex.schema.dropTable('topics');
};
