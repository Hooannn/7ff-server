import { Knex } from 'knex';
import { TABLES } from '..';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLES.USERS, function (table) {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.tinyint('role').notNullable();
    table.timestamps({ defaultToNow: true });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLES.USERS);
}
