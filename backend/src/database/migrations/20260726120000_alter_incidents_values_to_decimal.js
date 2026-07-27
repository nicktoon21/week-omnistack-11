exports.up = function (knex) {
  return knex.schema.alterTable('incidents', function (table) {
    table.decimal('values', 10, 2).notNullable().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('incidents', function (table) {
    table.string('values').notNullable().alter();
  });
};
