import { Knex } from 'knex';
import knex from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'test',
      charset: 'utf8',
    },
    useNullAsDefault: true,
  },
};

// TODO: dynamic db for production
export const knexInstance = knex(config.development);

export const TABLES = {
  USERS: 'users',
};

export default config;
