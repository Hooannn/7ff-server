import { Knex } from 'knex';
import knex from 'knex';
import { MYSQL_DB, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER } from '../config';
const test_host = 'sql9.freesqldatabase.com';
const test_db = 'sql9601096';
const test_user = 'sql9601096';
const test_password = 'N6U8P68MMA';
const test_port = 3306;
const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: test_host,
      port: test_port,
      user: test_user,
      password: test_password,
      database: test_db,
      charset: 'utf8',
    },
    useNullAsDefault: true,
  },
  production: {
    client: 'mysql2',
    connection: {
      host: MYSQL_HOST,
      port: parseInt(MYSQL_PORT),
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DB,
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
