import { Knex } from 'knex';
import { TABLES } from '..';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(TABLES.USERS).del();

  // Inserts seed entries

  await knex(TABLES.USERS).insert([
    {
      id: 1,
      name: 'Super Admin',
    },
  ]);
}
